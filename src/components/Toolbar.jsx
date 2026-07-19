import { useState } from 'react'
import { THEMES } from '../data/themes'
import { RARITY_ORDER } from '../data/sprites'
import Tooltip from './Tooltip'

// Filters that count toward the "active" badge (search + sort stay quick-access
// in the bar, so they're excluded from the badge count).
const FILTER_DEFAULTS = {
  theme: 'all',
  rarity: 'all',
  ownership: 'all',
  groupBy: 'none',
  hideMastered: false,
  showUnreleased: false,
}

function Chip({ active, onClick, children, color }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
        active ? 'text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
      }`}
      style={active ? { background: color || 'var(--brand)' } : undefined}
    >
      {children}
    </button>
  )
}

const selectCls =
  'rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]'

export default function Toolbar({ filters, setFilters, themeStats, count, total, onClear, hasActiveFilters }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const [open, setOpen] = useState(false)

  const activeCount = Object.entries(FILTER_DEFAULTS).filter(([k, v]) => filters[k] !== v).length

  return (
    <div className="flex flex-col gap-3">
      {/* Compact bar — search + sort stay out; everything else hides behind
          Filters (on every viewport, so the grid shows sooner). */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search sprites…"
          title="Search by sprite name, theme, or rarity"
          className="min-w-[160px] flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
        />
        <select
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
          title="Sort order"
          className={`${selectCls} shrink-0`}
        >
          <option value="default">Default order</option>
          <option value="name">Name A–Z</option>
          <option value="rarity">Rarity</option>
        </select>
        {/* Grid ↔ Quick-check list view. The list is a fast way to tick many
            variants at once. */}
        <div className="flex shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
          {[['grid', '▦', 'Grid view'], ['list', '☰', 'Quick-check list — tick variants fast']].map(([v, icon, title]) => (
            <button
              key={v}
              onClick={() => set({ view: v })}
              title={title}
              aria-label={title}
              aria-pressed={filters.view === v}
              className={`px-3 py-2 text-sm font-bold transition-colors ${
                filters.view === v ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel)] text-[var(--muted)] hover:text-white'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
            open || activeCount > 0
              ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-white'
              : 'border-[var(--border)] bg-[var(--panel)] text-white hover:border-[var(--brand)]'
          }`}
        >
          ⚙ Filters
          {activeCount > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-extrabold text-black">
              {activeCount}
            </span>
          )}
          <span className="text-[var(--muted)]">{open ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Result count + clear, always visible so you know what you're looking at. */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[var(--muted)]">
          Showing <span className="text-white">{count}</span>
          {typeof total === 'number' ? ` of ${total}` : ''} sprites
        </span>
        {hasActiveFilters && (
          <button onClick={onClear} className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Collapsible filter panel (all viewports). */}
      {open && (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3">
          <div className="flex flex-wrap items-center gap-2">
            <select value={filters.ownership} onChange={(e) => set({ ownership: e.target.value })} title="Filter by ownership" className={selectCls}>
              <option value="all">All ownership</option>
              <option value="owned">Owned only</option>
              <option value="unowned">Missing only</option>
            </select>
            <select value={filters.groupBy} onChange={(e) => set({ groupBy: e.target.value })} className={selectCls}>
              <option value="none">No grouping</option>
              <option value="theme">Group by theme</option>
              <option value="rarity">Group by rarity</option>
              <option value="tier">Group by tier</option>
              <option value="sprite">Group by sprite</option>
            </select>
            <label className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
              <input type="checkbox" checked={filters.hideMastered} onChange={(e) => set({ hideMastered: e.target.checked })} />
              Hide mastered
            </label>
            <label className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
              <input type="checkbox" checked={filters.showUnreleased} onChange={(e) => set({ showUnreleased: e.target.checked })} />
              Show unreleased
            </label>
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Variant</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip active={filters.theme === 'all'} onClick={() => set({ theme: 'all' })}>All</Chip>
              {THEMES.map((t) => {
                const st = themeStats?.[t.id]
                return (
                  <Tooltip key={t.id} content={t.bonus} below>
                    <Chip active={filters.theme === t.id} color={t.accent} onClick={() => set({ theme: t.id })}>
                      {t.name}
                      {st ? <span className="opacity-70"> {st.owned}/{st.total}</span> : null}
                    </Chip>
                  </Tooltip>
                )
              })}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Rarity</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip active={filters.rarity === 'all'} onClick={() => set({ rarity: 'all' })}>Any</Chip>
              {RARITY_ORDER.map((r) => (
                <Chip key={r} active={filters.rarity === r} onClick={() => set({ rarity: r })}>{r}</Chip>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
