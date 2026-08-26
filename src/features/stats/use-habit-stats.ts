import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { cleanDays, completionRate, currentStreak, longestStreak, rollingAverage } from './streak'
import { addDays, todayKey } from '@/shared/lib/date'
import type { HabitKind } from '@/shared/lib/kind'
import { t } from '@/shared/i18n'
import { supabase } from '@/shared/lib/supabase'
import { toAppError } from '@/shared/lib/app-error'
import type { Habit } from '../habits/habit.types'

/**
 * The only habit fields the stats need.
 *
 * Deliberately not `Habit`: `features/stats` must not import from
 * `features/habits`, and the name or icon has no bearing on the maths.
 */
export type HabitStatsInput = {
  kind: HabitKind
  /** Creation day as a date key; where a quit habit's clean count starts. */
  createdAt: string
}

/**
 * Derived statistics for one habit.
 *
 * Everything is `computed`, never stored: the same rule as not keeping a
 * `current_streak` column in Postgres, one layer up.
 */
export function useHabitStats(
  habit: MaybeRefOrGetter<HabitStatsInput>,
  markedDays: MaybeRefOrGetter<ReadonlySet<string>>,
  values: MaybeRefOrGetter<ReadonlyMap<string, number>>,
  today: MaybeRefOrGetter<string> = todayKey,
) {
  const streak = computed(() => {
    const { kind, createdAt } = toValue(habit)
    const days = toValue(markedDays)
    const now = toValue(today)

    if (kind === 'build') return currentStreak(days, now)
    if (kind === 'quit') return cleanDays(days, now, createdAt)

    return 0
  })

  const longest = computed(() => longestStreak(toValue(markedDays)))

  const completion30 = computed(() => {
    const now = toValue(today)

    return completionRate(toValue(markedDays), addDays(now, -29), now)
  })

  const average7 = computed(() => rollingAverage(toValue(values), toValue(today), 7))

  const averagePrevious7 = computed(() =>
    rollingAverage(toValue(values), addDays(toValue(today), -7), 7),
  )

  /** One line for the habit row, phrased per kind. */
  const summary = computed(() => {
    const { kind } = toValue(habit)

    if (kind === 'scale') {
      const average = average7.value

      return average === null
        ? t('stats.noData')
        : t('stats.avgSummary', { value: average.toFixed(1) })
    }

    return t('stats.streakSummary', {
      count: streak.value,
      label: t(`kind.${kind}.streak`),
    })
  })

  return { streak, longest, completion30, average7, averagePrevious7, summary }
}

/** A single habit by id, archived or not. */
export async function getHabit(id: string): Promise<Habit> {
  const { data, error } = await supabase.from('habits').select('*').eq('id', id).single()

  if (error) throw toAppError(error)
  return data
}
