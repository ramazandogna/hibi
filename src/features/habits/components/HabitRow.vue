<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

import type { Habit } from '../habit.types'
import { KIND_META } from '@/shared/lib/kind'
import { fromDateKey } from '@/shared/lib/date'
import { tapFeedback } from '@/shared/lib/haptics'

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

/** Days before today; today gets its own larger button. */
const previousDays = computed(() => days.filter((day) => day !== today))

const dayFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

function dayLabel(dateKey: string) {
  return dayFormatter.format(fromDateKey(dateKey))
}

function onDayTap(dateKey: string) {
  tapFeedback()
  emit('toggle', dateKey)
}

/** Binary kinds toggle; scale kinds open the 1-5 picker instead. */
function onTodayTap() {
  tapFeedback()

  if (meta.value.isBinary) {
    emit('toggle', today)
  } else {
    emit('scale', today)
  }
}
</script>

<template>
  <li
    class="border-hair rounded-card flex cursor-pointer items-center gap-3 border p-3"
    @click="emit('open', habit.id)"
  >
    <div class="flex size-10 shrink-0 items-center justify-center rounded-xl" :class="meta.soft">
      <span class="size-3 rounded-full" :class="meta.fill" />
    </div>

    <div class="min-w-0 flex-1">
      <p class="text-ink truncate text-sm font-medium">{{ habit.name }}</p>
      <p class="text-ink-soft text-xs">{{ markedDays.size }} of {{ days.length }} days</p>
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <button
        v-for="day in previousDays"
        :key="day"
        type="button"
        class="rounded-cell size-6 transition-transform duration-100 select-none active:scale-90"
        :class="markedDays.has(day) ? meta.fill : 'bg-mist'"
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
