import { THEME_MAP } from './themes'

// Fortnite sprite roster. Variant sets, themes (incl. the Rift line) and
// released/unreleased flags are aligned with the community tracker
// UltronCore/sprite-tracker; the Striker/Fishy/Aura/Boss/Grim Reaper sprites
// went live in the Jun 25, 2026 update. Wick/Drifter/Ice/Seven/Air/Batman/
// Spider-Man are datamined and not yet released (flagged `rumored` — leaked,
// unconfirmed; several carry a leaked `releaseDate`).
// Holofoil rolls out to every sprite (~Jul 9); Seven, Air & Batman are part of
// the ~Jul 16 DC Summer update; the new Cube & Quack forms are on the whole
// roster. All new variants are flagged unreleased until they go live, and their
// abilities/bonuses can change before launch.
//
// `dropRate` is the published/datamined base drop chance where known (Epic does
// not officially publish these — values are community estimates, and exact
// per-sprite numbers on fortnite.gg/sprites could not be fetched from this
// environment). null = unknown.

const R = true   // released
const U = false  // unreleased

export const SPRITE_TYPES = [
  { id: 'water', name: 'Water', icon: '💧', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Replenishes shields while in or near water.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'earth', name: 'Earth', icon: '🪨', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Better chance of rare rewards when opening chests.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'fire', name: 'Fire', icon: '🔥', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Ignites enemies and deals bonus fire damage.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'duck', name: 'Duck', icon: '🦆', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Drops helpful items and quacks at nearby loot.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'ghost', name: 'Ghost', icon: '👻', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Briefly phases you out of danger.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'dream', name: 'Dream', icon: '🌙', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Grants temporary shield regeneration.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, rift: U, cube: U, quack: U } },
  { id: 'demon', name: 'Demon', icon: '😈', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Lifesteal — heal a portion of damage dealt.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'punk', name: 'Punk', icon: '🎸', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Boosts movement and reboot speed.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, rift: U, cube: U, quack: U } },
  { id: 'king', name: 'King', icon: '👑', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Boosted XP and rewards.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'zeropoint', name: 'Zero Point', icon: '🔷', rarity: 'Mythic', dropRate: '0.00034%', released: true,
    ability: 'Reality-warping mobility and teleports.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'peanut', name: 'Burnt Peanut', icon: '🥜', rarity: 'Mythic', dropRate: '1.01%', released: true,
    ability: 'A rare snack that grants a powerful random buff.',
    variants: { normal: R, holofoil: U, cube: U, quack: U } },

  // ---- Added in the Jun 25, 2026 update ----
  { id: 'striker', name: 'Striker', icon: '⚡', rarity: 'Rare', dropRate: null, released: true,
    ability: 'Charges a burst of bonus damage on your next hit.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'fishy', name: 'Fishy', icon: '🐟', rarity: 'Rare', dropRate: null, released: true,
    ability: 'Finds fish and aquatic loot more often.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'aura', name: 'Aura', icon: '✨', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Emits a healing aura for you and teammates.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'boss', name: 'Boss', icon: '🤵', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Hires AI henchmen to fight alongside you.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'grim', name: 'Grim Reaper', icon: '💀', rarity: 'Mythic', dropRate: null, released: true,
    ability: 'Spawns almost exclusively from Sprite Chests; harvests bonus souls/XP.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },

  // ---- Datamined / upcoming (NOT yet released). `rumored` = leaked/unconfirmed;
  //      abilities & exact variant lines can change before launch. ----
  { id: 'wick', name: 'John Wick', icon: '🔫', rarity: 'Rare', dropRate: null, released: false, rumored: true,
    ability: 'Datamined collab sprite — not yet released.',
    variants: { normal: U } },
  { id: 'drifter', name: 'Drifter', icon: '🏜️', rarity: 'Rare', dropRate: null, released: false, rumored: true,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U } },
  { id: 'ice', name: 'Ice', icon: '❄️', rarity: 'Rare', dropRate: null, released: false, rumored: true,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U } },
  { id: 'seven', name: 'Seven', icon: '7️⃣', rarity: 'Epic', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-16',
    ability: 'Tracks nearby players — lets you follow their footstep trails. Leaked for the Jul 16 DC Summer update; power not yet confirmed by Epic.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'air', name: 'Air', icon: '🌬️', rarity: 'Epic', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-16',
    ability: 'A movement Sprite — increases sprint speed & jump height and removes fall damage. Leaked for the Jul 16 DC Summer update; power not yet confirmed by Epic.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'batman', name: 'Batman', icon: '🦇', rarity: 'Legendary', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-16',
    ability: 'DC Summer collab Sprite, leaked for Jul 16 (Holofoil variant teased for Jul 9). Its power hasn’t been revealed yet.',
    variants: { normal: U, gummy: U, galaxy: U, holofoil: U } },
  { id: 'spiderman', name: 'Spider-Man', icon: '🕷️', rarity: 'Legendary', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-30',
    ability: 'Datamined Marvel collab Sprite — reportedly grants web-swinging mobility. Leaked for ~Jul 30 (v41.30); not yet confirmed by Epic.',
    variants: { normal: U } },
]

export const RARITY_ORDER = ['Rare', 'Epic', 'Legendary', 'Mythic']

export const RARITY_COLORS = {
  Rare: '#3da9fc',
  Epic: '#a855f7',
  Legendary: '#f59e0b',
  Mythic: '#ef4444',
}

// Community gameplay tier — how strong a sprite's ability is in the current meta
// (distinct from rarity, which is how hard it is to find). A snapshot
// cross-referenced from the GAMES.GG, Beebom, PlayerAuctions & Destructoid
// Chapter 7 Season 3 tier lists. Opinion-based and meta-dependent; unreleased /
// leaked sprites and one-off snacks (Peanut) stay unranked until they settle.
export const TIER_META = {
  S: { label: 'S-Tier', blurb: 'Meta-defining — take it almost any match.', color: '#f6c945' },
  A: { label: 'A-Tier', blurb: 'Strong and widely useful.', color: '#34d399' },
  B: { label: 'B-Tier', blurb: 'Situational — good in the right spot.', color: '#3da9fc' },
  C: { label: 'C-Tier', blurb: 'Niche or hard to get value from.', color: '#8b93a7' },
}
export const TIER_ORDER = ['S', 'A', 'B', 'C']
const SPRITE_TIER = {
  striker: 'S', demon: 'S', ghost: 'S', zeropoint: 'S',
  earth: 'A', fishy: 'A',
  boss: 'B', duck: 'B', dream: 'B', king: 'B', aura: 'B', grim: 'B',
  water: 'C', fire: 'C', punk: 'C',
}
export function spriteTier(typeId) {
  return SPRITE_TIER[typeId] || null
}

export function buildSpriteList() {
  const items = []
  for (const type of SPRITE_TYPES) {
    for (const [themeId, variantReleased] of Object.entries(type.variants)) {
      if (!THEME_MAP[themeId]) continue
      items.push({
        id: `${type.id}_${themeId}`,
        typeId: type.id,
        typeName: type.name,
        icon: type.icon,
        rarity: type.rarity,
        dropRate: type.dropRate,
        ability: type.ability,
        themeId,
        // Official Epic sprite art at public/sprites/<id>.png; SpriteArt falls
        // back to generated SVG if the file is missing.
        image: `${import.meta.env.BASE_URL}sprites/${type.id}_${themeId}.png`,
        // Leaked/unconfirmed: either the whole sprite is rumored, or it's a
        // rumored variant form (e.g. Cube/Quack) whose bonus isn't confirmed.
        rumored: !!(type.rumored || THEME_MAP[themeId]?.rumored),
        tier: SPRITE_TIER[type.id] || null,
        released: type.released && variantReleased,
        unreleased: !(type.released && variantReleased),
      })
    }
  }
  return items
}

export const ALL_SPRITES = buildSpriteList()
export const TOTAL_COUNT = ALL_SPRITES.length
export const RELEASED_COUNT = ALL_SPRITES.filter((s) => s.released).length

// Estimated Sprite Dust to (re)summon a variant, by rarity. Normal = base cost;
// special variants (Gold/Gummy/Galaxy…) cost more. Community-sourced estimates.
const DUST_BASE = { Rare: 100, Epic: 3000, Legendary: 5000, Mythic: 7500 }
const DUST_VARIANT = { Rare: 4000, Epic: 6000, Legendary: 10000, Mythic: 15000 }
export function dustCost(rarity, themeId) {
  const table = themeId === 'normal' ? DUST_BASE : DUST_VARIANT
  return table[rarity] ?? null
}

// Where a sprite is farmed (they come from Sprite Chests; a few have notes).
const SPRITE_SOURCE = {
  grim: 'Sprite Chests — spawns almost exclusively here.',
  peanut: 'Extremely rare — a lucky Sprite Chest find.',
  zeropoint: 'Sprite Chests — Mythic, very rare.',
  fishy: 'Sprite Chests, with better odds near water & fishing spots.',
}
export function spriteSource(typeId) {
  return SPRITE_SOURCE[typeId] || 'Sprite Chests around the island (plus occasional mid-match spawns).'
}

// How a sprite's ability grows as you level it 1 → 5 (Lv 5 = Mastered).
// Epic doesn't publish exact numbers, so these are community-reported values
// (cross-referenced from fortnite.gg, the Fortnite Wiki, Beebom & AccountShark);
// treat the numbers as estimates. Kept as short strings so the detail view can
// show what you're actually leveling toward. `null`/absent = no reliable data.
const SPRITE_SCALING = {
  water: 'Bigger shield regen in/near water, and it extends further to nearby squadmates at higher levels.',
  earth: 'Stronger boost to Epic/Legendary chest loot odds as you level.',
  fire: 'The fiery burst on hit hits harder and wider at higher levels.',
  duck: 'Replenishes more shield while emoting/jamming the higher the level.',
  ghost: 'Reload cloak lasts ≈3s at Lv 1, up to ≈5s at Lv 5.',
  dream: 'Shield regen kicks in faster and lasts longer as you level.',
  demon: 'Lifesteal heals ≈10 effective HP per elim at Lv 1, up to ≈30 at Lv 5.',
  punk: 'Bigger movement & reboot-speed boost the higher the level.',
  king: 'Pickaxe deals progressively more damage to enemies as you level.',
  zeropoint: 'Shield Bubble Jr. lasts longer each level — up to ≈10s at Lv 5.',
  striker: 'Overdrive damage buff on every mantle/hurdle/wall-scramble; the buff grows with level.',
  fishy: 'Swim / move speed: 25% / 10% (Lv 1) → 50 / 20 → 100 / 30 → 150 / 40 → 200% / 50% (Lv 5).',
  aura: 'Earns Shock Rock charges faster (more damage-per-charge) at higher levels.',
  boss: 'Tougher AI henchmen, plus up to +25 HP & Shield over your base stats at Lv 5.',
  grim: 'Harvests progressively more bonus souls / XP as you level.',
}
export function spriteScaling(typeId) {
  return SPRITE_SCALING[typeId] || null
}
