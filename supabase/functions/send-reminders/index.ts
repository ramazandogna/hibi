// Sends the daily reminders.
//
// Invoked every half hour by pg_cron (see 0007_reminder_windows.sql). Each run
// asks: whose local clock is inside a reminder window right now, and who has not
// already been sent that slot today? Not twice daily, because "08:30" is a
// different instant in every zone.
//
// A window rather than an exact time, because a run can be late -- pg_net
// queues, functions cold-start -- and an exact match would silently skip the day
// rather than send a few minutes on.
import webpush from 'npm:web-push@3.6.7'
import { createClient } from 'jsr:@supabase/supabase-js@2'

import { buildMessage } from './messages.ts'
import type { Locale, Slot } from './messages.ts'

/** When each slot may be sent, as [open, close) in local minutes past midnight. */
const WINDOWS: Record<Slot, { from: number; to: number }> = {
  morning: { from: 8 * 60 + 30, to: 12 * 60 },
  evening: { from: 21 * 60, to: 23 * 60 },
}

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

/** The wall clock in someone else's time zone, as {minutes, dateKey}. */
function localNow(timeZone: string): { minutes: number; dateKey: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date())

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'

  return {
    // 'en-CA' formats hours as 00-23, but midnight can come back as '24'.
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
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
    const { minutes, dateKey } = localNow(sub.time_zone)

    const slot = (['morning', 'evening'] as const).find(
      (candidate) => minutes >= WINDOWS[candidate].from && minutes < WINDOWS[candidate].to,
    )

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
        // Expire the push when its window closes.
        //
        // Push services hold a message for a sleeping or offline phone and hand
        // it over whenever the device next checks in. Without a TTL that can be
        // hours: "how did today go" arriving after midnight, about a day that is
        // already over. Undelivered by then, it is better dropped than shown.
        { TTL: (WINDOWS[slot].to - minutes) * 60 },
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
