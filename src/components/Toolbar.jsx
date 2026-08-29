import { useState, useRef, useEffect } from 'react'
import { THEMES } from '../data/themes'
import { RARITY_ORDER, RARITY_COLORS, GENERATIONS } from '../data/sprites'
import Tooltip from './Tooltip'

const selectCls =
  'rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]'

function Chip({ active, onClick, children, color, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
        active ? 'text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
      }`}
      style={active ? { background: color || 'var(--brand)' } : undefined}
    >
      {children}
    </button>
  )
}

// Season / generation multiselect — a dropdown of checkboxes (empty = all seasons).
function SeasonSelect({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  const summary =
    selected.length === 0 ? 'All seasons'
    : selected.length === 1 ? (GENERATIONS.find((g) => g.id === selected[0])?.sub || selected[0])
    : `${selected.length} seasons`
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title="Filter by season (pick one or more)"
        className={`${selectCls} flex items-center gap-1.5`}
      >
        <span className="text-[var(--muted)]">Season:</span>
        <span className="font-semibold">{summary}</span>
        <span className="text-[var(--muted)]">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-1 min-w-[200px] rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1.5 shadow-xl">
          {GENERATIONS.map((g) => (
            <label key={g.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white hover:bg-[var(--panel-2)]">
              <input type="checkbox" checked={selected.includes(g.id)} onChange={() => toggle(g.id)} />
              <span>{g.sub}<span className="text-[var(--muted)]">{g.current ? ' · now' : g.legacy ? ' · last season' : ''}</span></span>
            </label>
          ))}
          {selected.length > 0 && (
            <button onClick={() => onChange([])} className="mt-1 w-full rounded-lg px-2 py-1 text-left text-[11px] font-bold text-[var(--muted)] hover:text-white">
              Clear seasons
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Human labels for the currently-applied filters, each with the patch that clears
// just that one — rendered as removable chips so what's active stays visible.
function activeChips(filters) {
  const chips = []
  for (const gid of filters.generation) {
    const g = GENERATIONS.find((x) => x.id === gid)
    chips.push({ label: g ? g.sub : gid, clear: { generation: filters.generation.filter((x) => x !== gid) } })
  }
  if (filters.rarity !== 'all') chips.push({ label: filters.rarity, clear: { rarity: 'all' } })
  if (filters.theme !== 'all') {
    const t = THEMES.find((x) => x.id === filters.theme)
    chips.push({ label: t ? t.name : filters.theme, clear: { theme: 'all' } })
  }
  if (filters.groupBy !== 'none') chips.push({ label: `Grouped: ${filters.groupBy}`, clear: { groupBy: 'none' } })
  if (filters.hideMastered) chips.push({ label: 'Hiding mastered', clear: { hideMastered: false } })
  if (!filters.showUnreleased) chips.push({ label: 'Hiding unreleased', clear: { showUnreleased: true } })
  return chips
}

export default function Toolbar({ filters, setFilters, themeStats, count, total, onClear, hasActiveFilters }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const chips = activeChips(filters)

  return (
    <div className="flex flex-col gap-3">
      {/* Primary controls: search · ownership · season · sort · view. */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search sprites…"
          title="Search by sprite name, theme, or rarity"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)] sm:w-56"
        />

        {/* Ownership — a compact dropdown. */}
        <select value={filters.ownership} onChange={(e) => set({ ownership: e.target.value })} title="Show owned, missing, or all sprites" className={`${selectCls} shrink-0`}>
          <option value="all">All sprites</option>
          <option value="owned">Owned</option>
          <option value="unowned">Missing</option>
        </select>

        {/* Season — a multiselect dropdown. */}
        <SeasonSelect selected={filters.generation} onChange={(g) => set({ generation: g })} />

        <div className="flex items-center gap-2 sm:ml-auto">
          {/* Sort. */}
          <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} title="Sort order" className={`${selectCls} shrink-0`}>
            <option value="default">Default order</option>
            <option value="closest">Closest to complete</option>
            <option value="name">Name A–Z</option>
            <option value="rarity">Rarity</option>
          </select>

          {/* Grid ↔ Quick-check list view. */}
          <div className="flex shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
            {[['grid', '▦', 'Grid view'], ['list', '☰', 'Quick-check list — tick variants fast']].map(([v, icon, title]) => (
              <button
                key={v}
                onClick={() => set({ view: v })}
                title={title}
                aria-label={title}
                aria-pressed={filters.view === v}
                className={`px-3 py-2 text-sm font-bold transition-colors ${filters.view === v ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel)] text-[var(--muted)] hover:text-white'}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rarity + Variant quick filters — always visible. */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Rarity</span>
          <Chip active={filters.rarity === 'all'} onClick={() => set({ rarity: 'all' })} title="Any rarity">Any</Chip>
          {RARITY_ORDER.map((r) => (
            <Chip key={r} active={filters.rarity === r} color={RARITY_COLORS[r]} onClick={() => set({ rarity: r })} title={r}>{r}</Chip>
          ))}
        </div>

        {/* Variant — the signature filter (9 themes with owned counts); scrolls
            horizontally so it never overflows on phones. */}
        <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5 [&>*]:shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Variant</span>
          <Chip active={filters.theme === 'all'} onClick={() => set({ theme: 'all' })} title="All variant themes">All</Chip>
          {THEMES.map((t) => {
            const st = themeStats?.[t.id]
            return (
              <Tooltip key={t.id} content={t.bonus} below>
                <Chip active={filters.theme === t.id} color={t.accent} onClick={() => set({ theme: t.id })}>
                  {t.name}{st ? <span className="opacity-70"> {st.owned}/{st.total}</span> : null}
                </Chip>
              </Tooltip>
            )
          })}
        </div>
      </div>

      {/* Options — grouping + toggles, kept in the open (not hidden behind a button). */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={filters.groupBy} onChange={(e) => set({ groupBy: e.target.value })} title="Group sprites" className={selectCls}>
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

      {/* Count + active-filter chips (each removable) + clear. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[var(--muted)]">
          Showing <span className="text-white">{count}</span>{typeof total === 'number' ? ` of ${total}` : ''} sprites
        </span>
        {chips.map((c) => (
          <button
            key={c.label}
            onClick={() => set(c.clear)}
            title={`Remove filter: ${c.label}`}
            className="flex items-center gap-1 rounded-full bg-[var(--brand)]/15 px-2.5 py-1 text-[11px] font-bold text-[var(--brand)] hover:bg-[var(--brand)]/25"
          >
            {c.label} <span aria-hidden="true">✕</span>
          </button>
        ))}
        {hasActiveFilters && (
          <button onClick={onClear} title="Reset every filter (keeps your view & sort)" className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
