<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

import DayPanel from '@/features/entries/components/DayPanel.vue'
import ScalePicker from '@/features/entries/components/ScalePicker.vue'
import { useEntriesInRange, useSetEntry, useToggleEntry } from '@/features/entries/entries.queries'
import { useHabits } from '@/features/habits/habits.queries'
import DayNoteField from '@/features/notes/components/DayNoteField.vue'
import { useNotesInRange } from '@/features/notes/notes.queries'
import { useWeekStart } from '@/features/profile/profile.queries'
import YearHabitHeader from '@/features/stats/components/YearHabitHeader.vue'
import YearHeatmap from '@/features/stats/components/YearHeatmap.vue'
import {
  BaseSheet,
  PageHeader,
  SectionHeading,
  SkeletonList,
  eachDayOfYear,
  formatDate,
  fromDateKey,
  todayKey,
} from 'rei-kit'
import { groupByKind, KIND_META } from '@/shared/lib/kind'

const route = useRoute()
const router = useRouter()

const currentYear = new Date().getFullYear()

/** Grids reflow when the user changes this in Profile. */
const weekStartsOn = useWeekStart()

/** Selected year lives in the URL so it survives refresh, sharing and back. */
const year = computed({
  get: () => {
    const raw = Number(route.query.y)

    return Number.isInteger(raw) && raw >= 2000 && raw <= currentYear + 1 ? raw : currentYear
  },
  set: (next: number) => {
    void router.push({ query: { ...route.query, y: String(next) } })
  },
})

const rangeFrom = computed(() => `${year.value}-01-01`)
const rangeTo = computed(() => `${year.value}-12-31`)

/** The grid stops at today: future cells would be empty placeholders. */
const days = computed(() => {
  const today = todayKey()

  return eachDayOfYear(year.value).filter((day) => day <= today)
})

const { data: habits, isPending } = useHabits()
const { data: entries } = useEntriesInRange(rangeFrom, rangeTo, { keepPrevious: true })
const { data: notes } = useNotesInRange(rangeFrom, rangeTo)

/** One request feeds every grid; entries are folded per habit for O(1) lookups. */
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

/** Day-level notes, shared by every habit. */
const dayNoteDays = computed(() => new Set((notes.value ?? []).map((note) => note.entry_date)))

/** Per-habit entry notes, written when a day was checked off. */
const entryNotesByHabit = computed(() => {
  const map = new Map<string, Map<string, string>>()

  for (const entry of entries.value ?? []) {
    const body = (entry.note ?? '').trim()
    if (!body) continue

    const perDay = map.get(entry.habit_id) ?? new Map<string, string>()
    perDay.set(entry.entry_date, body)
    map.set(entry.habit_id, perDay)
  }

  return map
})

/** Cells a habit's grid lets you open: its own notes plus the day's notes. */
function noteDaysFor(habitId: string): Set<string> {
  const days = new Set(dayNoteDays.value)

  for (const day of entryNotesByHabit.value.get(habitId)?.keys() ?? []) days.add(day)

  return days
}

const noteBodyByDay = computed(
  () => new Map((notes.value ?? []).map((note) => [note.entry_date, note.body])),
)

const habitGroups = computed(() => groupByKind(habits.value ?? [], (habit) => habit.kind))

const selectedDay = ref<string | null>(null)
const selectedHabitId = ref<string | null>(null)

const DAY_TITLE_OPTIONS = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
} as const

const daySheetOpen = computed({
  get: () => selectedDay.value !== null,
  set: (open: boolean) => {
    if (!open) {
      selectedDay.value = null
      selectedHabitId.value = null
    }
  },
})

const selectedDayNote = computed(() =>
  selectedDay.value ? (noteBodyByDay.value.get(selectedDay.value) ?? '') : '',
)

const selectedEntryNote = computed(() =>
  selectedDay.value && selectedHabitId.value
    ? (entryNotesByHabit.value.get(selectedHabitId.value)?.get(selectedDay.value) ?? '')
    : '',
)

const selectedHabitName = computed(
  () => (habits.value ?? []).find((habit) => habit.id === selectedHabitId.value)?.name ?? '',
)

const selectedDayTitle = computed(() =>
  selectedDay.value ? formatDate(fromDateKey(selectedDay.value), DAY_TITLE_OPTIONS) : '',
)

const { toggle } = useToggleEntry()
const setEntry = useSetEntry()

/** Today's panel, reachable from the year title so every screen offers it. */
const dayPanelDate = ref<string | null>(null)
const scalingHabitId = ref<string | null>(null)

const dayPanelOpen = computed({
  get: () => dayPanelDate.value !== null,
  set: (open: boolean) => {
    if (!open) {
      dayPanelDate.value = null
      scalingHabitId.value = null
    }
  },
})

const dayPanelTitle = computed(() =>
  dayPanelDate.value ? formatDate(fromDateKey(dayPanelDate.value), DAY_TITLE_OPTIONS) : '',
)

function onPanelToggle(habitId: string) {
  const dateKey = dayPanelDate.value
  if (!dateKey) return

  toggle({ habitId, dateKey }, markedByHabit.value.get(habitId)?.has(dateKey) ?? false)
}

function onScaleRemove() {
  const dateKey = dayPanelDate.value
  const habitId = scalingHabitId.value
  if (!dateKey || !habitId) return

  toggle({ habitId, dateKey }, true)
  scalingHabitId.value = null
}

function onScaleSubmit(payload: { value: number; note: string | null }) {
  const dateKey = dayPanelDate.value
  const habitId = scalingHabitId.value
  if (!dateKey || !habitId) return

  setEntry.mutate({ habitId, dateKey, ...payload })
  scalingHabitId.value = null
}

/** The year grid is read-only: a cell only opens the notes it holds. */
function onSelectDay(habitId: string, dateKey: string) {
  selectedHabitId.value = habitId
  selectedDay.value = dateKey
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <PageHeader :title="String(year)">
      <template #title>
        <button
          type="button"
          class="header-action"
          :aria-label="$t('common.openItem', { name: $t('today.todayLabel') })"
          @click="dayPanelDate = todayKey()"
        >
          <span class="truncate">{{ year }}</span>
          <ChevronDown class="text-ink-soft size-4 shrink-0" aria-hidden="true" />
        </button>
      </template>
      <template #left>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2"
          :aria-label="$t('year.previous')"
          @click="year -= 1"
        >
          ‹
        </button>
      </template>
      <template #right>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2 disabled:opacity-30"
          :aria-label="$t('year.next')"
          :disabled="year >= currentYear"
          @click="year += 1"
        >
          ›
        </button>
      </template>
    </PageHeader>

    <SkeletonList v-if="isPending" row-height="h-28" :label="$t('today.loadingHabits')" />

    <section
      v-for="group in isPending ? [] : habitGroups"
      :key="group.kind"
      class="flex flex-col gap-2"
    >
      <SectionHeading
        :tone="KIND_META[group.kind]"
        :label="$t(`kind.${group.kind}.group`)"
        :count="group.items.length"
      />

      <ul class="flex flex-col gap-3">
        <li
          v-for="habit in group.items"
          :key="habit.id"
          class="rounded-card flex flex-col gap-2 border p-3"
          :class="KIND_META[habit.kind].card"
        >
          <YearHabitHeader
            :habit="habit"
            :marked-days="markedByHabit.get(habit.id) ?? new Set()"
            :values="valuesByHabit.get(habit.id)"
          />

          <YearHeatmap
            :days="days"
            :kind="habit.kind"
            :marked-days="markedByHabit.get(habit.id) ?? new Set()"
            :values="valuesByHabit.get(habit.id)"
            :note-days="noteDaysFor(habit.id)"
            :week-starts-on="weekStartsOn"
            @select="(day) => onSelectDay(habit.id, day)"
          />
        </li>
      </ul>
    </section>

    <BaseSheet
      v-model="dayPanelOpen"
      :title="scalingHabitId ? $t('today.howWasIt') : dayPanelTitle"
    >
      <ScalePicker
        v-if="scalingHabitId && dayPanelDate"
        :key="`${scalingHabitId}-${dayPanelDate}`"
        :initial-value="valuesByHabit.get(scalingHabitId)?.get(dayPanelDate) ?? null"
        :initial-note="entryNotesByHabit.get(scalingHabitId)?.get(dayPanelDate) ?? ''"
        @submit="onScaleSubmit"
        @remove="onScaleRemove"
      />

      <DayPanel
        v-else-if="dayPanelDate"
        :date-key="dayPanelDate"
        :habits="habits ?? []"
        :marked-by-habit="markedByHabit"
        :values-by-habit="valuesByHabit"
        @toggle="onPanelToggle"
        @scale="(habitId) => (scalingHabitId = habitId)"
      >
        <template #note>
          <DayNoteField
            :key="dayPanelDate"
            :date-key="dayPanelDate"
            :initial-body="noteBodyByDay.get(dayPanelDate) ?? ''"
          />
        </template>
      </DayPanel>
    </BaseSheet>

    <BaseSheet v-model="daySheetOpen" :title="selectedDayTitle">
      <div class="flex flex-col gap-4">
        <section v-if="selectedEntryNote" class="flex flex-col gap-1">
          <h3 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">
            {{ selectedHabitName }}
          </h3>
          <p class="text-ink text-sm whitespace-pre-wrap">{{ selectedEntryNote }}</p>
        </section>

        <section v-if="selectedDayNote" class="flex flex-col gap-1">
          <h3 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">
            {{ $t('year.thatDay') }}
          </h3>
          <p class="text-ink text-sm whitespace-pre-wrap">{{ selectedDayNote }}</p>
        </section>
      </div>
    </BaseSheet>
  </div>
</template>
