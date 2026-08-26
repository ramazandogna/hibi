<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Pencil } from 'lucide-vue-next'

import { useEntriesInRange } from '@/features/entries/entries.queries'
import HabitForm from '@/features/habits/components/HabitForm.vue'
import { useArchiveHabit, useHabit } from '@/features/habits/habits.queries'
import { useHabitStats } from '@/features/stats/use-habit-stats'
import { fromDateKey, lastNDays, toDateKey, todayKey } from '@/shared/lib/date'
import { KIND_META } from '@/shared/lib/kind'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import SkeletonList from '@/shared/ui/SkeletonList.vue'
import StatCard from '@/shared/ui/StatCard.vue'

const { id } = defineProps<{ id: string }>()

const router = useRouter()
const { data: habit, isPending, isError } = useHabit(() => id)

const window365 = computed(() => lastNDays(365))
const rangeFrom = computed(() => window365.value[0] ?? todayKey())
const rangeTo = computed(() => window365.value.at(-1) ?? todayKey())
const { data: entries } = useEntriesInRange(rangeFrom, rangeTo)

const ownEntries = computed(() => (entries.value ?? []).filter((entry) => entry.habit_id === id))
const markedDays = computed(() => new Set(ownEntries.value.map((entry) => entry.entry_date)))
const values = computed(
  () => new Map(ownEntries.value.map((entry) => [entry.entry_date, entry.value])),
)

const statsInput = computed(() => ({
  kind: habit.value?.kind ?? 'build',
  createdAt: habit.value ? toDateKey(new Date(habit.value.created_at)) : todayKey(),
}))

const { streak, longest, completion30, average7, averagePrevious7, summary } = useHabitStats(
  statsInput,
  markedDays,
  values,
  rangeTo,
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
      { value: average7.value?.toFixed(1) ?? '—', label: 'avg this week', trend: trend.value },
      { value: averagePrevious7.value?.toFixed(1) ?? '—', label: 'avg last week', trend: null },
      { value: String(markedDays.value.size), label: 'days tracked', trend: null },
    ]
  }

  return [
    { value: String(streak.value), label: KIND_META[kind].streakLabel, trend: null },
    { value: String(longest.value), label: 'best run', trend: null },
    { value: `${Math.round(completion30.value * 100)}%`, label: 'last 30 days', trend: null },
  ]
})

const noteFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
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
      date: noteFormatter.format(fromDateKey(entry.entry_date)),
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
    <header class="flex items-center gap-2">
      <button
        type="button"
        class="text-ink-soft hover:text-ink p-1"
        aria-label="Back"
        @click="router.back()"
      >
        <ArrowLeft class="size-5" />
      </button>
      <h1 class="text-ink flex-1 truncate text-lg font-semibold">{{ habit?.name ?? '' }}</h1>
      <button
        v-if="habit"
        type="button"
        class="text-ink-soft hover:text-ink p-1"
        aria-label="Edit habit"
        @click="editOpen = true"
      >
        <Pencil class="size-5" />
      </button>
    </header>

    <SkeletonList v-if="isPending" :rows="1" row-height="h-20" label="Loading habit…" />
    <p v-else-if="isError" class="text-ink-soft text-sm">This habit no longer exists.</p>

    <template v-else-if="habit">
      <p class="text-ink-soft text-sm">{{ summary }}</p>

      <div class="flex gap-2">
        <StatCard
          v-for="card in cards"
          :key="card.label"
          :value="card.value"
          :label="card.label"
          :trend="card.trend"
        />
      </div>

      <BaseButton variant="ghost" :loading="archive.isPending.value" @click="archiveAndLeave">
        Archive habit
      </BaseButton>

      <section class="flex flex-col gap-2">
        <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">
          Notes<span v-if="notes.length > 0"> · {{ notes.length }}</span>
        </h2>

        <p v-if="notes.length === 0" class="text-ink-soft text-sm">
          No notes yet. Add one when you check this habit off.
        </p>

        <ul v-else class="flex flex-col gap-2">
          <li
            v-for="note in notes"
            :key="note.id"
            class="border-hair rounded-card flex flex-col gap-1 border p-3"
          >
            <p class="text-ink-soft text-xs tabular-nums">{{ note.date }}</p>
            <p class="text-ink text-sm whitespace-pre-wrap">{{ note.body }}</p>
          </li>
        </ul>
      </section>

      <BaseSheet v-model="editOpen" title="Edit habit">
        <HabitForm :key="habit.id" :habit="habit" @saved="editOpen = false" />
      </BaseSheet>
    </template>
  </div>
</template>
