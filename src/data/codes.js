// "Hack the Lobby" admin-panel codes — Chapter 7 Season 4 "Override".
//
// Override's theme is "break the rules": in the Battle Royale lobby you open the
// Admin Panel (the "…" / admin prompt, top-right), type a code, and Submit —
// a "LOBBY HACK ACTIVATED!" screen confirms it, then you Claim/Equip. Codes are
// one-time use per account, case-SENSITIVE (enter exactly as written), and stay
// claimable until you redeem them. Some are tied to real-world / regional
// promos and EXPIRE when that campaign ends. Epic drips new codes out all season.
//
// Redeeming a Sprite code you already own grants Sprite Dust instead (~10,000).
//
// `status`: 'working' (widely reported live) · 'regional' (working but locale/
//   campaign-locked, will expire) · 'rumored' (single-source, unverified).
// `spriteId` links a Cheatmaster Sprite unlock to its entry in the tracker.
// ALWAYS verify a code in-game before trusting it — these are community-sourced.

export const CODES_INTRO = {
  title: 'Hack the Lobby — Admin Panel codes',
  how: 'In the Battle Royale lobby, open the Admin Panel (the admin/“…” prompt in the top-right), type a code exactly as shown, and hit Submit. A “LOBBY HACK ACTIVATED!” screen confirms it — then Claim/Equip your reward.',
  rules: [
    'Case-sensitive — type it EXACTLY (all caps as shown).',
    'One-time use per account; a code stays claimable until you redeem it.',
    'Redeeming a Sprite you already own grants ~10,000 Sprite Dust instead.',
    'Regional / promo codes expire when their campaign ends.',
  ],
}

export const LOBBY_CODES = [
  // --- Cheatmaster Sprite unlocks (the headline rewards) ---
  { code: 'GOTTAGOFAST', unlocks: 'Cheatmaster Sonic Sprite', type: 'sprite', spriteId: 'sonic', status: 'working', source: 'Game8' },
  { code: 'IWANNAFLYHIGH', unlocks: 'Cheatmaster Tails Sprite', type: 'sprite', spriteId: 'tails', status: 'working', source: 'Game8' },
  { code: '8BITBLAST', unlocks: 'Cheatmaster 8-Bit Blaster Sprite', type: 'sprite', spriteId: 'blaster', status: 'working', source: 'Dexerto' },
  { code: 'PLAY4ALL', unlocks: 'Cheatmaster Jonesy Sprite', type: 'sprite', spriteId: 'jonesy', status: 'working', source: 'Dexerto' },
  { code: 'BORN2PLAY', unlocks: 'Cheatmaster Adventure Sprite', type: 'sprite', spriteId: 'adventure', status: 'working', source: 'PCGamesN' },

  // --- Rewards, gizmos & effects ---
  { code: 'DONTBLOCKME', unlocks: 'Tetris-block transform effect', type: 'effect', status: 'working', source: 'Loolo_WRLD' },
  { code: 'LETSBLOCKANDROLL', unlocks: 'Tetris-block transform effect', type: 'effect', status: 'working', source: 'Loolo_WRLD' },
  { code: 'TAKEYOURHEART', unlocks: '2× Extraction Accelerators (Persona 5 / Joker)', type: 'reward', status: 'working', source: 'GamesRadar' },
  { code: 'SURVIVETHENIGHT', unlocks: '2× Cheat Code Locators (99 Nights)', type: 'reward', status: 'working', source: 'GamesRadar' },
  { code: 'PERFECTORDER', unlocks: '4× spicy-taco gizmos (Geno)', type: 'reward', status: 'working', source: 'GamesRadar' },

  // --- Regional / promo (will expire with the campaign) ---
  { code: 'O2OVERRIDE', unlocks: 'Llama supply + 5 portable extractors', type: 'reward', status: 'regional', region: 'O2 promo', source: 'GamesRadar' },
  { code: 'MAGILUME', unlocks: '2,000 Sprite Dust', type: 'reward', status: 'regional', region: 'Brazil (WhatsApp)', source: 'GamesRadar' },
  { code: 'BEMOREALIEN', unlocks: '“Override Ready” loading screen', type: 'cosmetic', status: 'regional', region: 'Alienware', source: 'GamesRadar' },

  // --- Rumored / single-source (verify before trusting) ---
  { code: 'OVERRIDEXP', unlocks: '40,000 XP', type: 'reward', status: 'rumored', source: 'aggregated summary' },
  { code: 'CHISPAMBO', unlocks: '2,000 Sprite Dust', type: 'reward', status: 'rumored', region: 'regional', source: 'aggregated summary' },
  { code: 'PERLIMPINPIN', unlocks: '2,000 Sprite Dust', type: 'reward', status: 'rumored', region: 'regional', source: 'aggregated summary' },
  { code: 'ABGESTAUBT', unlocks: '2,000 Sprite Dust', type: 'reward', status: 'rumored', region: 'Germany', source: 'aggregated summary' },
]
