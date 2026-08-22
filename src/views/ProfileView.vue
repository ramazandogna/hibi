<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/features/auth/auth.store'
import HabitForm from '@/features/habits/components/HabitForm.vue'
import HabitManager from '@/features/habits/components/HabitManager.vue'
import type { Habit } from '@/features/habits/habit.types'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'

const auth = useAuthStore()
const router = useRouter()

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

    <HabitManager @edit="openEdit" />

    <BaseButton @click="openCreate">New habit</BaseButton>
    <BaseButton variant="ghost" @click="logout">Sign out</BaseButton>

    <BaseSheet v-model="sheetOpen" :title="editing ? 'Edit habit' : 'New habit'">
      <HabitForm :key="editing?.id ?? 'new'" :habit="editing" @saved="sheetOpen = false" />
    </BaseSheet>
  </div>
</template>
