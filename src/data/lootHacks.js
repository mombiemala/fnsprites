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
  patch: 'v42.20',
  rotationStart: '2026-09-17',
  nextRefresh: '2026-09-24', // next expected rotation (in-game timer is authoritative)
  maxLevel: 6, // each item unlocks at L1, then upgrades up to L6 for higher odds/rarity
  source: 'Epic (Fortnite / X, official list) · HYPEX · ShiinaBR',
  sourceUrl: 'https://x.com/Fortnite/status/2099906350671450438',
}

// Current rotation (Sep 17 → ~Sep 24, v42.20) — the six items Epic posted for the
// refresh. `role` describes what the item is; we don't assert an exact rarity/cost
// we can't source. (The Sep 3 pool — Caduceus Staff, Scorpion’s Combat Kit,
// Wrecker Revolver, Deadeye AR, Holo Twister AR — rotated out.)
export const LOOT_HACK_ROTATION = [
  { name: 'Rocket Ram', role: 'Mobility / utility', note: 'Ram-launch tool for repositioning and cracking builds — the returning standout.' },
  { name: 'Reaper Sniper Rifle', role: 'Sniper', note: 'Hard-hitting long-range sniper.' },
  { name: 'Mammoth Pistol', role: 'Pistol', note: 'Heavy single-shot pistol.' },
  { name: 'Hyperburst Pistol', role: 'Pistol', note: 'Burst-fire sidearm.' },
  { name: 'Deadeye DMR', role: 'Marksman rifle', note: 'Precision mid-to-long-range DMR.' },
  { name: 'Flowberry Fizz', role: 'Consumable', note: 'Mobility + effect consumable to add to your pool.' },
]

// How the system works — short, factual bullets reused by the app card + SEO page.
export const LOOT_HACK_HOW = [
  'Open the Loot Hack (Override) menu in the Battle Royale lobby and spend Sprite Dust to add a weapon to your personal chest loot pool.',
  'Each item unlocks at Level 1 (adds it to your pool), then upgrades up to Level 6 — higher levels raise how often, and at what rarity, it shows up in your chests.',
  'Upgrade costs climb per tier, so maxing several items takes a lot of Dust. You can reset upgrades to reclaim Dust, so it’s safe to experiment.',
  'Earn Sprite Dust by catching and extracting Sprites, redeeming duplicate Sprite codes, and some Admin Panel / Lobby Hack codes.',
]
