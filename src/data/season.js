// Season timing — single source of truth for the current/next season and the
// transition. Epic rarely confirms the end date until ~2 weeks out, so the end
// is an ESTIMATE (endConfirmed:false) until then. Update these when Epic locks
// the date or when Season 5 details are confirmed; the countdown card, the
// season-transition page and the transition banner all read from here.

export const SEASON = {
  current: {
    id: 'c7s4',
    name: 'Override',
    label: 'Chapter 7 Season 4',
    start: '2026-08-20',
  },
  // Community/outlet estimate (Fortnite.GG, Vice) — not yet Epic-confirmed.
  endEstimate: '2026-11-01',
  endConfirmed: false,
  next: {
    label: 'Chapter 7 Season 5',
    startEstimate: '2026-11-01',
  },
  source: 'Fortnite.GG / Vice',
  sourceUrl: 'https://fortnite.gg/season-countdown',
}

// What players keep vs. what resets at a season flip (the established pattern).
export const SEASON_TRANSITION = {
  keeps: [
    'Every Sprite you’ve collected — preserved in your Collection and the Sprite Garden',
    'Your Sprite Mastery levels',
  ],
  resets: [
    'Sprite Dust (a per-season currency)',
    'Portable Extractors & Lucky Locators (consumables)',
    'Loot Hack upgrades — spend or reset Dust before the flip so it isn’t wasted',
  ],
  note: 'Each season starts a NEW generation of Sprites that takes over Battle Royale. Older generations are kept and displayed (Epic has said they “may return down the line”).',
}

// Whole days from now until the estimated end (can go negative once past).
export function daysUntilSeasonEnd(now = new Date()) {
  const end = new Date(SEASON.endEstimate + 'T07:00:00Z') // downtime usually ~2–3 AM ET
  return Math.ceil((end - now) / 86400000)
}
