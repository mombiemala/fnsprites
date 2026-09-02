import { useMemo } from 'react'
import { ALL_SPRITES, RARITY_ORDER, dustCost } from '../data/sprites'
import { THEMES, THEME_MAP } from '../data/themes'

export default function StatsBreakdown({ tracking }) {
  const { closest, collectionPct, masteryPct, dustToComplete } = useMemo(() => {
    const released = ALL_SPRITES.filter((s) => s.released)
    const owned = (s) => !!tracking[s.id]?.owned

    // Collection % = variants owned vs everything obtainable right now.
    const ownedCount = released.filter(owned).length
    const collectionPct = released.length ? Math.round((ownedCount / released.length) * 100) : 0

    // Mastery % = total levels earned vs the max (5 each).
    const totalLevels = released.reduce((sum, s) => sum + (tracking[s.id]?.level || 0), 0)
    const masteryPct = released.length ? Math.round((totalLevels / (released.length * 5)) * 100) : 0

    // Sprite Dust to summon everything you're still missing (skip finishes you
    // don't summon with Dust — Cheatmaster is code-unlocked, Quack is a reward).
    let dustToComplete = 0
    for (const s of released) {
      if (owned(s)) continue
      const th = THEME_MAP[s.themeId]
      if (th?.noSummon || th?.mastery) continue
      dustToComplete += dustCost(s.rarity, s.themeId) || 0
    }

    // The one nudge we keep: the group (rarity or theme) you're closest to finishing.
    const groups = [
      ...RARITY_ORDER.map((r) => {
        const list = released.filter((s) => s.rarity === r)
        return { label: r, total: list.length, owned: list.filter(owned).length, kind: 'rarity' }
      }),
      ...THEMES.map((t) => {
        const list = released.filter((s) => s.themeId === t.id)
        return { label: t.name, total: list.length, owned: list.filter(owned).length, kind: 'theme' }
      }),
    ]
    const incomplete = groups.filter((g) => g.total > 0 && g.owned < g.total)
    incomplete.sort((a, b) => (a.total - a.owned) - (b.total - b.owned) || b.owned / b.total - a.owned / a.total)
    const closest = incomplete[0] || null

    return { closest, collectionPct, masteryPct, dustToComplete }
  }, [tracking])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/60 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">Breakdown</h3>
        {closest ? (
          <span className="rounded-full bg-[var(--brand)]/15 px-3 py-1 text-xs font-bold text-[var(--brand)]">
            🎯 {closest.total - closest.owned} away from completing {closest.label}
            {closest.kind === 'theme' ? ' theme' : ''}
          </span>
        ) : (
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">🏆 Everything collected!</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Variants owned vs everything obtainable right now">
          🗂️ Collection <span className="text-[var(--brand)]">{collectionPct}%</span>
        </span>
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Total sprite levels earned vs the max (5 each)">
          🏅 Mastery <span className="text-amber-300">{masteryPct}%</span>
        </span>
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Sprite Dust to summon everything you're still missing">
          💨 Dust to complete <span className="text-[var(--brand)]">≈{dustToComplete.toLocaleString()}</span>
        </span>
      </div>
    </div>
  )
}
