import { THEME_MAP } from './themes.js'

// Fortnite sprite roster. Variant sets, themes (incl. the Rift line) and
// released/unreleased flags are aligned with the community tracker
// UltronCore/sprite-tracker; the Striker/Fishy/Aura/Boss/Grim Reaper sprites
// went live in the Jun 25, 2026 update. Wick/Drifter/Ice/Seven/Air/Batman/
// Spider-Man are datamined and not yet released (flagged `rumored` — leaked,
// unconfirmed; several carry a leaked `releaseDate`).
// Holofoil rolls out in WAVES, not all at once: Water/Fire/Ghost/King/Striker
// (Jul 9) and Air/Seven/Batman (Jul 16) have it; Earth, Duck, Dream, Demon, Punk,
// Zero Point, Fishy, Aura, Boss & Grim are still to come (their holofoil stays U).
// Seven, Air & Batman are part of the ~Jul 16 DC Summer update; the new Cube &
// Quack forms are on the whole roster. All new variants are flagged unreleased
// until they go live, and their abilities/bonuses can change before launch.
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
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R, holofoil: R, quack: R } },
  { id: 'earth', name: 'Earth', icon: '🪨', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Better chance of rare rewards when opening chests.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R, cube: R, quack: R } },
  { id: 'fire', name: 'Fire', icon: '🔥', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Unleashes a fiery burst once you deal enough damage to an enemy.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: R, cube: R, quack: R } },
  { id: 'duck', name: 'Duck', icon: '🦆', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Emoting or Jamming replenishes your shields.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R } },
  { id: 'ghost', name: 'Ghost', icon: '👻', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Reloading cloaks you (near-invisible) for a few seconds — longer as it levels.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: R } },
  { id: 'dream', name: 'Dream', icon: '🌙', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Drops a random item each level-up, showering Legendary loot at max level.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, cube: R } },
  { id: 'demon', name: 'Demon', icon: '😈', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Siphons health and shields when you eliminate an opponent.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R } },
  { id: 'punk', name: 'Punk', icon: '🎸', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Rolls a random buff on level-up; at max level, a chance at infinite ammo.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R, cube: R } },
  { id: 'king', name: 'King', icon: '👑', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Your pickaxe deals extra damage.',
    // King ships Normal/Gold/Gummy/Galaxy/Holofoil only — Fortnite.GG lists no
    // Gem/Cube/Quack King (the earlier Gem King datamine never shipped publicly).
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: R } },
  { id: 'zeropoint', name: 'Zero Point', icon: '🔷', rarity: 'Mythic', dropRate: '0.00034%', released: true,
    ability: 'Spawns a Shield Bubble Jr. when you use a healing item on yourself (not splashes or grenades).',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R, holofoil: R, cube: R, quack: R } },
  { id: 'peanut', name: 'Burnt Peanut', icon: '🥜', rarity: 'Mythic', dropRate: '2.97%', released: true,
    ability: 'A rare snack that grants a powerful random buff.',
    // Normal-only special — no variant line (Holofoil ships for the other 15
    // Sprites, not Peanut), so it stays out of the Cube/Quack rollout too.
    variants: { normal: R } },

  // ---- Added in the Jun 25, 2026 update ----
  { id: 'striker', name: 'Striker', icon: '⚡', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Grants Overdrive (faster firing, reload & movement) when you Mantle, Hurdle or Wall Scramble.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: R } },
  { id: 'fishy', name: 'Fishy', icon: '🐟', rarity: 'Rare', dropRate: '8.73%', released: true,
    ability: 'Boosts your swim speed.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, cube: R } },
  { id: 'aura', name: 'Aura', icon: '✨', rarity: 'Epic', dropRate: '5.22%', released: true,
    ability: 'Builds a Shock Rock charge as you deal damage.',
    // Gem Aura launched via its v41.30 quest, was briefly vaulted, and returned
    // with the full Gem line on New Sprite Day (Aug 6, 2026) — obtainable again.
    // (Internal asset id: ESD_DrifterSprite — the source of the old phantom
    // "Drifter" entry, now removed.)
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R } },
  { id: 'boss', name: 'Boss', icon: '🤵', rarity: 'Legendary', dropRate: '2.436%', released: true,
    ability: 'Boosts your max HP and Shield, growing each level (up to +25).',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, cube: R } },
  { id: 'grim', name: 'Grim Reaper', icon: '💀', rarity: 'Mythic', dropRate: '0.000098%', released: true,
    ability: 'Marks the location of any enemy who damages you. Spawns almost exclusively from Sprite Chests.',
    // Gem Grim launched with v41.30, was vaulted the same day (Jul 30), and
    // returned with the full Gem line on New Sprite Day (Aug 6, 2026).
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R, holofoil: R, cube: R } },

  // ---- Added in the Jul 30, 2026 update (v41.30 New Sprite Day) ----
  //      Rarity/drop rate are community estimates pending Epic's confirmation;
  //      variant lines beyond Normal roll out over the coming weeks.
  { id: 'peely', name: 'Peeky Peely', icon: '🍌', rarity: 'Legendary', dropRate: null, released: true,
    ability: 'Emits a ping that reveals players carrying rare Sprites nearby — but marks you on the map too. Ping radius grows each level (40 → 50 → 60 → 70 → 80m at Lv 5).',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: R } },
  { id: 'llama', name: 'Lootin’ Llama', icon: '🦙', rarity: 'Legendary', dropRate: null, released: true,
    // Legendary tier, but reported to drop fairly often (unlike most Legendaries).
    ability: 'Opening ammo boxes has a chance to grant a weapon upgrade — the chance grows each level (5% → 10% → 15% → 17% → 20% at Lv 5).',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, gem: R } },
  { id: 'ironmouse', name: 'Ironmouse', icon: '🐭', rarity: 'Mythic', dropRate: null, released: true,
    ability: 'Found in Relic Chests: when your health drops critically low, regenerate over time while gaining Cloak and low gravity — health restored grows each level (60 → 70 → 80 → 90 → 100 HP at Lv 5). VTuber collab. Accidentally released early ahead of v41.30 and briefly vaulted, then re-enabled on Aug 4, 2026 (Ironmouse’s VTuber debut anniversary) — available again as of Aug 4. If you collected it during its short early window, it returns to your collection automatically at the level you last had it. A brief extraction bug right after the return was hotfixed by Epic on Aug 5.',
    variants: { normal: R } },

  // ---- Datamined / upcoming (NOT yet released). `rumored` = leaked/unconfirmed;
  //      abilities & exact variant lines can change before launch. ----
  { id: 'wick', name: 'John Wick', icon: '🔫', rarity: 'Mythic', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-30',
    ability: 'Knocking or eliminating a player reveals nearby enemies on the map — the mark lasts longer each level (3 → 3.5 → 4 → 4.5 → 5s at Lv 5). Exclusive to Springfield Reloaded (The Simpsons on Reload).',
    variants: { normal: U } },
  { id: 'seven', name: 'Seven', icon: '7️⃣', rarity: 'Epic', dropRate: null, released: true,
    ability: 'Reveals enemy foot trails on the map for your whole squad — duration ramps by level (10 → 15 → 20 → 25 → 30s at max). The Seven faction collab, live in the Jul 16 (v41.20) update.',
    variants: { normal: R, gold: R, gummy: R, galaxy: R, holofoil: R } },
  { id: 'air', name: 'Air', icon: '🌬️', rarity: 'Epic', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-16',
    ability: 'A movement Sprite — increases sprint speed & jump height and removes fall damage. On Epic’s Jul 16 New Sprite Day schedule (DC Summer); power not fully confirmed by Epic.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U, holofoil: U } },
  { id: 'batman', name: 'Batman', icon: '🦇', rarity: 'Mythic', dropRate: null, released: false, rumored: true, releaseDate: '2026-07-16',
    ability: 'Deploy the Bat Cape midair for a glide / slow descent. DC “Hot Bat Summer” collab Sprite (Mythic), in Gold, Gummy, Galaxy & Holofoil, plus a Cube variant from New Sprite Day (Jul 23). Live in the Jul 16 (v41.20) update.',
    variants: { normal: U, gold: U, gummy: U, galaxy: U, holofoil: U, cube: R } },
  // Collab Mythics — live in v41.20 (Jul 16), found in Sprite Chests. Normal-only
  // for now (no Gold/Gummy/Galaxy/Holofoil line yet), like Burnt Peanut.
  { id: 'pollo', name: 'Pollo', icon: '🐔', rarity: 'Mythic', dropRate: null, released: true,
    ability: 'On an elimination, slowly replenish shield for you and nearby squad (duration grows per level). Mythic collab Sprite, live in the Jul 16 (v41.20) update.',
    variants: { normal: R } },
  { id: 'vinijr', name: 'Vini Jr.', icon: '⚽', rarity: 'Mythic', dropRate: null, released: true,
    ability: 'Sprint briefly to make your slide destructive; slide-kicking enemies boosts your fire rate & reload speed. Mythic collab Sprite (Vinícius Júnior), live in the Jul 16 (v41.20) update.',
    variants: { normal: R } },

  // ---- Chapter 7 Season 4 "Override" (Aug 20) — the NEXT generation, upcoming.
  //   `gen: 'c7s4'` files them under the new generation; all `rumored` until Epic
  //   ships them. The five Design-a-Sprite Sprites are Epic-revealed contest
  //   winners (abilities as their designers built them — Epic may tweak; rarity
  //   TBC); Sonic is the confirmed "Gaming Legends" headliner (ability not yet
  //   revealed). Deliberately NO `releaseDate` — exact per-Sprite dates aren't
  //   confirmed, so they stay Upcoming/Rumored until the Aug 20 staging flips
  //   them with real variants, rarities and abilities (don't auto-release guesses).
  { id: 'sonic', name: 'Sonic', icon: '🦔', rarity: 'Epic', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — the marquee Sonic collab (cube “backpack” redesign). Normal & Cheatmaster are live (Cheatmaster unlocks via the GOTTAGOFAST lobby code); Gold is still to come. Its exact in-game ability isn’t documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'pond', name: 'Pond', icon: '🐸', rarity: 'Epic', dropRate: null, released: false, rumored: true, gen: 'c7s4',
    ability: 'Design-a-Sprite winner (by Pine & Kiri): evolves egg → tadpole → frog, boosting movement speed & jump height and cutting fall damage as it grows. Abilities as designed — Epic may tweak; rarity TBC. Arrives in a mid-season Override update.',
    variants: { normal: U } },
  { id: 'bullet', name: 'Bullet', icon: '💥', rarity: 'Epic', dropRate: null, released: false, rumored: true, gen: 'c7s4',
    ability: 'Design-a-Sprite winner (by Enorull): ammo boxes give extra ammo. Abilities as designed — Epic may tweak; rarity TBC. Arrives in a mid-season Override update.',
    variants: { normal: U } },
  { id: 'honey', name: 'Honey', icon: '🍯', rarity: 'Epic', dropRate: null, released: false, rumored: true, gen: 'c7s4',
    ability: 'Design-a-Sprite winner (by Conejito_sam): spawns a beehive that swarms whoever damages you. Abilities as designed — Epic may tweak; rarity TBC. Arrives in a mid-season Override update.',
    variants: { normal: U } },
  { id: 'dumpster', name: 'Dumpster Dive', icon: '🦝', rarity: 'Epic', dropRate: null, released: false, rumored: true, gen: 'c7s4',
    ability: 'Design-a-Sprite winner (by StinkyPrincessGoose): a raccoon that finds you loot when you hide in dumpsters. Abilities as designed — Epic may tweak; rarity TBC. Arrives in a mid-season Override update.',
    variants: { normal: U } },
  { id: 'xray', name: 'X-Ray', icon: '🩻', rarity: 'Epic', dropRate: null, released: false, rumored: true, gen: 'c7s4',
    ability: 'Design-a-Sprite winner (by Avila215): reveals nearby players like the old medallion did. Abilities as designed — Epic may tweak; rarity TBC. Arrives in a mid-season Override update.',
    variants: { normal: U } },

  // ---- Override new-generation Sprites — LIVE in Chapter 7 Season 4, with
  //   official datamined art (Normal, Gold & the new "Cheatmaster" finish).
  //   Normal & Cheatmaster are out (Cheatmaster via Hack-the-Lobby codes); Gold
  //   is still rolling out, so it stays `U`. Exact in-game abilities aren't
  //   documented yet, so ability text stays descriptive. Storm Scout is in the
  //   files but not yet obtainable, so it stays unreleased. The Sonic collab
  //   ships under the internal "NarrowFlea" codename: Sonic / Tails / Shadow. ----
  { id: 'tails', name: 'Tails', icon: '🦊', rarity: 'Epic', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — Tails (Sonic collab), cube redesign. Normal & Cheatmaster are live (Cheatmaster via the IWANNAFLYHIGH lobby code); Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'shadow', name: 'Shadow', icon: '🦔', rarity: 'Epic', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — Shadow the Hedgehog (Sonic collab), cube redesign. Normal & Cheatmaster are live; Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'jazz', name: 'Jazz Jackrabbit', icon: '🐇', rarity: 'Legendary', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — Jazz Jackrabbit. Normal & Cheatmaster are live; Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'klombo', name: 'Klombo', icon: '🦕', rarity: 'Mythic', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — the Klombo creature. Normal & Cheatmaster are live; Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'bushranger', name: 'Bush Ranger', icon: '🌿', rarity: 'Rare', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — a woodland Bush Ranger. Normal & Cheatmaster are live; Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'victorycrown', name: 'Crown', icon: '👑', rarity: 'Mythic', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — the Crown. Normal & Cheatmaster are live; Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'jonesy', name: 'Jonesy', icon: '🕶️', rarity: 'Rare', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — Jonesy. Normal & Cheatmaster are live (Cheatmaster via the PLAY4ALL lobby code); Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'blaster', name: '8-Bit Blaster', icon: '🎮', rarity: 'Rare', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — a retro handheld “8-Bit Blaster”. Normal & Cheatmaster are live (Cheatmaster via the 8BITBLAST lobby code); Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'killswitch', name: 'Killswitch', icon: '🎯', rarity: 'Epic', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — a tactical “Killswitch”. Normal & Cheatmaster are live; Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'adventure', name: 'Adventure', icon: '🧭', rarity: 'Rare', dropRate: null, released: true, gen: 'c7s4',
    ability: 'Chapter 7 Season 4 “Override” Sprite — the Adventure Sprite. Normal & Cheatmaster are live (Cheatmaster via the BORN2PLAY lobby code); Gold is coming. Exact in-game ability not documented here yet.',
    variants: { normal: R, gold: U, cheatmaster: R } },
  { id: 'stormscout', name: 'Storm Scout', icon: '👿', rarity: 'Rare', dropRate: null, released: false, rumored: true, gen: 'c7s4',
    ability: 'Datamined Season 4 “Override” Sprite — a horned “Storm Scout”, in Normal/Gold/Cheatmaster. In the files but not yet obtainable; ability not yet confirmed by Epic.',
    variants: { normal: U, gold: U, cheatmaster: U } },
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
// Holofoil rolls out in waves: Water/Fire/Ghost/King/Striker (Jul 9),
// Air/Seven/Batman (Jul 16), Grim + the new Peely/Llama (v41.30, Jul 30). Earth,
// Duck, Dream, Demon, Punk, Zero Point, Fishy, Aura & Boss are still to come. So
// Holofoil is set per-sprite in `variants` above, not date-gated here.
// Keep this map for any FUTURE form that genuinely drops roster-wide on one date.
//
// Cube ("New Sprite Day", first wave Thu Jul 23, 2026 @ 9 AM ET) rolls out in
// WEEKLY BATCHES like Holofoil — ~6-8 Sprites first, the full ~18 over the coming
// New Sprite Days — NOT all at once. So DON'T blanket date-gate it here (that
// would over-claim on day one). Flip `cube: R` per-sprite as each wave is
// confirmed live, exactly as Holofoil is handled above.
export const FORM_RELEASE = {}
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

// Sprite generations — each season introduces a whole new generation; past
// generations stay in your collection (Epic confirmed Sprites are permanent).
// The Sprite Garden groups by these. To add the next gen: append an entry here
// and tag its Sprite types with `gen: '<id>'` — they file in automatically.
// Sprite generations. `current` = the generation in play in Battle Royale this
// season; `legacy` = kept in your collection / the in-game Sprite Garden but no
// longer used in BR matches (Epic: past gens "may return down the line").
export const GENERATIONS = [
  { id: 'c7s3', name: 'Chapter 7 Season 3', sub: 'Runners', released: true, legacy: true },
  { id: 'c7s4', name: 'Chapter 7 Season 4', sub: 'Override', released: true, current: true },
]
// The generation currently playable in Battle Royale (used for the "current vs
// Garden-archive/legacy" split). Update when a new season takes over BR.
export const CURRENT_GEN = 'c7s4'
export const GEN_MAP = Object.fromEntries(GENERATIONS.map((g) => [g.id, g]))

export function buildSpriteList() {
  const items = []
  for (const type of SPRITE_TYPES) {
    for (const [themeId, variantReleased] of Object.entries(type.variants)) {
      if (!THEME_MAP[themeId]) continue
      items.push({
        id: `${type.id}_${themeId}`,
        typeId: type.id,
        // Which Sprite generation this belongs to (each season adds a new one;
        // past generations stay — Epic confirmed Sprites are permanent). Defaults
        // to the current gen; set `gen` on a type to file it elsewhere.
        gen: type.gen || 'c7s3',
        typeName: type.name,
        icon: type.icon,
        rarity: type.rarity,
        dropRate: type.dropRate,
        ability: type.ability,
        themeId,
        // Official Epic sprite art at public/sprites/<id>.png; SpriteArt falls
        // back to generated SVG if the file is missing.
        // `import.meta.env` is undefined under plain Node (the prerender script
        // imports this module directly), so fall back to a root base path there.
        // Season 4 "Override" art ships as .webp (datamined assets); the Season 3
        // roster is .png. SpriteArt falls back to generated vector art either way.
        image: `${import.meta.env?.BASE_URL ?? '/'}sprites/${type.id}_${themeId}.${type.gen === 'c7s4' ? 'webp' : 'png'}`,
        // Leaked/unconfirmed: either the whole sprite is rumored, or it's a
        // rumored variant form (e.g. Cube/Quack) whose bonus isn't confirmed.
        // BUT a variant explicitly flagged R is confirmed live, so it never wears
        // the "rumored" badge even while its FORM is still rolling out in waves
        // (e.g. the wave-1 Cube Sprites once we flip them). Unreleased Cube
        // variants keep the badge until their own wave lands.
        rumored: !!(type.rumored || (THEME_MAP[themeId]?.rumored && !variantReleased)),
        tier: SPRITE_TIER[type.id] || null,
        // A variant is live if it's flagged R, or its form's release date has
        // arrived (e.g. Holofoil auto-releases across the roster on Jul 9) — but
        // only when the sprite type itself is released.
        released: type.released && (variantReleased || formLive(themeId)),
        unreleased: !(type.released && (variantReleased || formLive(themeId))),
        // Vaulted = launched then pulled by Epic (whole type, or a specific form).
        // It still shows (owners keep it) but wears a "Vaulted" badge and isn't
        // currently obtainable.
        vaulted: !!(type.vaulted || type.vaultedForms?.includes(themeId)),
      })
    }
  }
  return items
}

export const ALL_SPRITES = buildSpriteList()
export const TOTAL_COUNT = ALL_SPRITES.length
export const RELEASED_COUNT = ALL_SPRITES.filter((s) => s.released).length

// id → sprite lookup, for resolving stored ids (e.g. a profile's showcase list).
export const SPRITE_BY_ID = Object.fromEntries(ALL_SPRITES.map((s) => [s.id, s]))

// Estimated Sprite Dust to (re)summon a variant, by rarity. Normal = base cost;
// special variants (Gold/Gummy/Galaxy…) cost more. Community-sourced estimates.
// The July 24, 2026 hotfix cut VARIANT summon costs by ~33% ("up to 33% off",
// ahead of Shinier Hours) — community-cited endpoints: variant Rare 4000→2700
// and variant Mythic 15000→10000. Epic/Legendary weren't published exactly, so
// they're set by the same ~33% cut for a consistent table. Base costs were not
// reported as changed and are left as-is. All figures remain estimates.
const DUST_BASE = { Rare: 100, Epic: 3000, Legendary: 5000, Mythic: 7500 }
const DUST_VARIANT = { Rare: 2700, Epic: 4000, Legendary: 6700, Mythic: 10000 }
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
  wick: 'Leaked as exclusive to The Simpsons Fortnite Reload — reveal it on the Springfield map with the new Reload Portable Extractor, eliminate a player already carrying it, or find it in Reload chests. Unconfirmed until Epic’s patch notes.',
}
export function spriteSource(typeId) {
  if (SPRITE_SOURCE[typeId]) return SPRITE_SOURCE[typeId]
  // Season 4 "Override" replaced Sprite Chests with in-world acquisition (Cheat
  // Code activities) + the Cheatmaster finish via Hack the Lobby codes — so the
  // chest-based default would be wrong for the new generation.
  const t = SPRITE_TYPES.find((x) => x.id === typeId)
  if (t?.gen === 'c7s4') return 'A Chapter 7 Season 4 “Override” Sprite — earned through Season 4 play (in-world Cheat Code activities), not from Sprite Chests.'
  return 'Sprite Chests around the island — any chest can drop any Sprite (rarer ones less often), plus occasional mid-match spawns.'
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
