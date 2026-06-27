import { useState } from 'react'
import { MAP_IMAGE, MAP_LINK, LAYERS } from '../data/mapMarkers'

export default function MapView() {
  const [on, setOn] = useState(() => Object.fromEntries(LAYERS.map((l) => [l.id, true])))
  const [imgOk, setImgOk] = useState(true)
  const [hover, setHover] = useState(null)

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">🗺️ Island Map</h3>
        <a href={MAP_LINK} target="_blank" rel="noreferrer" className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">
          Open full map ↗
        </a>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => setOn((s) => ({ ...s, [l.id]: !s[l.id] }))}
            title={l.note || l.label}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-opacity"
            style={{ background: on[l.id] ? l.color : 'var(--panel-2)', color: on[l.id] ? '#000' : 'var(--muted)' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: on[l.id] ? '#0008' : l.color }} />
            {l.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)]">
        {imgOk ? (
          <img
            src={MAP_IMAGE}
            alt="Fortnite map"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-sm text-[var(--muted)]">
            Couldn’t load the live map.{' '}
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="underline">Open the full interactive map ↗</a>
          </div>
        )}

        {imgOk &&
          LAYERS.filter((l) => on[l.id]).flatMap((l) =>
            l.markers.map((m, i) => (
              <button
                key={`${l.id}-${i}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                onMouseEnter={() => setHover(`${l.label}: ${m.label}`)}
                onMouseLeave={() => setHover(null)}
                title={`${l.label}: ${m.label}`}
              >
                <span className="block h-3.5 w-3.5 rounded-full border-2 border-white shadow" style={{ background: l.color }} />
              </button>
            ))
          )}

        {hover && (
          <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
            {hover}
          </div>
        )}
      </div>

      <p className="mt-3 text-[10px] text-[var(--muted)]">
        Map image via fortnite-api.com. Marker locations are community-sourced &amp; approximate and shift each update — use the full map for precision. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
