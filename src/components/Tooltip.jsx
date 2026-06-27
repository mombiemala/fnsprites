// Lightweight hover/focus tooltip. Wrap any element: <Tooltip content="…">…</Tooltip>.
// Shows on hover and keyboard focus; positioned above by default, below via `below`.
export default function Tooltip({ content, children, below = false, className = '' }) {
  if (!content) return children
  return (
    <span className={`group/tip relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-[60] w-max max-w-[220px] -translate-x-1/2 whitespace-normal rounded-lg bg-[#0c0f1a] px-2.5 py-1.5 text-center text-[11px] font-semibold leading-snug text-white opacity-0 shadow-xl ring-1 ring-[var(--border)] transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${
          below ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
        }`}
      >
        {content}
      </span>
    </span>
  )
}
