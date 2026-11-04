/* FuturePath Service Worker
 * Strategy:
 *   - HTML pages      → network-first (always fresh, falls back to cache offline)
 *   - API calls       → network-only  (never cache live data)
 *   - Static assets   → stale-while-revalidate (fast load, updates in background)
 *   - Images/fonts    → cache-first with 7-day expiry (rarely change)
 *
 * On every new deploy Vercel changes the JS/CSS chunk filenames, so the
 * old cache is automatically bypassed. We still bump CACHE_VERSION any
 * time we want to force-clear the old static cache.
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE  = `futurepath-static-${CACHE_VERSION}`;
const PAGE_CACHE    = `futurepath-pages-${CACHE_VERSION}`;

const STATIC_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp', '.woff', '.woff2'];
const API_PATHS         = ['/api/'];

/* ── Install: cache the offline fallback shell ─────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) =>
      cache.addAll(['/'])
    )
  );
  self.skipWaiting(); // activate immediately on new deploy
});

/* ── Activate: delete old caches from previous versions ─────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== PAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: route by resource type ──────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // API calls — network only, never cache
  if (API_PATHS.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(fetch(request));
    return;
  }

  // Static assets (images, fonts, icons) — cache-first, 7-day TTL
  if (STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 7 * 24 * 60 * 60));
    return;
  }

  // Next.js compiled chunks (_next/static) — stale-while-revalidate
  // Vercel rotates filenames on each deploy so stale entries expire naturally
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // HTML pages — network-first, fall back to cache when offline
  event.respondWith(networkFirst(request, PAGE_CACHE));
});

/* ── Strategy helpers ────────────────────────────────────────── */

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/'); // offline fallback
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || await fetchPromise;
}

async function cacheFirst(request, cacheName, maxAgeSeconds) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    const dateHeader = cached.headers.get('date');
    if (dateHeader) {
      const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
      if (age < maxAgeSeconds) return cached;
    } else {
      return cached;
    }
  }
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return cached || new Response('', { status: 408 });
  }
}
