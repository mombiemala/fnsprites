// Sprite variant themes, matching the in-game collectible lines. `bonus` is the
// gameplay perk the variant grants; `className` maps to a styled card-background
// treatment in index.css.
//
// Variant set + naming cross-referenced with the community tracker
// UltronCore/sprite-tracker (basic→Normal, candy→Gummy).
export const THEMES = [
  { id: 'normal', name: 'Normal', short: 'N', className: 'theme-normal', accent: '#8b93a7', bonus: 'Base sprite ability' },
  { id: 'gold', name: 'Gold', short: 'G', className: 'theme-gold', accent: '#f6c945', bonus: 'Bonus elimination XP' },
  { id: 'gummy', name: 'Gummy', short: 'Gy', className: 'theme-gummy', accent: '#ff5d8f', bonus: '+10% Sprite Dust on extraction' },
  { id: 'galaxy', name: 'Galaxy', short: 'Gx', className: 'theme-galaxy', accent: '#7b61ff', bonus: '+20% ammo when looting' },
  { id: 'gem', name: 'Gem', short: 'Ge', className: 'theme-gem', accent: '#27e0c4', bonus: '−30% fall damage' },
  { id: 'holofoil', name: 'Holofoil', short: 'H', className: 'theme-holofoil', accent: '#c44dff', bonus: '+5% squad chance to find rare (Gold/Gummy/Galaxy) Sprites from chests' },
  { id: 'cube', name: 'Cube', short: 'Cu', className: 'theme-cube', accent: '#8a2be2', bonus: 'Bonus not yet revealed', rumored: true },
  { id: 'quack', name: 'Quack', short: 'Qk', className: 'theme-quack', accent: '#ffcf4d', bonus: 'Bonus not yet revealed', rumored: true },
  { id: 'rift', name: 'Rift', short: 'R', className: 'theme-rift', accent: '#36c5ff', bonus: 'Special Rift variant' },
]

export const THEME_MAP = Object.fromEntries(THEMES.map((t) => [t.id, t]))
export const THEME_ORDER = THEMES.map((t) => t.id)
