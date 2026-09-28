import { useEffect, useMemo, useState } from 'react'
import { MAP_API, MAP_SOURCE, MAP_IMAGE_FALLBACK, MAP_POIS } from '../data/mapInfo'

// The in-app "Current Map" tab. Pulls the live minimap + POI list (with
// coordinates) from our /api/map proxy (server-side fetch of fortnite-api.com/v1/map
// — the browser can't call that vendor directly because it isn't CORS-open) and
// overlays togglable POI markers on the map image. Falls back to a static image +
// our curated POI list if the proxy fails or times out, so it ALWAYS resolves to a
// rendered reference rather than hanging on "Loading…".

// The minimap image is a SQUARE centred on the world origin (0,0). Fortnite-api's
// map spans roughly ±135000 world units per axis; POIs land ~85% out from centre,
// leaving the ocean border. These three constants are the calibration — if pins are
// uniformly off, adjust them:
//   WORLD_HALF  → scale (bigger = pins pulled toward centre)
//   FLIP_X/FLIP_Y → orientation (mirror horizontally / vertically)
const WORLD_HALF = 135000
const FLIP_X = false
const FLIP_Y = true // +Y is north (up); image Y grows downward, so flip by default

function project(p) {
  const nx = (FLIP_X ? -p.x : p.x) / (2 * WORLD_HALF) + 0.5
  const ny = (FLIP_Y ? -p.y : p.y) / (2 * WORLD_HALF) + 0.5
  return { left: nx * 100, top: ny * 100 }
}

export default function MapView() {
  const [data, setData] = useState(null) // { image, blankImage, pois:[{name,x,y}], names, bounds }
  const [status, setStatus] = useState('loading') // 'loading' | 'live' | 'fallback'
  const [showMarkers, setShowMarkers] = useState(true)
  const [showLabels, setShowLabels] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    let cancelled = false
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    ;(async () => {
      try {
        const res = await fetch(MAP_API, { signal: ctrl.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancelled) return
        const pois = Array.isArray(json?.pois) ? json.pois.filter((p) => p && p.name) : []
        const names = Array.isArray(json?.names) && json.names.length
          ? json.names
          : pois.map((p) => p.name).sort((a, b) => a.localeCompare(b))
        setData({
          image: json?.image || MAP_IMAGE_FALLBACK,
          blankImage: json?.blankImage || json?.image || MAP_IMAGE_FALLBACK,
          pois,
          names,
          bounds: json?.bounds || null,
        })
        setStatus('live')
      } catch {
        if (cancelled) return
        setData({
          image: MAP_IMAGE_FALLBACK,
          blankImage: MAP_IMAGE_FALLBACK,
          pois: [],
          names: MAP_POIS.map((p) => p.name),
          bounds: null,
        })
        setStatus('fallback')
      } finally {
        clearTimeout(timer)
      }
    })()
    return () => { cancelled = true; clearTimeout(timer); ctrl.abort() }
  }, [])

  // Can we draw the interactive overlay? Only when we have POI coordinates.
  const canOverlay = !!data?.pois?.length
  const markers = useMemo(
    () => (canOverlay ? data.pois.map((p, i) => ({ ...p, ...project(p), id: `${p.name}#${i}` })) : []),
    [canOverlay, data],
  )

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl text-white">🗺️ Current Map</h2>
        <span className="text-[11px] text-[var(--muted)]">
          {status === 'live' ? 'Live' : status === 'fallback' ? 'Cached' : '…'} · data from{' '}
          <a href="https://fortnite-api.com/" target="_blank" rel="noreferrer" className="underline hover:text-white">{MAP_SOURCE}</a>
        </span>
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-[var(--muted)]">
        The current Chapter 7 Season 4 “Override” Battle Royale map and its Points of Interest.
        Heads-up for collectors: Override Sprites aren’t tied to specific POIs — they come from
        in-world <a href="/codes" className="text-[var(--brand)] underline">Cheat Codes</a>,
        map-wide Sprite Chests and events — so treat this as a general chest-farm reference.
      </p>

      {/* Layer toggles */}
      {canOverlay && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Layers</span>
          <button
            type="button"
            onClick={() => setShowMarkers((v) => !v)}
            aria-pressed={showMarkers}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition ${showMarkers ? 'border-[var(--brand)] bg-[var(--brand)]/15 text-white' : 'border-[var(--border)] bg-[var(--bg-2)] text-[var(--muted)]'}`}
          >
            📍 Markers ({markers.length})
          </button>
          <button
            type="button"
            onClick={() => setShowLabels((v) => !v)}
            aria-pressed={showLabels}
            disabled={!showMarkers}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition disabled:opacity-40 ${showLabels && showMarkers ? 'border-[var(--brand)] bg-[var(--brand)]/15 text-white' : 'border-[var(--border)] bg-[var(--bg-2)] text-[var(--muted)]'}`}
          >
            🏷️ Labels
          </button>
        </div>
      )}

      {/* Map image + marker overlay */}
      <div className="mx-auto w-full max-w-[720px]">
        <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)]">
          <img
            src={canOverlay ? data.blankImage : data?.image || MAP_IMAGE_FALLBACK}
            alt="Fortnite Chapter 7 Season 4 Override map"
            loading="lazy"
            onError={(e) => { if (e.currentTarget.src !== MAP_IMAGE_FALLBACK) e.currentTarget.src = MAP_IMAGE_FALLBACK }}
            className="block w-full object-contain"
          />

          {canOverlay && showMarkers && markers.map((m) => {
            const active = hovered === m.name
            return (
              <button
                key={m.id}
                type="button"
                title={m.name}
                onMouseEnter={() => setHovered(m.name)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(m.name)}
                onBlur={() => setHovered(null)}
                style={{ left: `${m.left}%`, top: `${m.top}%` }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              >
                <span
                  className={`block rounded-full border border-black/50 shadow ring-1 ring-white/60 transition ${active ? 'h-3.5 w-3.5 bg-white' : 'h-2.5 w-2.5 bg-[var(--brand)]'}`}
                />
                {(showLabels || active) && (
                  <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {m.name}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {canOverlay && (
          <p className="mt-1.5 text-[10px] text-[var(--muted)]">
            Marker positions are approximate — derived from the live POI coordinates. Hover a pin or a name below to highlight it.
          </p>
        )}
      </div>

      {/* POI list (also the fallback when the overlay can't render) */}
      <h3 className="mb-2 mt-4 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
        Points of Interest{data?.names?.length ? ` (${data.names.length})` : ''}
      </h3>
      {status === 'loading' ? (
        <p className="text-[13px] text-[var(--muted)]">Loading the live POI list…</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {data.names.map((name) => (
            <span
              key={name}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              className={`cursor-default rounded-full px-2.5 py-1 text-[12px] font-semibold transition ${hovered === name ? 'bg-[var(--brand)] text-white' : 'bg-[var(--bg-2)] text-white'}`}
            >
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
