import { useEffect, useState, useMemo } from 'react'
import { NEWS, NEWS_TAGS } from '../data/news'

// Best-effort live BR news from a public Fortnite API (runs in the browser;
// silently ignored if blocked by CORS/network). Curated feed is the base.
function useLiveNews() {
  const [live, setLive] = useState([])
  useEffect(() => {
    let cancelled = false
    fetch('https://fortnite-api.com/v2/news/br?language=en')
      .then((r) => r.json())
      .then((d) => {
        const motds = d?.data?.motds || d?.data?.messages || []
        if (!cancelled && Array.isArray(motds)) {
          setLive(
            motds.slice(0, 4).map((m, i) => ({
              ts: `live-${i}`,
              when: 'In-game now',
              tag: 'event',
              title: m.title || 'In-game news',
              body: m.body || '',
              image: m.image,
              link: 'https://www.fortnite.com/news',
            }))
          )
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return live
}

export default function NewsFeed() {
  const live = useLiveNews()
  const [filter, setFilter] = useState('all')

  const items = useMemo(() => {
    const all = [...NEWS, ...live]
    return filter === 'all' ? all : all.filter((n) => n.tag === filter)
  }, [live, filter])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">📰 Fortnite News & Updates</h3>
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
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-black" style={{ background: tag.color }}>
                  {tag.label}
                </span>
                <span className="text-[11px] font-semibold text-[var(--muted)]">{n.when}</span>
              </div>
              <p className="text-sm font-bold text-white">{n.title}</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">{n.body}</p>
            </a>
          )
        })}
      </div>
      <p className="mt-3 text-[10px] text-[var(--muted)]">
        Curated from official patch notes; live in-game news via fortnite-api.com when available. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
