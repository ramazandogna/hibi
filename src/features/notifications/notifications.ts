import { computed, readonly, ref } from 'vue'

/** Whether this browser can show notifications at all. */
export const notificationsSupported =
  typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator

const ENABLED_KEY = 'hibi-reminders'

function readPermission(): NotificationPermission {
  return notificationsSupported ? Notification.permission : 'denied'
}

// Module-level singletons: Settings, the nudge and the scheduler all have to be
// looking at the same state, and there is no browser event for a permission
// change — so it is re-read whenever the tab comes back into view.
const permission = ref<NotificationPermission>(readPermission())

const enabled = ref<boolean>(
  (() => {
    try {
      return localStorage.getItem(ENABLED_KEY) !== 'false'
    } catch {
      return true
    }
  })(),
)

if (notificationsSupported) {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') permission.value = readPermission()
  })
}

/**
 * Asks the browser for permission.
 *
 * Must be called from a user gesture — browsers ignore, and Chrome permanently
 * blocks, a request that arrives on page load.
 *
 * @returns The resulting permission, already reflected in the shared state.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported) return 'denied'

  const result = await Notification.requestPermission()
  permission.value = result

  return result
}

/**
 * Shows a notification through the service worker.
 *
 * `new Notification()` throws on Android Chrome — there it must go through the
 * registration — so the service worker is the primary path and the constructor
 * only a desktop fallback.
 */
export async function showNotification(title: string, body: string, tag: string): Promise<void> {
  if (!notificationsSupported || permission.value !== 'granted') return

  const options: NotificationOptions = {
    body,
    icon: '/pwa-192.png',
    badge: '/pwa-192.png',
    // Same tag replaces rather than stacks: two mornings in a row should not
    // leave two identical cards in the tray.
    tag,
    lang: document.documentElement.lang,
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()

    if (registration) {
      await registration.showNotification(title, options)
      return
    }

    new Notification(title, options)
  } catch {
    // Blocked, or the tab lost its registration. Nothing to recover.
  }
}

/**
 * Permission plus the user's own on/off switch.
 *
 * The two are separate on purpose: someone can grant the browser permission and
 * still want reminders off for a week, and revoking a browser permission is a
 * chore we should not make them do to get that.
 */
export function useNotifications() {
  const isEnabled = computed<boolean>({
    get: () => enabled.value,
    set: (next) => {
      enabled.value = next

      try {
        localStorage.setItem(ENABLED_KEY, String(next))
      } catch {
        // Storage blocked; the choice lasts for this session only.
      }
    },
  })

  return {
    supported: notificationsSupported,
    permission: readonly(permission),
    isEnabled,
    /** Reminders only fire when both are true. */
    isActive: computed(() => permission.value === 'granted' && enabled.value),
    request: requestNotificationPermission,
  }
}
