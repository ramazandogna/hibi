// Sends the daily reminders.
//
// Invoked hourly by pg_cron (see 0006_reminder_cron.sql). Each run asks: for
// whom is it 08:00 or 21:00 right now, in their own time zone, and who has not
// already been sent that slot today? Hourly rather than twice daily because
// "08:00" is a different instant in every zone.
import webpush from 'npm:web-push@3.6.7'
import { createClient } from 'jsr:@supabase/supabase-js@2'

import { buildMessage } from './messages.ts'
import type { Locale, Slot } from './messages.ts'

const SLOT_HOUR: Record<Slot, number> = { morning: 8, evening: 21 }

interface Subscription {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  locale: string
  time_zone: string
  last_morning_on: string | null
  last_evening_on: string | null
}

/** The wall clock in someone else's time zone, as {hour, dateKey}. */
function localNow(timeZone: string): { hour: number; dateKey: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
  }).formatToParts(new Date())

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'

  return {
    // 'en-CA' formats hours as 00-23, but midnight can come back as '24'.
    hour: Number(get('hour')) % 24,
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
  }
}

function dayOfYear(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = Date.UTC(year!, month! - 1, day!)

  return Math.floor((date - Date.UTC(year!, 0, 0)) / 86_400_000)
}

Deno.serve(async (request) => {
  // Called by the database, not the browser. A shared secret keeps the endpoint
  // from being a free push-sender for anyone who finds the URL.
  const expected = Deno.env.get('REMINDER_SECRET')
  if (!expected || request.headers.get('x-reminder-secret') !== expected) {
    return new Response('Forbidden', { status: 403 })
  }

  const publicKey = Deno.env.get('VAPID_PUBLIC_KEY')
  const privateKey = Deno.env.get('VAPID_PRIVATE_KEY')
  const subject = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:hello@example.com'

  if (!publicKey || !privateKey) {
    return new Response('VAPID keys are not configured', { status: 500 })
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)

  // Service role: the sender has no session and must read across all users.
  // This key never leaves the function.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id,user_id,endpoint,p256dh,auth,locale,time_zone,last_morning_on,last_evening_on')

  if (error) return new Response(error.message, { status: 500 })

  let sent = 0
  let dropped = 0

  for (const sub of (subscriptions ?? []) as Subscription[]) {
    const { hour, dateKey } = localNow(sub.time_zone)

    const slot: Slot | null =
      hour === SLOT_HOUR.morning ? 'morning' : hour === SLOT_HOUR.evening ? 'evening' : null

    if (!slot) continue

    const alreadySent = slot === 'morning' ? sub.last_morning_on : sub.last_evening_on
    if (alreadySent === dateKey) continue

    // What is still open for this person today. Two small reads rather than a
    // view, because the counts are the whole payload.
    const [{ data: habits }, { data: entries }] = await Promise.all([
      supabase.from('habits').select('id,kind').eq('user_id', sub.user_id).is('archived_at', null),
      supabase
        .from('entries')
        .select('habit_id')
        .eq('user_id', sub.user_id)
        .eq('entry_date', dateKey),
    ])

    const marked = new Set((entries ?? []).map((entry) => entry.habit_id))
    const pending = (habits ?? []).filter((habit) => !marked.has(habit.id))

    const message = buildMessage(
      (['en', 'tr', 'ja', 'zh'].includes(sub.locale) ? sub.locale : 'en') as Locale,
      slot,
      dayOfYear(dateKey),
      {
        build: pending.filter((habit) => habit.kind === 'build').length,
        quit: pending.filter((habit) => habit.kind === 'quit').length,
        open: pending.length,
        done: (habits ?? []).length - pending.length,
      },
    )

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ ...message, tag: `hibi-${slot}`, url: '/' }),
      )
      sent += 1

      await supabase
        .from('push_subscriptions')
        .update(slot === 'morning' ? { last_morning_on: dateKey } : { last_evening_on: dateKey })
        .eq('id', sub.id)
    } catch (pushError) {
      // 404/410 mean the browser threw the subscription away — uninstalled, or
      // site data cleared. Keeping the row would retry it forever.
      const status = (pushError as { statusCode?: number }).statusCode

      if (status === 404 || status === 410) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id)
        dropped += 1
      }
    }
  }

  return Response.json({ sent, dropped, checked: subscriptions?.length ?? 0 })
})
