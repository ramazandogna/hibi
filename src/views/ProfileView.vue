<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Pencil } from 'lucide-vue-next'

import { useAuthStore } from '@/features/auth/auth.store'
import { useHabits } from '@/features/habits/habits.queries'
import HabitForm from '@/features/habits/components/HabitForm.vue'
import type { Habit } from '@/features/habits/habit.types'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import KindDot from '@/shared/ui/KindDot.vue'

const auth = useAuthStore()
const router = useRouter()

const { data: habits, isPending } = useHabits()

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
  <div class="flex w-full flex-col gap-6">
    <header class="flex flex-col gap-1">
      <h1 class="text-ink text-lg font-semibold">Profile</h1>
      <p class="text-ink-soft text-sm">{{ auth.user?.email ?? 'not signed in' }}</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">Habits</h2>

      <p v-if="isPending" class="text-ink-soft text-sm">Loading…</p>

      <ul v-else class="flex flex-col gap-1">
        <li
          v-for="habit in habits ?? []"
          :key="habit.id"
          class="border-hair rounded-card flex items-center gap-3 border p-3"
        >
          <KindDot :kind="habit.kind" />
          <span class="text-ink flex-1 text-sm font-medium">{{ habit.name }}</span>
          <button
            type="button"
            class="text-ink-soft hover:text-ink p-1"
            :aria-label="`Edit ${habit.name}`"
            @click="openEdit(habit)"
          >
            <Pencil class="size-4" />
          </button>
        </li>
      </ul>

      <BaseButton class="mt-2" @click="openCreate">New habit</BaseButton>
    </section>

    <BaseButton variant="ghost" @click="logout">Sign out</BaseButton>

    <BaseSheet v-model="sheetOpen" :title="editing ? 'Edit habit' : 'New habit'">
      <HabitForm :key="editing?.id ?? 'new'" :habit="editing" @saved="sheetOpen = false" />
    </BaseSheet>
  </div>
</template>
