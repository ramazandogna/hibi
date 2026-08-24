<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'

import { useCreateHabit, useHabits } from '@/features/habits/habits.queries'
import { toAppError } from '@/shared/lib/app-error'
import type { HabitKind } from '@/shared/lib/kind'
import BaseButton from '@/shared/ui/BaseButton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'
import { fromDateKey, lastNDays, todayKey } from '@/shared/lib/date'
import { useEntriesInRange, useSetEntry, useToggleEntry } from '@/features/entries/entries.queries'
import ScaleCheckIn from '@/features/entries/components/ScaleCheckIn.vue'
import ScalePicker from '@/features/entries/components/ScalePicker.vue'
import HabitRow from '@/features/habits/components/HabitRow.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/** Squares show five days; the query pulls a year so streaks are exact. */
const STATS_WINDOW_DAYS = 365

/** Today plus the four days before it, oldest first. */
const days = computed(() => lastNDays(5))
const statsWindow = computed(() => lastNDays(STATS_WINDOW_DAYS))
const rangeFrom = computed(() => statsWindow.value[0] ?? todayKey())
const rangeTo = computed(() => statsWindow.value.at(-1) ?? todayKey())

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

const todayFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const todayTitle = computed(() => todayFormatter.format(fromDateKey(rangeTo.value)))

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

/** Values only matter for scale habits; build/quit rows ignore this map. */
const valuesByHabit = computed(() => {
  const map = new Map<string, Map<string, number>>()

  for (const entry of entries.value ?? []) {
    const perDay = map.get(entry.habit_id) ?? new Map<string, number>()
    perDay.set(entry.entry_date, entry.value)
    map.set(entry.habit_id, perDay)
  }

  return map
})

const setEntry = useSetEntry()
const scaleTarget = ref<{ habitId: string; dateKey: string } | null>(null)
const scaleOpen = computed({
  get: () => scaleTarget.value !== null,
  set: (open: boolean) => {
    if (!open) scaleTarget.value = null
  },
})

function openScale(habitId: string, dateKey: string) {
  scaleTarget.value = { habitId, dateKey }
}

/**
 * Scale habits with no value for today.
 *
 * Asking inline costs one tap instead of opening the picker, which is the
 * difference between a mood tracker that gets filled in and one that does not.
 */
const pendingCheckIns = computed(() =>
  (habits.value ?? []).filter(
    (habit) => habit.kind === 'scale' && !markedByHabit.value.get(habit.id)?.has(rangeTo.value),
  ),
)

function checkIn(habitId: string, value: number) {
  setEntry.mutate({ habitId, dateKey: rangeTo.value, value })
}

function saveScale(payload: { value: number; note: string | null }) {
  const target = scaleTarget.value
  if (!target) return

  setEntry.mutate({ ...target, ...payload })
  scaleTarget.value = null
}

function openHabit(habitId: string) {
  void router.push({ name: 'HabitDetailView', params: { id: habitId } })
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <PageHeader :title="todayTitle" />

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

    <template v-else>
      <ScaleCheckIn
        v-for="habit in pendingCheckIns"
        :key="`checkin-${habit.id}`"
        :habit-name="habit.name"
        @select="(value) => checkIn(habit.id, value)"
      />
    </template>

    <ul v-if="!isPending && !isError && !isEmpty" class="flex flex-col gap-2">
      <HabitRow
        v-for="habit in habits ?? []"
        :key="habit.id"
        :values="valuesByHabit.get(habit.id)"
        :habit="habit"
        :days="days"
        :today="rangeTo"
        :marked-days="markedByHabit.get(habit.id) ?? new Set()"
        @toggle="(day) => onToggle(habit.id, day)"
        @scale="(day) => openScale(habit.id, day)"
        @open="openHabit"
      />
    </ul>

    <BaseSheet v-model="scaleOpen" title="How was it?">
      <ScalePicker
        v-if="scaleTarget"
        :key="`${scaleTarget.habitId}-${scaleTarget.dateKey}`"
        :initial-value="valuesByHabit.get(scaleTarget.habitId)?.get(scaleTarget.dateKey) ?? null"
        @submit="saveScale"
      />
    </BaseSheet>
  </div>
</template>
