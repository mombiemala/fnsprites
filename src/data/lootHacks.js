// Loot Hacks — the rotating set of weapons/items you unlock with Sprite Dust to
// add to (and upgrade within) your PERSONAL Battle Royale chest loot pool. This
// is a different system from the "Loot Hacker" Sprite finish — here you're
// spending Dust to bias what your own chests drop.
//
// The set ROTATES roughly weekly (the in-game Loot Hack screen shows a refresh
// timer). Keep this file current when a new rotation lands — update the items,
// `rotationStart` and `nextRefresh`, and add a source. Costs are deliberately
// qualitative: Epic doesn't publish exact per-tier Dust numbers and they differ
// per weapon, so we describe the mechanic (unlock + up to 6 upgrade levels)
// rather than invent figures. Verified/sourced only — same rule as codes & news.

export const LOOT_HACK_META = {
  patch: 'v42.10',
  rotationStart: '2026-09-03',
  nextRefresh: '2026-09-17', // next expected rotation (in-game timer is authoritative)
  maxLevel: 6, // each item unlocks at L1, then upgrades up to L6 for higher odds/rarity
  source: 'FNBRintel · accountshark · esports.gg',
  sourceUrl: 'https://x.com/FNBRintel/status/2095428841955094532',
}

// Current rotation (Sep 3 → ~Sep 17, v42.10). `role` describes what the weapon
// is; we don't assert an exact rarity/cost we can't source.
export const LOOT_HACK_ROTATION = [
  { name: 'Caduceus Staff', role: 'Healing / utility', note: 'Team-healing endgame tool — the standout unlock this rotation.' },
  { name: 'Scorpion’s Combat Kit', role: 'Close-range kit', note: 'Aggressive close-quarters option.' },
  { name: 'Wrecker Revolver', role: 'Revolver', note: 'Hard-hitting single-shot pistol.' },
  { name: 'Deadeye Assault Rifle', role: 'Assault rifle', note: 'Reliable mid-range AR.' },
  { name: 'Holo Twister Assault Rifle', role: 'Assault rifle', note: 'Alternate AR pick for the pool.' },
]

// How the system works — short, factual bullets reused by the app card + SEO page.
export const LOOT_HACK_HOW = [
  'Open the Loot Hack (Override) menu in the Battle Royale lobby and spend Sprite Dust to add a weapon to your personal chest loot pool.',
  'Each item unlocks at Level 1 (adds it to your pool), then upgrades up to Level 6 — higher levels raise how often, and at what rarity, it shows up in your chests.',
  'Upgrade costs climb per tier, so maxing several items takes a lot of Dust. You can reset upgrades to reclaim Dust, so it’s safe to experiment.',
  'Earn Sprite Dust by catching and extracting Sprites, redeeming duplicate Sprite codes, and some Admin Panel / Lobby Hack codes.',
]
