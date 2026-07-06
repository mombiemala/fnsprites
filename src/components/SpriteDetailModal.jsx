import { SPRITE_TYPES, ALL_SPRITES, RARITY_COLORS, dustCost, spriteSource, spriteScaling } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import SpriteArt from './SpriteArt'
import { useEscClose } from '../lib/useEscClose'

export default function SpriteDetailModal({ typeId, tracking, onClose, onToggleOwned, onToggleMastered, onToggleTrade, onToggleWanted, onSetLevel, onOpenMap, readOnly }) {
  useEscClose(onClose)
  const type = SPRITE_TYPES.find((t) => t.id === typeId)
  if (!type) return null
  const variants = ALL_SPRITES.filter((s) => s.typeId === typeId)
  const ownedCount = variants.filter((v) => tracking[v.id]?.owned).length
  const scaling = spriteScaling(type.id)
  // Highest level among the variants you actually own — so we can show progress
  // against the ability's Lv-5 scaling.
  const bestLevel = variants.reduce((m, v) => (tracking[v.id]?.owned ? Math.max(m, tracking[v.id]?.level || 0) : m), 0)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${type.name} details`}
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl [scrollbar-gutter:stable]"
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
                {type.rumored && (
                  <span
                    title="Leaked / not yet confirmed by Epic — details can change before launch"
                    className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-300"
                  >
                    Rumored
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        {type.ability && (
          <p className="mt-3 rounded-xl bg-[var(--bg-2)] px-3 py-2 text-sm text-[var(--text)]/90">
            <span className="font-bold text-[var(--brand)]">Ability{type.rumored ? ' (rumored)' : ''}:</span> {type.ability}
          </p>
        )}

        {scaling && (
          <div className="mt-2 rounded-xl bg-[var(--bg-2)] px-3 py-2 text-xs text-[var(--muted)]">
            <p>
              <span className="font-bold text-[var(--brand)]">⬆ Scales to Lv 5:</span> {scaling}
              {bestLevel > 0 && (
                <span className="font-semibold text-white/85">
                  {' '}· you’re at Lv {bestLevel}/5{bestLevel >= 5 ? ' — maxed ⭐' : ''}
                </span>
              )}
            </p>
            <p className="mt-0.5 text-[10px] opacity-70">
              Community-reported — Epic doesn’t publish exact per-level numbers.
            </p>
          </div>
        )}

        {/* Where to find — ties into the community loot map */}
        <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-[var(--bg-2)] px-3 py-2">
          <p className="text-sm text-[var(--text)]/90">
            <span className="font-bold text-[var(--brand)]">🗺️ Where to find:</span> {spriteSource(type.id)}
          </p>
          {onOpenMap && (
            <button onClick={onOpenMap} className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">
              See the Map →
            </button>
          )}
        </div>

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
            const level = st?.level || 0
            const dust = dustCost(type.rarity, v.themeId)
            return (
              <div key={v.id} className="flex items-center gap-3 rounded-xl bg-[var(--bg-2)] p-2">
                <div className={`sprite-art h-12 w-12 shrink-0 ${theme?.className} ${owned ? '' : 'sprite-locked'}`} style={{ borderRadius: '0.6rem' }}>
                  <SpriteArt sprite={v} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{theme?.name}</span>
                    {v.unreleased && (
                      <span className="rounded bg-black/40 px-1 py-0.5 text-[9px] font-bold uppercase text-white/60">soon</span>
                    )}
                    {dust != null && (
                      <span
                        title="Estimated Sprite Dust to (re)summon this variant. Indexing a trade avoids re-summoning."
                        className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-300"
                      >
                        ≈{dust.toLocaleString()} dust
                      </span>
                    )}
                  </div>
                  <span
                    className={`block truncate text-[11px] ${theme?.rumored ? 'text-amber-300/90' : 'text-[var(--muted)]'}`}
                    title={theme?.rumored ? 'Not yet confirmed by Epic' : undefined}
                  >
                    {theme?.bonus}
                  </span>
                  {owned && (
                    <div
                      className="mt-1 flex items-center gap-1.5"
                      title={readOnly ? `Level ${level} of 5` : `Level ${level} of 5 — tap a dot to set`}
                    >
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => {
                          const on = n <= level
                          const dot = (
                            <span
                              className="block h-2.5 w-2.5 rounded-full"
                              style={{ background: on ? (level >= 5 ? '#fbbf24' : 'var(--brand)') : 'var(--panel-2)' }}
                            />
                          )
                          return readOnly ? (
                            <span key={n}>{dot}</span>
                          ) : (
                            <button key={n} onClick={() => onSetLevel(v.id, n)} aria-label={`Set level ${n} of 5`}>{dot}</button>
                          )
                        })}
                      </div>
                      <span className={`text-[10px] font-bold ${level >= 5 ? 'text-amber-300' : 'text-[var(--muted)]'}`}>
                        Lv {level}/5{level >= 5 ? ' · Mastered' : ''}
                      </span>
                    </div>
                  )}
                </div>
                {!readOnly ? (
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => onToggleOwned(v.id, !owned)}
                      aria-label={owned ? 'Owned' : 'Mark owned'}
                      title={owned ? 'You own this — tap to unmark' : 'Mark as owned'}
                      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                    >
                      {owned ? 'Owned' : 'Have'}
                    </button>
                    <button
                      onClick={() => onToggleMastered(v.id, !mastered)}
                      aria-label="Mastered"
                      title="Mastered (max level)"
                      className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${mastered ? 'bg-amber-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => onToggleTrade(v.id, !forTrade)}
                      aria-label="Offer to trade or index"
                      title="Offer to trade or index — adds it to your Trade Board post"
                      className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${forTrade ? 'bg-emerald-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                    >
                      ⇄
                    </button>
                    <button
                      onClick={() => onToggleWanted(v.id, !wanted)}
                      aria-label="Want to index"
                      title="Want to index — adds it to your Trade Board post"
                      className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${wanted ? 'bg-pink-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                    >
                      ♥
                    </button>
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

        {!readOnly && (
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
            <b className="text-white">Owned</b> · <span className="text-amber-300">★</span> mastered ·{' '}
            <span className="text-emerald-300">⇄</span> offer to trade/index ·{' '}
            <span className="text-pink-300">♥</span> want to index. The last two prefill your{' '}
            <b className="text-white">Trade Board</b> post. <span className="text-amber-300">≈dust</span> = Sprite Dust to re-summon (indexing avoids it).
          </p>
        )}
      </div>
    </div>
  )
}
