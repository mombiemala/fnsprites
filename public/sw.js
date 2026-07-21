// Offline cache with a safe update story.
//
// The document (navigations) is fetched NETWORK-FIRST so the page always
// references the current, existing asset hashes — a stale cached index.html
// pointing at chunk hashes from an old deploy is what causes "Unexpected token
// '<'" (the server returns the SPA fallback HTML for a missing .js). Hashed
// assets stay cache-first (they're immutable). Bump CACHE to invalidate old
// caches for everyone on activate.
const CACHE = 'fnsprites-v3'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return // let Supabase/network calls pass through

  // Our serverless API (e.g. the stats proxy) must ALWAYS hit the network —
  // never cache it or risk serving a stale result or the SPA HTML fallback.
  if (url.pathname.startsWith('/api/')) return

  // Navigations: network-first, fall back to cache only when offline. Keeps the
  // HTML (and therefore its asset references) fresh after every deploy.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
          return res
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/')))
    )
    return
  }

  // OCR engine assets are large and content-stable — once cached, serve from
  // cache and skip revalidation so we don't re-download ~9MB.
  const immutable = url.pathname.includes('/tesseract/')
  const isAsset = /\.(js|css)$/i.test(url.pathname)

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached && immutable) return cached
      const network = fetch(req)
        .then((res) => {
          // Never treat/keep an HTML SPA-fallback as if it were JS/CSS — that's
          // the "Unexpected token '<'" crash. Fall back to any cached copy.
          if (isAsset && (res.headers.get('content-type') || '').includes('text/html')) {
            return cached || res
          }
          if (res && res.status === 200) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
