import { useMemo, useState } from 'react'
import { ALL_SPRITES, RARITY_ORDER, dustCost } from '../data/sprites'
import { useEscClose } from '../lib/useEscClose'

// A Sprite Dust budget planner. You type how much Dust you have (remembered in
// this browser) and it shows, against the current summon-cost estimates, which
// rarities you can afford to (re)summon — both base Sprites and special finishes
// — plus how many of the variants you already own are within budget to re-summon.
const BAL_KEY = 'fnsprites:dustBalance'
const fmt = (n) => n.toLocaleString('en-US')

function readBalance() {
  try {
    const v = Number(localStorage.getItem(BAL_KEY))
    return Number.isFinite(v) && v > 0 ? v : ''
  } catch {
    return ''
  }
}

export default function DustPlanner({ tracking = {}, onClose }) {
  useEscClose(onClose, true)
  const [balance, setBalance] = useState(readBalance)
  const bal = Number(balance) || 0

  const setBal = (v) => {
    const clean = v.replace(/[^\d]/g, '').slice(0, 7)
    setBalance(clean)
    try {
      if (clean) localStorage.setItem(BAL_KEY, clean)
      else localStorage.removeItem(BAL_KEY)
    } catch {
      /* ignore */
    }
  }

  const { rows, ownedTotal, ownedAffordable, priciestOwned, cheapestOver } = useMemo(() => {
    // Cost reference: base (Normal) vs special-finish cost per rarity.
    const rows = RARITY_ORDER.map((r) => ({
      rarity: r,
      base: dustCost(r, 'normal'),
      variant: dustCost(r, 'gold'), // any non-normal finish uses the variant table
    }))

    // Collection tie-in: variants you own are the ones you've unlocked, so they're
    // what Dust actually re-summons. Cost each and see how many fit the budget.
    const owned = ALL_SPRITES.filter((s) => s.released && tracking[s.id]?.owned)
    const costed = owned
      .map((s) => ({ s, cost: dustCost(s.rarity, s.themeId) }))
      .filter((x) => x.cost != null)
    const ownedTotal = costed.length
    const affordable = bal > 0 ? costed.filter((x) => x.cost <= bal) : []
    const priciestOwned = costed.reduce((m, x) => (x.cost > (m?.cost ?? -1) ? x : m), null)
    const over = bal > 0 ? costed.filter((x) => x.cost > bal).sort((a, b) => a.cost - b.cost)[0] : null

    return { rows, ownedTotal, ownedAffordable: affordable.length, priciestOwned, cheapestOver: over }
  }, [tracking, bal])

  const can = (cost) => bal > 0 && cost != null && cost <= bal

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sprite Dust budget planner"
        className="flex max-h-[88vh] w-full max-w-md flex-col rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl text-white">🔷 Dust planner</h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          How much Sprite Dust do you have? See what you can afford to (re)summon.
        </p>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Your Sprite Dust</span>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 focus-within:border-[var(--brand)]">
            <span className="text-lg">🔷</span>
            <input
              value={balance}
              onChange={(e) => setBal(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 8000"
              aria-label="Sprite Dust balance"
              className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        </label>

        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {/* Affordability table */}
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 bg-[var(--bg-2)] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">
              <span>Rarity</span>
              <span className="text-right">Base</span>
              <span className="text-right">Finish</span>
            </div>
            {rows.map((r) => (
              <div key={r.rarity} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-t border-[var(--border)] px-3 py-2 text-sm">
                <span className="font-bold text-white">{r.rarity}</span>
                <span className={`text-right tabular-nums ${can(r.base) ? 'font-bold text-emerald-300' : 'text-[var(--muted)]'}`}>
                  {can(r.base) ? '✓ ' : ''}{fmt(r.base)}
                </span>
                <span className={`text-right tabular-nums ${can(r.variant) ? 'font-bold text-emerald-300' : 'text-[var(--muted)]'}`}>
                  {can(r.variant) ? '✓ ' : ''}{fmt(r.variant)}
                </span>
              </div>
            ))}
          </div>

          {/* Plain-language summary + collection tie-in */}
          {bal > 0 && (
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <div className="rounded-xl bg-[var(--brand)]/10 p-3 text-[var(--text)]/90 ring-1 ring-[var(--brand)]/20">
                With <b className="text-white">{fmt(bal)}</b> Dust you can summon{' '}
                {rows.some((r) => can(r.base)) ? (
                  <>any <b className="text-emerald-300">{rows.filter((r) => can(r.base)).map((r) => r.rarity).join(' / ')}</b> base Sprite</>
                ) : (
                  <span className="text-amber-300">no base Sprite yet</span>
                )}
                {rows.some((r) => can(r.variant)) && (
                  <>, plus <b className="text-emerald-300">{rows.filter((r) => can(r.variant)).map((r) => r.rarity).join(' / ')}</b> finishes</>
                )}
                .
              </div>
              {ownedTotal > 0 && (
                <p className="text-[var(--muted)]">
                  <b className="text-white">{ownedAffordable}</b> of your <b className="text-white">{ownedTotal}</b> owned variants are within budget to re-summon
                  {priciestOwned && (
                    <> · priciest is <b className="text-white">{priciestOwned.s.typeName}</b> ({fmt(priciestOwned.cost)})</>
                  )}
                  .
                </p>
              )}
              {cheapestOver && (
                <p className="text-[var(--muted)]">
                  Save <b className="text-amber-300">{fmt(cheapestOver.cost - bal)}</b> more to reach the next: <b className="text-white">{cheapestOver.s.typeName}</b> ({fmt(cheapestOver.cost)}).
                </p>
              )}
            </div>
          )}

          <p className="mt-4 text-[10px] leading-relaxed text-[var(--muted)]">
            Summon costs are community estimates (Epic doesn’t publish exact figures) — the in-game menu shows the real price.
            Mastering a Sprite halves its re-summon cost, and the cost table resets each season.
          </p>
        </div>
      </div>
    </div>
  )
}
