import { useState } from 'react'
import { THEMES } from '../data/themes'
import { RARITY_ORDER } from '../data/sprites'
import Tooltip from './Tooltip'

// Filters that count toward the mobile "active" badge (search is always visible
// separately, so it's excluded here).
const FILTER_DEFAULTS = {
  theme: 'all',
  rarity: 'all',
  ownership: 'all',
  groupBy: 'none',
  sort: 'default',
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

export default function Toolbar({ filters, setFilters, themeStats, count, total, onClear, hasActiveFilters }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const [open, setOpen] = useState(false)

  const activeCount = Object.entries(FILTER_DEFAULTS).filter(([k, v]) => filters[k] !== v).length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[var(--muted)]">
          Showing <span className="text-white">{count}</span>{typeof total === 'number' ? ` of ${total}` : ''} sprites
        </span>
        {hasActiveFilters && (
          <button onClick={onClear} className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Search + selects. On desktop everything sits in one wrapping row
          exactly as before (the inner group uses display:contents); on mobile
          the selects/checkboxes collapse behind the Filters toggle. */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search sprites…"
          title="Search by sprite name, theme, or rarity"
          className="min-w-[180px] flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
        />
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm font-bold text-white sm:hidden"
        >
          ⚙ Filters
          {activeCount > 0 && (
            <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-extrabold text-black">
              {activeCount}
            </span>
          )}
          <span className="text-[var(--muted)]">{open ? '▲' : '▼'}</span>
        </button>
        <div className={`${open ? 'contents' : 'hidden'} sm:contents`}>
        <select
          value={filters.ownership}
          onChange={(e) => set({ ownership: e.target.value })}
          title="Filter by ownership"
          className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
        >
          <option value="all">All</option>
          <option value="owned">Owned only</option>
          <option value="unowned">Missing only</option>
        </select>
        <select
          value={filters.groupBy}
          onChange={(e) => set({ groupBy: e.target.value })}
          className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
        >
          <option value="none">No grouping</option>
          <option value="theme">Group by theme</option>
          <option value="rarity">Group by rarity</option>
          <option value="sprite">Group by sprite</option>
        </select>
        <select
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
          className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
        >
          <option value="default">Default order</option>
          <option value="name">Name A–Z</option>
          <option value="rarity">Rarity</option>
        </select>
        <label className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
          <input type="checkbox" checked={filters.hideMastered} onChange={(e) => set({ hideMastered: e.target.checked })} />
          Hide mastered
        </label>
        <label className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
          <input type="checkbox" checked={filters.showUnreleased} onChange={(e) => set({ showUnreleased: e.target.checked })} />
          Show unreleased
        </label>
        </div>
      </div>

      {/* Theme + rarity chips — collapse on mobile, always shown from sm up */}
      <div className={`${open ? 'flex' : 'hidden'} flex-col gap-3 sm:flex`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={filters.theme === 'all'} onClick={() => set({ theme: 'all' })}>
          All themes
        </Chip>
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

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={filters.rarity === 'all'} onClick={() => set({ rarity: 'all' })}>
          Any rarity
        </Chip>
        {RARITY_ORDER.map((r) => (
          <Chip key={r} active={filters.rarity === r} onClick={() => set({ rarity: r })}>
            {r}
          </Chip>
        ))}
      </div>
      </div>
    </div>
  )
}
