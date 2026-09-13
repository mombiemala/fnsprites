// Trade-reputation badge. `rep` is { count, tier } from trade_reputation_batch.
// Renders nothing until a player has at least one credible vouch.
const TIERS = {
  trusted: { icon: '🤝', label: 'Trusted', cls: 'bg-sky-400/15 text-sky-300' },
  verified: { icon: '✅', label: 'Verified trader', cls: 'bg-emerald-400/15 text-emerald-300' },
  top: { icon: '⭐', label: 'Top trader', cls: 'bg-amber-400/15 text-amber-300' },
}

export default function RepBadge({ rep }) {
  if (!rep || !rep.count || rep.tier === 'none') return null
  const t = TIERS[rep.tier] || TIERS.trusted
  return (
    <span
      title={`${t.label} — vouched by ${rep.count} collector${rep.count === 1 ? '' : 's'}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${t.cls}`}
    >
      {t.icon} {rep.count}
    </span>
  )
}
