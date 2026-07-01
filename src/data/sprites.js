import { THEME_MAP } from './themes'

// Fortnite sprite roster. Variant sets, themes (incl. the Rift line) and
// released/unreleased flags are aligned with the community tracker
// UltronCore/sprite-tracker; the Striker/Fishy/Aura/Boss/Grim Reaper sprites
// went live in the Jun 25, 2026 update. Wick/Drifter/Ice/Seven are datamined and
// not yet released.
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
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U } },
  { id: 'earth', name: 'Earth', icon: '🪨', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Better chance of rare rewards when opening chests.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U } },
  { id: 'fire', name: 'Fire', icon: '🔥', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Ignites enemies and deals bonus fire damage.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U } },
  { id: 'duck', name: 'Duck', icon: '🦆', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Drops helpful items and quacks at nearby loot.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U } },
  { id: 'ghost', name: 'Ghost', icon: '👻', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Briefly phases you out of danger.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U } },
  { id: 'dream', name: 'Dream', icon: '🌙', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Grants temporary shield regeneration.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, rift: U } },
  { id: 'demon', name: 'Demon', icon: '😈', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Lifesteal — heal a portion of damage dealt.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U } },
  { id: 'punk', name: 'Punk', icon: '🎸', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Boosts movement and reboot speed.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, rift: U } },
  { id: 'king', name: 'King', icon: '👑', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Boosted XP and rewards.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U } },
  { id: 'zeropoint', name: 'Zero Point', icon: '🔷', rarity: 'Mythic', dropRate: '0.00034%', released: true,
    ability: 'Reality-warping mobility and teleports.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U } },
  { id: 'peanut', name: 'Burnt Peanut', icon: '🥜', rarity: 'Mythic', dropRate: '1.01%', released: true,
    ability: 'A rare snack that grants a powerful random buff.',
    variants: { normal: R } },

  // ---- Added in the Jun 25, 2026 update ----
  { id: 'striker', name: 'Striker', icon: '⚡', rarity: 'Rare', dropRate: null, released: true,
    ability: 'Charges a burst of bonus damage on your next hit.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R } },
  { id: 'fishy', name: 'Fishy', icon: '🐟', rarity: 'Rare', dropRate: null, released: true,
    ability: 'Finds fish and aquatic loot more often.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R } },
  { id: 'aura', name: 'Aura', icon: '✨', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Emits a healing aura for you and teammates.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R } },
  { id: 'boss', name: 'Boss', icon: '🤵', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Hires AI henchmen to fight alongside you.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R } },
  { id: 'grim', name: 'Grim Reaper', icon: '💀', rarity: 'Mythic', dropRate: null, released: true,
    ability: 'Spawns almost exclusively from Sprite Chests; harvests bonus souls/XP.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R } },

  // ---- Datamined / upcoming (NOT yet released) ----
  { id: 'wick', name: 'John Wick', icon: '🔫', rarity: 'Rare', dropRate: null, released: false,
    ability: 'Datamined collab sprite — not yet released.',
    variants: { normal: U } },
  { id: 'drifter', name: 'Drifter', icon: '🏜️', rarity: 'Rare', dropRate: null, released: false,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U } },
  { id: 'ice', name: 'Ice', icon: '❄️', rarity: 'Rare', dropRate: null, released: false,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U } },
  { id: 'seven', name: 'Seven', icon: '7️⃣', rarity: 'Rare', dropRate: null, released: false,
    ability: 'Datamined sprite — not yet released.',
    variants: { normal: U } },
]

export const RARITY_ORDER = ['Rare', 'Epic', 'Legendary', 'Mythic']

export const RARITY_COLORS = {
  Rare: '#3da9fc',
  Epic: '#a855f7',
  Legendary: '#f59e0b',
  Mythic: '#ef4444',
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
