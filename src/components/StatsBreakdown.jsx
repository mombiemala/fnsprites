import { useMemo } from 'react'
import { ALL_SPRITES, RARITY_ORDER, dustCost, CURRENT_GEN } from '../data/sprites'
import { THEMES, THEME_MAP } from '../data/themes'

export default function StatsBreakdown({ tracking }) {
  const { closest, seasonPct, collectionPct, masteryPct, dustToComplete } = useMemo(() => {
    const released = ALL_SPRITES.filter((s) => s.released)
    // Current-season Sprites are the achievable target — archived past-gen Sprites
    // can't be obtained in BR now, so completion/Dust are figured on the current
    // season (what a player can actually still finish), with all-time kept alongside.
    const current = released.filter((s) => s.gen === CURRENT_GEN)
    const owned = (s) => !!tracking[s.id]?.owned

    // "This season" — variants owned vs everything obtainable in the current season
    // (a number you can actually reach 100%). Collection % is the all-time total.
    const seasonPct = current.length ? Math.round((current.filter(owned).length / current.length) * 100) : 0
    const ownedCount = released.filter(owned).length
    const collectionPct = released.length ? Math.round((ownedCount / released.length) * 100) : 0

    // Mastery % = total levels earned vs the max (5 each), across everything owned.
    const totalLevels = released.reduce((sum, s) => sum + (tracking[s.id]?.level || 0), 0)
    const masteryPct = released.length ? Math.round((totalLevels / (released.length * 5)) * 100) : 0

    // Sprite Dust to summon the current-season variants you're still missing (skip
    // finishes you don't summon with Dust — Cheatmaster is code-unlocked, Quack is a
    // reward). Archived Sprites are excluded — they can't be summoned anymore.
    let dustToComplete = 0
    for (const s of current) {
      if (owned(s)) continue
      const th = THEME_MAP[s.themeId]
      if (th?.noSummon || th?.mastery) continue
      dustToComplete += dustCost(s.rarity, s.themeId) || 0
    }

    // The one nudge we keep: the current-season group (rarity or theme) you're
    // closest to finishing — always something you can actually complete.
    const groups = [
      ...RARITY_ORDER.map((r) => {
        const list = current.filter((s) => s.rarity === r)
        return { label: r, total: list.length, owned: list.filter(owned).length, kind: 'rarity' }
      }),
      ...THEMES.map((t) => {
        const list = current.filter((s) => s.themeId === t.id)
        return { label: t.name, total: list.length, owned: list.filter(owned).length, kind: 'theme' }
      }),
    ]
    const incomplete = groups.filter((g) => g.total > 0 && g.owned < g.total)
    incomplete.sort((a, b) => (a.total - a.owned) - (b.total - b.owned) || b.owned / b.total - a.owned / a.total)
    const closest = incomplete[0] || null

    return { closest, seasonPct, collectionPct, masteryPct, dustToComplete }
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
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Current-season variants owned — the total you can actually reach 100% on this season">
          🌩️ This season <span className="text-[var(--brand)]">{seasonPct}%</span>
        </span>
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="All-time: variants owned across every season, including archived Sprites kept in your Sprite Garden">
          🗂️ All-time <span className="text-white/70">{collectionPct}%</span>
        </span>
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Total sprite levels earned vs the max (5 each)">
          🏅 Mastery <span className="text-amber-300">{masteryPct}%</span>
        </span>
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Sprite Dust to summon the current-season variants you're still missing">
          💨 Dust to finish season <span className="text-[var(--brand)]">≈{dustToComplete.toLocaleString()}</span>
        </span>
      </div>
    </div>
  )
}
