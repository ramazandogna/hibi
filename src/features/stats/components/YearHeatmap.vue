<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { fromDateKey, leadingBlanks } from '@/shared/lib/date'
import { useDragScroll } from '@/shared/lib/use-drag-scroll'
import { useToday } from '@/shared/lib/today'
import { formatDate } from '@/shared/lib/format'
import type { WeekStart } from '@/shared/lib/date'
import { dayCellClass, KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'

const {
  days,
  kind,
  markedDays,
  values,
  noteDays = undefined,
  weekStartsOn = 1,
} = defineProps<{
  days: readonly string[]
  kind: HabitKind
  markedDays: ReadonlySet<string>
  values: ReadonlyMap<string, number> | undefined
  noteDays?: ReadonlySet<string> | undefined
  weekStartsOn?: WeekStart
}>()

const emit = defineEmits<{ select: [dateKey: string] }>()

type MonthBlock = { key: string; label: string; blanks: number; days: string[] }

const scroller = ref<HTMLElement | null>(null)
const { didDrag } = useDragScroll(scroller)
const today = useToday()
/**
 * The year split into month blocks.
 *
 * Each month starts a fresh column instead of flowing on from the previous one,
 * so its label sits directly above its own block and the grid reads as a
 * calendar rather than one continuous strip.
 */
const months = computed<MonthBlock[]>(() => {
  const blocks: MonthBlock[] = []

  for (const day of days) {
    const monthKey = day.slice(0, 7)
    let block = blocks.at(-1)

    if (!block || block.key !== monthKey) {
      block = {
        key: monthKey,
        label: formatDate(fromDateKey(day), { month: 'short' }),
        blanks: leadingBlanks(day, weekStartsOn),
        days: [],
      }
      blocks.push(block)
    }

    block.days.push(day)
  }

  return blocks
})

/**
 * One listener for the whole grid, and only note days respond.
 *
 * The year view is a read-only history: marking days belongs to Today and Week,
 * where a mistap is obvious. Here a cell is only a door to what was written.
 */
function onGridClick(event: MouseEvent) {
  // A press that scrolled the grid is not a tap on the cell it started over.
  if (didDrag()) return

  const cell = (event.target as HTMLElement).closest('[data-date]')
  const date = cell?.getAttribute('data-date')

  if (date && noteDays?.has(date)) emit('select', date)
}

onMounted(() => {
  // Open on the most recent weeks; the year starts far off-screen to the left.
  if (scroller.value) scroller.value.scrollLeft = scroller.value.scrollWidth
})
</script>

<template>
  <div ref="scroller" data-hscroll class="no-scrollbar -mx-1 overflow-x-auto px-1">
    <div class="flex gap-1.5" @click="onGridClick">
      <div v-for="month in months" :key="month.key" class="flex flex-col gap-1">
        <span class="text-ink-soft text-[9px] leading-none">{{ month.label }}</span>

        <div class="grid grid-flow-col grid-rows-7 gap-[2px]">
          <span
            v-for="blank in month.blanks"
            :key="`blank-${blank}`"
            aria-hidden="true"
            class="size-2.5"
          />
          <button
            v-for="day in month.days"
            :key="day"
            type="button"
            :data-date="day"
            :disabled="!noteDays?.has(day)"
            :aria-label="noteDays?.has(day) ? `${day} — ${$t('year.hasNote')}` : day"
            class="rounded-cell after:bg-ink relative size-2.5 after:absolute after:inset-0 after:m-auto after:hidden after:size-[4px] after:rounded-full after:transition-transform after:content-[''] data-[note]:cursor-pointer data-[note]:before:absolute data-[note]:before:-inset-1 data-[note]:before:content-[''] data-[note]:after:block data-[note]:hover:after:scale-150"
            :data-note="noteDays?.has(day) ? '' : undefined"
            :class="
              dayCellClass({
                kind,
                isMarked: markedDays.has(day),
                value: values?.get(day),
                isFuture: day > today,
              })
            "
          />
        </div>
      </div>
    </div>

    <p
      v-if="noteDays && noteDays.size > 0"
      class="text-ink-soft mt-2 flex items-center justify-end gap-1.5 text-[10px]"
    >
      <span class="rounded-cell relative inline-block size-2.5" :class="KIND_META[kind].empty">
        <span class="bg-ink absolute inset-0 m-auto size-[4px] rounded-full" />
      </span>
      {{ $t('year.hasNote') }}
    </p>
  </div>
</template>
