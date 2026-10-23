import { useState } from 'react'
import { SEASON, daysUntilSeasonEnd } from '../data/season'

// A time-limited banner that surfaces as the season flip approaches: it leads
// with the countdown (so "Override ends ~Nov 1" is front-and-centre) and reminds
// players that Sprite Dust / Extractors / Locators reset at the flip, with a
// one-tap into the Dust planner. Only shows within ~2 weeks of the end, and is
// dismissible per-season (so it comes back for the next flip).
const SHOW_WITHIN_DAYS = 14
const DISMISS_KEY = `fnsprites:seasonFlipDismissed:${SEASON.current.id}`

const endLabel = () => {
  try {
    return new Date(SEASON.endEstimate + 'T12:00:00Z').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return SEASON.endEstimate
  }
}

export default function SeasonFlipBanner({ onPlanDust }) {
  const days = daysUntilSeasonEnd()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      return false
    }
  })

  // Only within the run-up to the flip (and up to a day after, while it settles).
  if (dismissed || days > SHOW_WITHIN_DAYS || days < -1) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const when = days > 1 ? `in ~${days} days` : days === 1 ? 'tomorrow' : days === 0 ? 'today' : 'any moment now'

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5">
      <span className="text-lg" aria-hidden>⏳</span>
      <p className="min-w-0 flex-1 text-sm text-[var(--text)]/90">
        <span className="font-bold text-white">
          {SEASON.current.label} “{SEASON.current.name}” ends {when}
        </span>{' '}
        ({endLabel()}). <b className="text-amber-300">Sprite Dust, Extractors &amp; Locators reset at the flip</b> — spend
        your Dust before then (your Sprites are kept).
      </p>
      <div className="flex shrink-0 items-center gap-2">
        {onPlanDust && (
          <button
            onClick={onPlanDust}
            title="Open the Dust planner — see what you can afford to (re)summon"
            className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-extrabold text-black transition-[filter] hover:brightness-110"
          >
            🔷 Plan my Dust
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Hide the season-flip reminder"
          title="Hide this"
          className="rounded-lg px-1.5 py-1 text-base leading-none text-[var(--muted)] hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
