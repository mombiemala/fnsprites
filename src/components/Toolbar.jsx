import { THEMES } from '../data/themes'
import { RARITY_ORDER } from '../data/sprites'

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

export default function Toolbar({ filters, setFilters }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search sprites…"
          className="min-w-[180px] flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
        />
        <select
          value={filters.ownership}
          onChange={(e) => set({ ownership: e.target.value })}
          className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
        >
          <option value="all">All</option>
          <option value="owned">Owned only</option>
          <option value="unowned">Missing only</option>
        </select>
        <label className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
          <input
            type="checkbox"
            checked={filters.hideMastered}
            onChange={(e) => set({ hideMastered: e.target.checked })}
          />
          Hide mastered
        </label>
        <label className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
          <input
            type="checkbox"
            checked={filters.showUnreleased}
            onChange={(e) => set({ showUnreleased: e.target.checked })}
          />
          Show unreleased
        </label>
        <label className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--muted)]">
          <input
            type="checkbox"
            checked={filters.groupByTheme}
            onChange={(e) => set({ groupByTheme: e.target.checked })}
          />
          Group by theme
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={filters.theme === 'all'} onClick={() => set({ theme: 'all' })}>
          All themes
        </Chip>
        {THEMES.map((t) => (
          <Chip key={t.id} active={filters.theme === t.id} color={t.accent} onClick={() => set({ theme: t.id })}>
            {t.name}
          </Chip>
        ))}
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
  )
}
