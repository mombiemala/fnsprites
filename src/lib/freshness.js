// Single source of truth for the "Updated daily" freshness signal shown in the
// app footer badge and the prerendered page headers. Derived from REAL content
// dates — the newest changelog entry and the newest lobby code — capped at today
// so a future-dated entry (e.g. an upcoming event) can never make us claim a
// date that hasn't happened. This keeps the freshness honest: it reflects when
// the tracker's content actually last changed, not just when it was rebuilt.
//
// `.js` extensions on the imports are deliberate: this module is imported both by
// Vite (browser bundle) and by scripts/prerender.mjs (Node ESM, which requires
// explicit extensions).
import { CHANGELOG } from '../data/changelog.js'
import { LOBBY_CODES } from '../data/codes.js'

const toTime = (d) => {
  const t = Date.parse(d)
  return Number.isNaN(t) ? 0 : t
}

// The most recent real content-change date (as a Date), never later than today.
export function lastUpdated(now = new Date()) {
  const todayTime = Date.parse(now.toISOString().slice(0, 10))
  const candidates = []
  if (CHANGELOG[0]?.date) candidates.push(toTime(CHANGELOG[0].date))
  for (const c of LOBBY_CODES) if (c.added) candidates.push(toTime(c.added))
  const newest = candidates.filter((t) => t && t <= todayTime).sort((a, b) => b - a)[0]
  return new Date(newest || todayTime)
}

// "Oct 11, 2026" — formatted in UTC so it's stable regardless of the viewer's TZ.
export function lastUpdatedLabel(now = new Date()) {
  return lastUpdated(now).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
