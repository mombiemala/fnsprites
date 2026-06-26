import { THEME_MAP } from './themes'

// Fortnite sprite roster, accurate to the Jun 25, 2026 update (which added
// Striker, Fishy, Aura, Boss and Grim Reaper). Each sprite lists the variants
// that exist for it and whether each is currently obtainable.
//
// `released`  – whether the sprite itself is live in-game yet.
// `variants`  – { themeId: released? } for every variant that exists for it.
//               A theme not listed here simply doesn't exist for that sprite.
// `dropRate`  – published drop chance where known, else null.
// `ability`   – community-sourced summary; easy to edit as data firms up.
//
// Roster cross-referenced against fortnite.gg/sprites, spritelocker.com and the
// community trackers UltronCore/sprite-tracker and MRSessions/fn-sprite-checklist.

const R = true   // released
const U = false  // unreleased / not yet obtainable

export const SPRITE_TYPES = [
  // ---- Starters & original roster ----
  { id: 'water', name: 'Water', icon: '💧', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Replenishes shields while in or near water.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U } },
  { id: 'earth', name: 'Earth', icon: '🪨', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Better chance of rare rewards when opening chests.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U } },
  { id: 'fire', name: 'Fire', icon: '🔥', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Ignites enemies and deals bonus fire damage.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U } },
  { id: 'duck', name: 'Duck', icon: '🦆', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Drops helpful items and quacks at nearby loot.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U } },
  { id: 'ghost', name: 'Ghost', icon: '👻', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Briefly phases you out of danger.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U } },
  { id: 'dream', name: 'Dream', icon: '🌙', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Grants temporary shield regeneration.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, cube: U } },
  { id: 'demon', name: 'Demon', icon: '😈', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Lifesteal — heal a portion of damage dealt.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U } },
  { id: 'punk', name: 'Punk', icon: '🎸', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Boosts movement and reboot speed.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, cube: U } },
  { id: 'king', name: 'King', icon: '👑', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Boosted XP and rewards.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U } },
  { id: 'zeropoint', name: 'Zero Point', icon: '🔷', rarity: 'Mythic', dropRate: null, released: true,
    ability: 'Reality-warping mobility and teleports.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, quack: U } },
  { id: 'peanut', name: 'Burnt Peanut', icon: '🥜', rarity: 'Mythic', dropRate: null, released: true,
    ability: 'A rare snack that grants a powerful random buff.',
    variants: { normal: R } },

  // ---- Added in the Jun 25, 2026 update ----
  { id: 'striker', name: 'Striker', icon: '⚡', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Charges a burst of bonus damage on your next hit.',
    variants: { normal: R, gold: U, gummy: U, galaxy: U } },
  { id: 'fishy', name: 'Fishy', icon: '🐟', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Finds fish and aquatic loot more often.',
    variants: { normal: R, gold: U, gummy: U, galaxy: U } },
  { id: 'aura', name: 'Aura', icon: '✨', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Emits a healing aura for you and teammates.',
    variants: { normal: R, gold: U, gummy: U, galaxy: U } },
  { id: 'boss', name: 'Boss', icon: '🤵', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Hires AI henchmen to fight alongside you.',
    variants: { normal: R, gold: U, gummy: U, galaxy: U } },
  { id: 'grim', name: 'Grim Reaper', icon: '💀', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Marks eliminated enemies to harvest bonus souls/XP.',
    variants: { normal: R, gold: U, gummy: U, galaxy: R } },

  // ---- Datamined / upcoming (NOT yet released) ----
  { id: 'wick', name: 'John Wick', icon: '🔫', rarity: 'Mythic', dropRate: null, released: false,
    ability: 'Datamined collab sprite — not yet released.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U } },
  { id: 'drifter', name: 'Drifter', icon: '🏜️', rarity: 'Legendary', dropRate: null, released: false,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U } },
  { id: 'ice', name: 'Ice', icon: '❄️', rarity: 'Rare', dropRate: null, released: false,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U } },
  { id: 'seven', name: 'Seven', icon: '7️⃣', rarity: 'Legendary', dropRate: null, released: false,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U } },
]

export const RARITY_ORDER = ['Rare', 'Epic', 'Legendary', 'Mythic']

export const RARITY_COLORS = {
  Rare: '#3da9fc',
  Epic: '#a855f7',
  Legendary: '#f59e0b',
  Mythic: '#ef4444',
}

// Flatten into the full list of collectible variants.
// A variant is "unreleased" if the sprite itself is unreleased OR the specific
// variant isn't obtainable yet.
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
        // AI-generated art lives at public/sprites/<id>.png; SpriteArt falls
        // back to generated SVG if the file is missing.
        image: `${import.meta.env.BASE_URL}sprites/${type.id}_${themeId}.png`,
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
