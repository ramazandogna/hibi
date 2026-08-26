<script setup lang="ts">
import { computed } from 'vue'
import { Flame } from 'lucide-vue-next'

import type { HabitKind } from '@/shared/lib/kind'
import { t } from '@/shared/i18n'

const {
  streak,
  kind,
  longest = 0,
} = defineProps<{
  streak: number
  kind: HabitKind
  longest?: number
}>()

/**
 * Four tiers, so the badge earns attention instead of always shouting.
 *
 * The flame only appears once a chain exists, and only turns hot past a month —
 * a permanent flame stops meaning anything.
 */
const tier = computed(() => {
  if (streak >= 30) return 'hot'
  if (streak >= 7) return 'warm'
  if (streak >= 1) return 'lit'

  return 'cold'
})

const TIER_CLASS = {
  cold: 'text-ink-soft',
  lit: 'text-ink-soft',
  warm: 'text-amber',
  hot: 'text-ember',
} as const

/** A nudge, not a scold: what is at stake, or how close the record is. */
const hint = computed(() => {
  if (streak === 0) return t('streak.startToday')
  if (longest > streak && longest - streak <= 3)
    return t('streak.toYourBest', { count: longest - streak })
  if (streak >= 30) return t('streak.dontBreak')

  return t(`kind.${kind}.streak`)
})
</script>

<template>
  <span class="flex items-center gap-1" :class="TIER_CLASS[tier]">
    <Flame
      v-if="tier !== 'cold'"
      class="size-3.5 shrink-0"
      :class="tier === 'hot' ? 'fill-current' : ''"
      aria-hidden="true"
    />
    <span v-if="streak > 0" class="text-xs font-semibold tabular-nums">{{ streak }}</span>
    <span class="text-ink-soft truncate text-xs">{{ hint }}</span>
  </span>
</template>
