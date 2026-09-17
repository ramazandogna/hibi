/**
 * Product events, and nothing personal in them.
 *
 * Only the event name and a few flat, non-identifying properties are sent —
 * never a habit name, never a note. Those are the most private things a person
 * writes down, and knowing how often notes get written does not need them.
 *
 * Sending is fire and forget. A failed write must never reach the interface,
 * and a missing table (the migration not run yet) switches tracking off for the
 * session instead of failing on every tap.
 */

export type EventName =
  | 'view_opened'
  | 'habit_created'
  | 'entry_marked'
  | 'note_written'
  | 'push_subscribed'
  | 'plus_opened'

export type EventProps = Record<string, string | number | boolean>

/** PostgREST and Postgres codes for "that relation does not exist". */
const MISSING_TABLE = new Set(['PGRST205', '42P01'])

let disabled = false

/**
 * Records a product event for the signed-in user.
 *
 * @param name What happened.
 * @param props Flat, non-personal detail, e.g. `{ kind: 'build' }`.
 *
 * @example
 * ```ts
 * track('habit_created', { kind: habit.kind })
 * ```
 */
export function track(name: EventName, props: EventProps = {}): void {
  if (disabled || import.meta.env.DEV) return

  void send(name, props)
}

async function send(name: EventName, props: EventProps) {
  try {
    // Loaded on first use: keeps the client, and the environment check it runs
    // on import, off the path of every module that only wants to call track().
    const { supabase } = await import('@/shared/lib/supabase')

    const { data } = await supabase.auth.getSession()
    if (!data.session) return

    const { error } = await supabase.from('events').insert({ name, props })

    if (error && MISSING_TABLE.has(error.code)) disabled = true
  } catch {
    // Offline, blocked, or the client failed to load. Losing an event is fine.
  }
}

/** Test seam: undoes the session-wide switch-off. */
export function resetTracking() {
  disabled = false
}
