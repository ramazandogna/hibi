<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useEntriesInRange } from '@/features/entries/entries.queries'
import { useHabits } from '@/features/habits/habits.queries'
import { useNotesInRange } from '@/features/notes/notes.queries'
import { useWeekStart } from '@/features/profile/profile.queries'
import YearHeatmap from '@/features/stats/components/YearHeatmap.vue'
import { eachDayOfYear, fromDateKey, todayKey } from '@/shared/lib/date'
import { groupByKind, KIND_META } from '@/shared/lib/kind'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import KindDot from '@/shared/ui/KindDot.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'
import SectionHeading from '@/shared/ui/SectionHeading.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'

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

/** Days that have a note; the only cells the year grid lets you open. */
const noteDays = computed(() => new Set((notes.value ?? []).map((note) => note.entry_date)))

const noteBodyByDay = computed(
  () => new Map((notes.value ?? []).map((note) => [note.entry_date, note.body])),
)

const habitGroups = computed(() => groupByKind(habits.value ?? [], (habit) => habit.kind))

const selectedDay = ref<string | null>(null)

const noteTitleFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const daySheetOpen = computed({
  get: () => selectedDay.value !== null,
  set: (open: boolean) => {
    if (!open) selectedDay.value = null
  },
})

const selectedNote = computed(() =>
  selectedDay.value ? (noteBodyByDay.value.get(selectedDay.value) ?? '') : '',
)

const selectedDayTitle = computed(() =>
  selectedDay.value ? noteTitleFormatter.format(fromDateKey(selectedDay.value)) : '',
)

/** The year grid is read-only: a cell only opens the note it holds. */
function onSelectDay(dateKey: string) {
  selectedDay.value = dateKey
}
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

    <section
      v-for="group in isPending ? [] : habitGroups"
      :key="group.kind"
      class="flex flex-col gap-2"
    >
      <SectionHeading :kind="group.kind" :label="group.label" :count="group.items.length" />

      <ul class="flex flex-col gap-3">
        <li
          v-for="habit in group.items"
          :key="habit.id"
          class="rounded-card flex flex-col gap-2 border p-3"
          :class="KIND_META[habit.kind].card"
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
            :week-starts-on="weekStartsOn"
            @select="onSelectDay"
          />
        </li>
      </ul>
    </section>

    <BaseSheet v-model="daySheetOpen" :title="selectedDayTitle">
      <p v-if="selectedNote" class="text-ink text-sm whitespace-pre-wrap">{{ selectedNote }}</p>
    </BaseSheet>
  </div>
</template>
