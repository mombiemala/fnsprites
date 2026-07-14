import { useEffect, useState, useMemo } from 'react'
import { NEWS, NEWS_TAGS } from '../data/news'
import { fetchLiveNews } from '../lib/liveNews'

export default function NewsFeed() {
  const [live, setLive] = useState([])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

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
    const todayNum = Number(today.replace(/-/g, ''))
    const isLiveNow = (n) => {
      if (!n.start && !n.end) return false
      if (n.start && today < n.start) return false
      if (n.end && today > n.end) return false
      return true
    }
    // Sortable YYYYMMDD from the item's date. Undated/evergreen items (weekly
    // events, known issues) count as "today" so they sit with current news
    // rather than sinking to the bottom of the timeline.
    const dateNum = (n) => {
      const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(n.ts || '')
      if (m) return Number(m[1] + m[2] + m[3])
      if (n.start && /^\d{4}-\d{2}-\d{2}$/.test(n.start)) return Number(n.start.replace(/-/g, ''))
      return todayNum
    }
    // Order: live-now (pinned) → upcoming (soonest first) → auto/live → history
    // (newest first). Each group is sorted by real date so the feed reads
    // chronologically within it. Dedupe by normalized title so a live item can't
    // double a curated one.
    const liveNow = NEWS.filter(isLiveNow).sort((a, b) => dateNum(b) - dateNum(a))
    const upcoming = NEWS.filter((n) => n.tag === 'upcoming' && !isLiveNow(n)).sort((a, b) => dateNum(a) - dateNum(b))
    const history = NEWS.filter((n) => n.tag !== 'upcoming' && !isLiveNow(n)).sort((a, b) => dateNum(b) - dateNum(a))
    const seen = new Set()
    let merged = [...liveNow, ...upcoming, ...live, ...history].filter((n) => {
      const k = (n._key || n.title).toLowerCase().trim()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    if (filter !== 'all') merged = merged.filter((n) => n.tag === filter)
    const q = query.trim().toLowerCase()
    if (q) {
      merged = merged.filter((n) =>
        `${n.title} ${n.body || ''} ${n.source || ''} ${NEWS_TAGS[n.tag]?.label || ''}`.toLowerCase().includes(q),
      )
    }
    return merged
  }, [live, filter, query])

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

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search news & events…"
        aria-label="Search news and events"
        className="mb-3 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none"
      />

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="rounded-xl bg-[var(--bg-2)] p-4 text-center text-xs text-[var(--muted)]">
            No news matches {query.trim() ? `“${query.trim()}”` : 'this filter'}.
          </p>
        )}
        {items.map((n) => {
          const tag = NEWS_TAGS[n.tag] || NEWS_TAGS.update
          // A known issue Epic has fixed: show a green "Resolved" badge instead
          // of the red "Known Issue" one (set `resolved: true` on the item).
          const resolved = n.tag === 'bug' && n.resolved
          return (
            <a
              key={n.ts}
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl bg-[var(--bg-2)] p-3 transition-colors hover:bg-[var(--panel-2)]"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {resolved ? (
                  <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-emerald-300" title={n.resolvedOn ? `Fixed in ${n.resolvedOn}` : 'Fixed by Epic'}>
                    ✓ Resolved{n.resolvedOn ? ` · ${n.resolvedOn}` : ''}
                  </span>
                ) : (
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-black" style={{ background: tag.color }}>
                    {tag.label}
                  </span>
                )}
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
        Live build auto-detected from fortnite-api.com; news &amp; events are curated, each with its source shown. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
