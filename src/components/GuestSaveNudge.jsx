import { useState } from 'react'

// Nudge for signed-out visitors who've started a collection: their progress lives
// in THIS browser only until they sign in (that first sign-in merges it to the
// cloud). Heads off the "logged in on another device and it's empty" surprise.
const KEY = 'fnsprites.guestNudgeDismissed'
const loadDismissed = () => { try { return localStorage.getItem(KEY) === '1' } catch { return false } }

export default function GuestSaveNudge({ tracking, onSignIn }) {
  const [dismissed, setDismissed] = useState(loadDismissed)
  const owned = Object.values(tracking || {}).filter((t) => t?.owned).length
  // Nothing to lose yet (or already dismissed) — stay out of the way.
  if (dismissed || owned < 1) return null

  const dismiss = () => {
    setDismissed(true)
    try { localStorage.setItem(KEY, '1') } catch { /* ignore */ }
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--brand)]/40 bg-gradient-to-r from-[var(--brand)]/12 to-[var(--brand-2)]/10 px-4 py-3">
      <span className="text-xl leading-none" aria-hidden>💾</span>
      <p className="min-w-0 flex-1 text-sm font-semibold text-white">
        Your {owned} saved Sprite{owned === 1 ? '' : 's'} {owned === 1 ? 'is' : 'are'} on <b>this device only</b>.{' '}
        <span className="font-normal text-[var(--muted)]">Sign in to back up your collection and sync it across devices — your current progress carries over.</span>
      </p>
      <button
        onClick={onSignIn}
        className="shrink-0 rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-1.5 text-xs font-extrabold text-black hover:opacity-90"
      >
        Sign in to save
      </button>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-md px-1.5 py-1 text-white/60 hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}
