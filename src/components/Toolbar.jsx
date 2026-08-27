import { useState } from 'react'
import { THEMES } from '../data/themes'
import { RARITY_ORDER, RARITY_COLORS, GENERATIONS } from '../data/sprites'
import Tooltip from './Tooltip'

// The secondary "⚙ Options" panel now holds only grouping + the toggles —
// generation, rarity and variant live in the always-visible quick-filter strip,
// so they're not gated behind the button. These defaults drive the button badge.
const OPTION_DEFAULTS = {
  groupBy: 'none',
  hideMastered: false,
  showUnreleased: true,
}

const selectCls =
  'rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]'

// A pill in a segmented control.
function Seg({ active, onClick, children, title, color }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`px-3 py-2 text-xs font-bold transition-colors ${active ? 'text-black' : 'bg-[var(--panel)] text-[var(--muted)] hover:text-white'}`}
      style={active ? { background: color || 'var(--brand)' } : undefined}
    >
      {children}
    </button>
  )
}

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

// Human labels for the currently-applied panel filters, each with the patch that
// clears just that one — rendered as removable chips so what's active is visible.
function activeChips(filters) {
  const chips = []
  if (filters.generation !== 'all') {
    const g = GENERATIONS.find((x) => x.id === filters.generation)
    chips.push({ label: g ? g.sub : filters.generation, clear: { generation: 'all' } })
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
  const [open, setOpen] = useState(false)

  const optionCount = Object.entries(OPTION_DEFAULTS).filter(([k, v]) => filters[k] !== v).length
  const chips = activeChips(filters)

  return (
    <div className="flex flex-col gap-3">
      {/* Primary row: a compact search, the key Owned/Missing control, then the
          view/sort/options cluster pushed right. Wraps cleanly on phones. */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search sprites…"
          title="Search by sprite name, theme, or rarity"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)] sm:w-56"
        />

        {/* Ownership — the #1 filter, a one-tap segmented control. */}
        <div className="flex shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
          <Seg active={filters.ownership === 'all'} onClick={() => set({ ownership: 'all' })} title="Show all sprites">All</Seg>
          <Seg active={filters.ownership === 'unowned'} onClick={() => set({ ownership: 'unowned' })} title="Only the sprites you're missing">Missing</Seg>
          <Seg active={filters.ownership === 'owned'} onClick={() => set({ ownership: 'owned' })} title="Only the sprites you own">Owned</Seg>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          {/* Sort — inline on desktop, in the Options panel on mobile. */}
          <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} title="Sort order" className={`${selectCls} hidden shrink-0 sm:block`}>
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

          {/* Options — grouping, mastered/unreleased toggles, mobile sort. */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            title="More options — grouping, hide mastered, show unreleased"
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
              open || optionCount > 0
                ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-white'
                : 'border-[var(--border)] bg-[var(--panel)] text-white hover:border-[var(--brand)]'
            }`}
          >
            ⚙ <span className="hidden sm:inline">Options</span>
            {optionCount > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-extrabold text-black">{optionCount}</span>
            )}
            <span className="text-[var(--muted)]">{open ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* Always-visible quick filters — the main narrowing controls (rarity,
          generation, variant) surfaced up front, no button click needed. */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Rarity</span>
            <Chip active={filters.rarity === 'all'} onClick={() => set({ rarity: 'all' })} title="Any rarity">Any</Chip>
            {RARITY_ORDER.map((r) => (
              <Chip key={r} active={filters.rarity === r} color={RARITY_COLORS[r]} onClick={() => set({ rarity: r })} title={r}>{r}</Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Gen</span>
            <Chip active={filters.generation === 'all'} onClick={() => set({ generation: 'all' })} title="All generations">All</Chip>
            {GENERATIONS.map((g) => (
              <Chip key={g.id} active={filters.generation === g.id} onClick={() => set({ generation: g.id })} title={`${g.name}${g.current ? ' (current)' : g.legacy ? ' (legacy)' : ''}`}>
                {g.sub}{g.current ? ' ·now' : g.legacy ? ' ·old' : ''}
              </Chip>
            ))}
          </div>
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

      {/* Count + active-filter chips (each removable) + clear. Applied filters are
          always visible here instead of hidden behind a badge. */}
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

      {/* Options panel — grouping + toggles (and sort on mobile). The narrowing
          filters live in the always-visible strip above, so this stays lean. */}
      {open && (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3">
          {/* Sort is inline on desktop; surface it here for mobile. */}
          <div className="sm:hidden">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Sort</p>
            <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} title="Sort order" className={`${selectCls} w-full`}>
              <option value="default">Default order</option>
              <option value="closest">Closest to complete</option>
              <option value="name">Name A–Z</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>

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
        </div>
      )}
    </div>
  )
}
