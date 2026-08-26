<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Settings, UserRound } from 'lucide-vue-next'

import { useAuthStore } from '@/features/auth/auth.store'
import HabitForm from '@/features/habits/components/HabitForm.vue'
import HabitManager from '@/features/habits/components/HabitManager.vue'
import { useArchivedHabits, useHabits } from '@/features/habits/habits.queries'
import type { Habit } from '@/features/habits/habit.types'
import { useProfile, useUpdateProfile } from '@/features/profile/profile.queries'
import { formatDate } from '@/shared/lib/format'
import { useDebouncedCallback } from '@/shared/lib/use-debounced-callback'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'
import SettingsGroup from '@/shared/ui/SettingsGroup.vue'
import SettingsRow from '@/shared/ui/SettingsRow.vue'
import StatCard from '@/shared/ui/StatCard.vue'

const auth = useAuthStore()
const router = useRouter()

const { data: habits } = useHabits()
const { data: archivedHabits } = useArchivedHabits()
const { data: profile } = useProfile()
const update = useUpdateProfile()

const email = computed(() => auth.user?.email ?? '')

const displayName = ref('')

// Seed the field once the row arrives, without fighting the user's typing.
watch(
  profile,
  (next) => {
    if (next && displayName.value === '') displayName.value = next.display_name ?? ''
  },
  { immediate: true },
)

const saveName = useDebouncedCallback((value: string) => {
  update.mutate({ display_name: value.trim() || null })
}, 800)

watch(displayName, (value) => {
  if (profile.value && value !== (profile.value.display_name ?? '')) saveName.run(value)
})

/** Falls back to the email, then to a neutral glyph rather than a stray '?'. */
const initial = computed(
  () => (displayName.value.trim() || email.value).charAt(0).toUpperCase() || '',
)

const memberSince = computed(() => {
  const createdAt = auth.user?.created_at
  if (!createdAt) return ''

  return formatDate(new Date(createdAt), { month: 'long', year: 'numeric' })
})

const sheetOpen = ref(false)
const editing = ref<Habit | undefined>(undefined)

function openEdit(habit: Habit) {
  editing.value = habit
  sheetOpen.value = true
}

async function logout() {
  await auth.signOut()
  await router.push('/login')
}
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <PageHeader :title="$t('profile.title')">
      <template #left>
        <RouterLink
          to="/settings"
          class="text-ink-soft hover:text-ink hover:bg-mist flex size-10 items-center justify-center rounded-full transition-colors active:scale-90"
          :aria-label="$t('settings.title')"
        >
          <Settings class="size-5" />
        </RouterLink>
      </template>
      <template #right>
        <button
          type="button"
          class="text-ink-soft hover:text-alert hover:bg-alert/10 flex size-10 items-center justify-center rounded-full transition-colors active:scale-90"
          :aria-label="$t('profile.signOut')"
          @click="logout"
        >
          <LogOut class="size-5" />
        </button>
      </template>
    </PageHeader>

    <!-- The identity block carries the brand gradient because it is the one
         place in the app that is about the person rather than the data. -->
    <section class="border-hair bg-surface rounded-card flex items-center gap-4 border p-4">
      <span
        class="brand-gradient flex size-14 shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white"
        aria-hidden="true"
      >
        <template v-if="initial">{{ initial }}</template>
        <UserRound v-else class="size-6" />
      </span>

      <div class="min-w-0 flex-1">
        <p class="text-ink truncate text-base font-semibold">
          {{ displayName.trim() || email || $t('profile.notSignedIn') }}
        </p>
        <p v-if="displayName.trim() && email" class="text-ink-soft truncate text-xs">
          {{ email }}
        </p>
        <p v-if="memberSince" class="text-ink-soft mt-1 text-xs">
          {{ $t('profile.trackingSince', { date: memberSince }) }}
        </p>
      </div>
    </section>

    <div class="flex gap-2">
      <StatCard :value="String(habits?.length ?? 0)" :label="$t('profile.activeHabits')" />
      <StatCard :value="String(archivedHabits?.length ?? 0)" :label="$t('profile.archived')" />
    </div>

    <SettingsGroup :title="$t('profile.account')">
      <SettingsRow
        :label="$t('profile.displayName')"
        :description="$t('profile.displayNameHint')"
        stacked
      >
        <BaseInput
          v-model="displayName"
          :label="$t('profile.displayName')"
          :placeholder="$t('profile.displayNamePlaceholder')"
          label-hidden
        />
      </SettingsRow>
    </SettingsGroup>

    <section class="flex flex-col gap-2">
      <h2 class="text-ink-soft px-1 text-xs font-semibold tracking-wide uppercase">
        {{ $t('profile.yourHabits') }}
      </h2>

      <HabitManager @edit="openEdit" />
    </section>

    <BaseSheet
      v-model="sheetOpen"
      :title="editing ? $t('habit.edit') : $t('habit.new')"
      :subtitle="editing ? '' : $t('habit.newSubtitle')"
    >
      <HabitForm :key="editing?.id ?? 'new'" :habit="editing" @saved="sheetOpen = false" />
    </BaseSheet>
  </div>
</template>
