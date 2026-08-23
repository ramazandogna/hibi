<script lang="ts" setup>
import { computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'

import { useCreateHabit, useHabits } from '@/features/habits/habits.queries'
import { toAppError } from '@/shared/lib/app-error'
import type { HabitKind } from '@/shared/lib/kind'
import BaseButton from '@/shared/ui/BaseButton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import KindDot from '@/shared/ui/KindDot.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'

const { data: habits, isPending, isError, error, refetch } = useHabits()
const createHabit = useCreateHabit()

/** One example per tracking mode, so the empty state also explains the product. */
const SUGGESTIONS = [
  { name: 'Write code', kind: 'build' },
  { name: 'Late-night scrolling', kind: 'quit' },
  { name: 'Stress level', kind: 'scale' },
] as const satisfies readonly { name: string; kind: HabitKind }[]

type Suggestion = (typeof SUGGESTIONS)[number]

const errorMessage = computed(() => (error.value ? toAppError(error.value).message : ''))
const isEmpty = computed(() => (habits.value?.length ?? 0) === 0)

function addSuggestion(suggestion: Suggestion) {
  createHabit.mutate({ name: suggestion.name, kind: suggestion.kind })
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <h1 class="text-ink text-lg font-semibold">Today</h1>

    <SkeletonList v-if="isPending" row-height="h-14" label="Loading habits…" />

    <div v-else-if="isError" class="flex flex-col items-center gap-3 py-10 text-center">
      <p class="text-ink text-sm">{{ errorMessage }}</p>
      <BaseButton variant="ghost" @click="refetch()">Try again</BaseButton>
    </div>

    <EmptyState
      v-else-if="isEmpty"
      title="Nothing tracked yet"
      description="Pick one to start with — you can rename or remove it later."
    >
      <template #icon><Sparkles class="size-6" /></template>
      <template #action>
        <BaseButton
          v-for="suggestion in SUGGESTIONS"
          :key="suggestion.name"
          variant="ghost"
          :loading="createHabit.isPending.value"
          @click="addSuggestion(suggestion)"
        >
          {{ suggestion.name }}
        </BaseButton>
      </template>
    </EmptyState>

    <ul v-else class="flex flex-col gap-1">
      <li
        v-for="habit in habits ?? []"
        :key="habit.id"
        class="border-hair rounded-card flex h-14 items-center gap-3 border px-3"
      >
        <KindDot :kind="habit.kind" />
        <span class="text-ink flex-1 truncate text-sm font-medium">{{ habit.name }}</span>
      </li>
    </ul>
  </div>
</template>
