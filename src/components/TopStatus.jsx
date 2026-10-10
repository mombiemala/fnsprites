import { useState, useEffect, useMemo } from 'react'
import { ANNOUNCEMENTS } from '../data/announcements'
import { LOBBY_CODES } from '../data/codes'
import { liveSpriteEvent, nextSpriteEvent } from '../data/events'
import { ALL_SPRITES } from '../data/sprites'
import { THEME_MAP } from '../data/themes'

// One compact top-of-page card with two thin rows:
//  1. the dismissible event announcement bar, and
//  2. the "Today" glance (live/next event + new codes).
// Upcoming/dated drops live in the sidebar's "What's next → Upcoming" card, so we
// don't repeat a "Coming up" feed here. Kept tight so it doesn't eat the screen.

const KEY = 'fnsprites.dismissedNotes'
function loadDismissed() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY)) || []) } catch { return new Set() }
}
function isActiveNote(a) {
  const today = new Date().toISOString().slice(0, 10)
  if (a.start && today < a.start) return false
  if (a.end && today > a.end) return false
  return true
}
// Left-accent colour per tone (kept subtle to stay compact).
const TONE_BORDER = {
  info: 'border-l-[var(--brand)]',
  event: 'border-l-fuchsia-400',
  alert: 'border-l-amber-400',
}

const isNewCode = (c) => c.added && Date.now() - new Date(c.added).getTime() <= 7 * 864e5

function fmtDur(ms) {
  if (ms <= 0) return 'now'
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${sec}s`
  return `${m}m ${sec}s`
}
// A boosted-finish event (Power Hours) is worth surfacing a "farm my missing
// ones" shortcut for — when it's LIVE, or starting within ~2 days.
const FARM_LEAD_MS = 2 * 864e5

export default function TopStatus({ onGo, tracking, onFarmFinish }) {
  const [dismissed, setDismissed] = useState(loadDismissed)
  const [now, setNow] = useState(() => Date.now()) // ticks every second for the countdown
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const newCodes = useMemo(() => LOBBY_CODES.filter(isNewCode).length, [])

  // Data-driven: "live" and the countdown come only from confirmed/sourced events
  // in src/data/events.js — no assuming every Monday/Saturday has one.
  const liveEvent = liveSpriteEvent(new Date(now))
  const nextEvent = nextSpriteEvent(new Date(now))

  // Avoid showing the same event twice: if the active announcement is about the
  // event already shown live/next in the row below (linked via its `eventId`),
  // skip the banner — the event row carries the same info, richer (LIVE badge +
  // live countdown). Prevents the duplicated Power-Hours notice at the top.
  const shownEvent = liveEvent || nextEvent
  const note = ANNOUNCEMENTS.find(
    (a) => isActiveNote(a) && !dismissed.has(a.id) && !(a.eventId && shownEvent && shownEvent.id.startsWith(a.eventId)),
  )

  // Power Hours tie-in: if a boosted-finish event is live (or imminent), offer a
  // one-tap "farm my missing <finish>" that filters the grid to exactly those.
  const boostEvent = (liveEvent?.boostedThemes?.length && liveEvent) ||
    (nextEvent?.boostedThemes?.length && (new Date(nextEvent.startsUtc) - now <= FARM_LEAD_MS) && nextEvent) || null
  const boostTheme = boostEvent?.boostedThemes?.[0] || null
  const boostMissing = (boostTheme && tracking)
    ? ALL_SPRITES.filter((s) => s.themeId === boostTheme && !s.unreleased && !tracking[s.id]?.owned).length
    : 0
  const showFarm = !!(onFarmFinish && boostTheme && boostMissing > 0)

  const dismiss = () => {
    const next = new Set(dismissed)
    next.add(note.id)
    setDismissed(next)
    try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch { /* ignore */ }
  }

  // Keep this card tight: only show the "Today" row when there's a real live/next
  // event or genuinely-new codes (no generic weekly filler), and render NOTHING at
  // all when there's no announcement, event, new code, or upcoming drop.
  const hasEvent = !!(liveEvent || nextEvent)
  const hasTodayRow = hasEvent || newCodes > 0
  if (!note && !hasTodayRow) return null

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
      {/* 1 · Active announcement (dismissible) */}
      {note && (
        <div className={`flex items-center gap-2 border-l-4 ${TONE_BORDER[note.tone] || TONE_BORDER.info} bg-[var(--bg-2)]/60 px-3 py-2`}>
          <span className="text-base leading-none">{note.emoji}</span>
          <p className="flex-1 text-[12px] font-semibold leading-snug text-white">
            {note.message}
            {note.link && (
              <a
                href={note.link}
                target="_blank"
                rel="noreferrer"
                className="ml-1.5 whitespace-nowrap text-[var(--brand)] underline hover:opacity-80"
                title={`Opens ${note.source || 'an external site'} in a new tab`}
              >
                {note.linkLabel || 'Learn more'} ↗
              </a>
            )}
          </p>
          <button
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="shrink-0 rounded-md px-1.5 py-0.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2 · Today — live/next event + new codes. Only renders when there's an
          event or new codes; with no event the codes button left-aligns (no empty
          floating row). */}
      {hasTodayRow && (
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5 ${hasEvent ? 'justify-between' : ''}`}>
        {hasEvent && (
        <div className="min-w-0">
          {liveEvent ? (
            <span className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
              </span>
              <span className="text-sm font-bold text-white">{liveEvent.emoji} {liveEvent.name}</span>
              <span className="hidden text-xs text-[var(--muted)] sm:inline">· {liveEvent.perk}</span>
            </span>
          ) : (
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-bold text-white">{nextEvent.emoji} {nextEvent.name}</span>
              <span className="text-xs text-[var(--muted)]">{nextEvent.confirmed ? 'in' : 'expected in'}</span>
              <span className="font-mono text-sm font-extrabold text-[var(--brand)]">{fmtDur(new Date(nextEvent.startsUtc) - now)}</span>
              <span className="hidden text-xs text-[var(--muted)] sm:inline">· {nextEvent.perk}</span>
            </span>
          )}
          <button onClick={() => onGo?.('news')} className="mt-0.5 block text-[11px] font-bold text-[var(--brand)] hover:underline">
            See all events →
          </button>
          {showFarm && (
            <button
              onClick={() => onFarmFinish(boostTheme)}
              title={`Filter the grid to the ${THEME_MAP[boostTheme]?.name || boostTheme} Sprites you still need — ${liveEvent?.boostedThemes ? 'boosted right now' : 'boosted this weekend'}`}
              className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-500/15 px-2.5 py-1 text-[11px] font-extrabold text-fuchsia-300 ring-1 ring-fuchsia-400/30 hover:bg-fuchsia-500/25"
            >
              🎯 Farm my {boostMissing} missing {THEME_MAP[boostTheme]?.name || boostTheme} Sprite{boostMissing === 1 ? '' : 's'} →
            </button>
          )}
        </div>
        )}
        {newCodes > 0 && (
          <button
            onClick={() => onGo?.('codes')}
            title="Open Lobby Hacks"
            className="shrink-0 rounded-xl bg-[var(--brand)]/15 px-3 py-1.5 text-xs font-bold text-[var(--brand)] transition-colors hover:bg-[var(--brand)]/25"
          >
            🆕 {newCodes} new code{newCodes === 1 ? '' : 's'} →
          </button>
        )}
      </div>
      )}
    </div>
  )
}
