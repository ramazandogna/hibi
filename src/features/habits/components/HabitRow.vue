<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

import type { Habit } from '../habit.types'
import type { WeekStart } from '@/shared/lib/date'
import { dayCellClass, KIND_META } from '@/shared/lib/kind'
import { fromDateKey, toDateKey } from '@/shared/lib/date'
import { formatDate } from '@/shared/lib/format'
import { shortDayLabel } from '@/shared/lib/day-label'
import { tapFeedback } from '@/shared/lib/haptics'
import { useHabitStats } from '@/features/stats/use-habit-stats'
import StreakBadge from '@/features/stats/components/StreakBadge.vue'

const {
  habit,
  days,
  today,
  markedDays,
  values,
  weekStartsOn = 1,
} = defineProps<{
  habit: Habit
  days: readonly string[]
  today: string
  markedDays: ReadonlySet<string>
  values: ReadonlyMap<string, number> | undefined
  weekStartsOn?: WeekStart
}>()

const emit = defineEmits<{
  toggle: [dateKey: string]
  scale: [dateKey: string]
  open: [habitId: string]
}>()

const todayValue = computed(() => values?.get(today) ?? null)

const meta = computed(() => KIND_META[habit.kind])

const { summary, streak, longest, week } = useHabitStats(
  () => ({
    kind: habit.kind,
    createdAt: toDateKey(new Date(habit.created_at)),
    targetPerWeek: habit.target_per_week,
  }),
  () => markedDays,
  () => values ?? new Map(),
  () => today,
  () => weekStartsOn,
)

/**
 * A paced habit shows its week, not a daily streak.
 *
 * Someone aiming for four days a week can never hold a seven-day chain, so a
 * streak badge on that habit counts down from a target they never set and
 * reports failure for hitting it exactly. The week is the unit they chose.
 */
const showWeekPace = computed(() => habit.kind === 'build' && week.value.isPaced)

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
    class="rounded-card flex cursor-pointer items-center gap-2.5 border p-3"
    :class="meta.card"
    @click="emit('open', habit.id)"
  >
    <div class="min-w-0 flex-1">
      <!-- The whole row stays tappable as a convenience, but the name is the
           real control: a bare <li> with a click handler is unreachable by
           keyboard and announces nothing to a screen reader. -->
      <button
        type="button"
        class="text-ink block max-w-full rounded text-left text-sm leading-tight font-medium"
        @click.stop="emit('open', habit.id)"
      >
        <!-- Two lines rather than an ellipsis: a habit called "Japonca içerik
             tüket" is unreadable cut to eight characters, and the row growing
             by one line costs less than the name being useless. -->
        <span class="line-clamp-2">{{ habit.name }}</span>
      </button>
      <div v-if="showWeekPace" class="mt-1 flex items-center gap-1.5">
        <span class="flex gap-0.5" aria-hidden="true">
          <span
            v-for="slot in week.target"
            :key="slot"
            class="h-1 w-2 rounded-full transition-colors"
            :class="slot <= week.done ? meta.fill : 'bg-hair'"
          />
        </span>
        <span class="text-ink-soft truncate text-[11px]">
          {{ week.met ? $t('stats.weekDone') : $t('stats.weekLeft', { count: week.remaining }) }}
        </span>
      </div>

      <p v-else-if="!meta.isBinary" class="text-ink-soft mt-0.5 text-xs">{{ summary }}</p>
      <StreakBadge v-else class="mt-0.5" :streak="streak" :longest="longest" :kind="habit.kind" />
    </div>

    <!-- Labelled columns rather than bare squares. Five identical squares gave
         no way to tell which day you were about to mark, which matters most on
         the one people reach for by mistake: yesterday. -->
    <div class="flex shrink-0 items-end gap-1">
      <div v-for="day in previousDays" :key="day" class="flex w-7 flex-col items-center gap-1">
        <span class="text-ink-soft/70 text-[9px] leading-none whitespace-nowrap">
          {{ shortDayLabel(day, today) }}
        </span>

        <button
          type="button"
          class="flex h-10 w-full items-center justify-center transition-transform duration-100 select-none active:scale-90"
          :aria-pressed="markedDays.has(day)"
          :aria-label="`${habit.name}, ${dayLabel(day)}`"
          @click.stop="onDayTap(day)"
        >
          <span
            class="rounded-cell size-6"
            :class="
              dayCellClass({
                kind: habit.kind,
                isMarked: markedDays.has(day),
                value: values?.get(day),
              })
            "
          />
        </button>
      </div>
    </div>

    <div class="flex shrink-0 flex-col items-center gap-1">
      <span class="text-[9px] leading-none font-semibold whitespace-nowrap" :class="meta.text">
        {{ $t('day.today') }}
      </span>

      <button
        type="button"
        class="flex size-11 items-center justify-center rounded-xl transition-transform duration-100 select-none active:scale-95"
        :class="markedDays.has(today) ? [meta.fill, 'text-white'] : [meta.empty, 'text-ink-soft']"
        :aria-pressed="markedDays.has(today)"
        :aria-label="`${habit.name}, ${$t('day.today')}`"
        @click.stop="onTodayTap"
      >
        <Check v-if="meta.isBinary" class="size-5" />
        <span v-else class="text-sm font-semibold">{{ todayValue ?? '–' }}</span>
      </button>
    </div>
  </li>
</template>
