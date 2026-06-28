import { useState } from 'react'

// A labelled, collapsible card. Used to tuck secondary sections (breakdown,
// share/export, trading) below the main grid so they don't eat vertical space
// while staying one tap away.
export default function Collapsible({ title, hint, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-[var(--panel-2)]/40"
      >
        <span className="flex items-center gap-2">
          <span className="font-display text-base text-white">{title}</span>
          {badge != null && (
            <span className="rounded-full bg-[var(--panel-2)] px-2 py-0.5 text-[11px] font-bold text-[var(--muted)]">{badge}</span>
          )}
          {hint && <span className="hidden text-xs text-[var(--muted)] sm:inline">{hint}</span>}
        </span>
        <span className="shrink-0 text-[var(--muted)]">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="border-t border-[var(--border)] p-4">{children}</div>}
    </div>
  )
}
