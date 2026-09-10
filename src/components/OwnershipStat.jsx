import { useEffect, useState } from 'react'
import { fetchOwnershipStats } from '../lib/ownershipStats'

// Don't show community percentages until there's a big enough sample to be
// meaningful (avoids "100% (1 of 1)" noise while the collector base is small).
const MIN_COLLECTORS = 10

// "Owned by X% of collectors" for a Sprite, from privacy-safe community
// aggregates. Uses the Normal finish as the proxy for "has this Sprite."
// Renders nothing until data loads and the sample clears the threshold.
export default function OwnershipStat({ typeId }) {
  const [stat, setStat] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await fetchOwnershipStats()
      if (cancelled || !s || s.total < MIN_COLLECTORS) return
      const owners = s.owners[`${typeId}_normal`] || 0
      const masters = s.masters[`${typeId}_normal`] || 0
      setStat({
        total: s.total,
        owners,
        ownPct: Math.round((owners / s.total) * 100),
        masterPct: Math.round((masters / s.total) * 100),
      })
    })()
    return () => {
      cancelled = true
    }
  }, [typeId])

  if (!stat) return null

  return (
    <div
      className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]/90"
      title={`${stat.owners} of ${stat.total} tracked collectors own this Sprite`}
    >
      🌍 Owned by <b className="text-white">{stat.ownPct}%</b> of collectors
      {stat.masterPct > 0 && (
        <span className="text-[var(--muted)]"> · mastered by {stat.masterPct}%</span>
      )}
    </div>
  )
}
