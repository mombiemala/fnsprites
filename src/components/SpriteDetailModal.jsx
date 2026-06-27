import { SPRITE_TYPES, ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import SpriteArt from './SpriteArt'
import Tooltip from './Tooltip'
import { useEscClose } from '../lib/useEscClose'

export default function SpriteDetailModal({ typeId, tracking, onClose, onToggleOwned, onToggleMastered, onToggleTrade, onToggleWanted, readOnly }) {
  useEscClose(onClose)
  const type = SPRITE_TYPES.find((t) => t.id === typeId)
  if (!type) return null
  const variants = ALL_SPRITES.filter((s) => s.typeId === typeId)
  const ownedCount = variants.filter((v) => tracking[v.id]?.owned).length

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${type.name} details`}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="sprite-art h-16 w-16 shrink-0 theme-normal" style={{ borderRadius: '0.75rem' }}>
              <SpriteArt sprite={variants[0]} />
            </div>
            <div>
              <h2 className="font-display text-2xl leading-none text-white">{type.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                  style={{ color: RARITY_COLORS[type.rarity], background: `${RARITY_COLORS[type.rarity]}22` }}
                >
                  {type.rarity}
                </span>
                {type.dropRate && <span className="text-xs text-[var(--muted)]">Drop rate {type.dropRate}</span>}
                {!type.released && (
                  <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white/70">
                    Unreleased
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        {type.ability && (
          <p className="mt-3 rounded-xl bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]/90">
            <span className="font-bold text-[var(--brand)]">Ability:</span> {type.ability}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Variants ({ownedCount}/{variants.length} owned)
          </h3>
        </div>

        <div className="mt-2 space-y-2">
          {variants.map((v) => {
            const theme = THEME_MAP[v.themeId]
            const st = tracking[v.id]
            const owned = !!st?.owned
            const mastered = !!st?.mastered
            const forTrade = !!st?.forTrade
            const wanted = !!st?.wanted
            return (
              <div key={v.id} className="flex items-center gap-3 rounded-xl bg-[var(--bg-2)] p-2">
                <div className={`sprite-art h-12 w-12 shrink-0 ${theme?.className} ${owned ? '' : 'sprite-locked'}`} style={{ borderRadius: '0.6rem' }}>
                  <SpriteArt sprite={v} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{theme?.name}</span>
                    {v.unreleased && (
                      <span className="rounded bg-black/40 px-1 py-0.5 text-[9px] font-bold uppercase text-white/60">soon</span>
                    )}
                  </div>
                  <span className="block truncate text-[11px] text-[var(--muted)]">{theme?.bonus}</span>
                </div>
                {!readOnly ? (
                  <div className="flex shrink-0 gap-1">
                    <Tooltip content={owned ? 'You own this — tap to unmark' : 'Mark as owned'}>
                      <button
                        onClick={() => onToggleOwned(v.id, !owned)}
                        aria-label={owned ? 'Owned' : 'Mark owned'}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                      >
                        {owned ? 'Owned' : 'Have'}
                      </button>
                    </Tooltip>
                    <Tooltip content="Mastered (max level)">
                      <button
                        onClick={() => onToggleMastered(v.id, !mastered)}
                        aria-label="Mastered"
                        className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${mastered ? 'bg-amber-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                      >
                        ★
                      </button>
                    </Tooltip>
                    <Tooltip content="I have a duplicate to trade">
                      <button
                        onClick={() => onToggleTrade(v.id, !forTrade)}
                        aria-label="For trade"
                        className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${forTrade ? 'bg-emerald-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                      >
                        ⇄
                      </button>
                    </Tooltip>
                    <Tooltip content="I want this one">
                      <button
                        onClick={() => onToggleWanted(v.id, !wanted)}
                        aria-label="Wanted"
                        className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${wanted ? 'bg-pink-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                      >
                        ♥
                      </button>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center gap-1">
                    <span className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}>
                      {owned ? 'Owned' : 'Missing'}
                    </span>
                    {forTrade && <span className="rounded-lg bg-emerald-400 px-2 py-1.5 text-[11px] font-bold text-black" title="For trade">⇄</span>}
                    {wanted && <span className="rounded-lg bg-pink-400 px-2 py-1.5 text-[11px] font-bold text-black" title="Wants">♥</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
