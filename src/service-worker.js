import { precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies"
import { CacheFirst } from "workbox-strategies"
import { setCacheNameDetails } from "workbox-core"
import { ExpirationPlugin } from "workbox-expiration"

setCacheNameDetails({
  prefix: "react-todo",
  suffix: "v1",
})

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache images with a CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
)

// Cache API requests with a StaleWhileRevalidate strategy
registerRoute(
  ({ url }) => url.pathname.startsWith("/api"),
  new StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 Day
      }),
    ],
  }),
)

// Default strategy for other requests
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
    ],
  }),
)

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

