import { useState, useEffect, useMemo } from 'react'
import { ANNOUNCEMENTS } from '../data/announcements'
import { activeIncoming, daysUntil } from '../data/incoming'
import { LOBBY_CODES } from '../data/codes'
import { liveSpriteEvent, nextSpriteEvent } from '../data/events'

// One compact top-of-page card that merges what used to be three stacked blocks:
//  1. the dismissible event announcement bar,
//  2. the "Today" glance (live/next weekly event + new codes), and
//  3. the "Heads up — you heard it here first" upcoming feed.
// Kept tight (one bordered card, thin rows) so it doesn't eat the screen.

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
function countdownLabel(dropsOn, confirmedDate) {
  const d = daysUntil(dropsOn)
  const approx = confirmedDate ? '' : '~'
  if (d > 1) return `${approx}${d}d`
  if (d === 1) return `${approx}1d`
  if (d === 0) return 'today'
  return 'soon'
}

export default function TopStatus({ onGo }) {
  const [dismissed, setDismissed] = useState(loadDismissed)
  const [now, setNow] = useState(() => Date.now()) // ticks every second for the countdown
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const note = ANNOUNCEMENTS.find((a) => isActiveNote(a) && !dismissed.has(a.id))
  const incoming = activeIncoming()
  const newCodes = useMemo(() => LOBBY_CODES.filter(isNewCode).length, [])

  // Data-driven: "live" and the countdown come only from confirmed/sourced events
  // in src/data/events.js — no assuming every Monday/Saturday has one.
  const liveEvent = liveSpriteEvent(new Date(now))
  const nextEvent = nextSpriteEvent(new Date(now))

  const dismiss = () => {
    const next = new Set(dismissed)
    next.add(note.id)
    setDismissed(next)
    try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch { /* ignore */ }
  }

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

      {/* 2 · Today — live/next weekly event + new codes */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-3 py-2.5">
        <div className="min-w-0">
          {liveEvent ? (
            <span className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
              </span>
              <span className="text-sm font-bold text-white">{liveEvent.emoji} {liveEvent.name}</span>
              <span className="hidden text-xs text-[var(--muted)] sm:inline">· {liveEvent.perk}</span>
            </span>
          ) : nextEvent ? (
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm font-bold text-white">{nextEvent.emoji} {nextEvent.name}</span>
              <span className="text-xs text-[var(--muted)]">{nextEvent.confirmed ? 'in' : 'expected in'}</span>
              <span className="font-mono text-sm font-extrabold text-[var(--brand)]">{fmtDur(new Date(nextEvent.startsUtc) - now)}</span>
              <span className="hidden text-xs text-[var(--muted)] sm:inline">· {nextEvent.perk}</span>
            </span>
          ) : (
            <span className="text-sm font-bold text-white">
              📅 Weekly Sprite events <span className="text-xs font-normal text-[var(--muted)]">· usually Mon / Thu / Sat (ET)</span>
            </span>
          )}
          <button onClick={() => onGo?.('news')} className="mt-0.5 block text-[11px] font-bold text-[var(--brand)] hover:underline">
            See all events →
          </button>
        </div>
        <button
          onClick={() => onGo?.('codes')}
          title="Open Lobby Hacks"
          className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
            newCodes > 0 ? 'bg-[var(--brand)]/15 text-[var(--brand)] hover:bg-[var(--brand)]/25' : 'bg-[var(--bg-2)] text-[var(--muted)] hover:text-white'
          }`}
        >
          {newCodes > 0 ? `🆕 ${newCodes} new code${newCodes === 1 ? '' : 's'}` : '🔓 Lobby Hacks'} →
        </button>
      </div>

      {/* 3 · Heads up — upcoming confirmed/dated drops, as compact chips */}
      {incoming.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--border)] px-3 py-2">
          <span className="mr-0.5 shrink-0 text-[11px] font-bold text-white/80">🔔 Coming up</span>
          {incoming.map((e) => {
            const cd = countdownLabel(e.dropsOn, e.confirmedDate)
            const when = new Date(e.dropsOn + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
            const external = e.sourceUrl?.startsWith('http')
            const tip = `${e.detail}\n\n${e.confirmedDate ? 'Drops' : 'Expected'} ${when} · ${e.source}`
            return (
              <a
                key={e.id}
                href={e.sourceUrl}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                title={tip}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[var(--bg-2)] px-2 py-1 text-[11px] text-[var(--muted)] transition-colors hover:text-white"
              >
                <span className="truncate font-semibold text-white">{e.emoji} {e.title}</span>
                <span className="shrink-0 rounded-full bg-[var(--brand)]/20 px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--brand)]">{cd}</span>
              </a>
            )
          })}
          <span className="w-full text-[10px] text-[var(--muted)] sm:w-auto sm:pl-1">Confirmed &amp; dated only — hover for details.</span>
        </div>
      )}
    </div>
  )
}
