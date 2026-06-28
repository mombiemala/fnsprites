// Map configuration. The POI layer is pulled LIVE from the public Fortnite map
// API at runtime (see lib/livePois.js) so it stays current each season with no
// manual entry; FALLBACK_POIS below is only used if that fetch fails.
//
// Chest / fishing / pond markers are COMMUNITY-SOURCED — players submit and
// confirm them (stored in Supabase). There is no open dataset for those, so
// crowd-sourcing is the sustainable, self-updating path.
// Map image candidates, tried in order. A self-hosted copy at public/map.png
// avoids hammering (and being rate-limited by) the external API on every load;
// if it's absent we fall back to the live API image.
export const MAP_IMAGE_CANDIDATES = [
  `${import.meta.env.BASE_URL}map.png`,
  'https://fortnite-api.com/images/map.png',
]
export const MAP_LINK = 'https://fortnite.gg/map'

// The community-marker layers. `pois` is handled separately (live).
export const KINDS = [
  { id: 'sprite_chest', label: 'Sprite Chests', color: '#36c5ff', emoji: '✨', note: 'Main source of rare sprites (incl. Grim Reaper).' },
  { id: 'chest', label: 'Chests', color: '#7CFC9B', emoji: '📦', note: 'Regular loot chests.' },
  { id: 'fishing', label: 'Fishing Spots', color: '#5BB8FF', emoji: '🎣', note: 'Fishing holes.' },
  { id: 'gold_pond', label: 'Gold Ponds', color: '#f6c945', emoji: '🟡', note: 'Higher chance of rare fishing rewards.' },
  { id: 'path', label: 'Runner Paths', color: '#a855f7', emoji: '🏃', note: 'Fast loops between chest clusters.' },
]

export const KIND_MAP = Object.fromEntries(KINDS.map((k) => [k.id, k]))

// Curated current-season POIs (Shattered Coast, Ch7 S3). Approximate positions —
// only used if the live POI fetch fails. Names are accurate to the season.
export const FALLBACK_POIS = [
  { label: 'Wonkeeland', x: 30, y: 30 },
  { label: 'Latte Landing', x: 44, y: 24 },
  { label: 'Lifty Lodge', x: 58, y: 22 },
  { label: 'Battlewoods', x: 70, y: 30 },
  { label: 'Sinister Strip', x: 50, y: 44 },
  { label: 'Shaken Sanctuary', x: 34, y: 50 },
  { label: 'Cluster Coast', x: 22, y: 44 },
  { label: 'Frosted Flats', x: 64, y: 50 },
  { label: 'Golden Grove', x: 76, y: 52 },
  { label: 'Sunken Shores', x: 28, y: 66 },
  { label: 'Heatwave Harbor', x: 50, y: 70 },
  { label: 'Calamari Canyon', x: 66, y: 70 },
  { label: 'Chopped Shop', x: 42, y: 60 },
]
