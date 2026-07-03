import { THEME_MAP } from '../data/themes'
import { RARITY_COLORS } from '../data/sprites'
import SpriteArt from './SpriteArt'

export default function SpriteCard({ sprite, state, onToggleOwned, onToggleMastered, onSetLevel, onOpen, readOnly }) {
  const theme = THEME_MAP[sprite.themeId]
  const owned = !!state?.owned
  const mastered = !!state?.mastered
  const level = state?.level || 0

  return (
    <div
      className={`group relative rounded-2xl bg-[var(--panel)] p-2.5 transition-transform hover:-translate-y-0.5 ${
        owned ? '' : 'sprite-locked'
      }`}
      style={{ boxShadow: owned ? `0 0 0 1px ${theme?.accent}55, 0 8px 24px rgba(0,0,0,.35)` : '0 0 0 1px #2c3556' }}
    >
      {/* Art (click to open detail) */}
      <button
        type="button"
        onClick={() => onOpen?.(sprite)}
        className={`sprite-art block w-full ${theme?.className || 'theme-normal'}`}
        title={`${sprite.typeName} · ${theme?.name} — details`}
      >
        <SpriteArt sprite={sprite} />
        {mastered && (
          <span className="absolute right-1 top-1 z-[3] rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold text-black shadow">
            ★
          </span>
        )}
        {sprite.unreleased && (
          <span className="absolute left-1 top-1 z-[3] rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/80">
            soon
          </span>
        )}
      </button>

      {/* Labels */}
      <div className="mt-2 px-0.5">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-xs font-bold text-[var(--text)]">{sprite.typeName}</span>
          <span
            className="rounded px-1 py-0.5 text-[9px] font-bold uppercase"
            style={{ color: RARITY_COLORS[sprite.rarity], background: `${RARITY_COLORS[sprite.rarity]}22` }}
          >
            {sprite.rarity}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-medium text-[var(--muted)]">{theme?.name}</span>
          {sprite.dropRate && (
            <span className="text-[10px] font-bold text-[var(--muted)]" title="Base drop rate">{sprite.dropRate}</span>
          )}
        </div>
      </div>

      {/* Level (1–5) — appears once owned; taps set the level, matching the modal */}
      {owned && (
        <div
          className="mt-1.5 flex items-center gap-1 px-0.5"
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
        <div className="mt-2 flex gap-1">
          <button
            onClick={() => onToggleOwned(sprite.id, !owned)}
            className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition-colors ${
              owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
            }`}
          >
            {owned ? 'Owned' : 'Have it?'}
          </button>
          <button
            onClick={() => onToggleMastered(sprite.id, !mastered)}
            title="Mastered"
            className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${
              mastered ? 'bg-amber-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
            }`}
          >
            ★
          </button>
        </div>
      ) : (
        <div className="mt-2 flex gap-1 text-[11px] font-bold">
          <span className={`flex-1 rounded-lg py-1 text-center ${owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}>
            {owned ? 'Owned' : 'Missing'}
          </span>
          {mastered && <span className="rounded-lg bg-amber-400 px-2 py-1 text-black">★</span>}
        </div>
      )}
    </div>
  )
}
