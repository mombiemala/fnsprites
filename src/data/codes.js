// "Hack the Lobby" admin-panel codes — Chapter 7 Season 4 "Override".
//
// Override's theme is "break the rules": in the Battle Royale lobby you open the
// Admin Panel (the "…" / admin prompt, top-right), type a code, and Submit —
// a "LOBBY HACK ACTIVATED!" screen confirms it, then you Claim/Equip. Codes are
// NOT case-sensitive (capitalization doesn't matter — we show them in caps for
// readability). Most work ONCE per account and stay claimable all season; the two
// Tetris-block codes are the exception — they're reusable. Some are tied to regional
// promos and EXPIRE when that campaign ends. Epic drips new codes out all season.
//
// Redeeming a Sprite code you already own grants Sprite Dust instead (~10,000).
//
// `status`: 'working' (widely reported live) · 'regional' (working but locale/
//   campaign-locked, will expire) · 'rumored' (single-source, unverified).
// `category` buckets a code by WHAT IT GIVES YOU (fortnite.gg-style grouping) —
//   see CODE_CATEGORIES; status stays a per-code badge so freshness is still clear.
// `spriteId` links a Cheatmaster Sprite unlock to its entry in the tracker.
// ALWAYS verify a code in-game before trusting it — these are community-sourced.

// Reward-type buckets, in display order. Grouping by "what you get" (like
// fortnite.gg) is easier to scan than grouping by status — a player usually
// comes here for a Sprite, or for XP, not for "the regional ones."
export const CODE_CATEGORIES = [
  { key: 'sprites', icon: '🧩', label: 'Cheatmaster Sprites', blurb: 'Permanent Sprite unlocks. Redeem one you already own for ~10,000 Sprite Dust.' },
  { key: 'gizmos', icon: '✨', label: 'Gizmos & effects', blurb: 'Lobby transforms and in-match gizmos.' },
  { key: 'boosts', icon: '⚡', label: 'Boosts & XP', blurb: 'Consumables, extractors and XP.' },
  { key: 'dust', icon: '🔷', label: 'Sprite Dust', blurb: 'Instant Sprite Dust to summon the finishes you want.' },
  { key: 'screens', icon: '🖼️', label: 'Loading screens', blurb: 'Cosmetic lobby unlocks.' },
]

export const CODES_INTRO = {
  title: 'Lobby Hacks — Admin Panel codes',
  how: 'In the Battle Royale lobby, open the Admin Panel (the admin/“…” prompt in the top-right), type a code (capitalization doesn’t matter), and hit Submit. A “LOBBY HACK ACTIVATED!” screen confirms it — then Claim/Equip your reward.',
  rules: [
    'Not case-sensitive — capitalization doesn’t matter (we show them in caps for readability).',
    'Most codes work once and stay claimable all season; the two Tetris-block codes are reusable.',
    'Redeeming a Sprite you already own grants ~10,000 Sprite Dust instead.',
    'Regional / promo codes (e.g. O2, Alienware) can be locale-locked and expire when the campaign ends.',
  ],
}

// Grouped by reward `category` (see CODE_CATEGORIES); `status` is an independent
// per-code badge (working / regional / rumored), so an expiring or unverified code
// still sits in its reward bucket but is clearly flagged.
export const LOBBY_CODES = [
  // --- 🧩 Cheatmaster Sprite unlocks (the headline rewards) ---
  { code: 'GOTTAGOFAST', unlocks: 'Cheatmaster Sonic Sprite', type: 'sprite', category: 'sprites', spriteId: 'sonic', status: 'working', source: 'Game8' },
  { code: 'IWANNAFLYHIGH', unlocks: 'Cheatmaster Tails Sprite', type: 'sprite', category: 'sprites', spriteId: 'tails', status: 'working', source: 'Game8' },
  { code: '8BITBLAST', unlocks: 'Cheatmaster 8-Bit Blaster Sprite', type: 'sprite', category: 'sprites', spriteId: 'blaster', status: 'working', source: 'Dexerto' },
  { code: 'PLAY4ALL', unlocks: 'Cheatmaster Jonesy Sprite', type: 'sprite', category: 'sprites', spriteId: 'jonesy', status: 'working', source: 'Dexerto' },
  { code: 'BORN2PLAY', unlocks: 'Cheatmaster Adventure Sprite', type: 'sprite', category: 'sprites', spriteId: 'adventure', status: 'working', source: 'PCGamesN' },

  // --- ✨ Gizmos & effects ---
  // The two Tetris-block codes are the only REUSABLE codes — they re-trigger the
  // transform every time instead of granting a one-time item.
  { code: 'DONTBLOCKME', unlocks: 'Tetris-block transform effect', type: 'effect', category: 'gizmos', status: 'working', repeatable: true, source: 'Loolo_WRLD' },
  { code: 'LETSBLOCKANDROLL', unlocks: 'Tetris-block transform effect', type: 'effect', category: 'gizmos', status: 'working', repeatable: true, source: 'Loolo_WRLD' },
  { code: 'PERFECTORDER', unlocks: '4× spicy-taco gizmos (Geno)', type: 'reward', category: 'gizmos', status: 'working', source: 'GamesRadar' },

  // --- ⚡ Boosts & XP (consumables, extractors, XP) ---
  { code: 'TAKEYOURHEART', unlocks: '2× Extraction Accelerators (Persona 5 / Joker)', type: 'reward', category: 'boosts', status: 'working', source: 'GamesRadar' },
  { code: 'SURVIVETHENIGHT', unlocks: '2× Cheat Code Locators (99 Nights)', type: 'reward', category: 'boosts', status: 'working', source: 'GamesRadar' },
  { code: 'FINDITCHAT', unlocks: '2× Cheat Code Locators', type: 'reward', category: 'boosts', status: 'working', source: 'community list' },
  { code: 'OVERRIDEXP', unlocks: '40,000 XP', type: 'reward', category: 'boosts', status: 'working', source: 'community list' },
  { code: 'O2OVERRIDE', unlocks: 'Llama supply + 5 portable extractors', type: 'reward', category: 'boosts', status: 'regional', region: 'O2 promo', source: 'GamesRadar' },

  // --- 🔷 Sprite Dust (2,000 each; listed globally by outlets, no regional gate) ---
  { code: 'MAGILUME', unlocks: '2,000 Sprite Dust', type: 'reward', category: 'dust', status: 'working', source: 'community list' },
  { code: 'CHISPAMBO', unlocks: '2,000 Sprite Dust', type: 'reward', category: 'dust', status: 'working', source: 'community list' },
  { code: 'PERLIMPINPIN', unlocks: '2,000 Sprite Dust', type: 'reward', category: 'dust', status: 'working', source: 'community list' },
  { code: 'ABGESTAUBT', unlocks: '2,000 Sprite Dust', type: 'reward', category: 'dust', status: 'working', source: 'community list' },

  // --- 🖼️ Loading screens ---
  { code: 'REACHYOURIMPOSSIBLE', unlocks: 'Block Party loading screen', type: 'cosmetic', category: 'screens', status: 'working', source: 'community list' },
  { code: 'BEMOREALIEN', unlocks: '“Override Ready” loading screen', type: 'cosmetic', category: 'screens', status: 'regional', region: 'Alienware', source: 'GamesRadar' },
]
