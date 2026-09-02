import type { ReminderSlot } from './reminder-copy'

/**
 * When each reminder may fire, as [open, close) in local minutes past midnight.
 *
 * A window rather than an instant, because the scheduler only runs while the app
 * is open: someone who opens Hibi at 09:30 should still get the morning nudge.
 *
 * The evening window closes at 23:00, not midnight. A reminder that asks how the
 * day went has to arrive while the day is still the one being asked about; past
 * midnight it is both wrong and, at that hour, unwelcome.
 *
 * The sender keeps its own copy of these bounds, in
 * `supabase/functions/send-reminders/index.ts`. It runs on Deno against a
 * different database and cannot import from here.
 */
export const WINDOWS: Record<ReminderSlot, { from: number; to: number }> = {
  morning: { from: 8 * 60 + 30, to: 12 * 60 },
  evening: { from: 21 * 60, to: 23 * 60 },
}

/**
 * Which reminder, if any, belongs to this moment.
 *
 * Deliberately its own module, with nothing but a type import: reaching it
 * through the composable would drag in the whole data layer, and the Supabase
 * client throws on load when the environment is not configured — which is every
 * CI run.
 *
 * @param now The local time to place.
 * @returns The slot whose window contains `now`, or null between them.
 *
 * @example
 * ```ts
 * slotForNow(new Date(2026, 0, 1, 8, 30)) // 'morning'
 * slotForNow(new Date(2026, 0, 1, 23, 0)) // null
 * ```
 */
export function slotForNow(now: Date): ReminderSlot | null {
  const minutes = now.getHours() * 60 + now.getMinutes()

  for (const slot of ['morning', 'evening'] as const) {
    const { from, to } = WINDOWS[slot]
    if (minutes >= from && minutes < to) return slot
  }

  return null
}
