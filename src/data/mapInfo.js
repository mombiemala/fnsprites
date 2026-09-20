// Current-season map reference. The live map image + full POI list are pulled at
// runtime from fortnite-api.com's free /v1/map endpoint (no key, CORS-open — the
// same vendor we already use for the Shop & player stats). This file holds a
// static fallback (used if that fetch fails) and the notable current-season POIs
// for the crawlable /map SEO page.
//
// NOTE for collectors: Override Sprites are NOT tied to specific POIs — they come
// from in-world Cheat Codes, map-wide Sprite Chests and events. This map is a
// general reference / chest-farm aid, not a "go here for Sprite X" tool.

export const MAP_API = 'https://fortnite-api.com/v1/map'
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
