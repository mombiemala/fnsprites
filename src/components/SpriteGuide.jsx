import { useState, useMemo } from 'react'
import {
  SPRITE_TYPES, SPRITE_BY_ID, RARITY_COLORS, RARITY_ORDER,
  TIER_META, dustCost, spriteSource, spriteTier,
} from '../data/sprites'

// Base (Normal) drop-rate string → probability, or null when unpublished.
function parseRate(s) {
  if (!s) return null
  const n = parseFloat(String(s).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n / 100 : null
}

const RARITY_RANK = Object.fromEntries(RARITY_ORDER.map((r, i) => [r, i]))
const fmt = (n) => Math.round(n).toLocaleString()

// One row per base Sprite, enriched with everything the guide needs.
function buildRows() {
  return SPRITE_TYPES.map((t) => {
    const live = SPRITE_BY_ID[`${t.id}_normal`]
    const released = !!live?.released
    const vaulted = !!(t.vaulted || live?.vaulted)
    const p = parseRate(t.dropRate)
    const status = vaulted ? 'vaulted' : released ? 'available' : 'upcoming'
    return {
      id: t.id,
      name: t.name,
      icon: t.icon,
      rarity: t.rarity,
      tier: spriteTier(t.id),
      dropRate: t.dropRate,
      p,
      avgChests: p ? Math.round(1 / p) : null,
      dust: dustCost(t.rarity, 'normal'),
      source: spriteSource(t.id),
      status,
    }
  })
}

const STATUS_META = {
  available: { label: 'Available', color: '#34d399' },
  upcoming: { label: 'Upcoming', color: '#3da9fc' },
  vaulted: { label: 'Vaulted', color: '#ef4444' },
}

const SORTS = {
  // Easiest first: obtainable, then by best drop rate (unknown rates sink), then rarity.
  easiest: (a, b) =>
    (a.status === 'available' ? 0 : 1) - (b.status === 'available' ? 0 : 1) ||
    (b.p ?? -1) - (a.p ?? -1) ||
    RARITY_RANK[a.rarity] - RARITY_RANK[b.rarity],
  rarest: (a, b) =>
    RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || (a.p ?? 2) - (b.p ?? 2),
  dust: (a, b) => (a.dust ?? Infinity) - (b.dust ?? Infinity),
  az: (a, b) => a.name.localeCompare(b.name),
}
const SORT_LABELS = { easiest: 'Easiest', rarest: 'Rarest', dust: 'Cheapest Dust', az: 'A–Z' }
const FILTERS = { all: 'All', available: 'Available', upcoming: 'Upcoming', vaulted: 'Vaulted' }

export default function SpriteGuide() {
  const [sort, setSort] = useState('easiest')
  const [filter, setFilter] = useState('all')
  const allRows = useMemo(() => buildRows(), [])
  // Monday = Mastery Monday (2× Sprite Dust & XP). getDay(): 0 Sun … 1 Mon.
  const isMasteryMonday = new Date().getDay() === 1

  const rows = useMemo(() => {
    let r = allRows
    if (filter !== 'all') r = r.filter((x) => x.status === filter)
    return [...r].sort(SORTS[sort])
  }, [allRows, sort, filter])

  const available = allRows.filter((r) => r.status === 'available').length

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">🧭 How to get every Sprite</h3>
        <span className="text-xs text-[var(--muted)]">{available} obtainable right now</span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-[var(--muted)]">
        Every Sprite, ranked by how easy it is to land — with its drop rate, average Sprite Chests, re-summon Dust cost and where to find it.
      </p>

      <div
        className={`mb-3 rounded-xl px-3 py-2 text-xs font-semibold ${
          isMasteryMonday ? 'bg-amber-400/15 text-amber-200' : 'bg-[var(--bg-2)] text-[var(--muted)]'
        }`}
      >
        {isMasteryMonday ? '🔥 It’s Mastery Monday' : '📅 Mastery Mondays'} — 2× Sprite Dust &amp; XP and boosted Sprite spawns{isMasteryMonday ? ' all day. Best day to grind & level.' : ' every Monday. The fastest day to farm and level up.'}
      </div>

      {/* Controls */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {Object.entries(SORT_LABELS).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              title={`Sort by ${label}`}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                sort === k ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-1">
          {Object.entries(FILTERS).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              title={`Show ${label}`}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                filter === k ? 'bg-white/90 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Column header (desktop) */}
      <div className="hidden grid-cols-[1.6fr_0.7fr_0.9fr_0.7fr_2fr] gap-2 px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)] sm:grid">
        <span>Sprite</span><span>Tier</span><span className="text-right">Drop / chests</span><span className="text-right">Dust</span><span>How to get</span>
      </div>

      <div className="space-y-1">
        {rows.length === 0 && (
          <p className="rounded-xl bg-[var(--bg-2)] p-4 text-center text-xs text-[var(--muted)]">No Sprites match this filter.</p>
        )}
        {rows.map((r) => {
          const st = STATUS_META[r.status]
          const tm = r.tier ? TIER_META[r.tier] : null
          return (
            <a
              key={r.id}
              href={`?sprite=${r.id}`}
              className="grid grid-cols-2 items-center gap-2 rounded-xl bg-[var(--bg-2)] px-2.5 py-2 transition-colors hover:bg-[var(--panel-2)] sm:grid-cols-[1.6fr_0.7fr_0.9fr_0.7fr_2fr]"
              title={`Open ${r.name}`}
            >
              {/* Name + rarity + status */}
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-lg leading-none">{r.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-bold text-white">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="rounded px-1 py-0.5 text-[9px] font-bold uppercase" style={{ color: RARITY_COLORS[r.rarity], background: `${RARITY_COLORS[r.rarity]}22` }}>{r.rarity}</span>
                    <span className="rounded px-1 py-0.5 text-[9px] font-bold" style={{ color: st.color, background: `${st.color}22` }}>{st.label}</span>
                  </div>
                </div>
              </div>

              {/* Tier */}
              <div className="text-right sm:text-left">
                {tm ? (
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-extrabold" style={{ color: tm.color, background: `${tm.color}22` }} title={tm.blurb}>{tm.label}</span>
                ) : (
                  <span className="text-[10px] text-[var(--muted)]">—</span>
                )}
              </div>

              {/* Drop / chests */}
              <div className="text-right text-xs">
                {r.p ? (
                  <>
                    <div className="font-semibold text-white">{r.dropRate}</div>
                    <div className="text-[10px] text-[var(--muted)]">~{fmt(r.avgChests)} chests</div>
                  </>
                ) : (
                  <span className="text-[10px] text-[var(--muted)]">rate TBD</span>
                )}
              </div>

              {/* Dust */}
              <div className="text-right text-xs">
                {r.dust != null ? <span className="font-semibold text-white">{fmt(r.dust)}</span> : <span className="text-[10px] text-[var(--muted)]">—</span>}
                <div className="text-[10px] text-[var(--muted)]">dust</div>
              </div>

              {/* How to get */}
              <p className="col-span-2 mt-1 text-[11px] leading-relaxed text-[var(--muted)] sm:col-span-1 sm:mt-0">{r.source}</p>
            </a>
          )
        })}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-[var(--muted)]">
        Drop rates &amp; Dust are community-estimated — Epic doesn’t publish official figures. Tap a Sprite for its full page. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
