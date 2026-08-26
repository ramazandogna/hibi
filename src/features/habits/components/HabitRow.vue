<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

import type { Habit } from '../habit.types'
import { dayCellClass, KIND_META } from '@/shared/lib/kind'
import { fromDateKey, toDateKey } from '@/shared/lib/date'
import { formatDate } from '@/shared/lib/format'
import { tapFeedback } from '@/shared/lib/haptics'
import { useHabitStats } from '@/features/stats/use-habit-stats'
import StreakBadge from '@/features/stats/components/StreakBadge.vue'

const { habit, days, today, markedDays, values } = defineProps<{
  habit: Habit
  days: readonly string[]
  today: string
  markedDays: ReadonlySet<string>
  values: ReadonlyMap<string, number> | undefined
}>()

const emit = defineEmits<{
  toggle: [dateKey: string]
  scale: [dateKey: string]
  open: [habitId: string]
}>()

const todayValue = computed(() => values?.get(today) ?? null)

const meta = computed(() => KIND_META[habit.kind])

const { summary, streak, longest } = useHabitStats(
  () => ({ kind: habit.kind, createdAt: toDateKey(new Date(habit.created_at)) }),
  () => markedDays,
  () => values ?? new Map(),
  () => today,
)

/** Days before today; today gets its own larger button. */
const previousDays = computed(() => days.filter((day) => day !== today))

function dayLabel(dateKey: string) {
  return formatDate(fromDateKey(dateKey), { month: 'short', day: 'numeric' })
}

/** Binary kinds toggle; scale kinds ask for a value, past days included. */
function onDayTap(dateKey: string) {
  tapFeedback()

  if (meta.value.isBinary) {
    emit('toggle', dateKey)
  } else {
    emit('scale', dateKey)
  }
}

function onTodayTap() {
  onDayTap(today)
}
</script>

<template>
  <li
    class="rounded-card flex cursor-pointer items-center gap-3 border p-3"
    :class="meta.card"
    @click="emit('open', habit.id)"
  >
    <div class="flex size-10 shrink-0 items-center justify-center rounded-xl" :class="meta.soft">
      <span class="size-3 rounded-full" :class="meta.fill" />
    </div>

    <div class="min-w-0 flex-1">
      <p class="text-ink truncate text-sm font-medium">{{ habit.name }}</p>
      <p v-if="!meta.isBinary" class="text-ink-soft text-xs">{{ summary }}</p>
      <StreakBadge v-else :streak="streak" :longest="longest" :kind="habit.kind" />
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <button
        v-for="day in previousDays"
        :key="day"
        type="button"
        class="rounded-cell size-6 transition-transform duration-100 select-none active:scale-90"
        :class="
          dayCellClass({
            kind: habit.kind,
            isMarked: markedDays.has(day),
            value: values?.get(day),
          })
        "
        :aria-pressed="markedDays.has(day)"
        :aria-label="`${habit.name}, ${dayLabel(day)}`"
        @click.stop="onDayTap(day)"
      />
    </div>

    <button
      type="button"
      class="flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-100 select-none active:scale-95"
      :class="markedDays.has(today) ? [meta.fill, 'text-white'] : 'bg-mist text-ink-soft'"
      :aria-pressed="markedDays.has(today)"
      :aria-label="`${habit.name}, today`"
      @click.stop="onTodayTap"
    >
      <Check v-if="meta.isBinary" class="size-5" />
      <span v-else class="text-sm font-semibold">{{ todayValue ?? '–' }}</span>
    </button>
  </li>
</template>
