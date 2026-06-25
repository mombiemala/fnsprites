// Sprite themes — the collectible variants every sprite type can appear in.
// `className` maps to a styled "art" treatment defined in index.css.
export const THEMES = [
  { id: 'basic', name: 'Basic', short: 'B', className: 'theme-basic', accent: '#8b93a7' },
  { id: 'gold', name: 'Gold', short: 'G', className: 'theme-gold', accent: '#f6c945' },
  { id: 'gummy', name: 'Gummy', short: 'Gy', className: 'theme-gummy', accent: '#ff5d8f' },
  { id: 'galaxy', name: 'Galaxy', short: 'Gx', className: 'theme-galaxy', accent: '#7b61ff' },
  { id: 'gem', name: 'Gem', short: 'Ge', className: 'theme-gem', accent: '#27e0c4' },
  { id: 'holofoil', name: 'Holofoil', short: 'H', className: 'theme-holofoil', accent: '#c4f' },
  { id: 'rift', name: 'Rift', short: 'R', className: 'theme-rift', accent: '#36c5ff' },
]

export const THEME_MAP = Object.fromEntries(THEMES.map((t) => [t.id, t]))
