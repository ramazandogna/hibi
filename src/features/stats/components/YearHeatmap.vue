<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { fromDateKey, leadingBlanks, todayKey } from '@/shared/lib/date'
import type { WeekStart } from '@/shared/lib/date'
import { dayCellClass } from '@/shared/lib/kind'
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
const today = todayKey()
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' })

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
        label: monthFormatter.format(fromDateKey(day)),
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
 * One listener for the whole grid instead of one per cell.
 *
 * A year is 365 buttons, and the screen stacks one grid per habit — binding
 * click handlers individually would cost thousands of listeners.
 */
function onGridClick(event: MouseEvent) {
  const cell = (event.target as HTMLElement).closest('[data-date]')
  const date = cell?.getAttribute('data-date')

  if (date && date <= today) emit('select', date)
}

onMounted(() => {
  // Open on the most recent weeks; the year starts far off-screen to the left.
  if (scroller.value) scroller.value.scrollLeft = scroller.value.scrollWidth
})
</script>

<template>
  <div ref="scroller" class="-mx-1 overflow-x-auto px-1">
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
            :disabled="day > today"
            :aria-label="day"
            class="rounded-cell relative size-2.5 after:absolute after:right-0 after:bottom-0 after:hidden after:size-[3px] after:rounded-full after:bg-black/40 after:content-[''] data-[note]:after:block"
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
  </div>
</template>
