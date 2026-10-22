// Loot Hacks — the rotating set of weapons/items you unlock with Sprite Dust to
// add to (and upgrade within) your PERSONAL Battle Royale chest loot pool. This
// is a different system from the "Loot Hacker" Sprite finish — here you're
// spending Dust to bias what your own chests drop.
//
// The set ROTATES with major updates (not strictly weekly — the Oct 22 window
// passed with no change; the in-game Loot Hack screen shows the real refresh
// timer). Keep this file current when a new rotation lands — update the items,
// `rotationStart` and `nextRefresh`, and add a source. Costs are deliberately
// qualitative: Epic doesn't publish exact per-tier Dust numbers and they differ
// per weapon, so we describe the mechanic (unlock + up to 6 upgrade levels)
// rather than invent figures. Verified/sourced only — same rule as codes & news.

export const LOOT_HACK_META = {
  patch: 'v42.40',
  rotationStart: '2026-10-15',
  nextRefresh: '2026-10-29', // no rotation landed Oct 22; the pool holds until the next major update (v42.50, est. Oct 29) — the in-game timer is authoritative
  maxLevel: 6, // each item unlocks at L1, then upgrades up to L6 for higher odds/rarity
  source: 'Epic (Fortnite v42.40) · FRVR · fortnitenews · The Click',
  sourceUrl: 'https://fortnitenews.com/fortnite-v42-40-is-live-bee-swarms-sprite-thieves-and-a-freddy-powered-power-hours/',
}

// Current rotation (Oct 15, v42.40). `role` describes what the item is; we don't
// assert an exact rarity/cost we can't source. (The Oct 1 v42.30 pool — Infantry
// Rifle, LMG, Pumpkin Launcher, Last Call, Slap Candy Corn — rotated out.) This
// update also vaulted Super Shot, Big Boom, Action Hero & Healing Overdrive from
// the Match Overrides. Note: the Loot Hacker Sprite finish is also in the Loot
// Hack menu (a Sprite variant, not a weapon in this pool).
export const LOOT_HACK_ROTATION = [
  { name: 'Thorne’s Vampiric Blade', role: 'Melee', note: 'A lifesteal blade — heal as you deal melee damage.' },
  { name: 'Finger Guns', role: 'Weapon', note: 'New to the Loot Hack pool this rotation.' },
  { name: 'Gatekeeper Shotgun', role: 'Shotgun', note: 'Hard-hitting shotgun (vaulted from Reload, still on Nitemare Island).' },
  { name: 'Hunting Rifle', role: 'Marksman rifle', note: 'No-scope precision rifle for mid/long range.' },
  { name: 'Slap Splash', role: 'Consumable', note: 'Throw near you or teammates for Health/Shields plus a temporary stamina-free sprint (Slap effect).' },
]

// How the system works — short, factual bullets reused by the app card + SEO page.
export const LOOT_HACK_HOW = [
  'Open the Loot Hack (Override) menu in the Battle Royale lobby and spend Sprite Dust to add a weapon to your personal chest loot pool.',
  'Each item unlocks at Level 1 (adds it to your pool), then upgrades up to Level 6 — higher levels raise how often, and at what rarity, it shows up in your chests.',
  'Upgrade costs climb per tier, so maxing several items takes a lot of Dust. You can reset upgrades to reclaim Dust, so it’s safe to experiment.',
  'Earn Sprite Dust by catching and extracting Sprites, redeeming duplicate Sprite codes, and some Admin Panel / Lobby Hack codes.',
]
