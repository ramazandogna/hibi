<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DayPanel from '@/features/entries/components/DayPanel.vue'
import ScalePicker from '@/features/entries/components/ScalePicker.vue'
import { useEntriesInRange, useSetEntry, useToggleEntry } from '@/features/entries/entries.queries'
import { useHabits } from '@/features/habits/habits.queries'
import DayNoteField from '@/features/notes/components/DayNoteField.vue'
import { useNotesInRange } from '@/features/notes/notes.queries'
import YearHeatmap from '@/features/stats/components/YearHeatmap.vue'
import { eachDayOfYear, todayKey } from '@/shared/lib/date'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import KindDot from '@/shared/ui/KindDot.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'

const route = useRoute()
const router = useRouter()

const { toggle } = useToggleEntry()
const setEntry = useSetEntry()

const selectedDay = ref<string | null>(null)
const scalingHabitId = ref<string | null>(null)

/** One sheet, two contents: the day summary, or the 1-5 picker for one habit. */
const daySheetOpen = computed({
  get: () => selectedDay.value !== null,
  set: (open: boolean) => {
    if (!open) {
      selectedDay.value = null
      scalingHabitId.value = null
    }
  },
})

function onSelectDay(_habitId: string, dateKey: string) {
  scalingHabitId.value = null
  selectedDay.value = dateKey
}

function onToggle(habitId: string) {
  const dateKey = selectedDay.value
  if (!dateKey) return

  toggle({ habitId, dateKey }, markedByHabit.value.get(habitId)?.has(dateKey) ?? false)
}

function onScaleSubmit(payload: { value: number; note: string | null }) {
  const dateKey = selectedDay.value
  const habitId = scalingHabitId.value
  if (!dateKey || !habitId) return

  setEntry.mutate({ habitId, dateKey, ...payload })
  scalingHabitId.value = null
}

const currentYear = new Date().getFullYear()

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

/** Days that have a note, for the small marker on each cell. */
const noteDays = computed(() => new Set((notes.value ?? []).map((note) => note.entry_date)))

const noteBodyByDay = computed(
  () => new Map((notes.value ?? []).map((note) => [note.entry_date, note.body])),
)

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
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <PageHeader :title="String(year)">
      <template #left>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2"
          aria-label="Previous year"
          @click="year -= 1"
        >
          ‹
        </button>
      </template>
      <template #right>
        <button
          type="button"
          class="text-ink-soft hover:text-ink p-2 disabled:opacity-30"
          aria-label="Next year"
          :disabled="year >= currentYear"
          @click="year += 1"
        >
          ›
        </button>
      </template>
    </PageHeader>

    <SkeletonList v-if="isPending" row-height="h-28" label="Loading habits…" />

    <ul v-else class="flex flex-col gap-3">
      <li
        v-for="habit in habits ?? []"
        :key="habit.id"
        class="border-hair rounded-card flex flex-col gap-2 border p-3"
      >
        <div class="flex items-center gap-2">
          <KindDot :kind="habit.kind" />
          <span class="text-ink flex-1 truncate text-sm font-medium">{{ habit.name }}</span>
        </div>

        <YearHeatmap
          :days="days"
          :kind="habit.kind"
          :marked-days="markedByHabit.get(habit.id) ?? new Set()"
          :values="valuesByHabit.get(habit.id)"
          :note-days="noteDays"
          @select="(day) => onSelectDay(habit.id, day)"
        />
      </li>
    </ul>

    <BaseSheet v-model="daySheetOpen" :title="scalingHabitId ? 'How was it?' : 'Day'">
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
        @toggle="onToggle"
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
