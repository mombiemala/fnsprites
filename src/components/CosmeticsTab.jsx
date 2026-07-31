import { useEffect, useState } from 'react'
import { fetchNewCosmetics, rarityTint } from '../lib/fortniteApi'

// A cosmetics browser (recently-added BR cosmetics from the public API) with a
// local-only "want" toggle — the same proof-of-concept that used to live in a
// modal, now a full tab styled like the Item Shop (search + rarity/type filters
// and a card grid). It deliberately does NOT touch accounts/profiles yet: the
// wishlist lives only in this browser (localStorage). If we like the shape, the
// real version would extend profiles/Supabase so cosmetic collections sync &
// share like the sprite collection does.
const WISH_KEY = 'fnsprites.cosmeticsWishlist.poc'

function loadWishlist() {
  try { return new Set(JSON.parse(localStorage.getItem(WISH_KEY)) || []) } catch { return new Set() }
}

function cosmeticImage(c) {
  return c?.images?.icon || c?.images?.smallIcon || c?.images?.featured || c?.albumArt || null
}

const selectCls =
  'rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]'

export default function CosmeticsTab() {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wish, setWish] = useState(loadWishlist)
  const [reloadKey, setReloadKey] = useState(0)
  // Filters — mirror the Item Shop: name search + rarity / type, plus a
  // wishlist-only toggle since a "want" list is the point of this view.
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('all')
  const [type, setType] = useState('all')
  const [wishOnly, setWishOnly] = useState(false)

  useEffect(() => {
    let alive = true
    fetchNewCosmetics()
      .then((list) => { if (alive) { setItems(list); setError(null); setLoading(false) } })
      .catch((e) => { if (alive) { setError(e.message || 'Could not load cosmetics'); setLoading(false) } })
    return () => { alive = false }
  }, [reloadKey])

  const toggleWish = (id) => {
    setWish((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem(WISH_KEY, JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }
  const retry = () => { setLoading(true); setError(null); setReloadKey((k) => k + 1) }

  const all = items || []

  // Build filter option lists from what's actually loaded.
  const rarityOpts = new Map()
  const typeOpts = new Map()
  for (const c of all) {
    if (c.rarity?.value) rarityOpts.set(c.rarity.value, c.rarity.displayValue || c.rarity.value)
    if (c.type?.value) typeOpts.set(c.type.value, c.type.displayValue || c.type.value)
  }

  const q = query.trim().toLowerCase()
  const filtered = all.filter((c) => {
    if (rarity !== 'all' && c.rarity?.value !== rarity) return false
    if (type !== 'all' && c.type?.value !== type) return false
    if (wishOnly && !wish.has(c.id)) return false
    if (q && !(c.name || '').toLowerCase().includes(q)) return false
    return true
  })
  const anyFilter = q || rarity !== 'all' || type !== 'all' || wishOnly
  const shown = filtered.slice(0, 60)

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-lg text-white">
          🧢 Cosmetics
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">Experimental</span>
        </h3>
        <button onClick={retry} title="Reload the latest cosmetics" className="text-xs font-bold text-[var(--muted)] hover:text-white">↻ Refresh</button>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">
        A preview of the newest Fortnite cosmetics (skins, emotes &amp; more), live from{' '}
        <a href="https://fortnite-api.com" target="_blank" rel="noreferrer" className="underline">fortnite-api.com</a>.
        Tap <b className="text-white">♥ Want</b> to try the idea of a cosmetic wishlist — for now it saves only in this browser
        (a full version would sync to your account, like your sprite collection).
      </p>

      {/* Filters — name search + rarity / type + wishlist-only, like the Item Shop. */}
      {!loading && !error && all.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cosmetics…"
              title="Search cosmetics by name"
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
            <button
              onClick={() => setWishOnly((v) => !v)}
              title="Show only cosmetics on your wishlist"
              className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${wishOnly ? 'bg-pink-500 text-white' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'}`}
            >
              ♥ Wishlist {wish.size > 0 && <span className="opacity-80">({wish.size})</span>}
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--muted)]">
            <span>Showing <span className="text-white">{Math.min(shown.length, filtered.length)}</span> of {all.length} cosmetics</span>
            {anyFilter && (
              <button onClick={() => { setQuery(''); setRarity('all'); setType('all'); setWishOnly(false) }} title="Clear cosmetics filters" className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">✕ Clear filters</button>
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
          <p className="text-sm text-[var(--muted)]">Couldn’t load cosmetics — {error}</p>
          <button onClick={retry} title="Try loading cosmetics again" className="mt-3 rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]">Try again</button>
        </div>
      ) : !all.length ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">No cosmetics to show right now.</p>
      ) : !filtered.length ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">No cosmetics match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {shown.map((c) => {
            const img = cosmeticImage(c)
            const wanted = wish.has(c.id)
            const tint = rarityTint(c.rarity?.value)
            return (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]" title={`${c.name || 'Cosmetic'}${c.type?.displayValue ? ` · ${c.type.displayValue}` : ''}${c.rarity?.displayValue ? ` · ${c.rarity.displayValue}` : ''}`}>
                <div className="relative aspect-square w-full bg-[var(--bg-2)]" style={{ boxShadow: `inset 0 -50px 50px -36px ${tint}` }}>
                  {img ? <img src={img} alt={c.name || ''} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-2xl text-[var(--muted)]">🧢</div>}
                  {c.rarity?.displayValue && <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-black" style={{ background: tint }}>{c.rarity.displayValue}</span>}
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-white">{c.name || 'Cosmetic'}</span>
                    <span className="block truncate text-[11px] text-[var(--muted)]">{c.type?.displayValue || ''}</span>
                  </span>
                  <button
                    onClick={() => toggleWish(c.id)}
                    title={wanted ? 'On your wishlist — tap to remove' : 'Add to your (local) cosmetic wishlist'}
                    className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${wanted ? 'bg-pink-500 text-white' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'}`}
                  >
                    {wanted ? '♥ Want' : '♡ Want'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
