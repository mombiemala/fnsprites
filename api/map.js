// Vercel serverless function — a thin, server-side proxy for the current
// Battle Royale map (minimap images + POI list WITH coordinates) via
// fortnite-api.com.
//
// WHY THIS EXISTS: the browser can't reliably call fortnite-api.com/v1/map
// directly — the endpoint isn't CORS-open for arbitrary origins, so a client-side
// fetch fails and the in-app Map tab was left stuck on "Loading…". This function
// fetches the map server-side (no CORS in server-to-server calls) and returns a
// small, already-parsed shape the client can render. No API key is needed for the
// map endpoint (unlike stats), so this is just a CORS/shape shim.
//
// Client contract:  GET /api/map
// Returns on success:
//   {
//     image,       // labelled minimap URL (POI names baked in)
//     blankImage,  // unlabelled minimap URL (for our own marker overlay)
//     pois,        // [{ name, x, y }] — named POIs with world coords, de-duped
//     names,       // sorted unique POI names (for the text list / SEO fallback)
//     bounds,      // { minX, maxX, minY, maxY } of the POI coords (self-calibration)
//     source
//   }
// or { error } on failure.

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
      const blankImage = d.images?.blank || d.images?.pois || null
      const raw = Array.isArray(d.pois) ? d.pois : []

      // Named POIs WITH coordinates, de-duped by name. The raw feed repeats some
      // markers (e.g. 8× "Override Console", 2× "Carwash") — distinct in-world
      // objects but noise as named pins, so we keep the first of each name.
      const seen = new Set()
      const pois = []
      for (const p of raw) {
        const name = p?.name
        const x = p?.location?.x
        const y = p?.location?.y
        if (!name || typeof x !== 'number' || typeof y !== 'number') continue
        if (seen.has(name)) continue
        seen.add(name)
        pois.push({ name, x, y })
      }

      // All unique POI names (drives the text list + offline fallback).
      const names = [...new Set(raw.map((p) => p?.name).filter(Boolean))].sort((a, b) => a.localeCompare(b))

      // Coordinate bounds so the client can normalize marker positions without
      // hardcoding the world extent — this auto-recalibrates when the map changes.
      let bounds = null
      if (pois.length) {
        const xs = pois.map((p) => p.x)
        const ys = pois.map((p) => p.y)
        bounds = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
      }

      res.status(200).json({ image, blankImage, pois, names, bounds, source: SOURCE })
      return
    }

    res.status(502).json({ error: 'Could not reach the map source. Try again in a bit.' })
  } catch {
    res.status(502).json({ error: 'Could not reach the map source. Try again in a bit.' })
  }
}
