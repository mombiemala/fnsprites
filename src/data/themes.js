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
  // Event date is Epic-confirmed (Jul 23), but which Sprites get Cube each wave is
  // still unconfirmed AND `rumored: true` is what keeps the leaked-Sprite loop from
  // auto-releasing Cube early — so it stays true until each wave actually lands.
  { id: 'cube', name: 'Cube', short: 'Cu', className: 'theme-cube', accent: '#8a2be2', bonus: 'Overdrive (speed boost) while you’re in the Storm.', rumored: true },
  { id: 'quack', name: 'Quack', short: 'Qk', className: 'theme-quack', accent: '#ffcf4d', bonus: 'Shares 50% of the XP it earns with every other Sprite in your match — levels your collection faster. Earned via Sprite Mastery rewards, not from chests.', mastery: true },
  // Cheatmaster — the Chapter 7 Season 4 "Override" finish (glitch/pixel theme).
  // Datamined; its bonus and roll odds aren't confirmed yet, so `rumored: true`
  // keeps it from auto-releasing (and reads as leaked) until Epic reveals it.
  // `noSummon`: unlocked another way (a Hack-the-Lobby code), not by spending
  // Sprite Dust — so it's excluded from "Dust to complete" math. (Quack is the
  // same idea via `mastery`.)
  { id: 'cheatmaster', name: 'Cheatmaster', short: 'Ch', className: 'theme-cheatmaster', accent: '#41f08a', bonus: 'Season 4 “Override” finish — unlocked by a Hack the Lobby code, not summoned. Bonus not yet confirmed by Epic (datamined).', rumored: true, noSummon: true },
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
  rift: 0.05,
}
