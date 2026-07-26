import { useEscClose } from '../lib/useEscClose'
import { entryItems, rarityTint } from '../lib/fortniteApi'

// Best display image for a cosmetic: prefer the full featured render, fall back
// to the square icon / track album art.
function itemImage(it) {
  return it?.images?.featured || it?.images?.icon || it?.images?.smallIcon || it?.albumArt || it?.images?.large || null
}

function fmtDate(iso) {
  if (!iso) return null
  try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) } catch { return null }
}

// Detail view for a single Item Shop offer. Shows the hero render, full metadata,
// price breakdown, shop-history, and — crucially — every item bundled in the
// offer (the grid card only previews the first). All fields are optional; the
// layout degrades gracefully when the API omits them.
export default function ShopItemModal({ entry, onClose }) {
  useEscClose(onClose)
  const items = entryItems(entry)
  const rep = items[0] || {}
  const tint = rarityTint(rep?.rarity?.value)
  const hero = itemImage(rep)

  const rarity = rep?.rarity?.displayValue
  const type = rep?.type?.displayValue
  const series = rep?.series?.value
  const set = rep?.set?.text || (rep?.set?.value ? `Part of the ${rep.set.value} set` : null)
  const season = rep?.introduction?.text
  const added = fmtDate(rep?.added)
  const history = Array.isArray(rep?.shopHistory) ? rep.shopHistory : null
  const seen = history?.length || null
  const lastSeen = seen ? fmtDate([...history].sort().at(-1)) : null

  const discount = entry.regularPrice > entry.finalPrice
    ? Math.round((1 - entry.finalPrice / entry.regularPrice) * 100)
    : 0

  const meta = [
    type && ['Type', type],
    series && ['Series', series],
    set && ['Set', set],
    season && ['Introduced', season],
    added && ['First added', added],
    seen && ['Seen in shop', `${seen}× ${lastSeen ? `· last ${lastSeen}` : ''}`.trim()],
  ].filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={rep?.name || 'Item details'}
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative">
          <div
            className="grid aspect-video w-full place-items-center overflow-hidden rounded-t-2xl bg-[var(--bg-2)]"
            style={{ boxShadow: `inset 0 -80px 80px -50px ${tint}` }}
          >
            {hero ? (
              <img src={hero} alt={rep?.name || 'Item'} className="h-full w-full object-contain" />
            ) : (
              <div className="text-5xl text-[var(--muted)]">🛍️</div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
          >✕</button>
          {rarity && (
            <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-extrabold text-black" style={{ background: tint }}>{rarity}</span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-5">
          {/* Title + price */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-2xl leading-tight text-white">{rep?.name || rep?.title || entry.devName || 'Item'}</h2>
              {rep?.description && <p className="mt-1 text-sm text-[var(--muted)]">{rep.description}</p>}
            </div>
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-1 font-display text-xl text-white">
                <span className="text-[var(--brand)]">◈</span>{entry.finalPrice?.toLocaleString?.() ?? entry.finalPrice}
              </div>
              {discount > 0 && (
                <div className="text-[11px] text-[var(--muted)]">
                  <span className="line-through">{entry.regularPrice?.toLocaleString?.()}</span> · <span className="font-bold text-[var(--brand)]">-{discount}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          {meta.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-[var(--bg-2)] p-3 text-sm">
              {meta.map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{k}</dt>
                  <dd className="break-words text-white">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Everything in this offer */}
          {items.length > 1 && (
            <div>
              <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">In this offer · {items.length} items</h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {items.map((it, i) => {
                  const img = it?.images?.icon || it?.images?.smallIcon || itemImage(it)
                  const t = rarityTint(it?.rarity?.value)
                  return (
                    <div key={it.id || i} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)]" title={`${it.name || it.title || 'Item'}${it.type?.displayValue ? ` · ${it.type.displayValue}` : ''}`}>
                      <div className="aspect-square w-full" style={{ boxShadow: `inset 0 -30px 30px -22px ${t}` }}>
                        {img ? <img src={img} alt={it.name || 'Item'} loading="lazy" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-xl text-[var(--muted)]">🎁</div>}
                      </div>
                      <p className="break-words px-1.5 py-1 text-[11px] font-semibold leading-tight text-white">{it.name || it.title || 'Item'}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <p className="text-center text-[11px] text-[var(--muted)]">
            Read-only shop view · data from <a href="https://fortnite-api.com" target="_blank" rel="noreferrer" className="underline">fortnite-api.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
