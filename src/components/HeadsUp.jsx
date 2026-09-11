import { activeIncoming, daysUntil } from '../data/incoming'

// "You heard it here first" — a prominent heads-up spotlight for confirmed,
// dated things that are COMING but not live yet, each with a countdown. Only
// renders when there's something upcoming; dismissible per-session isn't needed
// since it's small and high-signal.
function countdownLabel(dropsOn, confirmedDate) {
  const d = daysUntil(dropsOn)
  const approx = confirmedDate ? '' : '~'
  if (d > 1) return `${approx}${d} days`
  if (d === 1) return `${approx}tomorrow`
  if (d === 0) return 'today'
  return 'any moment'
}

export default function HeadsUp() {
  const items = activeIncoming()
  if (!items.length) return null

  return (
    <div className="mb-4 rounded-2xl border border-[var(--brand)]/40 bg-gradient-to-br from-[var(--brand)]/12 to-fuchsia-500/10 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">🔔</span>
        <h3 className="font-display text-lg text-white">Heads up — you heard it here first</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((e) => {
          const cd = countdownLabel(e.dropsOn, e.confirmedDate)
          const when = new Date(e.dropsOn + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
          const external = e.sourceUrl?.startsWith('http')
          return (
            <div key={e.id} className="rounded-xl bg-[var(--bg-2)] p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-white">{e.emoji} {e.title}</span>
                <span className="shrink-0 rounded-full bg-[var(--brand)]/20 px-2 py-0.5 text-[10px] font-extrabold text-[var(--brand)]">{cd}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--muted)]">{e.detail}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[var(--muted)]">
                <span>{e.confirmedDate ? 'Drops' : 'Expected'} {when}</span>
                <span className="opacity-40">·</span>
                {external ? (
                  <a href={e.sourceUrl} target="_blank" rel="noreferrer" className="text-[var(--brand)] hover:underline">{e.source} ↗</a>
                ) : (
                  <a href={e.sourceUrl} className="text-[var(--brand)] hover:underline">{e.source} →</a>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-[10px] text-[var(--muted)]">Confirmed &amp; dated only — pure leaks stay flagged “Rumored.” We flip each to live the moment it drops.</p>
    </div>
  )
}
