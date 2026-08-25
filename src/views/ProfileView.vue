<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Plus } from 'lucide-vue-next'

import { useAuthStore } from '@/features/auth/auth.store'
import HabitForm from '@/features/habits/components/HabitForm.vue'
import HabitManager from '@/features/habits/components/HabitManager.vue'
import { useArchivedHabits, useHabits } from '@/features/habits/habits.queries'
import type { Habit } from '@/features/habits/habit.types'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'
import StatCard from '@/shared/ui/StatCard.vue'

import ProfileSettings from '@/features/profile/components/ProfileSettings.vue'

const auth = useAuthStore()
const router = useRouter()

const { data: habits } = useHabits()
const { data: archivedHabits } = useArchivedHabits()

const email = computed(() => auth.user?.email ?? '')

/** First letter of the account, used as a stand-in avatar. */
const initial = computed(() => email.value.charAt(0).toUpperCase() || '?')

const memberSinceFormatter = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })

const memberSince = computed(() => {
  const createdAt = auth.user?.created_at
  if (!createdAt) return ''

  return `Tracking since ${memberSinceFormatter.format(new Date(createdAt))}`
})

const sheetOpen = ref(false)
const editing = ref<Habit | undefined>(undefined)

function openCreate() {
  editing.value = undefined
  sheetOpen.value = true
}

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
  <div class="flex w-full flex-col gap-5">
    <PageHeader title="Profile">
      <template #right>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2"
          aria-label="Sign out"
          @click="logout"
        >
          <LogOut class="size-5" />
        </button>
      </template>
    </PageHeader>

    <section class="bg-mist rounded-card flex items-center gap-3 p-4">
      <span
        class="bg-sea flex size-12 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
        aria-hidden="true"
      >
        {{ initial }}
      </span>

      <div class="min-w-0">
        <p class="text-ink truncate text-sm font-medium">{{ email || 'not signed in' }}</p>
        <p class="text-ink-soft text-xs">{{ memberSince }}</p>
      </div>
    </section>

    <div class="flex gap-2">
      <StatCard :value="String(habits?.length ?? 0)" label="active habits" />
      <StatCard :value="String(archivedHabits?.length ?? 0)" label="archived" />
    </div>

    <div class="flex flex-col gap-3">
      <HabitManager @edit="openEdit" />

      <BaseButton class="w-full shrink-0" @click="openCreate">
        <Plus class="size-4 shrink-0" />
        New habit
      </BaseButton>
    </div>

    <ProfileSettings />

    <BaseSheet v-model="sheetOpen" :title="editing ? 'Edit habit' : 'New habit'">
      <HabitForm :key="editing?.id ?? 'new'" :habit="editing" @saved="sheetOpen = false" />
    </BaseSheet>
  </div>
</template>
