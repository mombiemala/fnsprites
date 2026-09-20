// Vercel serverless function — a thin, server-side proxy for the current
// Battle Royale map (labelled minimap image + POI list) via fortnite-api.com.
//
// WHY THIS EXISTS: the browser can't reliably call fortnite-api.com/v1/map
// directly — the endpoint isn't CORS-open for arbitrary origins, so a client-side
// fetch fails and the in-app Map tab was left stuck on "Loading…". This function
// fetches the map server-side (no CORS in server-to-server calls) and returns a
// small, already-parsed shape the client can render. No API key is needed for the
// map endpoint (unlike stats), so this is just a CORS/shape shim.
//
// Client contract:  GET /api/map
// Returns { image, pois, source } on success, or { error } on failure. `image` is
// a labelled-POI minimap URL; `pois` is a sorted array of POI names.

const UPSTREAM = 'https://fortnite-api.com/v1/map'
const SOURCE = 'fortnite-api.com'

export default async function handler(req, res) {
  // The map changes at most a few times a season — cache hard at the edge so we
  // barely touch the upstream and the tab loads instantly for everyone.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const upstream = await fetch(UPSTREAM)
    const body = await upstream.json().catch(() => null)

    if (upstream.ok && body?.data) {
      const d = body.data
      const image = d.images?.pois || d.images?.blank || null
      const pois = Array.isArray(d.pois)
        ? d.pois.map((p) => p?.name).filter(Boolean).sort((a, b) => a.localeCompare(b))
        : []
      res.status(200).json({ image, pois, source: SOURCE })
      return
    }

    res.status(502).json({ error: 'Could not reach the map source. Try again in a bit.' })
  } catch {
    res.status(502).json({ error: 'Could not reach the map source. Try again in a bit.' })
  }
}
