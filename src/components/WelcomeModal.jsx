import { useState } from 'react'
import { useEscClose } from '../lib/useEscClose'

const KEY = 'fnsprites.welcomed'

// Show once, only to genuinely new visitors (neither welcomed nor the older
// onboarding hint dismissed).
function shouldShow() {
  try {
    // Don't cover a deep link (e.g. /?sprite=…, /?cosmetics=1, /?view=…, /?u=…)
    // with the generic welcome — show the content the link points to instead.
    const q = new URLSearchParams(window.location.search)
    if (['sprite', 'cosmetics', 'about', 'changelog', 'backup', 'bug', 'view', 'u'].some((k) => q.has(k))) return false
    // A #hash deep link (e.g. /#honey) is intentional navigation — don't cover it.
    if ((window.location.hash || '').length > 1) return false
    return localStorage.getItem(KEY) !== '1' && localStorage.getItem('fnsprites.onboarded') !== '1'
  } catch {
    return false
  }
}

const POINTS = [
  { icon: '✅', text: 'Tap any sprite to mark each variant Have · ★ Mastered · ⇄ Trade · ♥ Want — it saves in this browser as you go.' },
  { icon: '📷', text: 'Already have some? Import a sprite-locker screenshot to fill your collection in one go.' },
  { icon: '☁️', text: 'Optional: log in to sync across devices, join the leaderboard, and get a shareable link.' },
  { icon: '🔁', text: 'Find trades, farm the finishes you’re missing, and flex your Collection score.' },
]

export default function WelcomeModal({ onImport }) {
  const [open, setOpen] = useState(shouldShow)

  const close = () => {
    try {
      localStorage.setItem(KEY, '1')
      localStorage.setItem('fnsprites.onboarded', '1')
    } catch {
      /* ignore */
    }
    setOpen(false)
  }
  const importAndClose = () => {
    close()
    onImport?.()
  }
  useEscClose(close, open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl text-white">
          Welcome to FN <span className="text-[var(--brand)]">Sprite</span> Tracker 👋
        </h2>
        <p className="mt-1 text-sm text-[var(--text)]/85">
          Track every Fortnite sprite and variant — <b className="text-white">no account needed</b>. Start right now:
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {POINTS.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-[var(--text)]/90">
              <span className="shrink-0 text-lg leading-none">{p.icon}</span>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={close}
            title="Start marking sprites — no account needed"
            className="w-full rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] py-2.5 text-sm font-extrabold text-black"
          >
            Start tracking →
          </button>
          {onImport && (
            <button
              onClick={importAndClose}
              title="Import your sprite locker from a screenshot — read on your device"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] py-2.5 text-sm font-bold text-white hover:bg-[var(--border)]"
            >
              📷 Import a locker screenshot
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
          Works instantly as a guest · progress saves in this browser until you log in.
        </p>
      </div>
    </div>
  )
}
