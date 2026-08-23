<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useEntriesInRange } from '@/features/entries/entries.queries'
import { useHabits } from '@/features/habits/habits.queries'
import { eachDayOfYear } from '@/shared/lib/date'
import { KIND_META } from '@/shared/lib/kind'

const route = useRoute()
const router = useRouter()

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

/** `'all'` or a habit id. Also in the URL. */
const habitFilter = computed({
  get: () => (typeof route.query.h === 'string' ? route.query.h : 'all'),
  set: (next: string) => {
    void router.push({ query: { ...route.query, h: next } })
  },
})

const rangeFrom = computed(() => `${year.value}-01-01`)
const rangeTo = computed(() => `${year.value}-12-31`)

const days = computed(() => eachDayOfYear(year.value))

const { data: habits } = useHabits()
const { data: entries, isPending } = useEntriesInRange(rangeFrom, rangeTo, { keepPrevious: true })

const visibleEntries = computed(() => {
  const all = entries.value ?? []

  return habitFilter.value === 'all'
    ? all
    : all.filter((entry) => entry.habit_id === habitFilter.value)
})
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <header class="flex items-center justify-between">
      <button
        type="button"
        class="text-ink-soft hover:text-ink p-2"
        aria-label="Previous year"
        @click="year -= 1"
      >
        ‹
      </button>
      <h1 class="text-ink text-lg font-semibold tabular-nums">{{ year }}</h1>
      <button
        type="button"
        class="text-ink-soft hover:text-ink p-2 disabled:opacity-30"
        aria-label="Next year"
        :disabled="year >= currentYear"
        @click="year += 1"
      >
        ›
      </button>
    </header>

    <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <button
        type="button"
        class="rounded-card shrink-0 px-3 py-1.5 text-xs font-medium"
        :class="habitFilter === 'all' ? 'bg-sea text-white' : 'bg-mist text-ink-soft'"
        @click="habitFilter = 'all'"
      >
        All
      </button>
      <button
        v-for="habit in habits ?? []"
        :key="habit.id"
        type="button"
        class="rounded-card shrink-0 px-3 py-1.5 text-xs font-medium"
        :class="
          habitFilter === habit.id
            ? [KIND_META[habit.kind].fill, 'text-white']
            : 'bg-mist text-ink-soft'
        "
        @click="habitFilter = habit.id"
      >
        {{ habit.name }}
      </button>
    </div>

    <p class="text-ink-soft text-xs">
      {{ days.length }} days · {{ visibleEntries.length }} entries
      <span v-if="isPending"> · loading…</span>
    </p>
  </div>
</template>
