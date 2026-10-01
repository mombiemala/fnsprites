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
  patch: 'v42.30',
  rotationStart: '2026-10-01',
  nextRefresh: '2026-10-08', // next rotation expected ~weekly; the in-game timer is authoritative
  maxLevel: 6, // each item unlocks at L1, then upgrades up to L6 for higher odds/rarity
  source: 'Epic (Fortnite v42.30 Fortnitemares) · FNAssist',
  sourceUrl: 'https://x.com/FN_Assist/status/2105577166163603735',
}

// Current rotation (Oct 1, v42.30 — Fortnitemares). `role` describes what the item
// is; we don't assert an exact rarity/cost we can't source. (The Sep 17 pool —
// Rocket Ram, Reaper Sniper Rifle, Mammoth Pistol, Hyperburst Pistol, Deadeye DMR,
// Flowberry Fizz — rotated out.) Note: v42.30 also added the Loot Hacker Sprite
// finish to the Loot Hack menu (a Sprite variant, not a weapon in this pool).
export const LOOT_HACK_ROTATION = [
  { name: 'Infantry Rifle', role: 'Assault rifle', note: 'Steady semi-auto rifle for controlled mid-range fire.' },
  { name: 'Light Machine Gun (LMG)', role: 'LMG', note: 'High-capacity suppressive fire — great for shredding builds.' },
  { name: 'Pumpkin Launcher', role: 'Explosive', note: 'Fortnitemares explosive launcher — the Halloween standout.' },
  { name: 'Last Call', role: 'Weapon', note: 'New to the Loot Hack pool this Fortnitemares rotation.' },
  { name: 'Slap Candy Corn', role: 'Consumable', note: 'Halloween Slap consumable — a candy-corn energy/mobility boost.' },
]

// How the system works — short, factual bullets reused by the app card + SEO page.
export const LOOT_HACK_HOW = [
  'Open the Loot Hack (Override) menu in the Battle Royale lobby and spend Sprite Dust to add a weapon to your personal chest loot pool.',
  'Each item unlocks at Level 1 (adds it to your pool), then upgrades up to Level 6 — higher levels raise how often, and at what rarity, it shows up in your chests.',
  'Upgrade costs climb per tier, so maxing several items takes a lot of Dust. You can reset upgrades to reclaim Dust, so it’s safe to experiment.',
  'Earn Sprite Dust by catching and extracting Sprites, redeeming duplicate Sprite codes, and some Admin Panel / Lobby Hack codes.',
]
