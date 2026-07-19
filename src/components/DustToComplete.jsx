import { useMemo } from 'react'
import { ALL_SPRITES, dustCost, RARITY_ORDER, RARITY_COLORS } from '../data/sprites'

// "Finish-line" estimate: the Sprite Dust you'd spend to summon every released
// variant you're still missing. It's a collector goalpost, not an exact bill —
// most Sprites come from chests — so it's clearly labelled as an estimate.
export default function DustToComplete({ tracking }) {
  const { total, missing, byRarity } = useMemo(() => {
    let total = 0
    let missing = 0
    const byRarity = {}
    for (const s of ALL_SPRITES) {
      if (!s.released || tracking[s.id]?.owned) continue
      const c = dustCost(s.rarity, s.themeId) || 0
      total += c
      missing++
      byRarity[s.rarity] = (byRarity[s.rarity] || 0) + c
    }
    return { total, missing, byRarity }
  }, [tracking])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="mb-1 flex items-center gap-1.5 font-display text-lg text-white">✨ Dust to complete</h3>
      {missing === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          You’ve got every released variant — nothing left to summon. 🏆
        </p>
      ) : (
        <>
          <p className="mb-2 text-sm text-[var(--muted)]">
            Roughly <b className="font-display text-2xl text-[var(--brand)]">{total.toLocaleString()}</b> Sprite Dust to summon your{' '}
            <b className="text-white">{missing}</b> missing variant{missing === 1 ? '' : 's'}.
          </p>
          <div className="flex flex-col gap-1">
            {RARITY_ORDER.filter((r) => byRarity[r]).map((r) => (
              <div key={r} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full" style={{ background: RARITY_COLORS[r] }} />
                  {r}
                </span>
                <span className="font-semibold text-[var(--text)]">{byRarity[r].toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-[var(--muted)]">
            Estimate — most Sprites come from Chests; Dust is for (re)summoning indexed variants.
          </p>
        </>
      )}
    </div>
  )
}
