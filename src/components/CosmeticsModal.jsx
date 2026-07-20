import { useEffect, useState } from 'react'
import { fetchNewCosmetics, rarityTint } from '../lib/fortniteApi'
import { useEscClose } from '../lib/useEscClose'

// PROOF OF CONCEPT — a cosmetics browser (recently-added BR cosmetics from the
// public API) with a local-only "want" toggle to demonstrate how a cosmetic
// collection could work. It deliberately does NOT touch accounts/profiles yet:
// the wishlist lives only in this browser (localStorage). If we like the shape,
// the real version would extend profiles/Supabase so cosmetic collections sync &
// share like the sprite collection does.
const WISH_KEY = 'fnsprites.cosmeticsWishlist.poc'

function loadWishlist() {
  try { return new Set(JSON.parse(localStorage.getItem(WISH_KEY)) || []) } catch { return new Set() }
}

function cosmeticImage(c) {
  return c?.images?.icon || c?.images?.smallIcon || c?.images?.featured || c?.albumArt || null
}

export default function CosmeticsModal({ onClose }) {
  useEscClose(onClose, true)
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wish, setWish] = useState(loadWishlist)
  const [reloadKey, setReloadKey] = useState(0)

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

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cosmetics (proof of concept)"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3.5">
          <h2 className="flex items-center gap-2 font-display text-xl text-white">
            🧢 Cosmetics
            <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">Experimental</span>
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={retry} title="Reload the latest cosmetics" className="text-xs font-bold text-[var(--muted)] hover:text-white">↻ Refresh</button>
            <button onClick={onClose} title="Close" aria-label="Close" className="rounded-lg px-2 py-1 text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-white">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 text-xs text-[var(--muted)]">
            A preview of the newest Fortnite cosmetics (skins, emotes &amp; more), live from{' '}
            <a href="https://fortnite-api.com" target="_blank" rel="noreferrer" className="underline">fortnite-api.com</a>.
            Tap <b className="text-white">♥ Want</b> to try the idea of a cosmetic wishlist — for now it saves only in this browser
            (a full version would sync to your account, like your sprite collection).
          </p>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[var(--bg-2)]" />)}
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[var(--muted)]">Couldn’t load cosmetics — {error}</p>
              <button onClick={retry} title="Try loading cosmetics again" className="mt-3 rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]">Try again</button>
            </div>
          ) : !items?.length ? (
            <p className="py-10 text-center text-sm text-[var(--muted)]">No cosmetics to show right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.slice(0, 60).map((c) => {
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
      </div>
    </div>
  )
}
