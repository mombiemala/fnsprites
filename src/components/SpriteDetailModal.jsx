import { useState } from 'react'
import { SPRITE_TYPES, ALL_SPRITES, SPRITE_BY_ID, RARITY_COLORS, dustCost, spriteSource, spriteScaling, spriteTier, TIER_META, GEN_MAP } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import SpriteArt from './SpriteArt'
import { useEscClose } from '../lib/useEscClose'
import { useAuth } from '../context/authStore'

export default function SpriteDetailModal({ typeId, tracking, onClose, onToggleOwned, onToggleMastered, onSetLevel, readOnly }) {
  useEscClose(onClose)
  const { fetchSpriteHolders } = useAuth()
  // "Who owns this" — loaded on demand the first time the section is expanded.
  const [holders, setHolders] = useState(null)
  const [holdersOpen, setHoldersOpen] = useState(false)
  const [holdersLoading, setHoldersLoading] = useState(false)
  const toggleHolders = () => {
    const next = !holdersOpen
    setHoldersOpen(next)
    if (next && holders === null && !holdersLoading) {
      setHoldersLoading(true)
      fetchSpriteHolders(typeId).then((rows) => { setHolders(rows); setHoldersLoading(false) })
    }
  }
  const type = SPRITE_TYPES.find((t) => t.id === typeId)
  if (!type) return null
  const variants = ALL_SPRITES.filter((s) => s.typeId === typeId)
  const ownedCount = variants.filter((v) => tracking[v.id]?.owned).length
  const scaling = spriteScaling(type.id)
  const tier = spriteTier(type.id)
  const tierMeta = tier ? TIER_META[tier] : null
  // Highest level among the variants you actually own — so we can show progress
  // against the ability's Lv-5 scaling.
  const bestLevel = variants.reduce((m, v) => (tracking[v.id]?.owned ? Math.max(m, tracking[v.id]?.level || 0) : m), 0)
  // Released Sprites have a static /sprite/<slug> page (see scripts/prerender.mjs);
  // link to it so the modal can hand off to the fuller, shareable page.
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

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
                {tierMeta && (
                  <span
                    title={`Gameplay tier: ${tierMeta.blurb} (community/meta ranking)`}
                    className="rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase"
                    style={{ color: tierMeta.color, background: `${tierMeta.color}22` }}
                  >
                    {tierMeta.label}
                  </span>
                )}
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
                {type.vaulted && (
                  <span
                    title="Launched then pulled by Epic — currently unavailable (owners keep it)"
                    className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-300"
                  >
                    Vaulted
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} title="Close" aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        {/* Generation / Battle-Royale status — current gen plays in BR; older
            generations are preserved in the Sprite Garden but not used in BR. */}
        {(() => {
          const gen = GEN_MAP[type.gen || 'c7s3']
          if (!gen) return null
          const current = !!gen.current
          return (
            <div
              className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${current ? 'bg-emerald-400/10 text-emerald-200' : 'bg-[var(--bg-2)] text-[var(--muted)]'}`}
              title={current ? 'Current generation — playable in Battle Royale this season' : 'Older generation — kept in your collection & the in-game Sprite Garden, but not used in Battle Royale this season (may return later)'}
            >
              <span>{current ? '🟢' : '🏡'}</span>
              <span>
                <b className="text-white">{gen.name} · {gen.sub}</b>{' '}
                {current ? '— playable in Battle Royale now' : '— Garden archive (kept forever; not used in BR this season)'}
              </span>
            </div>
          )
        })()}

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

        {/* Where to find — descriptive source hint */}
        <div className="mt-2 rounded-xl bg-[var(--bg-2)] px-3 py-2">
          <p className="text-sm text-[var(--text)]/90">
            <span className="font-bold text-[var(--brand)]">🗺️ Where to find:</span> {spriteSource(type.id)}
          </p>
        </div>

        {type.released && (
          <a
            href={`/sprite/${slug(type.name)}`}
            title={`Open the full ${type.name} Sprite page`}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm font-bold text-[var(--brand)] transition-colors hover:border-[var(--brand)]"
          >
            View the full {type.name} page — drop rate, dust &amp; FAQ →
          </a>
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
                    {v.vaulted ? (
                      <span title="Vaulted — currently unavailable" className="rounded bg-red-500/15 px-1 py-0.5 text-[9px] font-bold uppercase text-red-300">vaulted</span>
                    ) : v.unreleased && (
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
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => onToggleOwned(v.id, !owned)}
                      aria-label={owned ? 'Owned' : 'Mark owned'}
                      title={owned ? 'You own this — tap to unmark' : 'Mark as owned'}
                      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                    >
                      {owned ? 'Owned' : 'Have'}
                    </button>
                    {owned && (
                      <button
                        onClick={() => onToggleMastered(v.id, !mastered)}
                        aria-label="Mastered"
                        title="Mastered (max level)"
                        className={`rounded-lg px-2 py-1.5 text-[11px] font-bold ${mastered ? 'bg-amber-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}
                      >
                        ★
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center gap-1">
                    <span className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${owned ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)]'}`}>
                      {owned ? 'Owned' : 'Missing'}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Who owns this — public collectors of this Sprite (loads on expand) */}
        <div className="mt-3">
          <button
            onClick={toggleHolders}
            className="flex w-full items-center justify-between rounded-xl bg-[var(--bg-2)] px-3 py-2 text-sm transition-colors hover:bg-[var(--panel-2)]"
            aria-expanded={holdersOpen}
          >
            <span className="font-bold text-white">👥 Who owns {type.name}{holders?.length ? <span className="text-[var(--muted)]"> · {holders.length}</span> : ''}</span>
            <span className="text-xs text-[var(--muted)]">{holdersOpen ? '▲' : '▼'}</span>
          </button>
          {holdersOpen && (
            <div className="mt-2">
              {holdersLoading ? (
                <p className="px-1 text-xs text-[var(--muted)]">Finding collectors…</p>
              ) : !holders?.length ? (
                <p className="px-1 text-xs text-[var(--muted)]">No public collectors yet — make your profile public to show yours off here.</p>
              ) : (
                <div className="flex max-h-56 flex-col gap-1 overflow-y-auto">
                  {holders.map((h) => {
                    const av = h.avatar ? SPRITE_BY_ID[h.avatar] : null
                    const avTheme = av ? THEME_MAP[av.themeId] : null
                    return (
                      <a key={h.user_id} href={`?u=${h.user_id}`} title={`View ${h.gamertag || 'this collector'}’s collection`} className="flex items-center gap-2 rounded-lg bg-[var(--bg-2)] px-2 py-1.5 transition-colors hover:bg-[var(--panel-2)]">
                        <span className={`sprite-art h-7 w-7 shrink-0 ${avTheme?.className || 'theme-normal'}`} style={{ borderRadius: '50%' }}>
                          {av ? <SpriteArt sprite={av} /> : <span className="grid h-full w-full place-items-center text-xs">🧩</span>}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{h.gamertag || 'Anonymous'}</span>
                        <span className="shrink-0 text-[11px] text-[var(--muted)]">{h.owned} owned{h.mastered ? ` · ${h.mastered}★` : ''}</span>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {!readOnly && (
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
            <b className="text-white">Owned</b> · <span className="text-amber-300">★</span> mastered.{' '}
            <span className="text-amber-300">≈dust</span> = Sprite Dust to re-summon this variant.
          </p>
        )}
      </div>
    </div>
  )
}
