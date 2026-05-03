const APP_VERSION = "1.1.2";
const CACHE_NAME = `gastos-naty-v${APP_VERSION}`;

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
];

// ── Install: precache shell assets ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting();
});

// ── Activate: delete caches from previous versions ──────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: Network-first strategy ───────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  // Only handle same-origin GET requests
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache a fresh copy on success
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() =>
        // Network failed → serve from cache
        caches.match(event.request).then(
          (cached) => cached || new Response("Sin conexión", { status: 503 })
        )
      )
  );
});

// ── Message: version query from the page ────────────────────────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "GET_VERSION") {
    event.ports[0]?.postMessage({ version: APP_VERSION });
  }
});
