// "Where to farm Sprites" — a lightweight, curated reference that replaced the
// old crowd-sourced community map (which had zero contributions and duplicated
// far better tools like fortnite.gg). No login, no database: just the stable
// chest hotspots, farming tips, and links to the authoritative interactive maps.
import { CHEST_FACTS, HOTSPOTS, FARMING_TIPS, MAP_LINKS, FARMING_SOURCES } from '../data/farming'

// Minimal **bold** renderer (keeps copy readable in the source data).
function Rich({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <b key={i} className="font-bold text-white">{p.slice(2, -2)}</b>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export default function SpriteFarming() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3">
        <h3 className="font-display text-lg text-white">🗺️ Where to farm Sprites</h3>
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          Sprite Chests are the main source of Sprites. Here’s how to spot them, where they cluster, and the best maps to plan a route.
        </p>
      </div>

      {/* What a Sprite Chest is */}
      <div className="rounded-xl bg-[var(--bg-2)] p-3">
        <ul className="space-y-1.5 text-xs text-[var(--muted)]">
          {CHEST_FACTS.map((f, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true" className="text-[var(--brand)]">•</span>
              <span><Rich text={f} /></span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hotspots */}
      <h4 className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Best farming spots</h4>
      <div className="space-y-2">
        {HOTSPOTS.map((h) => (
          <div key={h.poi} className="flex items-center gap-3 rounded-xl bg-[var(--bg-2)] p-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-extrabold text-black"
              style={{ background: 'var(--brand)' }}
              title={`${h.chests} Sprite Chests`}
            >
              {h.chests}✨
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{h.poi}</p>
              <p className="text-xs text-[var(--muted)]">{h.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <h4 className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Tips</h4>
      <ul className="space-y-1.5 text-xs text-[var(--muted)]">
        {FARMING_TIPS.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden="true" className="text-[var(--brand)]">›</span>
            <span><Rich text={t} /></span>
          </li>
        ))}
      </ul>

      {/* Authoritative maps */}
      <h4 className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Interactive maps</h4>
      <div className="space-y-2">
        {MAP_LINKS.map((m) => (
          <a
            key={m.href}
            href={m.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-2 rounded-xl bg-[var(--bg-2)] p-3 transition-colors hover:bg-[var(--panel-2)]"
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold text-white">{m.label}</span>
              <span className="block text-xs text-[var(--muted)]">{m.note}</span>
            </span>
            <span aria-hidden="true" className="shrink-0 text-[var(--brand)]">↗</span>
          </a>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-[var(--muted)]">
        Chest counts are a current-season snapshot ({FARMING_SOURCES.join(', ')}); active spawns rotate each match. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
