import { THEME_MAP } from '../data/themes'
import { RARITY_COLORS } from '../data/sprites'
import SpriteArt from './SpriteArt'

// Dense "tick them off fast" view, fortnite.gg-style: one row per Sprite with a
// thumbnail, and a round, tappable toggle per finish (BASE · GOLD · CHEAT ·
// HACKER · HUNTER · TRICK …). Tap a circle to mark that finish owned — far
// quicker than opening each card when entering a lot at once. Built from the same
// grouped/filtered list the grid uses, so search, theme, rarity and grouping all
// carry over.

// Fixed column order so the circles line up down the list, and short labels that
// match the in-game finish names (fall back to each theme's own short label).
const FINISH_ORDER = ['normal', 'gold', 'cheatmaster', 'loothacker', 'bountyhunter', 'trickortreat', 'gummy', 'galaxy', 'gem', 'holofoil', 'cube', 'quack']
const SHORT = {
  normal: 'BASE', gold: 'GOLD', cheatmaster: 'CHEAT', loothacker: 'HACKER',
  bountyhunter: 'HUNTER', trickortreat: 'TRICK',
}
const shortLabel = (themeId) => SHORT[themeId] || (THEME_MAP[themeId]?.short || THEME_MAP[themeId]?.name || themeId).toUpperCase()
const orderIndex = (themeId) => {
  const i = FINISH_ORDER.indexOf(themeId)
  return i === -1 ? FINISH_ORDER.length : i
}

export default function QuickCheckList({ groups, tracking, onToggleOwned, readOnly }) {
  return (
    <>
      {groups.map((g) => {
        // Regroup the group's variant-level items back into one row per Sprite,
        // keeping the finish columns in a consistent order.
        const byType = new Map()
        for (const it of g.items) {
          if (!byType.has(it.typeId)) byType.set(it.typeId, { typeId: it.typeId, typeName: it.typeName, rarity: it.rarity, items: [] })
          byType.get(it.typeId).items.push(it)
        }
        const rows = [...byType.values()]
        for (const r of rows) r.items.sort((a, b) => orderIndex(a.themeId) - orderIndex(b.themeId))

        return (
          <section key={g.key} className="mb-6">
            {g.label && (
              <h2 className="mb-3 font-display text-xl text-white/90">
                {g.label} <span className="text-sm text-[var(--muted)]">· {rows.length}</span>
              </h2>
            )}
            <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
              {rows.map((row) => {
                const ownable = row.items.filter((it) => !it.unreleased && !it.vaulted)
                const owned = ownable.filter((it) => tracking[it.id]?.owned).length
                const done = ownable.length > 0 && owned === ownable.length
                // Thumbnail uses the Normal finish when present (its art reads best).
                const thumb = row.items.find((it) => it.themeId === 'normal') || row.items[0]
                const theme = THEME_MAP[thumb.themeId]
                return (
                  <div key={row.typeId} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2.5">
                    {/* Thumbnail + name + progress */}
                    <div className={`sprite-art ${theme?.className || 'theme-normal'} relative h-11 w-11 shrink-0 overflow-hidden rounded-lg`}>
                      <SpriteArt sprite={thumb} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: RARITY_COLORS[row.rarity] || '#888' }} />
                        <span className="truncate font-bold text-white">{row.typeName}</span>
                      </span>
                      <span className={`text-[11px] font-semibold ${done ? 'text-emerald-400' : 'text-[var(--muted)]'}`}>
                        {owned}/{ownable.length} owned
                      </span>
                    </div>

                    {/* Finish circles */}
                    <div className="flex shrink-0 flex-wrap items-start justify-end gap-x-2 gap-y-1">
                      {row.items.map((it) => {
                        const tm = THEME_MAP[it.themeId]
                        const accent = tm?.accent || 'var(--brand)'
                        const label = shortLabel(it.themeId)
                        const locked = it.unreleased || it.vaulted
                        const isOwned = !!tracking[it.id]?.owned
                        const disabled = readOnly || locked
                        const lockTitle = it.vaulted ? 'Vaulted — not currently obtainable' : 'Not released yet'
                        return (
                          <div key={it.id} className="flex w-9 flex-col items-center gap-1">
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => !disabled && onToggleOwned(it.id, !isOwned)}
                              aria-pressed={isOwned}
                              title={locked
                                ? `${tm?.name || it.themeId} — ${lockTitle}`
                                : `${tm?.name || it.themeId}${isOwned ? ' — owned (tap to remove)' : ' — tap to mark owned'}`}
                              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-black transition-colors ${
                                locked
                                  ? 'cursor-not-allowed border-dashed border-[var(--border)] text-[var(--muted)] opacity-50'
                                  : isOwned
                                    ? 'text-black'
                                    : 'border-[var(--border)] text-transparent hover:border-white/70'
                              } ${!disabled ? 'cursor-pointer' : ''}`}
                              style={!locked && isOwned ? { background: accent, borderColor: accent } : undefined}
                            >
                              {locked ? '🔒' : isOwned ? '✓' : ''}
                            </button>
                            <span
                              className="text-[8px] font-bold leading-none tracking-wide"
                              style={{ color: it.themeId === 'normal' ? 'var(--muted)' : accent, opacity: locked ? 0.5 : 1 }}
                            >
                              {label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </>
  )
}
