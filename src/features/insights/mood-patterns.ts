import type { HabitKind } from '@/shared/lib/kind'

/** The habit fields the maths needs. */
export type PatternHabit = {
  id: string
  kind: HabitKind
  /** Creation day as a date key: days before a habit existed say nothing about it. */
  since: string
}

export type PatternEntry = {
  habit_id: string
  entry_date: string
  value: number
}

/** How a rating habit moves on the days another habit was marked. */
export type MoodPattern = {
  /** The rating habit whose average moves. */
  ratingHabitId: string
  /** The build or quit habit it moves with. */
  habitId: string
  habitKind: Exclude<HabitKind, 'scale'>
  /** Average rating on days the habit was marked. For quit habits, a slip. */
  markedAverage: number
  unmarkedAverage: number
  markedDays: number
  unmarkedDays: number
  /** `markedAverage - unmarkedAverage`. */
  difference: number
}

export type PatternOptions = {
  /** First day considered, inclusive. */
  from: string
  /** Last day considered, inclusive. */
  to: string
  /** Rated days needed on each side before an average is worth showing. */
  minDays?: number
  /** Smallest difference worth showing, on the 1-5 scale. */
  minDifference?: number
}

const average = (values: readonly number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length

/**
 * Every rating habit set against every build and quit habit.
 *
 * Only days that carry a rating are compared, and only days after both habits
 * existed, so an empty history is never read as "not done". Both sides need
 * `minDays` before a pair is reported: an average over two days is noise
 * however large the gap.
 *
 * @returns Patterns worth showing, strongest first.
 *
 * @example
 * ```ts
 * findMoodPatterns(habits, entries, { from: '2026-01-01', to: '2026-09-17' })
 * // [{ habitId: 'run', markedAverage: 4.1, unmarkedAverage: 3.2, difference: 0.9, … }]
 * ```
 */
export function findMoodPatterns(
  habits: readonly PatternHabit[],
  entries: readonly PatternEntry[],
  { from, to, minDays = 5, minDifference = 0.3 }: PatternOptions,
): MoodPattern[] {
  const markedByHabit = new Map<string, Set<string>>()
  const ratingsByHabit = new Map<string, Map<string, number>>()
  const kindById = new Map(habits.map((habit) => [habit.id, habit.kind]))

  for (const entry of entries) {
    if (entry.entry_date < from || entry.entry_date > to) continue

    if (kindById.get(entry.habit_id) === 'scale') {
      const ratings = ratingsByHabit.get(entry.habit_id) ?? new Map<string, number>()
      ratings.set(entry.entry_date, entry.value)
      ratingsByHabit.set(entry.habit_id, ratings)
    } else {
      const marked = markedByHabit.get(entry.habit_id) ?? new Set<string>()
      marked.add(entry.entry_date)
      markedByHabit.set(entry.habit_id, marked)
    }
  }

  const patterns: MoodPattern[] = []

  for (const rating of habits) {
    if (rating.kind !== 'scale') continue

    const ratings = ratingsByHabit.get(rating.id)
    if (!ratings) continue

    for (const habit of habits) {
      if (habit.kind === 'scale') continue

      const since = habit.since > rating.since ? habit.since : rating.since
      const marked = markedByHabit.get(habit.id) ?? new Set<string>()
      const onMarked: number[] = []
      const onUnmarked: number[] = []

      for (const [day, value] of ratings) {
        if (day < since) continue
        ;(marked.has(day) ? onMarked : onUnmarked).push(value)
      }

      if (onMarked.length < minDays || onUnmarked.length < minDays) continue

      const markedAverage = average(onMarked)
      const unmarkedAverage = average(onUnmarked)
      const difference = markedAverage - unmarkedAverage

      if (Math.abs(difference) < minDifference) continue

      patterns.push({
        ratingHabitId: rating.id,
        habitId: habit.id,
        habitKind: habit.kind,
        markedAverage,
        unmarkedAverage,
        markedDays: onMarked.length,
        unmarkedDays: onUnmarked.length,
        difference,
      })
    }
  }

  return patterns.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
}
