<script setup lang="ts">
import { computed } from 'vue'
import { Lock, Sparkles } from 'lucide-vue-next'
import { BaseButton, BaseCard, toDateKey } from 'rei-kit'

import type { Entry } from '@/features/entries/entry.types'
import type { Habit } from '@/features/habits/habit.types'
import { usePlusSheet } from '@/features/premium/plus-sheet'
import { usePlus } from '@/features/premium/premium.queries'
import { intlLocale, t } from '@/shared/i18n'
import { findMoodPatterns } from '../mood-patterns'

const { habits, entries, from, to } = defineProps<{
  habits: readonly Habit[]
  entries: readonly Entry[]
  from: string
  to: string
}>()

const { hasPlus } = usePlus()
const { openPlus } = usePlusSheet()

const hasRating = computed(() => habits.some((habit) => habit.kind === 'scale'))
const hasBinary = computed(() => habits.some((habit) => habit.kind !== 'scale'))

const patterns = computed(() =>
  findMoodPatterns(
    habits.map((habit) => ({
      id: habit.id,
      kind: habit.kind,
      since: toDateKey(new Date(habit.created_at)),
    })),
    entries,
    { from, to },
  ),
)

/**
 * The strongest pattern is free.
 *
 * Seeing one real sentence about your own life is what makes the rest worth
 * wanting; a blurred placeholder would ask people to pay for a promise.
 */
const shown = computed(() => (hasPlus.value ? patterns.value : patterns.value.slice(0, 1)))
const lockedCount = computed(() => patterns.value.length - shown.value.length)

const nameById = computed(() => new Map(habits.map((habit) => [habit.id, habit.name])))

const oneDecimal = computed(
  () =>
    new Intl.NumberFormat(intlLocale.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
)

const lines = computed(() =>
  shown.value.map((pattern) => {
    const values = {
      habit: nameById.value.get(pattern.habitId) ?? '',
      rating: nameById.value.get(pattern.ratingHabitId) ?? '',
      marked: oneDecimal.value.format(pattern.markedAverage),
      unmarked: oneDecimal.value.format(pattern.unmarkedAverage),
      days: pattern.markedDays + pattern.unmarkedDays,
    }
    const isBuild = pattern.habitKind === 'build'

    return {
      key: `${pattern.ratingHabitId}:${pattern.habitId}`,
      headline: isBuild ? t('insights.buildMarked', values) : t('insights.quitMarked', values),
      contrast: isBuild ? t('insights.buildUnmarked', values) : t('insights.quitUnmarked', values),
      basis: t('insights.basis', values),
    }
  }),
)
</script>

<template>
  <BaseCard
    v-if="hasBinary"
    as="section"
    padding="md"
    class="flex flex-col gap-3"
    aria-labelledby="mood-patterns-title"
  >
    <h2 id="mood-patterns-title" class="text-ink flex items-center gap-2 text-sm font-semibold">
      <Sparkles class="text-amber size-4" aria-hidden="true" />
      {{ $t('insights.title') }}
    </h2>

    <p v-if="!hasRating" class="text-ink-soft text-sm">{{ $t('insights.needsRating') }}</p>

    <p v-else-if="patterns.length === 0" class="text-ink-soft text-sm">
      {{ $t('insights.needsTime') }}
    </p>

    <template v-else>
      <ul class="flex flex-col gap-3">
        <li v-for="line in lines" :key="line.key" class="flex flex-col gap-0.5">
          <p class="text-ink text-sm">{{ line.headline }}</p>
          <p class="text-ink-soft text-xs">{{ line.contrast }} {{ line.basis }}</p>
        </li>
      </ul>

      <BaseButton
        v-if="lockedCount > 0"
        variant="ghost"
        size="sm"
        class="self-start"
        @click="openPlus('insights')"
      >
        <Lock class="size-4" aria-hidden="true" />
        {{ $t('insights.locked', { count: lockedCount }) }}
      </BaseButton>

      <p class="text-ink-soft text-xs">{{ $t('insights.caveat') }}</p>
    </template>
  </BaseCard>
</template>
