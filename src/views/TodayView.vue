<script lang="ts" setup>
import { computed } from 'vue'
import { Sparkles } from 'lucide-vue-next'

import { useCreateHabit, useHabits } from '@/features/habits/habits.queries'
import { toAppError } from '@/shared/lib/app-error'
import type { HabitKind } from '@/shared/lib/kind'
import BaseButton from '@/shared/ui/BaseButton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'
import { lastNDays, todayKey } from '@/shared/lib/date'
import { useEntriesInRange, useToggleEntry } from '@/features/entries/entries.queries'
import HabitRow from '@/features/habits/components/HabitRow.vue'

/** Today plus the four days before it, oldest first. */
const days = computed(() => lastNDays(5))
const rangeFrom = computed(() => days.value[0] ?? todayKey())
const rangeTo = computed(() => days.value.at(-1) ?? todayKey())

const { data: entries } = useEntriesInRange(rangeFrom, rangeTo)

/**
 * One request feeds every row: the flat entry list is folded into a lookup so
 * a row can answer "is this day marked" in O(1) without querying for itself.
 */
const markedByHabit = computed(() => {
  const map = new Map<string, Set<string>>()

  for (const entry of entries.value ?? []) {
    const marked = map.get(entry.habit_id) ?? new Set<string>()
    marked.add(entry.entry_date)
    map.set(entry.habit_id, marked)
  }

  return map
})

const { toggle } = useToggleEntry()

function onToggle(habitId: string, dateKey: string) {
  toggle({ habitId, dateKey }, markedByHabit.value.get(habitId)?.has(dateKey) ?? false)
}

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

    <ul v-else class="flex flex-col gap-2">
      <HabitRow
        v-for="habit in habits ?? []"
        :key="habit.id"
        :habit="habit"
        :days="days"
        :today="rangeTo"
        :marked-days="markedByHabit.get(habit.id) ?? new Set()"
        @toggle="(day) => onToggle(habit.id, day)"
      />
    </ul>
  </div>
</template>
