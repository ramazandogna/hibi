<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { leadingBlanks, todayKey } from '@/shared/lib/date'
import type { WeekStart } from '@/shared/lib/date'
import { KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'

const {
  year,
  days,
  kind,
  markedDays,
  values,
  weekStartsOn = 1,
} = defineProps<{
  year: number
  days: readonly string[]
  kind: HabitKind
  markedDays: ReadonlySet<string>
  values: ReadonlyMap<string, number> | undefined
  weekStartsOn?: WeekStart
}>()

const emit = defineEmits<{ select: [dateKey: string] }>()

const scroller = ref<HTMLElement | null>(null)
const blanks = computed(() => leadingBlanks(year, weekStartsOn))
const today = todayKey()

/** Same 20-100% ramp the scale picker uses, so the two screens read alike. */
const SCALE_OPACITY = ['opacity-20', 'opacity-40', 'opacity-60', 'opacity-80', 'opacity-100']

function cellClass(day: string): string {
  if (day > today) return 'border-hair border bg-transparent'
  if (!markedDays.has(day)) return 'bg-mist'

  const meta = KIND_META[kind]
  if (kind !== 'scale') return meta.fill

  const value = values?.get(day) ?? 1

  return `${meta.fill} ${SCALE_OPACITY[value - 1] ?? 'opacity-100'}`
}

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
    <div class="grid grid-flow-col grid-rows-7 gap-[2px]" @click="onGridClick">
      <span v-for="blank in blanks" :key="`blank-${blank}`" aria-hidden="true" class="size-2.5" />

      <button
        v-for="day in days"
        :key="day"
        type="button"
        :data-date="day"
        :disabled="day > today"
        :aria-label="day"
        class="rounded-cell size-2.5"
        :class="cellClass(day)"
      />
    </div>
  </div>
</template>
