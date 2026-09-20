// Current-season map reference. The live map image + full POI list are pulled at
// runtime from our own /api/map serverless proxy, which fetches fortnite-api.com's
// /v1/map server-side. We proxy it (rather than calling the vendor from the
// browser) because that endpoint isn't CORS-open, so a direct client fetch failed
// and left the Map tab stuck loading. This file holds a static fallback (used if
// the proxy fails) and the notable current-season POIs for the crawlable /map page.
//
// NOTE for collectors: Override Sprites are NOT tied to specific POIs — they come
// from in-world Cheat Codes, map-wide Sprite Chests and events. This map is a
// general reference / chest-farm aid, not a "go here for Sprite X" tool.

export const MAP_API = '/api/map' // our proxy → fortnite-api.com/v1/map (see api/map.js)
export const MAP_SOURCE = 'fortnite-api.com'

// A stable, always-current labelled minimap image from the same API's CDN. If the
// live /v1/map fetch fails, MapView falls back to this URL, then to the blank map.
export const MAP_IMAGE_FALLBACK = 'https://media.fortnite-api.com/images/map_pois.png'

// Notable Chapter 7 Season 4 "Override" POIs (curated + sourced). The in-app Map
// view shows the live, complete list; this drives the SEO page and the fallback.
export const MAP_POIS = [
  { name: 'Green Hill Zone', note: 'Sonic-themed POI (replaced Calamari Canyon).' },
  { name: 'Reality’s Reign', note: 'Large technological complex of pipes & machinery.' },
  { name: 'Stone Sanctum', note: 'Ancient-themed location on the southern Island.' },
  { name: 'The Spire', note: 'Central landmark (the old Zero Point spot).' },
  { name: 'Sunken Shores', note: 'Tetris-themed destruction added this season.' },
]

export const MAP_UPDATED = 'September 20, 2026'
