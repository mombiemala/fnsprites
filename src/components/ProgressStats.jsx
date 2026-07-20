function Bar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex-1">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</span>
        <span className="text-xs font-extrabold text-[var(--text)]">
          {value}/{total} <span className="text-[var(--muted)]">· {pct}%</span>
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--panel-2)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

// `total` is the *obtainable-right-now* count (what the bars measure against, so
// 100% means "everything you can actually collect today"). `upcoming` is how many
// more variants are rumored/announced but not live yet — surfaced as a caption so
// the denominator never looks mysteriously large.
export default function ProgressStats({ owned, mastered, total, upcoming = 0, onShare }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)]/60 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <Bar label="Collection" value={owned} total={total} color="linear-gradient(90deg,#36c5ff,#7b61ff)" />
        <Bar label="Mastery" value={mastered} total={total} color="linear-gradient(90deg,#ffd23f,#f6b73c)" />
        {onShare && (
          <button
            onClick={onShare}
            title="Preview & download a shareable image of your collection, or copy a Discord/Reddit caption"
            className="flex shrink-0 items-center gap-1.5 self-stretch rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3.5 py-2 text-xs font-extrabold text-black transition-opacity hover:opacity-90 sm:self-center"
          >
            📤 Share &amp; export
          </button>
        )}
      </div>
      <p className="mt-3 text-[11px] text-[var(--muted)]">
        <b className="text-[var(--text)]">{total}</b> variants obtainable now
        {upcoming > 0 && (
          <> · <b className="text-[var(--text)]">{upcoming}</b> more rumored/upcoming (toggle <b>Show unreleased</b> in Filters to include them)</>
        )}
      </p>
    </div>
  )
}
