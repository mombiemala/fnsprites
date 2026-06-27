// Pull the current named POIs straight from the public Fortnite map API so the
// base layer stays current every season with zero manual entry. The fetch runs
// in the user's browser (which can reach the API) and falls back to a curated
// list if the API is unreachable or changes shape.
//
// The API returns POI world coordinates; the BR map texture spans roughly
// ±MAP_BOUND on both axes, with world-Y pointing up (so it's inverted for
// screen space). If POIs look offset on the live map, tune MAP_BOUND.
import { FALLBACK_POIS } from '../data/mapMarkers'

const MAP_ENDPOINT = 'https://fortnite-api.com/v1/map'
const MAP_BOUND = 135000

function worldToPct(x, y) {
  const px = ((x + MAP_BOUND) / (2 * MAP_BOUND)) * 100
  const py = ((MAP_BOUND - y) / (2 * MAP_BOUND)) * 100
  return { x: px, y: py }
}

// Returns { pois: [{label,x,y}], live: boolean }. Never throws.
export async function fetchLivePois() {
  try {
    const res = await fetch(MAP_ENDPOINT)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const raw = json?.data?.pois
    if (!Array.isArray(raw) || raw.length === 0) throw new Error('no pois')
    const pois = raw
      .filter((p) => p?.name && p?.location && Number.isFinite(p.location.x) && Number.isFinite(p.location.y))
      .map((p) => {
        const { x, y } = worldToPct(p.location.x, p.location.y)
        return { label: p.name, x, y }
      })
      .filter((p) => p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100)
    if (pois.length === 0) throw new Error('no usable pois')
    return { pois, live: true }
  } catch {
    return { pois: FALLBACK_POIS, live: false }
  }
}
