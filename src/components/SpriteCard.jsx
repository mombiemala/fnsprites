import { THEME_MAP } from '../data/themes'
import { RARITY_COLORS } from '../data/sprites'
import SpriteArt from './SpriteArt'

export default function SpriteCard({ sprite, state, onToggleOwned, onToggleMastered, onSetLevel, onOpen, readOnly }) {
  const theme = THEME_MAP[sprite.themeId]
  const owned = !!state?.owned
  const mastered = !!state?.mastered
  const level = state?.level || 0
  const edge = RARITY_COLORS[sprite.rarity] || '#3a3350'

  return (
    <div className={`sc-card group ${owned ? 'is-owned' : 'sprite-locked'}`} style={{ '--edge': edge }}>
      <div className="sc-inner">
        {/* Art (click to open detail) — framed like a trading card */}
        <button
          type="button"
          onClick={() => onOpen?.(sprite)}
          className={`sprite-art sc-art relative block w-full ${theme?.className || 'theme-normal'}`}
          title={`${sprite.typeName} · ${theme?.name} — details`}
        >
          <SpriteArt sprite={sprite} />
          <span className="sc-foil" aria-hidden="true" />
          {mastered && (
            <span className="absolute right-1.5 top-1.5 z-[5] rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold text-black shadow">
              ★
            </span>
          )}
          {sprite.vaulted ? (
            <span title="Vaulted — currently unavailable" className="sc-badge absolute left-1.5 top-1.5 z-[5] bg-red-500/85 text-white">
              vaulted
            </span>
          ) : sprite.unreleased && (
            <span title="Coming soon — not yet released" className="sc-badge absolute left-1.5 top-1.5 z-[5] bg-black/60 text-white/85 ring-1 ring-white/20">
              soon
            </span>
          )}
          {owned && !mastered && (
            <span title="In your collection" className="sc-badge absolute bottom-1.5 left-1.5 z-[5] bg-[var(--brand)] text-black">
              have
            </span>
          )}
        </button>

        {/* Nameplate */}
        <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: edge, boxShadow: `0 0 8px ${edge}` }} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-extrabold leading-tight text-[var(--text)]">{sprite.typeName}</span>
              <span className="block truncate text-[10.5px] font-bold leading-tight text-[var(--muted)]">
                {theme?.name}{sprite.dropRate ? ` · ${sprite.dropRate}` : ''}
              </span>
            </span>
            <span
              className="shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase"
              style={{ color: edge, background: `${edge}22` }}
            >
              {sprite.rarity}
            </span>
          </div>

          {/* Level (1–5) — appears once owned; taps set the level, matching the modal */}
          {owned && (
            <div
              className="mt-2 flex items-center gap-1"
              title={readOnly ? `Level ${level} of 5` : `Level ${level} of 5 — tap a dot to set`}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const on = n <= level
                  const dot = (
                    <span
                      className="block h-2 w-2 rounded-full"
                      style={{ background: on ? (level >= 5 ? '#fbbf24' : 'var(--brand)') : 'var(--panel-2)' }}
                    />
                  )
                  return readOnly ? (
                    <span key={n}>{dot}</span>
                  ) : (
                    <button key={n} onClick={() => onSetLevel?.(sprite.id, n)} aria-label={`Set level ${n} of 5`} className="leading-none">
                      {dot}
                    </button>
                  )
                })}
              </div>
              <span className={`ml-auto text-[9px] font-bold ${level >= 5 ? 'text-amber-300' : 'text-[var(--muted)]'}`}>
                Lv {level}/5
              </span>
            </div>
          )}

          {/* Controls */}
          {!readOnly ? (
            <div className="mt-auto flex gap-1 pt-2">
              <button
                onClick={() => onToggleOwned(sprite.id, !owned)}
                title={owned ? `Owned — tap to unmark ${sprite.typeName} · ${theme?.name}` : `Mark ${sprite.typeName} · ${theme?.name} as owned`}
                className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition-colors ${
                  owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
                }`}
              >
                {owned ? 'Owned' : 'Have it?'}
              </button>
              <button
                onClick={() => onToggleMastered(sprite.id, !mastered)}
                title={mastered ? 'Mastered (Level 5) — tap to unmark' : 'Mark as mastered (Level 5)'}
                className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${
                  mastered ? 'bg-amber-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
                }`}
              >
                ★
              </button>
            </div>
          ) : (
            <div className="mt-auto flex gap-1 pt-2 text-[11px] font-bold">
              <span className={`flex-1 rounded-lg py-1 text-center ${owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}>
                {owned ? 'Owned' : 'Missing'}
              </span>
              {mastered && <span className="rounded-lg bg-amber-400 px-2 py-1 text-black">★</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
