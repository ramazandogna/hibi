<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

import type { Habit } from '@/features/habits/habit.types'
import { ToneDot, formatDate, fromDateKey } from 'rei-kit'
import { KIND_META } from '@/shared/lib/kind'

const { dateKey, habits, markedByHabit, valuesByHabit } = defineProps<{
  dateKey: string
  habits: readonly Habit[]
  markedByHabit: ReadonlyMap<string, ReadonlySet<string>>
  valuesByHabit: ReadonlyMap<string, ReadonlyMap<string, number>>
}>()

const emit = defineEmits<{ toggle: [habitId: string]; scale: [habitId: string] }>()

const title = computed(() =>
  formatDate(fromDateKey(dateKey), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)

const rows = computed(() =>
  habits.map((habit) => ({
    habit,
    isMarked: markedByHabit.get(habit.id)?.has(dateKey) ?? false,
    value: valuesByHabit.get(habit.id)?.get(dateKey) ?? null,
  })),
)

const doneCount = computed(() => rows.value.filter((row) => row.isMarked).length)
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-ink text-sm font-medium">{{ title }}</p>

    <ul class="flex flex-col gap-1">
      <li v-for="row in rows" :key="row.habit.id" class="flex items-center gap-3">
        <ToneDot :fill="KIND_META[row.habit.kind].fill" />
        <span class="text-ink flex-1 truncate text-sm">{{ row.habit.name }}</span>

        <button
          type="button"
          class="flex size-11 items-center justify-center rounded-xl transition-transform duration-100 active:scale-95"
          :class="
            row.isMarked
              ? [KIND_META[row.habit.kind].fill, 'text-white']
              : [KIND_META[row.habit.kind].empty, 'text-ink-soft']
          "
          :aria-pressed="row.isMarked"
          :aria-label="`${row.habit.name}, ${title}`"
          @click="
            KIND_META[row.habit.kind].isBinary
              ? emit('toggle', row.habit.id)
              : emit('scale', row.habit.id)
          "
        >
          <Check v-if="KIND_META[row.habit.kind].isBinary" class="size-4" />
          <span v-else class="text-sm font-semibold">{{ row.value ?? '–' }}</span>
        </button>
      </li>
    </ul>

    <p class="text-ink-soft text-xs">
      {{ $t('entry.completed', { done: doneCount, total: rows.length }) }}
    </p>

    <!-- Filled by the parent: features/entries must not import features/notes. -->
    <slot name="note" />
  </div>
</template>
