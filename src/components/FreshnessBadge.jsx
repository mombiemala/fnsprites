import { lastUpdatedLabel } from '../lib/freshness'

// A small trust + SEO signal: this tracker is checked every day (the automated
// daily watch), with the date of the latest content change. Subtle by default so
// it sits comfortably in the footer; pass a className to restyle.
export default function FreshnessBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 ${className}`}
      title="This tracker is checked every day and updated whenever Fortnite Sprite codes, drops or events change. The date is the most recent content update."
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      Updated daily · current as of {lastUpdatedLabel()}
    </span>
  )
}
