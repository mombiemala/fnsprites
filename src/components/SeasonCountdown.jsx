import { SEASON, SEASON_TRANSITION, daysUntilSeasonEnd } from '../data/season'

// Season-end countdown card. Appears only in the run-up to the flip (≤60 days
// out) so it stays timely. The end date is an estimate until Epic confirms —
// labelled as such — and everything reads from src/data/season.js.
export default function SeasonCountdown() {
  const days = daysUntilSeasonEnd()
  if (days > 60 || days < -2) return null // out of the relevant window

  const label =
    days > 1 ? `~${days} days left` : days === 1 ? '~1 day left' : days === 0 ? 'Ends today' : 'Season ending / flipping now'

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg text-white">⏳ Season ending</h3>
        <span className="rounded-full bg-[var(--bg-2)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">{SEASON.label}</span>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">
        <b className="text-[var(--brand)]">{label}</b> — {SEASON.current.label} “{SEASON.name}” is expected to end around{' '}
        {new Date(SEASON.endEstimate + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
        {!SEASON.endConfirmed && ' (estimated)'}, with {SEASON.next.label} to follow.
      </p>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-[var(--bg-2)] p-2">
          <div className="mb-1 font-bold text-emerald-300">✓ You keep</div>
          <ul className="space-y-0.5 text-[var(--muted)]">
            {SEASON_TRANSITION.keeps.map((k) => <li key={k}>{k.split(' — ')[0]}</li>)}
          </ul>
        </div>
        <div className="rounded-lg bg-[var(--bg-2)] p-2">
          <div className="mb-1 font-bold text-amber-300">↺ Resets</div>
          <ul className="space-y-0.5 text-[var(--muted)]">
            {SEASON_TRANSITION.resets.map((r) => <li key={r}>{r.split(' — ')[0].split(' (')[0]}</li>)}
          </ul>
        </div>
      </div>

      <a
        href="/season-transition"
        className="mt-3 block rounded-lg bg-[var(--bg-2)] px-3 py-2 text-center text-xs font-bold text-[var(--brand)] hover:bg-[var(--border)]"
      >
        What carries over to next season →
      </a>
    </div>
  )
}
