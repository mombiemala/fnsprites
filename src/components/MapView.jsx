import { useEffect, useState } from 'react'
import { MAP_API, MAP_SOURCE, MAP_POIS, FORTNITE_GG_MAP } from '../data/mapInfo'

// The "Current Map" tab. Rather than ship an in-house map that can't match a
// dedicated tool, we point players to fortnite.gg's full interactive map (zoom +
// POI/chest/loot layer toggles, same Epic data) and keep a live, crawlable POI
// list here for quick reference. The POI names come from our /api/map proxy
// (server-side fetch of fortnite-api.com/v1/map, which isn't CORS-open to the
// browser), falling back to a curated static list so it always renders.
export default function MapView() {
  const [pois, setPois] = useState(null) // null = loading
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    ;(async () => {
      try {
        const res = await fetch(MAP_API, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const list = Array.isArray(json?.pois)
          ? json.pois.filter(Boolean).sort((a, b) => a.localeCompare(b))
          : []
        if (cancelled) return
        if (list.length) { setPois(list); setLive(true) }
        else setPois(MAP_POIS.map((p) => p.name))
      } catch {
        if (cancelled) return
        setPois(MAP_POIS.map((p) => p.name))
      } finally {
        clearTimeout(timer)
      }
    })()
    return () => { cancelled = true; clearTimeout(timer); ctrl.abort() }
  }, [])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl text-white">🗺️ Current Map</h2>
        <span className="text-[11px] text-[var(--muted)]">
          {live ? 'Live POIs' : '…'} · via{' '}
          <a href="https://fortnite-api.com/" target="_blank" rel="noreferrer" className="underline hover:text-white">{MAP_SOURCE}</a>
        </span>
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-[var(--muted)]">
        For the full interactive map — zoomable, with POI, chest and loot layers you can toggle —
        we send you to <b className="text-white">fortnite.gg</b>, the best free tool for it. Heads-up for
        collectors: Override Sprites aren’t tied to specific POIs — they come from in-world{' '}
        <a href="/codes" className="text-[var(--brand)] underline">Cheat Codes</a>, map-wide Sprite
        Chests and events — so treat the map as a general chest-farm reference.
      </p>

      {/* Primary CTA — the actual interactive map */}
      <a
        href={FORTNITE_GG_MAP}
        target="_blank"
        rel="noreferrer"
        className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-center text-sm font-bold text-white transition hover:brightness-110"
      >
        🗺️ Open the full interactive map on fortnite.gg →
      </a>

      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
        Current POIs{pois?.length ? ` (${pois.length})` : ''}
      </h3>
      {pois === null ? (
        <p className="text-[13px] text-[var(--muted)]">Loading the live POI list…</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {pois.map((name) => (
            <span key={name} className="rounded-full bg-[var(--bg-2)] px-2.5 py-1 text-[12px] font-semibold text-white">
              {name}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 text-[11px] text-[var(--muted)]">
        POI names © Epic Games, via {MAP_SOURCE}. New to farming Sprites? See the{' '}
        <a href="/sprites" className="text-[var(--brand)] underline">Sprites guide</a>.
      </p>
    </div>
  )
}
