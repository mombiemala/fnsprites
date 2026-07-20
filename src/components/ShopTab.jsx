import { useEffect, useState } from 'react'
import { fetchShop, entryItems, rarityTint } from '../lib/fortniteApi'

// Pull a display image for an entry from whichever item bucket it has.
function entryImage(item) {
  if (!item) return null
  return (
    item.images?.icon ||
    item.images?.featured ||
    item.images?.smallIcon ||
    item.albumArt || // tracks
    item.images?.large ||
    null
  )
}

function ShopCard({ entry }) {
  const items = entryItems(entry)
  const rep = items[0]
  const img = entryImage(rep)
  const name = rep?.name || rep?.title || entry.devName || 'Item'
  const rarity = rep?.rarity?.displayValue
  const tint = rarityTint(rep?.rarity?.value)
  const type = rep?.type?.displayValue
  const extra = items.length > 1 ? ` +${items.length - 1}` : ''

  return (
    <div
      className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]"
      title={`${name}${type ? ` · ${type}` : ''}${rarity ? ` · ${rarity}` : ''} — ${entry.finalPrice} V-Bucks`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--bg-2)]" style={{ boxShadow: `inset 0 -60px 60px -40px ${tint}` }}>
        {img ? (
          <img src={img} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center text-3xl text-[var(--muted)]">🛍️</div>
        )}
        {rarity && (
          <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-black" style={{ background: tint }}>{rarity}</span>
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate text-sm font-bold text-white" title={name}>{name}{extra}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[var(--muted)]">
          <span className="text-[var(--brand)]">◈</span> {entry.finalPrice?.toLocaleString?.() ?? entry.finalPrice}
          {entry.regularPrice > entry.finalPrice && (
            <span className="text-[10px] text-[var(--muted)] line-through">{entry.regularPrice}</span>
          )}
        </p>
      </div>
    </div>
  )
}

const selectCls =
  'rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]'

export default function ShopTab() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  // Filters (competitor-style): search by name, plus rarity / type / sort.
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('all')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('shop')

  useEffect(() => {
    let alive = true
    fetchShop()
      .then((d) => { if (alive) { setData(d); setError(null); setLoading(false) } })
      .catch((e) => { if (alive) { setError(e.message || 'Could not load the shop'); setLoading(false) } })
    return () => { alive = false }
  }, [reloadKey])

  const retry = () => { setLoading(true); setError(null); setReloadKey((k) => k + 1) }

  const allEntries = data?.entries || []

  // Build filter option lists from what's actually in the shop today.
  const rarityOpts = new Map()
  const typeOpts = new Map()
  for (const e of allEntries) {
    const rep = entryItems(e)[0]
    if (rep?.rarity?.value) rarityOpts.set(rep.rarity.value, rep.rarity.displayValue || rep.rarity.value)
    if (rep?.type?.value) typeOpts.set(rep.type.value, rep.type.displayValue || rep.type.value)
  }

  const q = query.trim().toLowerCase()
  const matches = (e) => {
    const items = entryItems(e)
    const rep = items[0]
    if (rarity !== 'all' && rep?.rarity?.value !== rarity) return false
    if (type !== 'all' && rep?.type?.value !== type) return false
    if (q && !items.some((it) => (it.name || it.title || '').toLowerCase().includes(q))) return false
    return true
  }
  const filtered = allEntries.filter(matches)
  const anyFilter = q || rarity !== 'all' || type !== 'all'

  // Group by shop section (default), or produce a single flat, sorted list when a
  // price sort is chosen (sorting across sections only makes sense flat).
  let sections = []
  if (sort === 'shop') {
    const byName = new Map()
    for (const e of [...filtered].sort((a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))) {
      const key = e.layout?.name || 'Featured'
      if (!byName.has(key)) { byName.set(key, []); sections.push({ name: key, items: byName.get(key) }) }
      byName.get(key).push(e)
    }
  } else {
    const sorted = [...filtered].sort((a, b) =>
      sort === 'price-asc' ? (a.finalPrice ?? 0) - (b.finalPrice ?? 0) : (b.finalPrice ?? 0) - (a.finalPrice ?? 0)
    )
    sections = [{ name: null, items: sorted }]
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg text-white">🛒 Item Shop</h3>
        <button onClick={retry} title="Reload today's Item Shop" className="text-xs font-bold text-[var(--muted)] hover:text-white">↻ Refresh</button>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">
        Today’s rotating Fortnite Item Shop{data?.date ? ` · ${new Date(data.date).toLocaleDateString()}` : ''} — the in-game store where cosmetics are sold for V-Bucks (this is a read-only view; nothing is purchasable here).
        Live from <a href="https://fortnite-api.com" target="_blank" rel="noreferrer" className="underline">fortnite-api.com</a>.
      </p>

      {/* Filters — name search + rarity / type / sort, like the competitor sites. */}
      {!loading && !error && allEntries.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shop…"
              title="Search shop items by name"
              className="min-w-[150px] flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)] sm:max-w-xs"
            />
            <select value={rarity} onChange={(e) => setRarity(e.target.value)} title="Filter by rarity" className={selectCls}>
              <option value="all">Any rarity</option>
              {[...rarityOpts].map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} title="Filter by item type" className={selectCls}>
              <option value="all">Any type</option>
              {[...typeOpts].map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} title="Sort order" className={selectCls}>
              <option value="shop">Shop order</option>
              <option value="price-asc">Price: low → high</option>
              <option value="price-desc">Price: high → low</option>
            </select>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--muted)]">
            <span>Showing <span className="text-white">{filtered.length}</span> of {allEntries.length} offers</span>
            {anyFilter && (
              <button onClick={() => { setQuery(''); setRarity('all'); setType('all') }} title="Clear shop filters" className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">✕ Clear filters</button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[var(--bg-2)]" />)}
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="text-sm text-[var(--muted)]">Couldn’t load the shop — {error}</p>
          <button onClick={retry} title="Try loading the shop again" className="mt-3 rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]">Try again</button>
        </div>
      ) : !allEntries.length ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">The shop looks empty right now — check back after the daily reset.</p>
      ) : !filtered.length ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">No shop items match your filters.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((sec, si) => (
            <section key={sec.name ?? `s${si}`}>
              {sec.name && <h4 className="mb-2 font-display text-base text-white/90">{sec.name} <span className="text-sm text-[var(--muted)]">· {sec.items.length}</span></h4>}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {sec.items.map((e, i) => <ShopCard key={e.offerId || i} entry={e} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
