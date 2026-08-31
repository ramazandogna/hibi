<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, NotebookPen, Pencil } from 'lucide-vue-next'

import { useEntriesInRange } from '@/features/entries/entries.queries'
import HabitForm from '@/features/habits/components/HabitForm.vue'
import HabitNoteTimeline from '@/features/habits/components/HabitNoteTimeline.vue'
import { useArchiveHabit, useHabit } from '@/features/habits/habits.queries'
import { useProfile } from '@/features/profile/profile.queries'
import StreakBadge from '@/features/stats/components/StreakBadge.vue'
import YearHeatmap from '@/features/stats/components/YearHeatmap.vue'
import { useHabitStats } from '@/features/stats/use-habit-stats'
import { fromDateKey, lastNDays, toDateKey } from '@/shared/lib/date'
import type { WeekStart } from '@/shared/lib/date'
import { formatDate } from '@/shared/lib/format'
import { KIND_META } from '@/shared/lib/kind'
import { useToday } from '@/shared/lib/today'
import { t } from '@/shared/i18n'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import KindDot from '@/shared/ui/KindDot.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'
import StatCard from '@/shared/ui/StatCard.vue'

const { id } = defineProps<{ id: string }>()

const router = useRouter()
const today = useToday()
const { data: habit, isPending, isError } = useHabit(() => id)
const { data: profile } = useProfile()

const weekStartsOn = computed<WeekStart>(() => (profile.value?.week_starts_on === 0 ? 0 : 1))

const window365 = computed(() => lastNDays(365, today.value))
const rangeFrom = computed(() => window365.value[0] ?? today.value)
const rangeTo = computed(() => window365.value.at(-1) ?? today.value)
const { data: entries } = useEntriesInRange(rangeFrom, rangeTo)

const ownEntries = computed(() => (entries.value ?? []).filter((entry) => entry.habit_id === id))
const markedDays = computed(() => new Set(ownEntries.value.map((entry) => entry.entry_date)))
const values = computed(
  () => new Map(ownEntries.value.map((entry) => [entry.entry_date, entry.value])),
)

const statsInput = computed(() => ({
  kind: habit.value?.kind ?? 'build',
  createdAt: habit.value ? toDateKey(new Date(habit.value.created_at)) : today.value,
  targetPerWeek: habit.value?.target_per_week ?? 7,
}))

const { streak, longest, completion30, average7, averagePrevious7, summary, week, weekHistory } =
  useHabitStats(statsInput, markedDays, values, rangeTo, weekStartsOn)

const createdOn = computed(() =>
  habit.value
    ? formatDate(new Date(habit.value.created_at), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '',
)

const trend = computed(() => {
  const now = average7.value
  const before = averagePrevious7.value

  if (now === null || before === null) return null
  if (now > before) return 'up' as const
  if (now < before) return 'down' as const

  return 'flat' as const
})

const cards = computed(() => {
  const kind = habit.value?.kind ?? 'build'

  if (kind === 'scale') {
    return [
      {
        value: average7.value?.toFixed(1) ?? '—',
        label: t('stats.avgThisWeek'),
        trend: trend.value,
      },
      {
        value: averagePrevious7.value?.toFixed(1) ?? '—',
        label: t('stats.avgLastWeek'),
        trend: null,
      },
      { value: String(markedDays.value.size), label: t('stats.daysTracked'), trend: null },
    ]
  }

  // A paced habit is judged by the week, so the third slot reports weeks hit
  // rather than a raw thirty-day rate that its own target guarantees is low.
  const third =
    kind === 'build' && week.value.isPaced
      ? {
          value: `${weekHistory.value.met}/${weekHistory.value.total}`,
          label: t('stats.weeksOnTarget'),
          trend: null,
        }
      : {
          value: `${Math.round(completion30.value * 100)}%`,
          label: t('stats.last30'),
          trend: null,
        }

  return [
    { value: String(streak.value), label: t(`kind.${kind}.streak`), trend: null },
    { value: String(longest.value), label: t('stats.bestRun'), trend: null },
    third,
  ]
})

/**
 * Every entry that carries a note, newest first.
 *
 * The stat cards say how often; these say why. Reading them back is the point
 * of writing them, so they get a place on the habit's own page.
 */
const notes = computed(() =>
  ownEntries.value
    .filter((entry) => (entry.note ?? '').trim().length > 0)
    .sort((a, b) => b.entry_date.localeCompare(a.entry_date))
    .map((entry) => ({
      id: entry.id,
      date: formatDate(fromDateKey(entry.entry_date), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      body: entry.note ?? '',
    })),
)

const editOpen = ref(false)
const archive = useArchiveHabit()

async function archiveAndLeave() {
  await archive.mutateAsync(id)
  await router.push('/')
}
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <header class="flex items-center justify-between">
      <button
        type="button"
        class="text-ink-soft hover:text-ink hover:bg-mist flex size-11 shrink-0 items-center justify-center rounded-full transition-colors active:scale-90"
        :aria-label="$t('common.back')"
        @click="router.back()"
      >
        <ArrowLeft class="size-5" />
      </button>

      <button
        v-if="habit"
        type="button"
        class="text-ink-soft hover:text-ink hover:bg-mist flex size-11 shrink-0 items-center justify-center rounded-full transition-colors active:scale-90"
        :aria-label="$t('habit.edit')"
        @click="editOpen = true"
      >
        <Pencil class="size-5" />
      </button>
    </header>

    <SkeletonList v-if="isPending" :rows="1" row-height="h-20" :label="$t('habit.loadingHabit')" />
    <p v-else-if="isError" class="text-ink-soft text-sm">{{ $t('habit.missing') }}</p>

    <template v-else-if="habit">
      <!-- The name lives here rather than in the header bar so it can be set at
           a readable size and wrap, instead of being cut to fit between two
           icon buttons. -->
      <section
        class="rounded-card flex flex-col gap-3 border p-4"
        :class="KIND_META[habit.kind].card"
      >
        <span class="flex items-center gap-1.5">
          <KindDot :kind="habit.kind" />
          <span
            class="text-[11px] font-semibold tracking-wide uppercase"
            :class="KIND_META[habit.kind].text"
          >
            {{ $t(`kind.${habit.kind}.group`) }}
          </span>
        </span>

        <h1 class="text-ink text-2xl leading-tight font-semibold text-balance">
          {{ habit.name }}
        </h1>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span
            v-if="habit.kind === 'build' && week.isPaced"
            class="text-ink-soft text-xs tabular-nums"
          >
            {{ $t('stats.thisWeek', { done: week.done, target: week.target }) }}
          </span>
          <StreakBadge
            v-else-if="KIND_META[habit.kind].isBinary"
            :streak="streak"
            :longest="longest"
            :kind="habit.kind"
          />
          <span v-else class="text-ink-soft text-xs">{{ summary }}</span>

          <span v-if="createdOn" class="text-ink-soft text-xs">
            {{ $t('habit.since', { date: createdOn }) }}
          </span>
        </div>
      </section>

      <div class="flex gap-2">
        <StatCard
          v-for="card in cards"
          :key="card.label"
          :value="card.value"
          :label="card.label"
          :trend="card.trend"
        />
      </div>

      <section class="flex flex-col gap-2">
        <h2 class="text-ink-soft px-1 text-xs font-semibold tracking-wide uppercase">
          {{ $t('habit.activity') }}
        </h2>

        <div class="border-hair bg-surface rounded-card border p-3">
          <YearHeatmap
            :days="window365"
            :kind="habit.kind"
            :marked-days="markedDays"
            :values="values"
            :week-starts-on="weekStartsOn"
          />
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <h2
          class="text-ink-soft flex items-center gap-2 px-1 text-xs font-semibold tracking-wide uppercase"
        >
          {{ $t('habit.notes') }}
          <span
            v-if="notes.length > 0"
            class="bg-mist text-ink-soft rounded-full px-2 tabular-nums"
          >
            {{ notes.length }}
          </span>
        </h2>

        <div
          v-if="notes.length === 0"
          class="border-hair rounded-card flex flex-col items-center gap-2 border border-dashed px-6 py-8 text-center"
        >
          <NotebookPen class="text-ink-soft size-6" aria-hidden="true" />
          <p class="text-ink text-sm font-medium">{{ $t('habit.noNotesTitle') }}</p>
          <p class="text-ink-soft max-w-[32ch] text-xs leading-relaxed">
            {{ $t('habit.noNotes') }}
          </p>
        </div>

        <HabitNoteTimeline v-else :notes="notes" :kind="habit.kind" />
      </section>

      <button
        type="button"
        class="text-ink-soft hover:text-alert self-center text-xs underline underline-offset-2 transition-colors disabled:opacity-50"
        :disabled="archive.isPending.value"
        @click="archiveAndLeave"
      >
        {{ $t('habit.archiveHabit') }}
      </button>

      <BaseSheet v-model="editOpen" :title="$t('habit.edit')">
        <HabitForm :key="habit.id" :habit="habit" @saved="editOpen = false" />
      </BaseSheet>
    </template>
  </div>
</template>
