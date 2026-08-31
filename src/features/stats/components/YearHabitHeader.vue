<script setup lang="ts">
import type { Habit } from '@/features/habits/habit.types'
import { KIND_META } from '@/shared/lib/kind'
import StreakBadge from '@/features/stats/components/StreakBadge.vue'
import { useHabitStats } from '@/features/stats/use-habit-stats'
import { ToneDot, toDateKey } from 'rei-kit'

const { habit, markedDays, values } = defineProps<{
  habit: Habit
  markedDays: ReadonlySet<string>
  values: ReadonlyMap<string, number> | undefined
}>()

const { summary, streak, longest } = useHabitStats(
  () => ({ kind: habit.kind, createdAt: toDateKey(new Date(habit.created_at)) }),
  () => markedDays,
  () => values ?? new Map(),
)
</script>

<template>
  <div class="flex items-center gap-2">
    <ToneDot :fill="KIND_META[habit.kind].fill" />
    <span class="text-ink min-w-0 flex-1 truncate text-sm font-medium">{{ habit.name }}</span>

    <span v-if="habit.kind === 'scale'" class="text-ink-soft shrink-0 text-xs">{{ summary }}</span>
    <StreakBadge v-else :streak="streak" :longest="longest" :kind="habit.kind" />
  </div>
</template>
