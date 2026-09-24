// Sprite variant themes, matching the in-game collectible lines. `bonus` is the
// gameplay perk the variant grants; `className` maps to a styled card-background
// treatment in index.css.
//
// Variant set + naming cross-referenced with the community tracker
// UltronCore/sprite-tracker (basic→Normal, candy→Gummy).
export const THEMES = [
  { id: 'normal', name: 'Normal', short: 'N', className: 'theme-normal', accent: '#8b93a7', bonus: 'Base sprite ability' },
  { id: 'gold', name: 'Gold', short: 'G', className: 'theme-gold', accent: '#f6c945', bonus: 'Bonus elimination XP' },
  { id: 'gummy', name: 'Gummy', short: 'Gy', className: 'theme-gummy', accent: '#ff5d8f', bonus: '+20% Sprite Dust on extraction' },
  { id: 'galaxy', name: 'Galaxy', short: 'Gx', className: 'theme-galaxy', accent: '#7b61ff', bonus: '+30% ammo when looting' },
  { id: 'gem', name: 'Gem', short: 'Ge', className: 'theme-gem', accent: '#27e0c4', bonus: 'Take 30% less fall damage (stacks with the Sprite’s base ability). Live from New Sprite Day, Aug 6, 2026.' },
  { id: 'holofoil', name: 'Holofoil', short: 'H', className: 'theme-holofoil', accent: '#c44dff', bonus: '+5% squad chance to find rare (Gold/Gummy/Galaxy) Sprites from chests' },
  // Cube shipped in waves during Season 3 (from Jul 23) and is now archived like
  // the rest of that generation. `rumored: true` is kept as a release-GATE so only
  // the Sprites with an explicit Cube variant count as having it, rather than the
  // form auto-releasing across the whole roster.
  { id: 'cube', name: 'Cube', short: 'Cu', className: 'theme-cube', accent: '#8a2be2', bonus: 'Overdrive (speed boost) while you’re in the Storm.', rumored: true },
  { id: 'quack', name: 'Quack', short: 'Qk', className: 'theme-quack', accent: '#ffcf4d', bonus: 'Shares 50% of the XP it earns with every other Sprite in your match — levels your collection faster. Earned via Sprite Mastery rewards, not from chests.', mastery: true },
  // Cheatmaster — the Chapter 7 Season 4 "Override" premium finish (glitch/pixel
  // theme). LIVE since the Aug 20 launch, but unlocked PER-SPRITE by specific
  // Hack-the-Lobby codes (Sonic = GOTTAGOFAST, etc.), so `rumored: true` stays as a
  // release-GATE: only Sprites with a confirmed code / explicit release count as
  // live, rather than the whole finish auto-releasing across the roster. `noSummon`:
  // it's code-unlocked, not Dust-summoned, so it's excluded from summon math.
  // (Quack is the same idea via `mastery`.)
  { id: 'cheatmaster', name: 'Cheatmaster', short: 'Ch', className: 'theme-cheatmaster', accent: '#41f08a', bonus: 'Season 4 “Override” premium finish — unlocked per-Sprite by a specific Hack the Lobby code, not Dust-summoned. A cosmetic finish: it keeps the Sprite’s base ability.', rumored: true, noSummon: true },
  // Loot Hacker — a second Chapter 7 Season 4 "Override" finish (blue circuit /
  // hologram theme), distinct from the green Cheatmaster. Went live in the
  // Sep 10, 2026 update: 14 new Loot Hacker variants entered the loot pool
  // (15 incl. the already-out Crown). `noSummon: true` keeps it out of
  // "Dust to complete" math (it isn't a Dust summon).
  { id: 'loothacker', name: 'Loot Hacker', short: 'LH', className: 'theme-loothacker', accent: '#4aa3ff', bonus: 'Season 4 “Override” finish. Holding a Loot Hacker Sprite gives a +20% (1.2×) chance of Loot Hack items from Chests.', noSummon: true },
  // Bounty Hunter — a third Chapter 7 Season 4 "Override" finish, DATAMINED in the
  // v42.20 update (Sep 17). In-game description: "Chance to find Sprites when
  // eliminating opponents." It only gains Sprite XP from eliminations (unless a
  // Sprite has special XP rules), so it levels by fighting — like Crown's Crown
  // Wins. `rumored: true` is a release-GATE (only Sprites with an explicit Bounty
  // Hunter variant count as having it, rather than the finish auto-releasing
  // roster-wide); `noSummon: true` keeps it out of "Dust to complete" math. Epic
  // ships variants gradually over the following weeks, so each stays U until live.
  // (Datamine: FireMonkey / Vice.)
  { id: 'bountyhunter', name: 'Bounty Hunter', short: 'BH', className: 'theme-bountyhunter', accent: '#ff7a2f', bonus: 'Season 4 “Override” finish (v42.20, live Sep 24). Chance to find Sprites when eliminating opponents. Only gains Sprite XP from eliminations, so it levels by fighting rather than from chests.', noSummon: true },
]

export const THEME_MAP = Object.fromEntries(THEMES.map((t) => [t.id, t]))
export const THEME_ORDER = THEMES.map((t) => t.id)

// ROUGH ESTIMATE — how likely a given Sprite pull rolls each finish, relative to
// the Normal form (Normal = 1). Epic does NOT publish finish-roll odds, so these
// are deliberately approximate placeholders, not measured values. The Chest-luck
// calculator multiplies the base (Normal-form) drop rate by this factor to
// estimate the odds of pulling a *specific* finish. Tune here if better community
// numbers surface — this is the single source of truth for that math.
export const FINISH_ODDS_FACTOR = {
  normal: 1,
  gold: 0.15,
  gummy: 0.12,
  galaxy: 0.08,
  holofoil: 0.03,
  gem: 0.02,
  cube: 0.02,
  // Quack is a Sprite Mastery reward (unlocked by mastering N Sprites), NOT a
  // chest pull — null keeps it out of the Chest-luck picker in both the app and
  // the static pages, which both filter finishes on `FINISH_ODDS_FACTOR[f] != null`.
  quack: null,
  // Cheatmaster odds aren't known yet — null keeps it out of the Chest-luck picker
  // until Epic (or the community) surfaces a roll rate.
  cheatmaster: null,
  // Loot Hacker is live (Sep 10) but Epic/the community haven't surfaced a roll
  // rate for it — null keeps it out of the Chest-luck picker until one does.
  loothacker: null,
  // Bounty Hunter is datamined (v42.20) and not chest-summoned (it levels from
  // eliminations) — null keeps it out of the Chest-luck picker.
  bountyhunter: null,
  rift: 0.05,
}
