<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ChevronDown, Sparkles } from 'lucide-vue-next'

import { useCreateHabit, useHabits } from '@/features/habits/habits.queries'
import { toAppError } from '@/shared/lib/app-error'
import { groupByKind, KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'
import BaseButton from '@/shared/ui/BaseButton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import PageHeader from '@/shared/ui/PageHeader.vue'
import SectionHeading from '@/shared/ui/SectionHeading.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'
import { fromDateKey, lastNDays, todayKey } from '@/shared/lib/date'
import { useEntriesInRange, useSetEntry, useToggleEntry } from '@/features/entries/entries.queries'
import DayPanel from '@/features/entries/components/DayPanel.vue'
import EntryNoteSheet from '@/features/entries/components/EntryNoteSheet.vue'
import MarkedDayActions from '@/features/entries/components/MarkedDayActions.vue'
import ScaleCheckIn from '@/features/entries/components/ScaleCheckIn.vue'
import ScalePicker from '@/features/entries/components/ScalePicker.vue'
import HabitRow from '@/features/habits/components/HabitRow.vue'
import DayNoteField from '@/features/notes/components/DayNoteField.vue'
import { useNotesInRange } from '@/features/notes/notes.queries'
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

const { data: notes } = useNotesInRange(rangeFrom, rangeTo)

const noteBodyByDay = computed(
  () => new Map((notes.value ?? []).map((note) => [note.entry_date, note.body])),
)

/** The header date opens the day panel, the only place a day note is written. */
const dayPanelOpen = ref(false)

const { toggle } = useToggleEntry()

/** Habit the user just marked today, waiting to be offered a note. */
const noteTarget = ref<{ habitId: string; name: string; dateKey: string } | null>(null)

const noteSheetOpen = computed({
  get: () => noteTarget.value !== null,
  set: (open: boolean) => {
    if (!open) noteTarget.value = null
  },
})

const noteByHabitDay = computed(
  () =>
    new Map(
      (entries.value ?? []).map((entry) => [`${entry.habit_id}:${entry.entry_date}`, entry.note]),
    ),
)

/**
 * Marking stays one tap; the note is offered afterwards.
 *
 * Asking first would put a form in front of the app's most frequent action.
 * Only today, only when checking on, and only for binary kinds — scale habits
 * already collect a note inside the picker.
 */
/**
 * Marking on is one tap; unmarking never is.
 *
 * A mistap on an already-marked day used to wipe it — along with any note
 * attached to it — with no confirmation. Now it opens a sheet where removing is
 * a deliberate second action.
 */
function onToggle(habitId: string, dateKey: string) {
  const wasMarked = markedByHabit.value.get(habitId)?.has(dateKey) ?? false
  const habit = (habits.value ?? []).find((item) => item.id === habitId)
  if (!habit) return

  if (wasMarked) {
    markedTarget.value = { habitId, name: habit.name, dateKey }
    return
  }

  toggle({ habitId, dateKey }, false)

  // Scale habits collect a note inside the picker, so only binary kinds ask.
  if (KIND_META[habit.kind].isBinary) {
    noteTarget.value = { habitId, name: habit.name, dateKey }
  }
}

/** Habit + day the user tapped while it was already marked. */
const markedTarget = ref<{ habitId: string; name: string; dateKey: string } | null>(null)

const markedSheetOpen = computed({
  get: () => markedTarget.value !== null,
  set: (open: boolean) => {
    if (!open) markedTarget.value = null
  },
})

function saveMarkedNote(note: string | null) {
  const target = markedTarget.value
  if (!target) return

  setEntry.mutate({ habitId: target.habitId, dateKey: target.dateKey, value: 1, note })
  markedTarget.value = null
}

function removeMark() {
  const target = markedTarget.value
  if (!target) return

  toggle({ habitId: target.habitId, dateKey: target.dateKey }, true)
  markedTarget.value = null
}

function saveEntryNote(note: string | null) {
  const target = noteTarget.value
  if (!target) return

  if (note !== null) {
    setEntry.mutate({ habitId: target.habitId, dateKey: target.dateKey, value: 1, note })
  }

  noteTarget.value = null
}

const { data: habits, isPending, isError, error, refetch } = useHabits()
const createHabit = useCreateHabit()

/** One example per tracking mode, so the empty state also explains the product. */
const SUGGESTIONS = [
  { name: 'Write code', kind: 'build' },
  { name: 'Late-night scrolling', kind: 'quit' },
  { name: 'How I feel', kind: 'scale' },
] as const satisfies readonly { name: string; kind: HabitKind }[]

type Suggestion = (typeof SUGGESTIONS)[number]

const errorMessage = computed(() => (error.value ? toAppError(error.value).message : ''))
const isEmpty = computed(() => (habits.value?.length ?? 0) === 0)

/** Rows read as three labelled blocks instead of one mixed list. */
/**
 * Groups, with today's finished habits pushed to the bottom.
 *
 * What is left to do belongs at the top: the screen answers "what now" before
 * it answers "what did I already do". Order is stable within each half, so a
 * row never jumps past its neighbours.
 */
const habitGroups = computed(() =>
  groupByKind(habits.value ?? [], (habit) => habit.kind).map((group) => ({
    ...group,
    items: [
      ...group.items.filter((habit) => !markedByHabit.value.get(habit.id)?.has(rangeTo.value)),
      ...group.items.filter((habit) => markedByHabit.value.get(habit.id)?.has(rangeTo.value)),
    ],
  })),
)

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

function clearScale() {
  const target = scaleTarget.value
  if (!target) return

  toggle(target, true)
  scaleTarget.value = null
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
    <PageHeader :title="todayTitle">
      <template #title>
        <button
          type="button"
          class="header-action"
          :aria-label="`Open ${todayTitle}`"
          @click="dayPanelOpen = true"
        >
          <span class="truncate">{{ todayTitle }}</span>
          <ChevronDown class="text-ink-soft size-4 shrink-0" aria-hidden="true" />
        </button>
      </template>
    </PageHeader>

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

    <section
      v-for="group in !isPending && !isError && !isEmpty ? habitGroups : []"
      :key="group.kind"
      class="flex flex-col gap-2"
    >
      <SectionHeading :kind="group.kind" :label="group.label" :count="group.items.length" />

      <ul class="flex flex-col gap-2">
        <HabitRow
          v-for="habit in group.items"
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
    </section>

    <BaseSheet v-model="markedSheetOpen" title="This day">
      <MarkedDayActions
        v-if="markedTarget"
        :key="`${markedTarget.habitId}-${markedTarget.dateKey}`"
        :habit-name="markedTarget.name"
        :initial-note="noteByHabitDay.get(`${markedTarget.habitId}:${markedTarget.dateKey}`) ?? ''"
        @save="saveMarkedNote"
        @remove="removeMark"
      />
    </BaseSheet>

    <BaseSheet v-model="noteSheetOpen" title="Add a note">
      <EntryNoteSheet
        v-if="noteTarget"
        :key="`${noteTarget.habitId}-${noteTarget.dateKey}`"
        :habit-name="noteTarget.name"
        :initial-note="noteByHabitDay.get(`${noteTarget.habitId}:${noteTarget.dateKey}`) ?? ''"
        @save="saveEntryNote"
        @skip="noteTarget = null"
      />
    </BaseSheet>

    <BaseSheet v-model="dayPanelOpen" :title="todayTitle">
      <DayPanel
        :date-key="rangeTo"
        :habits="habits ?? []"
        :marked-by-habit="markedByHabit"
        :values-by-habit="valuesByHabit"
        @toggle="(habitId) => onToggle(habitId, rangeTo)"
        @scale="(habitId) => openScale(habitId, rangeTo)"
      >
        <template #note>
          <DayNoteField
            :key="rangeTo"
            :date-key="rangeTo"
            :initial-body="noteBodyByDay.get(rangeTo) ?? ''"
          />
        </template>
      </DayPanel>
    </BaseSheet>

    <BaseSheet v-model="scaleOpen" title="How was it?">
      <ScalePicker
        v-if="scaleTarget"
        :key="`${scaleTarget.habitId}-${scaleTarget.dateKey}`"
        :initial-value="valuesByHabit.get(scaleTarget.habitId)?.get(scaleTarget.dateKey) ?? null"
        @submit="saveScale"
        @remove="clearScale"
      />
    </BaseSheet>
  </div>
</template>
