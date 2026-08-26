<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DayPanel from '@/features/entries/components/DayPanel.vue'
import ScalePicker from '@/features/entries/components/ScalePicker.vue'
import { useEntriesInRange, useSetEntry, useToggleEntry } from '@/features/entries/entries.queries'
import { useHabits } from '@/features/habits/habits.queries'
import DayNoteField from '@/features/notes/components/DayNoteField.vue'
import { useNotesInRange } from '@/features/notes/notes.queries'
import { addDays, fromDateKey, startOfWeek, todayKey } from '@/shared/lib/date'
import { dayCellClass, groupByKind, KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'
import SectionHeading from '@/shared/ui/SectionHeading.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'

import { useWeekStart } from '@/features/profile/profile.queries'

const route = useRoute()
const router = useRouter()

/** Read from the profile in a later step; Monday for now. */
const weekStartsOn = useWeekStart()

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
      ? startOfWeek(raw, weekStartsOn.value)
      : startOfWeek(today, weekStartsOn.value)
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
/**
 * A summary per group instead of one for the whole week.
 *
 * "You completed 24 of 35" mixes building a habit with quitting one and with
 * rating a mood — three different things whose numbers do not add up to
 * anything meaningful together.
 */
const groupReviews = computed(() =>
  habitGroups.value.map((group) => {
    const rows = group.items.map((habit) => {
      const marked = markedByHabit.value.get(habit.id)
      const done = days.value.filter((day) => marked?.has(day)).length

      return { habit, done, target: habit.target_per_week }
    })

    const planned = rows.reduce((total, row) => total + row.target, 0)
    const completed = rows.reduce((total, row) => total + Math.min(row.done, row.target), 0)
    const sorted = [...rows].sort((a, b) => b.done / b.target - a.done / a.target)

    return {
      kind: group.kind,
      completed,
      planned,
      percent: planned === 0 ? 0 : Math.round((completed / planned) * 100),
      best: sorted[0] ?? null,
      behind: sorted.length > 1 ? (sorted.at(-1) ?? null) : null,
    }
  }),
)

const reviewByKind = computed(
  () => new Map(groupReviews.value.map((review) => [review.kind, review])),
)

const weekNotes = computed(() => (notes.value ?? []).slice(0, 3))

const habitGroups = computed(() => groupByKind(habits.value ?? [], (habit) => habit.kind))

const weekdayFormatter = new Intl.DateTimeFormat('en', { weekday: 'narrow' })
const rangeFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

const title = computed(
  () =>
    `${rangeFormatter.format(fromDateKey(weekStart.value))} – ${rangeFormatter.format(fromDateKey(weekEnd.value))}`,
)

const { toggle } = useToggleEntry()
const setEntry = useSetEntry()

const noteBodyByDay = computed(
  () => new Map((notes.value ?? []).map((note) => [note.entry_date, note.body])),
)

/** Column headers open a day: the panel is where notes and values are written. */
const selectedDay = ref<string | null>(null)
const scalingHabitId = ref<string | null>(null)

const dayPanelOpen = computed({
  get: () => selectedDay.value !== null,
  set: (open: boolean) => {
    if (!open) {
      selectedDay.value = null
      scalingHabitId.value = null
    }
  },
})

const dayTitleFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const selectedDayTitle = computed(() =>
  selectedDay.value ? dayTitleFormatter.format(fromDateKey(selectedDay.value)) : '',
)

function openDay(dateKey: string) {
  if (dateKey > today) return

  scalingHabitId.value = null
  selectedDay.value = dateKey
}

function onPanelToggle(habitId: string) {
  if (selectedDay.value) onToggle(habitId, selectedDay.value)
}

function onScaleSubmit(payload: { value: number; note: string | null }) {
  const dateKey = selectedDay.value
  const habitId = scalingHabitId.value
  if (!dateKey || !habitId) return

  setEntry.mutate({ habitId, dateKey, ...payload })
  scalingHabitId.value = null
}

/**
 * Binary kinds toggle; scale kinds open the picker, past days included.
 *
 * Without the branch a mood cell would silently flip to a value of 1, which is
 * a number the user never chose.
 */
function onCellTap(habit: { id: string; kind: HabitKind }, dateKey: string) {
  if (dateKey > today) return

  if (!KIND_META[habit.kind].isBinary) {
    selectedDay.value = dateKey
    scalingHabitId.value = habit.id
    return
  }

  toggle({ habitId: habit.id, dateKey }, markedByHabit.value.get(habit.id)?.has(dateKey) ?? false)
}

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
      <button
        v-for="day in days"
        :key="`head-${day}`"
        type="button"
        class="text-ink-soft rounded-cell py-1 text-center text-[10px] disabled:opacity-40"
        :class="day === today ? 'text-sea font-bold' : ''"
        :disabled="day > today"
        :aria-label="`Open ${day}`"
        @click="openDay(day)"
      >
        {{ weekdayFormatter.format(fromDateKey(day)) }}
      </button>
      <span />

      <template v-for="group in habitGroups" :key="group.kind">
        <div class="col-span-9 mt-3 flex">
          <SectionHeading :kind="group.kind" :label="group.label" :count="group.items.length" />
        </div>

        <template v-for="habit in group.items" :key="habit.id">
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
            @click="onCellTap(habit, day)"
          />

          <span class="text-ink-soft text-right text-[10px] tabular-nums">
            {{ score(habit.id, habit.target_per_week) }}
          </span>
        </template>

        <p
          v-if="reviewByKind.get(group.kind)"
          class="text-ink-soft col-span-9 mt-1 mb-1 text-[11px]"
        >
          <span class="tabular-nums">{{ reviewByKind.get(group.kind)?.completed }}</span> of
          <span class="tabular-nums">{{ reviewByKind.get(group.kind)?.planned }}</span> days ·
          <span class="tabular-nums">{{ reviewByKind.get(group.kind)?.percent }}%</span>
          <template v-if="reviewByKind.get(group.kind)?.best">
            · strongest {{ reviewByKind.get(group.kind)?.best?.habit.name }}
          </template>
        </p>
      </template>
    </div>

    <section
      v-if="weekNotes.length > 0"
      class="border-hair rounded-card flex flex-col gap-2 border p-3"
    >
      <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">Notes this week</h2>

      <ul class="flex flex-col gap-1">
        <li v-for="note in weekNotes" :key="note.id" class="text-ink-soft truncate text-xs">
          {{ note.entry_date }} — {{ note.body }}
        </li>
      </ul>
    </section>

    <p v-if="!isPending && habitGroups.length === 0" class="text-ink-soft text-sm">
      No data for this week.
    </p>

    <BaseSheet v-model="dayPanelOpen" :title="scalingHabitId ? 'How was it?' : selectedDayTitle">
      <ScalePicker
        v-if="scalingHabitId && selectedDay"
        :key="`${scalingHabitId}-${selectedDay}`"
        :initial-value="valuesByHabit.get(scalingHabitId)?.get(selectedDay) ?? null"
        @submit="onScaleSubmit"
      />

      <DayPanel
        v-else-if="selectedDay"
        :date-key="selectedDay"
        :habits="habits ?? []"
        :marked-by-habit="markedByHabit"
        :values-by-habit="valuesByHabit"
        @toggle="onPanelToggle"
        @scale="(habitId) => (scalingHabitId = habitId)"
      >
        <template #note>
          <DayNoteField
            :key="selectedDay"
            :date-key="selectedDay"
            :initial-body="noteBodyByDay.get(selectedDay) ?? ''"
          />
        </template>
      </DayPanel>
    </BaseSheet>
  </div>
</template>
