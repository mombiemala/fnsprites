import { useState } from 'react'

const KEY = 'fnsprites.onboarded'

export default function OnboardingHint() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })
  if (dismissed) return null

  const close = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    setDismissed(true)
  }

  return (
    <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-4">
      <p className="text-sm text-white">
        👋 <span className="font-bold">New here?</span> Tap any sprite for details. Mark each variant{' '}
        <span className="font-bold text-[var(--brand)]">Have</span>,{' '}
        <span className="font-bold text-amber-300">★ Mastered</span>,{' '}
        <span className="font-bold text-emerald-300">⇄ Trade</span> or{' '}
        <span className="font-bold text-pink-300">♥ Want</span>. <span className="font-bold">Log in</span> to save to the cloud, share your gamertag, and climb the leaderboard.
      </p>
      <button onClick={close} aria-label="Dismiss tip" className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2 py-1 text-xs font-bold text-white hover:bg-[var(--border)]">
        Got it
      </button>
    </div>
  )
}
