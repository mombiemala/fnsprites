import { useRef, useState, useLayoutEffect, useCallback } from 'react'

// A priority-plus navigation: shows as many items inline as fit the width, and
// tucks the rest into a "⋯ More" overflow menu (along with any always-in-menu
// `extras`, e.g. utility links). No fixed breakpoints — it measures and adapts,
// so it degrades gracefully from desktop down to a phone.
//
// `views`:  the primary tabs [{ id, label }]
// `actions`: inline buttons after the tabs [{ key, label, onClick, title }]
// `extras`: [{ id, label, onClick?, href?, title? }] — always in the menu.

const pillCls = (active) =>
  `whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
    active ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
  }`
const menuCls =
  'block w-full whitespace-nowrap px-3 py-2 text-left text-xs font-bold text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-white'

function Pill({ d }) {
  const cls = pillCls(d.active)
  if (d.href) return <a href={d.href} title={d.title} className={cls}>{d.label}</a>
  return (
    <button aria-current={d.active ? 'page' : undefined} onClick={d.onClick} title={d.title} className={cls}>
      {d.label}
    </button>
  )
}

function MenuRow({ d, onPick }) {
  if (d.href) return <a href={d.href} target={d.external ? '_blank' : undefined} rel={d.external ? 'noreferrer' : undefined} role="menuitem" title={d.title} onClick={onPick} className={menuCls}>{d.label}</a>
  return (
    <button role="menuitem" title={d.title} onClick={() => { d.onClick?.(); onPick() }} className={menuCls}>
      {d.label}
    </button>
  )
}

export default function OverflowNav({ views = [], view, isShareView, onSelectView, actions = [], extras = [], ariaLabel = 'Sections' }) {
  // Build the inline items here (not in the parent) so the parent's memoized data
  // pipeline stays clean for the React Compiler.
  const base = typeof window !== 'undefined' ? window.location.pathname : '/'
  const items = [
    ...views.map((t) => ({
      key: t.id,
      label: t.label,
      active: !isShareView && view === t.id,
      onClick: isShareView ? undefined : () => onSelectView?.(t.id),
      href: isShareView ? (t.id === 'collection' ? base : `${base}?view=${t.id}`) : undefined,
      title: `View ${t.label.replace(/^[^\w]+\s*/, '')}`,
    })),
    ...actions,
  ]

  const wrapRef = useRef(null)
  const measureRef = useRef(null)
  const moreRef = useRef(null)
  const [visible, setVisible] = useState(items.length)
  const [open, setOpen] = useState(false)

  const recompute = useCallback(() => {
    const wrap = wrapRef.current
    const measure = measureRef.current
    if (!wrap || !measure) return
    const avail = wrap.clientWidth
    const moreW = (moreRef.current?.offsetWidth || 90) + 6
    const gap = 6
    const kids = Array.from(measure.children)
    let used = 0
    let count = 0
    for (let i = 0; i < kids.length; i++) {
      used += kids[i].offsetWidth + gap
      // The "More" button is (almost) always present (it holds the utility
      // extras), so always leave room for it.
      if (used + moreW <= avail) count++
      else break
    }
    setVisible(Math.max(0, count))
  }, [])

  useLayoutEffect(() => {
    recompute()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(recompute) : null
    if (ro && wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', recompute)
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', recompute) }
  }, [recompute, items.length])

  const overflow = items.slice(visible)
  const showMore = overflow.length > 0 || extras.length > 0
  const close = () => setOpen(false)

  return (
    <nav aria-label={ariaLabel} className="relative mb-5">
      {/* Off-screen measurement copy of every pill — gives stable widths no matter
          what's currently shown. Hidden from a11y + pointer + layout flow. */}
      <div ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 flex gap-1.5">
        {items.map((d) => <span key={d.key} className={pillCls(false)}>{d.label}</span>)}
      </div>

      <div ref={wrapRef} className="flex items-center gap-1.5">
        {/* Inline pills live in their own clipped track so a pre-measure flash
            can't spill; the More button + its dropdown sit OUTSIDE this clip. */}
        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
          {items.slice(0, visible).map((d) => <Pill key={d.key} d={d} />)}
        </div>

        {showMore && (
          <div className="relative shrink-0">
            <button
              ref={moreRef}
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              title="More sections & options"
              className="flex items-center gap-1 whitespace-nowrap rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-[var(--muted)] transition-colors hover:text-white"
            >
              ⋯ More <span className="text-[var(--muted)]">{open ? '▲' : '▼'}</span>
            </button>

            {/* Anchored to THIS button's container (relative + non-clipping), so
                it hangs directly off the button — right-aligned, dropping below. */}
            {open && (
              <>
                <button aria-hidden="true" tabIndex={-1} onClick={close} title="Close menu" className="fixed inset-0 z-30 cursor-default" />
                <div role="menu" className="absolute right-0 top-full z-40 mt-1 min-w-[12rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] py-1 text-left shadow-xl">
                  {overflow.map((d) => <MenuRow key={d.key} d={d} onPick={close} />)}
                  {overflow.length > 0 && extras.length > 0 && <div className="my-1 h-px bg-[var(--border)]" />}
                  {extras.map((d) => <MenuRow key={d.id} d={{ ...d, external: !!d.href }} onPick={close} />)}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
