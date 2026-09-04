import { useState, useEffect, useMemo } from 'react'
import { LOBBY_CODES } from '../data/codes'

// A small "what's happening now" card at the top of the collection: a live
// countdown to the next weekly Sprite event, plus a nudge to any codes added
// this week. The heavier cards (Next to chase, Breakdown) live below — this is
// just the timely, glanceable stuff.

// A code counts as "new" for ~a week after its `added` date.
const isNewCode = (c) => c.added && Date.now() - new Date(c.added).getTime() <= 7 * 864e5

// "Now" as an Eastern-Time wall-clock Date (parsed back as local), so day-of-week
// and diffs line up with Fortnite's ET event schedule regardless of the viewer's
// timezone. Falls back to plain local time if Intl/timeZone misbehaves.
function nowET() {
  try {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))
  } catch {
    return new Date()
  }
}

// ms until the next weekly occurrence of (day-of-week `dow` 0=Sun…6=Sat) at `hour`
// ET. If it's that day but the hour has passed, roll to next week.
function msUntilWeekly(now, dow, hour) {
  const t = new Date(now)
  t.setHours(hour, 0, 0, 0)
  let add = (dow - now.getDay() + 7) % 7
  if (add === 0 && now >= t) add = 7
  t.setDate(t.getDate() + add)
  return t - now
}

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

export default function TodayHub({ onGo }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const newCodes = useMemo(() => LOBBY_CODES.filter(isNewCode).length, [])

  const now = nowET()
  const day = now.getDay()
  const hour = now.getHours()
  // Live windows: Mastery Monday runs all Monday; Power Hours are Sat 2–4 & 9–11 PM ET.
  const masteryLive = day === 1
  const powerLive = day === 6 && ((hour >= 14 && hour < 16) || (hour >= 21 && hour < 23))

  const EVENTS = [
    { key: 'mastery', emoji: '📅', name: 'Mastery Monday', perk: '2× Sprite Dust & XP', live: masteryLive, ms: msUntilWeekly(now, 1, 0) },
    { key: 'power', emoji: '⚡', name: 'Power Hours', perk: 'boosted Sprite spawns', live: powerLive, ms: msUntilWeekly(now, 6, 14) },
  ]
  const liveEvent = EVENTS.find((e) => e.live)
  const nextEvent = [...EVENTS].sort((a, b) => a.ms - b.ms)[0]

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Event — live now, or a countdown to the next one */}
      <div className="min-w-0">
        {liveEvent ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
            </span>
            <span className="text-sm font-bold text-white">{liveEvent.emoji} {liveEvent.name}</span>
            <span className="hidden text-xs text-[var(--muted)] sm:inline">· {liveEvent.perk}</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-bold text-white">{nextEvent.emoji} {nextEvent.name}</span>
            <span className="text-xs text-[var(--muted)]">in</span>
            <span className="font-mono text-sm font-extrabold text-[var(--brand)]" aria-live="off">{fmtDur(nextEvent.ms)}</span>
            <span className="hidden text-xs text-[var(--muted)] sm:inline">· {nextEvent.perk}</span>
          </div>
        )}
        <p className="mt-0.5 text-[11px] text-[var(--muted)]">
          {liveEvent ? 'On now — jump in.' : 'Weekly Sprite events (ET).'}{' '}
          <button onClick={() => onGo?.('news')} className="font-bold text-[var(--brand)] hover:underline">See all events →</button>
        </p>
      </div>

      {/* New codes this week */}
      <button
        onClick={() => onGo?.('codes')}
        title="Open Lobby Hacks"
        className={`shrink-0 rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${
          newCodes > 0 ? 'bg-[var(--brand)]/15 text-[var(--brand)] hover:bg-[var(--brand)]/25' : 'bg-[var(--bg-2)] text-[var(--muted)] hover:text-white'
        }`}
      >
        {newCodes > 0 ? `🆕 ${newCodes} new code${newCodes === 1 ? '' : 's'} this week` : '🔓 Lobby Hacks'} →
      </button>
    </div>
  )
}
