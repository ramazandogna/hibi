/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

/**
 * Hibi's service worker.
 *
 * Written by hand rather than generated because it has to handle `push`, and a
 * generated worker has no place to put that. Everything above the push handler
 * is what `generateSW` produced before.
 */
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Every route is client-side, so a cold navigation to /week must be answered
// with the shell — the same rule vercel.json applies on the server.
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

// The update prompt asks the waiting worker to take over. Without this the
// prompt's Reload button would reload into the same old worker.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') void self.skipWaiting()
})

/** What the sender puts in the push body. */
interface PushPayload {
  title: string
  body: string
  tag?: string
  url?: string
}

self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload: PushPayload

  try {
    payload = event.data.json() as PushPayload
  } catch {
    // A push with an unreadable body still has to show something: browsers
    // punish a worker that receives a push and displays nothing by revoking
    // the subscription.
    payload = { title: 'Hibi', body: event.data.text() }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/pwa-192.png',
      badge: '/pwa-192.png',
      tag: payload.tag ?? 'hibi',
      data: { url: payload.url ?? '/' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const target = (event.notification.data as { url?: string } | undefined)?.url ?? '/'

  // Focus an open tab rather than opening a second one — someone tapping a
  // reminder wants the app they already have, at the screen it names.
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          await client.focus()
          if ('navigate' in client) await client.navigate(target)
          return
        }
      }

      await self.clients.openWindow(target)
    }),
  )
})
