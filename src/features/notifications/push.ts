import { activeLocale } from '@/shared/i18n'
import { toAppError } from 'rei-kit'
import { supabase } from '@/shared/lib/supabase'

/**
 * The VAPID public key.
 *
 * Public by design: it is the half push services check a signature against, and
 * it ships in the bundle like the Supabase anon key. The private half only ever
 * exists as an Edge Function secret.
 */
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''

export const pushConfigured = VAPID_PUBLIC_KEY.length > 0

/**
 * `applicationServerKey` wants raw bytes, and VAPID keys travel as base64url.
 *
 * `atob` needs standard base64, so the URL-safe characters are swapped back and
 * the padding the encoding dropped is restored.
 */
function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=')
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))

  // Backed by an explicit ArrayBuffer: `applicationServerKey` takes a
  // BufferSource, and the default Uint8Array type also admits SharedArrayBuffer.
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function encodeKey(subscription: PushSubscription, name: 'p256dh' | 'auth'): string {
  const key = subscription.getKey(name)
  if (!key) throw new Error(`Push subscription is missing its ${name} key`)

  return btoa(String.fromCharCode(...new Uint8Array(key)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Subscribes this browser and records it against the account.
 *
 * The locale and time zone travel with the subscription because the sender has
 * no session: it has to know what language to write in and what "08:00" means
 * for this person before it can send anything.
 *
 * @returns Whether a subscription is now stored.
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!pushConfigured || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready

    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        // Required by every browser: a push must result in something the user
        // sees. Silent pushes are how the permission gets revoked.
        userVisibleOnly: true,
        applicationServerKey: base64UrlToBytes(VAPID_PUBLIC_KEY),
      }))

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        endpoint: subscription.endpoint,
        p256dh: encodeKey(subscription, 'p256dh'),
        auth: encodeKey(subscription, 'auth'),
        locale: activeLocale.value,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      // The same browser re-subscribing must update its row, not add a second.
      { onConflict: 'endpoint' },
    )

    if (error) throw toAppError(error)

    return true
  } catch {
    // A failed subscription is not worth an error screen: local reminders still
    // work, and Settings already shows the permission state.
    return false
  }
}

/**
 * Whether this browser already holds a push subscription.
 *
 * The source of truth is the browser, not anything we stored: a subscription
 * survives reloads, and the service worker can also drop one on its own.
 */
export async function hasPushSubscription(): Promise<boolean> {
  if (!pushConfigured || !('serviceWorker' in navigator)) return false

  try {
    const registration = await navigator.serviceWorker.ready

    return (await registration.pushManager.getSubscription()) !== null
  } catch {
    return false
  }
}

/**
 * Unsubscribes this browser and forgets the row.
 *
 * Deleting server-side matters more than the local unsubscribe: a row left
 * behind means the sender keeps pushing to an endpoint nobody is listening to.
 */
export async function unsubscribeFromPush(): Promise<void> {
  if (!('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return

    await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint)
    await subscription.unsubscribe()
  } catch {
    // Already gone, or offline. Nothing to recover.
  }
}
