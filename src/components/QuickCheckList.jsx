import { THEME_MAP } from '../data/themes'
import { RARITY_COLORS } from '../data/sprites'

// Dense "tick them off fast" view: one row per sprite, a tappable chip per
// variant. Built from the same grouped/filtered list the grid uses, so search,
// theme, rarity and grouping all carry over. Tapping a chip toggles owned — much
// quicker than opening each card when you're entering a lot at once.
export default function QuickCheckList({ groups, tracking, onToggleOwned, readOnly }) {
  return (
    <>
      {groups.map((g) => {
        // Regroup the group's variant-level items back into one row per sprite.
        const byType = new Map()
        for (const it of g.items) {
          if (!byType.has(it.typeId)) byType.set(it.typeId, { typeName: it.typeName, rarity: it.rarity, items: [] })
          byType.get(it.typeId).items.push(it)
        }
        const rows = [...byType.values()]
        return (
          <section key={g.key} className="mb-6">
            {g.label && (
              <h2 className="mb-3 font-display text-xl text-white/90">
                {g.label} <span className="text-sm text-[var(--muted)]">· {rows.length}</span>
              </h2>
            )}
            <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)]">
              {rows.map((row, i) => {
                const owned = row.items.filter((it) => tracking[it.id]?.owned).length
                const done = owned === row.items.length
                return (
                  <div key={row.typeName} className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 ${i % 2 ? 'bg-transparent' : 'bg-[var(--panel)]/40'}`}>
                    <div className="flex min-w-[150px] flex-1 items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: RARITY_COLORS[row.rarity] || '#888' }} />
                      <span className="font-bold text-white">{row.typeName}</span>
                      <span className={`text-xs font-semibold ${done ? 'text-emerald-400' : 'text-[var(--muted)]'}`}>{owned}/{row.items.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {row.items.map((it) => {
                        const isOwned = !!tracking[it.id]?.owned
                        const tm = THEME_MAP[it.themeId]
                        return (
                          <button
                            key={it.id}
                            disabled={readOnly}
                            onClick={() => onToggleOwned(it.id, !isOwned)}
                            title={`${tm?.name || it.themeId}${isOwned ? ' — owned (tap to remove)' : ' — tap to mark owned'}`}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                              isOwned ? 'text-black' : 'bg-[var(--bg-2)] text-[var(--muted)] hover:text-white'
                            } ${readOnly ? 'cursor-default' : ''}`}
                            style={isOwned ? { background: tm?.accent || 'var(--brand)' } : undefined}
                          >
                            {isOwned ? '✓ ' : ''}{tm?.name || it.themeId}
                          </button>
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
