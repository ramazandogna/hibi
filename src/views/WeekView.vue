<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useEntriesInRange, useToggleEntry } from '@/features/entries/entries.queries'
import { useHabits } from '@/features/habits/habits.queries'
import { useNotesInRange } from '@/features/notes/notes.queries'
import { addDays, fromDateKey, startOfWeek, todayKey } from '@/shared/lib/date'
import type { WeekStart } from '@/shared/lib/date'
import { dayCellClass } from '@/shared/lib/kind'
import PageHeader from '@/shared/ui/PageHeader.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'

const route = useRoute()
const router = useRouter()

/** Read from the profile in a later step; Monday for now. */
const weekStartsOn: WeekStart = 1
const today = todayKey()

/**
 * Selected week in the URL, normalised to its first day.
 *
 * Any date inside the week works, so a shared link like `?w=2026-08-26` still
 * opens the right week.
 */
const weekStart = computed({
  get: () => {
    const raw = route.query.w

    return typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)
      ? startOfWeek(raw, weekStartsOn)
      : startOfWeek(today, weekStartsOn)
  },
  set: (next: string) => {
    void router.push({ query: { ...route.query, w: next } })
  },
})

const days = computed(() =>
  Array.from({ length: 7 }, (_, index) => addDays(weekStart.value, index)),
)
const weekEnd = computed(() => days.value[6] ?? weekStart.value)

const { data: habits, isPending } = useHabits()
const { data: entries } = useEntriesInRange(weekStart, weekEnd, { keepPrevious: true })

const markedByHabit = computed(() => {
  const map = new Map<string, Set<string>>()

  for (const entry of entries.value ?? []) {
    const marked = map.get(entry.habit_id) ?? new Set<string>()
    marked.add(entry.entry_date)
    map.set(entry.habit_id, marked)
  }

  return map
})

const valuesByHabit = computed(() => {
  const map = new Map<string, Map<string, number>>()

  for (const entry of entries.value ?? []) {
    const perDay = map.get(entry.habit_id) ?? new Map<string, number>()
    perDay.set(entry.entry_date, entry.value)
    map.set(entry.habit_id, perDay)
  }

  return map
})

const { data: notes } = useNotesInRange(weekStart, weekEnd)

/**
 * Week in review.
 *
 * Deliberately neutral wording: habit apps that shame people get deleted. The
 * numbers are shown, the judgement is left to the user.
 */
const review = computed(() => {
  const list = habits.value ?? []
  if (list.length === 0) return null

  const rows = list.map((habit) => {
    const marked = markedByHabit.value.get(habit.id)
    const done = days.value.filter((day) => marked?.has(day)).length

    return { habit, done, target: habit.target_per_week }
  })

  const planned = rows.reduce((total, row) => total + row.target, 0)
  const completed = rows.reduce((total, row) => total + Math.min(row.done, row.target), 0)

  const sorted = [...rows].sort((a, b) => b.done / b.target - a.done / a.target)

  return {
    completed,
    planned,
    percent: planned === 0 ? 0 : Math.round((completed / planned) * 100),
    best: sorted[0] ?? null,
    behind: sorted.at(-1) ?? null,
  }
})

const weekNotes = computed(() => (notes.value ?? []).slice(0, 3))

const weekdayFormatter = new Intl.DateTimeFormat('en', { weekday: 'narrow' })
const rangeFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

const title = computed(
  () =>
    `${rangeFormatter.format(fromDateKey(weekStart.value))} – ${rangeFormatter.format(fromDateKey(weekEnd.value))}`,
)

const { toggle } = useToggleEntry()

function onToggle(habitId: string, dateKey: string) {
  if (dateKey > today) return

  toggle({ habitId, dateKey }, markedByHabit.value.get(habitId)?.has(dateKey) ?? false)
}

/** Days marked this week against the habit's weekly target. */
function score(habitId: string, target: number): string {
  const marked = markedByHabit.value.get(habitId)
  const done = days.value.filter((day) => marked?.has(day)).length

  return `${done}/${target}`
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <PageHeader :title="title">
      <template #left>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2"
          aria-label="Previous week"
          @click="weekStart = addDays(weekStart, -7)"
        >
          ‹
        </button>
      </template>
      <template #right>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2 disabled:opacity-30"
          aria-label="Next week"
          :disabled="weekEnd >= today"
          @click="weekStart = addDays(weekStart, 7)"
        >
          ›
        </button>
      </template>
    </PageHeader>

    <SkeletonList v-if="isPending" row-height="h-8" label="Loading habits…" />

    <div v-else class="grid grid-cols-[1fr_repeat(7,1.75rem)_2.5rem] items-center gap-1">
      <span />
      <span
        v-for="day in days"
        :key="`head-${day}`"
        class="text-ink-soft text-center text-[10px]"
        :class="day === today ? 'text-sea font-bold' : ''"
      >
        {{ weekdayFormatter.format(fromDateKey(day)) }}
      </span>
      <span />

      <template v-for="habit in habits ?? []" :key="habit.id">
        <span class="text-ink truncate text-xs font-medium">{{ habit.name }}</span>

        <button
          v-for="day in days"
          :key="`${habit.id}-${day}`"
          type="button"
          :disabled="day > today"
          class="rounded-cell mx-auto size-6 transition-transform duration-100 active:scale-90"
          :class="
            dayCellClass({
              kind: habit.kind,
              isMarked: markedByHabit.get(habit.id)?.has(day) ?? false,
              value: valuesByHabit.get(habit.id)?.get(day),
              isFuture: day > today,
            })
          "
          :aria-pressed="markedByHabit.get(habit.id)?.has(day) ?? false"
          :aria-label="`${habit.name}, ${day}`"
          @click="onToggle(habit.id, day)"
        />

        <span class="text-ink-soft text-right text-[10px] tabular-nums">
          {{ score(habit.id, habit.target_per_week) }}
        </span>
      </template>
    </div>

    <section v-if="review" class="border-hair rounded-card flex flex-col gap-2 border p-3">
      <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">Week in review</h2>

      <p class="text-ink text-sm">
        You completed <strong class="tabular-nums">{{ review.completed }}</strong> of
        <strong class="tabular-nums">{{ review.planned }}</strong> planned days ·
        <span class="tabular-nums">{{ review.percent }}%</span>
      </p>

      <p v-if="review.best" class="text-ink-soft text-xs">
        Strongest: {{ review.best.habit.name }} — {{ review.best.done }} of
        {{ review.best.target }}
      </p>
      <p v-if="review.behind && review.behind !== review.best" class="text-ink-soft text-xs">
        Least tracked: {{ review.behind.habit.name }} — {{ review.behind.done }} of
        {{ review.behind.target }}
      </p>

      <ul v-if="weekNotes.length > 0" class="mt-1 flex flex-col gap-1">
        <li v-for="note in weekNotes" :key="note.id" class="text-ink-soft truncate text-xs">
          {{ note.entry_date }} — {{ note.body }}
        </li>
      </ul>
    </section>

    <p v-else-if="!isPending" class="text-ink-soft text-sm">No data for this week.</p>
  </div>
</template>
