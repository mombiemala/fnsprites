import { useState } from 'react'
import { TRADE_STEPS, SPRITE_SWAP_ISLANDS, ISLAND_HOWTO } from '../data/tradeHubs'
import { useToast } from '../context/toastStore'

// In-app "how to actually trade" helper: the drop-&-extract steps + community
// Sprite-Swap island codes (tap to copy). Shown in the Friends → Trade matches
// view so a matched trade has a clear path to completion.
export default function TradeHowTo() {
  const { toast } = useToast()
  const [openSteps, setOpenSteps] = useState(false)

  const copy = (code) => {
    try {
      navigator.clipboard?.writeText(code)
      toast(`Copied ${code}`)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
      <button
        onClick={() => setOpenSteps((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={openSteps}
      >
        <span className="text-sm font-bold text-white">🔁 How to trade Sprites in-game</span>
        <span className="text-[var(--muted)]">{openSteps ? '▾' : '▸'}</span>
      </button>
      {openSteps && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[11px] leading-relaxed text-[var(--muted)]">
          {TRADE_STEPS.map((s) => <li key={s}>{s}</li>)}
        </ol>
      )}

      <p className="mt-2 rounded-lg bg-[var(--panel)] px-2.5 py-2 text-[10px] leading-relaxed text-[var(--muted)]">
        <b className="text-emerald-300">After a successful trade:</b> tap <b className="text-white">🔁 Mark as traded</b> on their card. When you’ve <b>both</b> marked it, you can <b className="text-sky-300">🤝 Vouch</b> — that’s what builds a trader’s <b className="text-white">reputation badge</b> so the community knows who to trust.
      </p>

      <p className="mt-3 mb-1.5 text-[11px] font-bold text-white">Sprite-Swap islands to meet on</p>
      <div className="space-y-1.5">
        {SPRITE_SWAP_ISLANDS.map((isl) => (
          <div key={isl.code} className="flex items-center gap-2 rounded-lg bg-[var(--panel)] px-2.5 py-1.5">
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-white">{isl.name}</div>
              <div className="truncate text-[10px] text-[var(--muted)]">{isl.note}</div>
            </div>
            <button
              onClick={() => copy(isl.code)}
              title="Copy island code"
              className="shrink-0 rounded-md bg-[var(--bg-2)] px-2 py-1 font-mono text-[11px] font-bold text-[var(--brand)] hover:bg-[var(--border)]"
            >
              {isl.code}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-[var(--muted)]">{ISLAND_HOWTO} Community-run islands (not ours) — codes can change; verify in-game. Full walkthrough on the <a href="/how-to-trade-sprites" className="text-[var(--brand)] hover:underline">trading guide</a>.</p>
    </div>
  )
}
