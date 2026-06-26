// Sprite variant themes, accurate to the in-game collectible lines
// (as of the Jun 25, 2026 update). `bonus` is the gameplay perk the variant
// grants; `className` maps to a styled "art" treatment in index.css.
//
// Sources cross-referenced: fortnite.gg/sprites, spritelocker.com, and the
// community trackers UltronCore/sprite-tracker & MRSessions/fn-sprite-checklist.
export const THEMES = [
  { id: 'normal', name: 'Normal', short: 'N', className: 'theme-normal', accent: '#8b93a7', bonus: 'Base sprite ability' },
  { id: 'gold', name: 'Gold', short: 'G', className: 'theme-gold', accent: '#f6c945', bonus: 'Bonus elimination XP' },
  { id: 'gummy', name: 'Gummy', short: 'Gy', className: 'theme-gummy', accent: '#ff5d8f', bonus: '+10% Sprite Dust on extraction' },
  { id: 'galaxy', name: 'Galaxy', short: 'Gx', className: 'theme-galaxy', accent: '#7b61ff', bonus: '+20% ammo when looting' },
  { id: 'gem', name: 'Gem', short: 'Ge', className: 'theme-gem', accent: '#27e0c4', bonus: '−30% fall damage' },
  { id: 'holofoil', name: 'Holofoil', short: 'H', className: 'theme-holofoil', accent: '#c44dff', bonus: 'Better odds to find rare sprites' },
  // Special one-off variants tied to specific sprites
  { id: 'cube', name: 'Cube', short: 'C', className: 'theme-cube', accent: '#b14dff', bonus: 'Special Kevin/Cube cosmetic variant' },
  { id: 'quack', name: 'Quack', short: 'Q', className: 'theme-quack', accent: '#ffd23f', bonus: 'Special Quack cosmetic variant' },
]

export const THEME_MAP = Object.fromEntries(THEMES.map((t) => [t.id, t]))

// Ordering used for grouping / display.
export const THEME_ORDER = THEMES.map((t) => t.id)
