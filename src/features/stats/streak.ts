import { addDays } from '@/shared/lib/date'

/**
 * Streak and completion maths.
 *
 * Every function is pure and takes "today" as an argument — nothing here reads
 * the system clock, so the whole file can be tested with plain inputs.
 */

/**
 * Consecutive marked days ending today, with a one-day grace period.
 *
 * An unmarked today does not break the chain: the day is not over yet. An
 * unmarked yesterday does.
 *
 * @param marked - Days the habit was marked, as `YYYY-MM-DD` keys.
 * @param today - Today's key.
 *
 * @example
 * ```ts
 * currentStreak(new Set(['2026-08-23']), '2026-08-24')  // 1 — grace period
 * currentStreak(new Set(['2026-08-22']), '2026-08-24')  // 0 — chain broken
 * ```
 */
export function currentStreak(marked: ReadonlySet<string>, today: string): number {
  let streak = 0
  let cursor = today

  for (;;) {
    if (marked.has(cursor)) {
      streak += 1
    } else if (cursor !== today) {
      break
    }

    cursor = addDays(cursor, -1)
  }

  return streak
}

/**
 * The longest run of consecutive marked days ever recorded.
 *
 * @param marked - Days the habit was marked.
 */
export function longestStreak(marked: ReadonlySet<string>): number {
  const days = [...marked].sort()

  let longest = 0
  let run = 0
  let previous: string | null = null

  for (const day of days) {
    run = previous !== null && addDays(previous, 1) === day ? run + 1 : 1
    longest = Math.max(longest, run)
    previous = day
  }

  return longest
}

/**
 * Days since the habit was last slipped, for `quit` habits.
 *
 * For quit habits a marked day means "I slipped", so the streak counts the
 * unmarked days instead.
 *
 * @param marked - Days the user slipped.
 * @param today - Today's key.
 * @param since - The habit's creation day; the count stops there.
 */
export function cleanDays(marked: ReadonlySet<string>, today: string, since: string): number {
  let clean = 0
  let cursor = today

  while (cursor >= since) {
    if (marked.has(cursor)) break

    clean += 1
    cursor = addDays(cursor, -1)
  }

  return clean
}

/**
 * Share of days in a range that were marked, from 0 to 1.
 *
 * @param marked - Days the habit was marked.
 * @param from - First day, inclusive.
 * @param to - Last day, inclusive.
 */
export function completionRate(marked: ReadonlySet<string>, from: string, to: string): number {
  let total = 0
  let done = 0
  let cursor = from

  while (cursor <= to) {
    total += 1
    if (marked.has(cursor)) done += 1
    cursor = addDays(cursor, 1)
  }

  return total === 0 ? 0 : done / total
}

/**
 * Mean value over the last `days` days ending at `to`, for `scale` habits.
 *
 * @returns The mean, or `null` when there is no data in the window — "no data"
 *   and "average of zero" are different answers and must not collapse.
 */
export function rollingAverage(
  values: ReadonlyMap<string, number>,
  to: string,
  days: number,
): number | null {
  let sum = 0
  let count = 0
  let cursor = to

  for (let index = 0; index < days; index += 1) {
    const value = values.get(cursor)

    if (value !== undefined) {
      sum += value
      count += 1
    }

    cursor = addDays(cursor, -1)
  }

  return count === 0 ? null : sum / count
}
