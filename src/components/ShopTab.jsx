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

export default function ShopTab() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let alive = true
    fetchShop()
      .then((d) => { if (alive) { setData(d); setError(null); setLoading(false) } })
      .catch((e) => { if (alive) { setError(e.message || 'Could not load the shop'); setLoading(false) } })
    return () => { alive = false }
  }, [reloadKey])

  const retry = () => { setLoading(true); setError(null); setReloadKey((k) => k + 1) }

  // Group entries by their shop section (layout name), preserving sort priority.
  const sections = []
  if (data?.entries) {
    const byName = new Map()
    for (const e of [...data.entries].sort((a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0))) {
      const key = e.layout?.name || 'Featured'
      if (!byName.has(key)) { byName.set(key, []); sections.push({ name: key, items: byName.get(key) }) }
      byName.get(key).push(e)
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg text-white">🛒 Item Shop</h3>
        <button onClick={retry} title="Reload today's Item Shop" className="text-xs font-bold text-[var(--muted)] hover:text-white">↻ Refresh</button>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">
        Today’s rotating Fortnite Item Shop{data?.date ? ` · ${new Date(data.date).toLocaleDateString()}` : ''}. Prices in V-Bucks.
        Live from <a href="https://fortnite-api.com" target="_blank" rel="noreferrer" className="underline">fortnite-api.com</a>.
      </p>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[var(--bg-2)]" />)}
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="text-sm text-[var(--muted)]">Couldn’t load the shop — {error}</p>
          <button onClick={retry} title="Try loading the shop again" className="mt-3 rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]">Try again</button>
        </div>
      ) : !sections.length ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">The shop looks empty right now — check back after the daily reset.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((sec) => (
            <section key={sec.name}>
              <h4 className="mb-2 font-display text-base text-white/90">{sec.name} <span className="text-sm text-[var(--muted)]">· {sec.items.length}</span></h4>
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
