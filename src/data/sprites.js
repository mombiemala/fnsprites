import { THEMES } from './themes'

// Each sprite "type" can be collected across several themes. A tracked item is
// uniquely identified by `${type.id}_${theme.id}` (e.g. "water_gold"), matching
// the sprite_id stored per-user in the database.
//
// `themes` lists which theme variants exist for that type. `unreleased` flags
// variants that aren't obtainable in-game yet.

const ALL = THEMES.map((t) => t.id)
const COMMON = ['basic', 'gold', 'gummy', 'galaxy', 'gem']

export const SPRITE_TYPES = [
  { id: 'water', name: 'Water', icon: '💧', rarity: 'Rare', themes: ALL },
  { id: 'earth', name: 'Earth', icon: '🪨', rarity: 'Rare', themes: ALL },
  { id: 'fire', name: 'Fire', icon: '🔥', rarity: 'Rare', themes: ALL },
  { id: 'air', name: 'Air', icon: '🌪️', rarity: 'Rare', themes: COMMON, unreleased: ['holofoil', 'rift'] },
  { id: 'duck', name: 'Duck', icon: '🦆', rarity: 'Epic', themes: ['basic', 'gold', 'gummy', 'galaxy', 'gem', 'quack'] },
  { id: 'fishy', name: 'Fishy', icon: '🐟', rarity: 'Epic', themes: COMMON },
  { id: 'ghost', name: 'Ghost', icon: '👻', rarity: 'Epic', themes: ALL },
  { id: 'dream', name: 'Dream', icon: '🌙', rarity: 'Epic', themes: ALL },
  { id: 'demon', name: 'Demon', icon: '😈', rarity: 'Special', themes: ALL },
  { id: 'punk', name: 'Punk', icon: '🎸', rarity: 'Special', themes: COMMON },
  { id: 'striker', name: 'Striker', icon: '⚡', rarity: 'Special', themes: ALL },
  { id: 'aura', name: 'Aura', icon: '✨', rarity: 'Special', themes: ALL },
  { id: 'grim', name: 'Grim', icon: '💀', rarity: 'Legendary', themes: ALL },
  { id: 'boss', name: 'Boss', icon: '👑', rarity: 'Legendary', themes: ALL },
  { id: 'king', name: 'King', icon: '🤴', rarity: 'Legendary', themes: ALL },
  { id: 'seven', name: 'Seven', icon: '7️⃣', rarity: 'Legendary', themes: COMMON, unreleased: ['basic', 'gold', 'gummy', 'galaxy', 'gem'] },
  { id: 'wick', name: 'John Wick', icon: '🔫', rarity: 'Mythic', themes: ALL, unreleased: ['holofoil', 'rift'] },
  { id: 'zeropoint', name: 'Zero Point', icon: '🔷', rarity: 'Mythic', themes: ['basic', 'gold', 'gummy', 'galaxy', 'gem', 'rift', 'quack'] },
  { id: 'peanut', name: 'Burnt Peanut', icon: '🥜', rarity: 'Mythic', themes: ['basic', 'gold', 'galaxy', 'gem'] },
]

// "quack" is a one-off custom theme used by a couple of sprites; surface it so
// cards can still render it even though it isn't in the standard THEMES list.
export const CUSTOM_THEME = {
  id: 'quack',
  name: 'Quack',
  short: 'Q',
  className: 'theme-quack',
  accent: '#ffd23f',
}

export const RARITY_ORDER = ['Rare', 'Epic', 'Special', 'Legendary', 'Mythic']

export const RARITY_COLORS = {
  Rare: '#3da9fc',
  Epic: '#a855f7',
  Special: '#ec4899',
  Legendary: '#f59e0b',
  Mythic: '#ef4444',
}

// Flatten into the full list of collectible variants.
export function buildSpriteList() {
  const items = []
  for (const type of SPRITE_TYPES) {
    for (const themeId of type.themes) {
      items.push({
        id: `${type.id}_${themeId}`,
        typeId: type.id,
        typeName: type.name,
        icon: type.icon,
        rarity: type.rarity,
        themeId,
        unreleased: Array.isArray(type.unreleased) && type.unreleased.includes(themeId),
      })
    }
  }
  return items
}

export const ALL_SPRITES = buildSpriteList()
export const TOTAL_COUNT = ALL_SPRITES.length
