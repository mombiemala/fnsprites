import { useState, useRef, useEffect, useMemo } from 'react'
import { THEMES } from '../data/themes'
import { RARITY_ORDER, GENERATIONS, SPRITE_TYPES } from '../data/sprites'

// Simplified filter/search bar (fortnite.gg-style): a season tab row, then one
// clean line of Search · Variant · Sprite · Sort · view-toggle · ⚙ (advanced).
// The less-used options (ownership, rarity, grouping, hide-mastered, show-
// unreleased) live behind the gear so the common path stays uncluttered.

const selectCls =
  'rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]'

// "C7 S4" style short label from a generation id like "c7s4".
const shortSeason = (id) => id.replace(/c(\d+)s(\d+)/i, 'C$1 S$2').toUpperCase()

// Removable chips for what's currently applied, each with the patch that clears it.
function activeChips(filters) {
  const chips = []
  if (filters.spriteType !== 'all') {
    const t = SPRITE_TYPES.find((x) => x.id === filters.spriteType)
    chips.push({ label: t ? t.name : filters.spriteType, clear: { spriteType: 'all' } })
  }
  if (filters.theme !== 'all') {
    const t = THEMES.find((x) => x.id === filters.theme)
    chips.push({ label: t ? t.name : filters.theme, clear: { theme: 'all' } })
  }
  if (filters.rarity !== 'all') chips.push({ label: filters.rarity, clear: { rarity: 'all' } })
  if (filters.ownership !== 'all') chips.push({ label: filters.ownership === 'owned' ? 'Owned' : 'Missing', clear: { ownership: 'all' } })
  if (filters.groupBy !== 'none') chips.push({ label: `Grouped: ${filters.groupBy}`, clear: { groupBy: 'none' } })
  if (filters.hideMastered) chips.push({ label: 'Hiding mastered', clear: { hideMastered: false } })
  if (!filters.showUnreleased) chips.push({ label: 'Hiding unreleased', clear: { showUnreleased: true } })
  return chips
}

export default function Toolbar({ filters, setFilters, themeStats, count, total, onClear, hasActiveFilters }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const chips = activeChips(filters)

  // Advanced (gear) popover.
  const [gearOpen, setGearOpen] = useState(false)
  const gearRef = useRef(null)
  useEffect(() => {
    if (!gearOpen) return
    const onDoc = (e) => { if (gearRef.current && !gearRef.current.contains(e.target)) setGearOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [gearOpen])

  // Season is single-select here (All / one season). We keep the underlying
  // `generation` array shape so the filter logic is unchanged ([] = all seasons).
  const activeSeason = filters.generation.length === 1 ? filters.generation[0] : null
  const selectSeason = (id) => set({ generation: id ? [id] : [] })
  const seasonTabs = [...GENERATIONS].reverse().sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0))

  // When one season is selected, only offer the variants/rarities/sprites that
  // actually exist in it.
  const singleGen = filters.generation.length === 1 ? filters.generation[0] : null
  const { validRarity, validTheme } = useMemo(() => {
    if (!singleGen) return { validRarity: null, validTheme: null }
    const rarities = new Set(), themes = new Set()
    for (const t of SPRITE_TYPES) {
      if ((t.gen || 'c7s3') !== singleGen) continue
      rarities.add(t.rarity)
      for (const k of Object.keys(t.variants || {})) themes.add(k)
    }
    return { validRarity: rarities, validTheme: themes }
  }, [singleGen])
  const shownRarities = RARITY_ORDER.filter((r) => !validRarity || validRarity.has(r))
  const shownThemes = THEMES.filter((t) => !validTheme || validTheme.has(t.id))
  const shownTypes = useMemo(
    () => SPRITE_TYPES
      .filter((t) => !singleGen || (t.gen || 'c7s3') === singleGen)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name)),
    [singleGen],
  )

  const advCount =
    (filters.ownership !== 'all' ? 1 : 0) +
    (filters.rarity !== 'all' ? 1 : 0) +
    (filters.groupBy !== 'none' ? 1 : 0) +
    (filters.hideMastered ? 1 : 0) +
    (!filters.showUnreleased ? 1 : 0)

  const seasonTab = (id, label, title) => (
    <button
      key={id || 'all'}
      onClick={() => selectSeason(id)}
      aria-pressed={activeSeason === id}
      title={title}
      className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
        activeSeason === id ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Season tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {seasonTab(null, 'All Seasons', 'Show every season')}
        {seasonTabs.map((g) => seasonTab(g.id, shortSeason(g.id), `${g.name} — ${g.sub}${g.current ? ' (current)' : ''}`))}
      </div>

      {/* Main controls: search · variant · sprite · sort · view · advanced.
          `relative` here anchors the gear popover to the full-width row, not the
          gear itself — the gear wraps to varying x on mobile, so anchoring to it
          pushed the panel off one edge or the other. */}
      <div className="relative flex flex-wrap items-center gap-2">
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search…"
          title="Search by sprite name, variant, or rarity"
          className="min-w-[140px] flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)] sm:max-w-56"
        />

        {/* Variant */}
        <select value={filters.theme} onChange={(e) => set({ theme: e.target.value })} title="Filter by variant/finish" className={`${selectCls} shrink-0`}>
          <option value="all">All variants</option>
          {shownThemes.map((t) => {
            const st = themeStats?.[t.id]
            return <option key={t.id} value={t.id}>{t.name}{st ? ` (${st.owned}/${st.total})` : ''}</option>
          })}
        </select>

        {/* Sprite (base character) */}
        <select value={filters.spriteType} onChange={(e) => set({ spriteType: e.target.value })} title="Filter to one Sprite" className={`${selectCls} shrink-0`}>
          <option value="all">All sprites</option>
          {shownTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        {/* Sort */}
        <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} title="Sort order" className={`${selectCls} shrink-0`}>
          <option value="default">Sort: Default</option>
          <option value="newest">Sort: Newest</option>
          <option value="closest">Sort: Closest to complete</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="rarity">Sort: Rarity</option>
        </select>

        {/* Grid ↔ list */}
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

        {/* Advanced (gear) — not `relative`, so the popover below positions
            against the full-width controls row instead of this button. */}
        <div ref={gearRef} className="shrink-0">
          <button
            onClick={() => setGearOpen((o) => !o)}
            aria-expanded={gearOpen}
            title="More filters — ownership, rarity, grouping"
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
              gearOpen || advCount > 0 ? 'border-[var(--brand)] bg-[var(--brand)]/10 text-white' : 'border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:text-white'
            }`}
          >
            ⚙
            {advCount > 0 && <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-extrabold text-black">{advCount}</span>}
          </button>
          {gearOpen && (
            <div className="absolute right-0 top-full z-40 mt-1 w-60 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 shadow-xl">
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Ownership
                  <select value={filters.ownership} onChange={(e) => set({ ownership: e.target.value })} className={selectCls}>
                    <option value="all">All sprites</option>
                    <option value="owned">Owned</option>
                    <option value="unowned">Missing</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Rarity
                  <select value={filters.rarity} onChange={(e) => set({ rarity: e.target.value })} className={selectCls}>
                    <option value="all">Any rarity</option>
                    {shownRarities.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Group by
                  <select value={filters.groupBy} onChange={(e) => set({ groupBy: e.target.value })} className={selectCls}>
                    <option value="none">No grouping</option>
                    <option value="theme">Variant</option>
                    <option value="rarity">Rarity</option>
                    <option value="tier">Tier</option>
                    <option value="update">Release date</option>
                    <option value="sprite">Sprite</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-white">
                  <input type="checkbox" checked={filters.hideMastered} onChange={(e) => set({ hideMastered: e.target.checked })} />
                  Hide mastered
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-white">
                  <input type="checkbox" checked={filters.showUnreleased} onChange={(e) => set({ showUnreleased: e.target.checked })} />
                  Show unreleased
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Count + active-filter chips + clear. */}
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
