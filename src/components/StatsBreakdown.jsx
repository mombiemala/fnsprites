import { useMemo } from 'react'
import { ALL_SPRITES, RARITY_ORDER, RARITY_COLORS, dustCost } from '../data/sprites'
import { THEMES } from '../data/themes'

function Ring({ owned, total, color, label }) {
  const pct = total ? owned / total : 0
  const r = 18
  const c = 2 * Math.PI * r
  const done = total > 0 && owned >= total
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 44 44" className="h-12 w-12 -rotate-90">
          <circle cx="22" cy="22" r={r} fill="none" stroke="#222a45" strokeWidth="5" />
          <circle
            cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[10px] font-extrabold" style={{ color: done ? color : '#eaf0ff' }}>
          {done ? '✓' : `${Math.round(pct * 100)}`}
        </span>
      </div>
      <span className="text-[10px] font-bold text-[var(--muted)]">{label}</span>
    </div>
  )
}

export default function StatsBreakdown({ tracking }) {
  const { rarities, themes, closest, badges, masteryPct, dustToComplete } = useMemo(() => {
    const released = ALL_SPRITES.filter((s) => s.released)
    const owned = (s) => !!tracking[s.id]?.owned

    // Mastery % based on levels (each sprite is worth up to 5) + total Sprite
    // Dust still needed to summon everything you're missing.
    const totalLevels = released.reduce((sum, s) => sum + (tracking[s.id]?.level || 0), 0)
    const masteryPct = released.length ? Math.round((totalLevels / (released.length * 5)) * 100) : 0
    const dustToComplete = released
      .filter((s) => !owned(s))
      .reduce((sum, s) => sum + (dustCost(s.rarity, s.themeId) || 0), 0)

    const byRarity = RARITY_ORDER.map((r) => {
      const list = released.filter((s) => s.rarity === r)
      return { key: r, label: r, total: list.length, owned: list.filter(owned).length, color: RARITY_COLORS[r] }
    }).filter((g) => g.total > 0)

    const byTheme = THEMES.map((t) => {
      const list = released.filter((s) => s.themeId === t.id)
      return { key: t.id, label: t.name, total: list.length, owned: list.filter(owned).length, color: t.accent }
    }).filter((g) => g.total > 0)

    // closest incomplete group (fewest remaining, then highest %)
    const groups = [...byRarity.map((g) => ({ ...g, kind: 'rarity' })), ...byTheme.map((g) => ({ ...g, kind: 'theme' }))]
    const incomplete = groups.filter((g) => g.owned < g.total)
    incomplete.sort((a, b) => (a.total - a.owned) - (b.total - b.owned) || b.owned / b.total - a.owned / a.total)
    const closest = incomplete[0] || null

    const badges = groups.filter((g) => g.owned >= g.total).map((g) => ({ label: g.label, color: g.color }))
    return { rarities: byRarity, themes: byTheme, closest, badges, masteryPct, dustToComplete }
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

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Total sprite levels earned vs the max (5 each)">
          🏅 Mastery <span className="text-amber-300">{masteryPct}%</span>
        </span>
        <span className="rounded-lg bg-[var(--bg-2)] px-3 py-1.5 text-xs font-bold text-white" title="Sprite Dust to summon everything you're still missing">
          💨 Dust to complete <span className="text-[var(--brand)]">≈{dustToComplete.toLocaleString()}</span>
        </span>
      </div>

      <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">By rarity</div>
      <div className="mb-3 flex flex-wrap gap-3">
        {rarities.map((g) => <Ring key={g.key} {...g} />)}
      </div>

      <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">By theme</div>
      <div className="flex flex-wrap gap-3">
        {themes.map((g) => <Ring key={g.key} {...g} />)}
      </div>

      {badges.length > 0 && (
        <div className="mt-3 border-t border-[var(--border)] pt-3">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Badges earned</div>
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <span key={b.label} className="rounded-full px-2.5 py-1 text-[11px] font-extrabold text-black" style={{ background: b.color }}>
                {b.label} ✓
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
