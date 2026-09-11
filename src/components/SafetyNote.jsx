import { useState } from 'react'

const KEY = 'fnsprites.safetyDismissed'

function loadDismissed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

// Evergreen player-safety PSA about the Fortnite scams going around (fake
// "you won a prize" DMs and "check your locker value" sites/Discords that
// phish Epic logins). Dismissible + remembered. Also states plainly that this
// fan-made tracker never DMs players or asks for an Epic password — a trust
// signal that matters for a third-party site offering sign-in.
export default function SafetyNote() {
  const [dismissed, setDismissed] = useState(loadDismissed)
  if (dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    try { localStorage.setItem(KEY, '1') } catch { /* private mode */ }
  }

  return (
    <div className="rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-500/15 to-amber-500/10 p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg text-white">🚨 Watch out for scams</h3>
        <button onClick={dismiss} aria-label="Dismiss" className="text-[var(--muted)] hover:text-white">✕</button>
      </div>
      <p className="mb-2 text-xs text-[var(--muted)]">Two scams are going around Fortnite right now:</p>
      <ul className="mb-2 space-y-1.5 text-xs text-[var(--muted)]">
        <li>🎁 <b className="text-white">“You won a prize — claim it here!”</b> Random accounts add you and send a link to claim a reward.</li>
        <li>💰 <b className="text-white">“Check your locker value!”</b> A random site or Discord that asks you to sign in.</li>
      </ul>
      <p className="mb-2 text-xs text-[var(--muted)]">
        Both are built to steal your Epic account. <b className="text-white">Never enter your Epic Games login on a random site</b>, don’t click suspicious links or join random Discords, and be very suspicious of anyone who DMs you a “prize.”
      </p>
      <p className="text-[11px] text-[var(--muted)]">
        🛡️ FN Sprite Tracker is fan-made and <b className="text-white">will never DM you or ask for your Epic/Fortnite password.</b> Your (optional) tracker account is separate from your Epic login.
      </p>
    </div>
  )
}
