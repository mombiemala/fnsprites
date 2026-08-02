// Vercel serverless function — a thin, server-side proxy for the auto-pulled
// Fortnite news signals (current live build + official in-game BR news tiles)
// from fortnite-api.com.
//
// WHY THIS EXISTS: the news feed used to be fetched straight from the browser
// against fortnite-api.com. That breaks in two ways in production: the news
// endpoint now expects an API key (unauthenticated calls get rate-limited /
// rejected, so the live section silently went empty), and hitting a third-party
// host from the client is a CORS liability. Same call as the stats proxy: the
// key lives ONLY on the server (FORTNITE_API_KEY env var, set in Vercel — never
// in the repo or the client bundle), and the browser calls THIS function.
//
// Client contract:  GET /api/news
// Returns { data: { build, motds } } — `build` is a version string like "41.30"
// (or null) and `motds` is the raw in-game news tiles array (possibly empty).
// Always 200 with a safe shape: the live section must never break the curated
// feed, so any upstream failure degrades to nulls/[] rather than an error.

const API = 'https://fortnite-api.com'

export default async function handler(req, res) {
  // News changes on the order of patches/events, not seconds — cache hard at the
  // edge so we barely touch the upstream (and its rate limit) under traffic.
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800')

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // The key is optional for news, but sending it lifts the rate limit and
  // satisfies endpoints that now require auth. Absent key → still try (public).
  const key = process.env.FORTNITE_API_KEY
  const headers = key ? { Authorization: key } : {}

  // Fetch both signals in parallel; each is independently best-effort.
  const [build, motds] = await Promise.all([
    fetchBuild(headers),
    fetchMotds(headers),
  ])

  res.status(200).json({ data: { build, motds } })
}

// Current build/version → self-populates on every patch. Returns "41.30" | null.
async function fetchBuild(headers) {
  try {
    const r = await fetch(`${API}/v1/aes`, { headers })
    if (!r.ok) return null
    const d = await r.json().catch(() => null)
    const m = (d?.data?.build || '').match(/Release-(\d+\.\d+)/)
    return m ? m[1] : null
  } catch {
    return null
  }
}

// Official in-game BR news tiles (MOTDs). Returns a trimmed array (or []),
// keeping only the fields the client renders so we don't proxy a huge payload.
async function fetchMotds(headers) {
  try {
    const r = await fetch(`${API}/v2/news/br?language=en`, { headers })
    if (!r.ok) return []
    const d = await r.json().catch(() => null)
    const raw = d?.data?.motds || d?.data?.messages || []
    return raw.slice(0, 8).map((m) => ({
      id: m.id || null,
      title: m.title || m.tabTitle || '',
      body: m.body || '',
      image: m.image || m.tileImage || null,
    }))
  } catch {
    return []
  }
}
