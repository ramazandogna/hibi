<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ChevronDown, ChevronRight, Compass, Sparkles } from 'lucide-vue-next'

import { useCreateHabit, useHabits } from '@/features/habits/habits.queries'
import { useOnboarding } from '@/features/onboarding/onboarding'
import NotificationNudge from '@/features/notifications/components/NotificationNudge.vue'
import InstallPrompt from '@/features/pwa/components/InstallPrompt.vue'
import { t } from '@/shared/i18n'
import {
  BaseButton,
  BaseSheet,
  EmptyState,
  PageHeader,
  SectionHeading,
  SkeletonList,
  formatDate,
  fromDateKey,
  lastNDays,
  toAppError,
  useToday,
} from 'rei-kit'
import type { WeekStart } from 'rei-kit'
import { groupByKind, KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'
import { useEntriesInRange, useSetEntry, useToggleEntry } from '@/features/entries/entries.queries'
import DayPanel from '@/features/entries/components/DayPanel.vue'
import EntryNoteSheet from '@/features/entries/components/EntryNoteSheet.vue'
import MarkedDayActions from '@/features/entries/components/MarkedDayActions.vue'
import ScaleCheckIn from '@/features/entries/components/ScaleCheckIn.vue'
import ScalePicker from '@/features/entries/components/ScalePicker.vue'
import HabitRow from '@/features/habits/components/HabitRow.vue'
import DayNoteField from '@/features/notes/components/DayNoteField.vue'
import { useNotesInRange } from '@/features/notes/notes.queries'
import { useProfile } from '@/features/profile/profile.queries'
import { useRouter } from 'vue-router'

const router = useRouter()
const tour = useOnboarding()

const { data: profile } = useProfile()
const weekStartsOn = computed<WeekStart>(() => (profile.value?.week_starts_on === 0 ? 0 : 1))

/** Squares show five days; the query pulls a year so streaks are exact. */
const STATS_WINDOW_DAYS = 365

const today = useToday()

// Reading `today` is what makes these recompute when the date rolls over;
// `lastNDays` on its own has no reactive dependency to track.
/** Today plus the four days before it, oldest first. */
const days = computed(() => lastNDays(5, today.value))
const statsWindow = computed(() => lastNDays(STATS_WINDOW_DAYS, today.value))
const rangeFrom = computed(() => statsWindow.value[0] ?? today.value)
const rangeTo = computed(() => statsWindow.value.at(-1) ?? today.value)

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

const todayTitle = computed(() =>
  formatDate(fromDateKey(rangeTo.value), { weekday: 'long', day: 'numeric', month: 'long' }),
)

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
/** One starter per kind, so the empty state also teaches the three modes. */
const SUGGESTIONS = [
  { key: 'today.suggestionCode', kind: 'build' },
  { key: 'today.suggestionScroll', kind: 'quit' },
  { key: 'today.suggestionFeel', kind: 'scale' },
] as const satisfies readonly { key: string; kind: HabitKind }[]

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
  createHabit.mutate({ name: t(suggestion.key), kind: suggestion.kind })
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
          :aria-label="$t('common.openItem', { name: todayTitle })"
          @click="dayPanelOpen = true"
        >
          <span class="truncate">{{ todayTitle }}</span>
          <ChevronDown class="text-ink-soft size-4 shrink-0" aria-hidden="true" />
        </button>
      </template>
    </PageHeader>

    <!-- Only once there is something to be reminded about. A brand-new account
         has the guide open; stacking two permission asks on top of it is a wall
         rather than a welcome. -->
    <template v-if="!isPending && !isError && !isEmpty">
      <InstallPrompt />
      <NotificationNudge />
    </template>

    <SkeletonList v-if="isPending" row-height="h-14" :label="$t('today.loadingHabits')" />

    <div v-else-if="isError" class="flex flex-col items-center gap-3 py-10 text-center">
      <p class="text-ink text-sm">{{ errorMessage }}</p>
      <BaseButton variant="ghost" @click="refetch()">{{ $t('common.tryAgain') }}</BaseButton>
    </div>

    <EmptyState
      v-else-if="isEmpty"
      :title="$t('today.emptyTitle')"
      :description="$t('today.emptyDescription')"
    >
      <template #icon><Sparkles class="size-6" /></template>
      <template #action>
        <!-- Offered above the starters on purpose: someone with nothing tracked
             has not decided this is worth doing yet, and the guide is the
             argument. The duration is on the button because the real objection
             to a tour is not interest, it is how long it will take. -->
        <button
          type="button"
          class="border-sea/30 bg-sea/8 hover:bg-sea/14 rounded-card flex w-full items-center gap-3 border p-3 text-left transition-colors active:scale-[0.98]"
          @click="tour.restart()"
        >
          <span
            class="bg-sea flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
            aria-hidden="true"
          >
            <Compass class="size-5" />
          </span>

          <span class="min-w-0 flex-1">
            <span class="text-ink block text-sm font-semibold">{{
              $t('onboarding.discover')
            }}</span>
            <span class="text-ink-soft block text-xs leading-snug">
              {{ $t('onboarding.discoverHint') }}
            </span>
          </span>

          <ChevronRight class="text-ink-soft size-4 shrink-0" aria-hidden="true" />
        </button>

        <div class="flex items-center gap-3 py-1">
          <span class="bg-hair h-px flex-1" />
          <span class="text-ink-soft text-xs">{{ $t('auth.or') }}</span>
          <span class="bg-hair h-px flex-1" />
        </div>

        <BaseButton
          v-for="suggestion in SUGGESTIONS"
          :key="suggestion.key"
          variant="ghost"
          :loading="createHabit.isPending.value"
          @click="addSuggestion(suggestion)"
        >
          {{ $t(suggestion.key) }}
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
      <SectionHeading
        :tone="KIND_META[group.kind]"
        :label="$t(`kind.${group.kind}.group`)"
        :count="group.items.length"
      />

      <ul class="flex flex-col gap-2">
        <HabitRow
          v-for="habit in group.items"
          :key="habit.id"
          :values="valuesByHabit.get(habit.id)"
          :habit="habit"
          :days="days"
          :today="rangeTo"
          :marked-days="markedByHabit.get(habit.id) ?? new Set()"
          :week-starts-on="weekStartsOn"
          @toggle="(day) => onToggle(habit.id, day)"
          @scale="(day) => openScale(habit.id, day)"
          @open="openHabit"
        />
      </ul>
    </section>

    <BaseSheet v-model="markedSheetOpen" :title="$t('today.thisDay')">
      <MarkedDayActions
        v-if="markedTarget"
        :key="`${markedTarget.habitId}-${markedTarget.dateKey}`"
        :habit-name="markedTarget.name"
        :initial-note="noteByHabitDay.get(`${markedTarget.habitId}:${markedTarget.dateKey}`) ?? ''"
        @save="saveMarkedNote"
        @remove="removeMark"
      />
    </BaseSheet>

    <BaseSheet v-model="noteSheetOpen" :title="$t('today.addNote')">
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

    <BaseSheet v-model="scaleOpen" :title="$t('today.howWasIt')">
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
