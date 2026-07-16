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
// `dropRate` is the base (Normal) chance from a Sprite Chest. Epic does NOT
// publish official rates — these are COMMUNITY ESTIMATES cross-referenced from
// accountshark, fortnite.gg & community wikis, and they vary a bit by source.
// Most follow the rarity-tier base (Rare 8.73% · Epic 5.22% · Legendary 2.436%);
// the Mythics carry their own widely-cited figures (Zero Point 0.00034%, Grim
// Reaper ~0.000098% as the rarest, Burnt Peanut ~2.97% — far higher than the
// other Mythics because it has no variant slots). Treat all as approximate.

const R = true   // released
const U = false  // unreleased

export const SPRITE_TYPES = [
  { id: 'water', name: 'Water', icon: '💧', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Replenishes shields for you and nearby squad while you’re in water.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'earth', name: 'Earth', icon: '🪨', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Better chance of rare rewards when opening chests.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'fire', name: 'Fire', icon: '🔥', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Unleashes a fiery burst once you deal enough damage to an enemy.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'duck', name: 'Duck', icon: '🦆', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Emoting or Jamming replenishes your shields.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'ghost', name: 'Ghost', icon: '👻', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Reloading cloaks you (near-invisible) for a few seconds — longer as it levels.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'dream', name: 'Dream', icon: '🌙', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Drops a random item each level-up, showering Legendary loot at max level.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, rift: U, cube: U, quack: U } },
  { id: 'demon', name: 'Demon', icon: '😈', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Siphons health and shields when you eliminate an opponent.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'punk', name: 'Punk', icon: '🎸', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Rolls a random buff on level-up; at max level, a chance at infinite ammo.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, rift: U, cube: U, quack: U } },
  { id: 'king', name: 'King', icon: '👑', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Your pickaxe deals extra damage.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'zeropoint', name: 'Zero Point', icon: '🔷', rarity: 'Mythic', dropRate: '0.00034%', released: true,
    ability: 'Spawns a Shield Bubble Jr. when you use a healing item on yourself (not splashes or grenades).',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'peanut', name: 'Burnt Peanut', icon: '🥜', rarity: 'Mythic', dropRate: '2.97%', released: true,
    ability: 'A rare snack that grants a powerful random buff.',
    // Normal-only special — no variant line (Holofoil ships for the other 15
    // Sprites, not Peanut), so it stays out of the Cube/Quack rollout too.
    variants: { normal: R } },

  // ---- Added in the Jun 25, 2026 update ----
  { id: 'striker', name: 'Striker', icon: '⚡', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Grants Overdrive (faster firing, reload & movement) when you Mantle, Hurdle or Wall Scramble.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'fishy', name: 'Fishy', icon: '🐟', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Boosts your swim speed.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'aura', name: 'Aura', icon: '✨', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Builds a Shock Rock charge as you deal damage.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'boss', name: 'Boss', icon: '🤵', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Boosts your max HP and Shield, growing each level (up to +25).',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: U, cube: U, quack: U } },
  { id: 'grim', name: 'Grim Reaper', icon: '💀', rarity: 'Mythic', dropRate: '0.000098%', released: true,
    ability: 'Marks the location of any enemy who damages you. Spawns almost exclusively from Sprite Chests.',
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
  // Seven was expected Jul 16, but Epic's weekly schedule shows only Batman & Air
  // on New Sprite Day — so no firm date-gate (some leaks say ~Jul 23, unconfirmed).
  { id: 'seven', name: 'Seven', icon: '7️⃣', rarity: 'Epic', dropRate: null, released: false, rumored: true,
    ability: 'Reveals enemy foot trails on the map for your whole squad — duration ramps by level (10 → 15 → 20 → 25 → 30s at max). Timing unconfirmed: some sources list it for the Jul 16 DC Summer update, but Epic’s weekly schedule shows only Batman & Air on New Sprite Day (leaks point to ~Jul 23).',
    variants: { normal: U, gold: U, gummy: U, galaxy: U, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'air', name: 'Air', icon: '🌬️', rarity: 'Epic', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-16',
    ability: 'A movement Sprite — increases sprint speed & jump height and removes fall damage. On Epic’s Jul 16 New Sprite Day schedule (DC Summer); power not fully confirmed by Epic.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U, gem: U, holofoil: U, cube: U, quack: U } },
  { id: 'batman', name: 'Batman', icon: '🦇', rarity: 'Mythic', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-16',
    ability: 'Deploy the Bat Cape midair for a glide / slow descent. DC “Hot Bat Summer” collab Sprite (Mythic), in Gold, Gummy, Galaxy & Holofoil. Live in the Jul 16 (v41.20) update.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U, holofoil: U } },
  { id: 'spiderman', name: 'Spider-Man', icon: '🕷️', rarity: 'Legendary', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-30',
    ability: 'Datamined Marvel collab Sprite — reportedly grants web-swinging mobility. Leaked for ~Jul 30 (v41.30); not yet confirmed by Epic.',
    variants: { normal: U } },
  // Football-collab Mythics datamined in the v41.20 files (Jul 16). Abilities per
  // FNBRintel; not yet officially announced/released by Epic.
  { id: 'pollo', name: 'Pollo', icon: '🐔', rarity: 'Mythic', dropRate: null, released: false, rumored: true,
    ability: 'On an elimination, slowly replenish shield for you and nearby squad (duration grows per level). Mythic football-collab Sprite datamined in v41.20 — not yet confirmed by Epic.',
    variants: { normal: U } },
  { id: 'vinijr', name: 'Vini Jr.', icon: '⚽', rarity: 'Mythic', dropRate: null, released: false, rumored: true,
    ability: 'Sprint briefly to make your slide destructive; slide-kicking enemies boosts your fire rate & reload speed. Mythic football-collab Sprite datamined in v41.20 — not yet confirmed by Epic.',
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

// Some variant FORMS roll out on a known date across the whole roster. Rather
// than hand-flip every sprite on release day, gate those variants on the date:
// an unreleased form auto-flips to released once its date arrives (evaluated on
// each app load, browser-local). Only list FIRMLY-dated forms here — leave
// leaked/uncertain ones out so nothing releases early by mistake. To adjust a
// slipped date, just edit the string; to release manually, set it to a past date.
export const FORM_RELEASE = { holofoil: '2026-07-09' }
const _todayStr = (() => { try { return new Date().toISOString().slice(0, 10) } catch { return '9999-12-31' } })()
const formLive = (themeId) => !!(FORM_RELEASE[themeId] && _todayStr >= FORM_RELEASE[themeId])

// Date-gate the leaked SPRITES too: a not-yet-released type with a `releaseDate`
// auto-flips to released once its date arrives (Air/Seven/Batman ~Jul 16,
// Spider-Man ~Jul 30). On release it stops being `rumored`, and its variants
// become collectible (except any whose form has a still-future release date).
// These dates are LEAKED — recheck them before each drop; a wrong date releases
// content early, and it's a one-line fix (edit or remove the `releaseDate`).
for (const t of SPRITE_TYPES) {
  if (!t.released && t.releaseDate && _todayStr >= t.releaseDate) {
    t.released = true
    t.rumored = false
    for (const k of Object.keys(t.variants)) {
      // Don't auto-release a variant whose FORM hasn't dropped yet (future
      // FORM_RELEASE date) or whose theme is itself still rumored/unconfirmed
      // (Gem is disabled, Cube/Quack bonuses unrevealed) — those stay U so a
      // newly-released Sprite matches how the rest of the roster treats them.
      if (!t.variants[k] && !THEME_MAP[k]?.rumored && !(FORM_RELEASE[k] && _todayStr < FORM_RELEASE[k])) t.variants[k] = true
    }
  }
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
        // A variant is live if it's flagged R, or its form's release date has
        // arrived (e.g. Holofoil auto-releases across the roster on Jul 9) — but
        // only when the sprite type itself is released.
        released: type.released && (variantReleased || formLive(themeId)),
        unreleased: !(type.released && (variantReleased || formLive(themeId))),
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
// Every Sprite comes from Sprite Chests (RNG weighted by drop rate) — no Sprite
// is tied to a specific location, so the notes are about rarity/odds, not spots.
const SPRITE_SOURCE = {
  grim: 'Sprite Chests — spawns almost exclusively here (no mid-match spawns).',
  peanut: 'Extremely rare — a lucky Sprite Chest find.',
  zeropoint: 'Sprite Chests — Mythic, so very rare from any single chest.',
}
export function spriteSource(typeId) {
  return SPRITE_SOURCE[typeId] || 'Sprite Chests around the island — any chest can drop any Sprite (rarer ones less often), plus occasional mid-match spawns.'
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
