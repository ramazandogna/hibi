import { onScopeDispose, watch } from 'vue'

import { showNotification, useNotifications } from './notifications'
import { eveningMessage, morningMessage } from './reminder-copy'
import type { ReminderSlot } from './reminder-copy'
import { listEntriesInRange } from '@/features/entries/entries.api'
import { useHabits } from '@/features/habits/habits.queries'
import { toDateKey } from 'rei-kit'

/**
 * When each reminder may fire, as [open, close) in local minutes past midnight.
 *
 * A window rather than an instant, because this scheduler only runs while the
 * app is open: someone who opens Hibi at 09:30 should still get the morning
 * nudge.
 *
 * The evening window closes at 23:00, not midnight. A reminder that asks how
 * the day went has to arrive while the day is still the one being asked about;
 * past midnight it is both wrong and, at that hour, unwelcome.
 */
const WINDOWS: Record<ReminderSlot, { from: number; to: number }> = {
  morning: { from: 8 * 60 + 30, to: 12 * 60 },
  evening: { from: 21 * 60, to: 23 * 60 },
}

/**
 * Which reminder, if any, belongs to this moment.
 *
 * Exported for its tests: the boundaries are the whole point of the windows,
 * and they are not reachable from outside without waiting for the clock.
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

const FIRED_KEY = 'hibi-reminder-fired'

/** How often to re-check while the tab is open. */
const TICK_MS = 60_000

type FiredLog = Partial<Record<ReminderSlot, string>>

function readFired(): FiredLog {
  try {
    return JSON.parse(localStorage.getItem(FIRED_KEY) ?? '{}') as FiredLog
  } catch {
    return {}
  }
}

function markFired(slot: ReminderSlot, dateKey: string) {
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify({ ...readFired(), [slot]: dateKey }))
  } catch {
    // Storage blocked; the reminder may repeat once this session.
  }
}

/** Undoes a claim, so a slot that failed can be retried on the next tick. */
function releaseSlot(slot: ReminderSlot) {
  markFired(slot, '')
}

/**
 * The daily reminders.
 *
 * **This is a client-side scheduler, and that is a real limitation:** it can
 * only fire while a tab is open, or when the app is opened inside a window that
 * has not been used yet. Delivering a notification to a closed browser needs
 * Web Push, which needs a server holding a VAPID key — a Supabase Edge Function
 * on a cron would be the next step. Everything above this line is written so
 * that change would only replace where `showNotification` is called from.
 *
 * @example
 * ```ts
 * useReminders()   // once, in the app layout
 * ```
 */
export function useReminders() {
  const { isActive } = useNotifications()
  const { data: habits } = useHabits()

  let timer: ReturnType<typeof setInterval> | undefined

  async function check() {
    if (!isActive.value || document.visibilityState !== 'visible') return

    // One reading of the clock for both the slot and the day it belongs to.
    // Taking the date from a separately-maintained ref would let the two
    // disagree across midnight, which is how a slot gets claimed under the wrong
    // date and fires twice.
    const now = new Date()
    const dateKey = toDateKey(now)
    const slot = slotForNow(now)
    if (!slot || readFired()[slot] === dateKey) return

    const active = habits.value
    if (!active) return

    // Claim the slot before awaiting: two ticks can overlap on a slow request,
    // and a duplicate notification is worse than a missed one.
    markFired(slot, dateKey)

    let markedToday: Set<string>
    try {
      const entries = await listEntriesInRange(dateKey, dateKey)
      markedToday = new Set(entries.map((entry) => entry.habit_id))
    } catch {
      // Offline. A wrong count is worse than silence, so give the slot back and
      // let the next tick try again.
      releaseSlot(slot)
      return
    }

    const pending = active.filter((habit) => !markedToday.has(habit.id))

    const message =
      slot === 'morning'
        ? morningMessage(dateKey, {
            build: pending.filter((habit) => habit.kind === 'build').length,
            quit: pending.filter((habit) => habit.kind === 'quit').length,
          })
        : eveningMessage(dateKey, {
            open: pending.length,
            done: active.length - pending.length,
          })

    await showNotification(message.title, message.body, `hibi-${slot}`)
  }

  function start() {
    stop()
    void check()
    timer = setInterval(() => void check(), TICK_MS)
  }

  function stop() {
    clearInterval(timer)
    timer = undefined
  }

  function onVisibility() {
    if (document.visibilityState === 'visible') void check()
  }

  document.addEventListener('visibilitychange', onVisibility)

  // Only run the timer once reminders are actually on; there is no point waking
  // up every minute for a user who never granted permission.
  watch(isActive, (active) => (active ? start() : stop()), { immediate: true })

  onScopeDispose(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibility)
  })
}
