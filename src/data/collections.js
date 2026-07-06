// Collection "sets" — the seam that lets this app track more than sprites.
//
// A collection is one set of trackable items (Sprites today; a future season's
// collectible tomorrow). Everything generic — ownership/level/mastery tracking,
// the Trade Board, the leaderboard, the map, OCR import, exports — is meant to
// read the ACTIVE collection, so adding a new collectible becomes a data entry
// here rather than new machinery.
//
// Phase 0 (groundwork): the registry exists and the cloud progress layer tags
// every row with its collection id. Screens still read the Sprites data directly
// — wiring them through here happens when a second set is actually added.
import { ALL_SPRITES, SPRITE_TYPES, TOTAL_COUNT, RELEASED_COUNT, RARITY_ORDER, TIER_ORDER, TIER_META } from './sprites'
import { THEMES, THEME_MAP } from './themes'

export const COLLECTIONS = [
  {
    id: 'sprites',
    label: 'Sprites',
    icon: '✨',
    items: ALL_SPRITES, // flat list of every variant (what progress is keyed on)
    types: SPRITE_TYPES, // items grouped by type
    variants: THEMES, // variant / finish lines (Normal, Gold, Gummy, …)
    variantMap: THEME_MAP, // id → variant lookup
    rarityOrder: RARITY_ORDER, // rarity ordering for grouping
    tierOrder: TIER_ORDER.map((t) => [t, TIER_META[t].label]), // gameplay-tier grouping
    total: TOTAL_COUNT,
    released: RELEASED_COUNT,
  },
  // A new season's collectible slots in here — no new tracking/trade/rank code.
]

// The set the app currently centers on (the season's headline collectible).
export const ACTIVE_COLLECTION_ID = 'sprites'

export const getCollection = (id = ACTIVE_COLLECTION_ID) =>
  COLLECTIONS.find((c) => c.id === id) || COLLECTIONS[0]

export const getActiveCollection = () => getCollection(ACTIVE_COLLECTION_ID)
