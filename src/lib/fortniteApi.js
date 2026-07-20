// Thin client for fortnite-api.com — a free, no-auth, CORS-enabled public API
// (the same ecosystem sites like fortnite.gg use for shop/cosmetics data). We
// already lean on this project for news/build info; here it powers the Item Shop
// and the cosmetics proof-of-concept. Sprite data stays our own curated set —
// these endpoints don't cover Sprites, they cover the wider game.
const BASE = 'https://fortnite-api.com'

// Today's rotating Item Shop. Returns `data` = { date, vbuckIcon, entries: [...] }.
export async function fetchShop() {
  const res = await fetch(`${BASE}/v2/shop`)
  if (!res.ok) throw new Error(`Shop request failed (HTTP ${res.status})`)
  const json = await res.json()
  return json.data
}

// Recently-added BR cosmetics (small, fresh list — ideal for a browser POC vs the
// full multi-thousand catalogue). Returns { date, items: {...category arrays} } on
// /v2/cosmetics/new; we flatten to a single list of BR items.
export async function fetchNewCosmetics() {
  const res = await fetch(`${BASE}/v2/cosmetics/new`)
  if (!res.ok) throw new Error(`Cosmetics request failed (HTTP ${res.status})`)
  const json = await res.json()
  const items = json.data?.items
  // Newer shape nests by type (br/tracks/…); older returned a flat `items` array.
  if (Array.isArray(items)) return items
  return items?.br || []
}

// Rarity → colour, spanning Fortnite's collab/series tiers, with a neutral default.
export const RARITY_TINT = {
  common: '#9aa4bf',
  uncommon: '#59a63a',
  rare: '#3da9fc',
  epic: '#a855f7',
  legendary: '#f59e0b',
  mythic: '#ffd23f',
  marvel: '#d3273e',
  dc: '#3c6fed',
  icon: '#37e5c8',
  gaming: '#1e93ff',
  starwars: '#000000',
  slurp: '#20e3c0',
  frozen: '#8fd0ff',
  lava: '#ff6a3d',
  shadow: '#4b4b57',
}
export const rarityTint = (value) => RARITY_TINT[(value || '').toLowerCase()] || '#7f8ab0'

// Collapse an entry's various item buckets (brItems, tracks, cars…) into one list.
export function entryItems(entry) {
  return [
    ...(entry.brItems || []),
    ...(entry.tracks || []),
    ...(entry.instruments || []),
    ...(entry.cars || []),
    ...(entry.legoKits || []),
  ]
}
