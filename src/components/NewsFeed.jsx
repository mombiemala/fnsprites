import { useEffect, useState, useMemo } from 'react'
import { NEWS, NEWS_TAGS } from '../data/news'
import { fetchLiveNews } from '../lib/liveNews'

export default function NewsFeed() {
  const [live, setLive] = useState([])
  const [filter, setFilter] = useState('all')

  // Auto-pull the current build + official in-game news once on mount.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const items = await fetchLiveNews()
      if (!cancelled) setLive(items)
    })()
    return () => { cancelled = true }
  }, [])

  const items = useMemo(() => {
    // A curated item with a start/end window is "live now" while today falls
    // inside it — those get pinned to the very top so a currently-running event
    // leads the feed. After the window passes it drops back to its normal group.
    const today = new Date().toISOString().slice(0, 10)
    const isLiveNow = (n) => {
      if (!n.start && !n.end) return false
      if (n.start && today < n.start) return false
      if (n.end && today > n.end) return false
      return true
    }
    // Order: live-now (pinned) → curated "upcoming" (editorial) → auto/live →
    // curated history. Dedupe by normalized title so a live item can't double a
    // curated one.
    const liveNow = NEWS.filter(isLiveNow)
    const upcoming = NEWS.filter((n) => n.tag === 'upcoming' && !isLiveNow(n))
    const history = NEWS.filter((n) => n.tag !== 'upcoming' && !isLiveNow(n))
    const seen = new Set()
    const merged = [...liveNow, ...upcoming, ...live, ...history].filter((n) => {
      const k = (n._key || n.title).toLowerCase().trim()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    return filter === 'all' ? merged : merged.filter((n) => n.tag === filter)
  }, [live, filter])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">📰 Fortnite News &amp; Updates</h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${filter === 'all' ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
          >
            All
          </button>
          {Object.entries(NEWS_TAGS).map(([k, t]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className="rounded-full px-2.5 py-1 text-[11px] font-bold"
              style={filter === k ? { background: t.color, color: '#000' } : { background: 'var(--panel-2)', color: 'var(--muted)' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((n) => {
          const tag = NEWS_TAGS[n.tag] || NEWS_TAGS.update
          return (
            <a
              key={n.ts}
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl bg-[var(--bg-2)] p-3 transition-colors hover:bg-[var(--panel-2)]"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-black" style={{ background: tag.color }}>
                  {tag.label}
                </span>
                {n.tentative && (
                  <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-300" title="Date/details not yet confirmed by Epic">
                    Tentative
                  </span>
                )}
                <span className="text-[11px] font-semibold text-[var(--muted)]">{n.when}</span>
              </div>
              <p className="text-sm font-bold text-white">{n.title}</p>
              {n.body && <p className="mt-0.5 text-xs text-[var(--muted)]">{n.body}</p>}
              {n.source && (
                <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-[var(--muted)]">
                  <span>
                    Source: {n.source}
                    <span className={n.official ? 'text-emerald-300' : 'text-amber-300'}>
                      {n.official ? ' · official' : ' · unofficial'}
                    </span>
                  </span>
                  <span aria-hidden="true">· opens in a new tab ↗</span>
                </p>
              )}
            </a>
          )
        })}
      </div>
      <p className="mt-3 text-[10px] text-[var(--muted)]">
        Live build &amp; in-game news auto-pulled from fortnite-api.com; curated “upcoming” items are editorial. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
