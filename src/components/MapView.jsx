import { useEffect, useState } from 'react'
import { MAP_API, MAP_SOURCE, MAP_IMAGE_FALLBACK, MAP_POIS } from '../data/mapInfo'

// A light "current map" reference: the live labelled minimap + POI list from our
// /api/map proxy (server-side fetch of fortnite-api.com/v1/map — the browser can't
// call that vendor directly because it isn't CORS-open). Falls back to a static
// image + our curated POI list if the proxy fails or times out, so it ALWAYS
// resolves to a rendered list rather than hanging on "Loading…".
export default function MapView() {
  const [image, setImage] = useState(MAP_IMAGE_FALLBACK)
  const [pois, setPois] = useState(null) // null = loading; [] handled as fallback
  const [live, setLive] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Never hang the tab: if the proxy is slow/unreachable, bail to the fallback.
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    ;(async () => {
      try {
        const res = await fetch(MAP_API, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const img = json?.image
        const list = Array.isArray(json?.pois)
          ? json.pois.filter(Boolean).sort((a, b) => a.localeCompare(b))
          : []
        if (cancelled) return
        if (img) setImage(img)
        if (list.length) { setPois(list); setLive(true) }
        else setPois(MAP_POIS.map((p) => p.name))
      } catch {
        if (cancelled) return
        setFailed(true)
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
          {live ? 'Live' : failed ? 'Cached' : '…'} · data from{' '}
          <a href="https://fortnite-api.com/" target="_blank" rel="noreferrer" className="underline hover:text-white">{MAP_SOURCE}</a>
        </span>
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-[var(--muted)]">
        The current Chapter 7 Season 4 “Override” Battle Royale map and its Points of Interest.
        Heads-up for collectors: Override Sprites aren’t tied to specific POIs — they come from
        in-world <a href="/codes" className="text-[var(--brand)] underline">Cheat Codes</a>,
        map-wide Sprite Chests and events — so treat this as a general chest-farm reference.
      </p>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)]">
        <img
          src={image}
          alt="Fortnite Chapter 7 Season 4 Override map with POIs"
          loading="lazy"
          onError={(e) => { if (e.currentTarget.src !== MAP_IMAGE_FALLBACK) e.currentTarget.src = MAP_IMAGE_FALLBACK }}
          className="mx-auto block w-full max-w-[720px] object-contain"
        />
      </div>

      <h3 className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
        Points of Interest{pois?.length ? ` (${pois.length})` : ''}
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
        Map & POI data © Epic Games, served via {MAP_SOURCE}. New to farming Sprites? See the{' '}
        <a href="/sprites" className="text-[var(--brand)] underline">Sprites guide</a>.
      </p>
    </div>
  )
}
