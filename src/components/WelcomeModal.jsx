import { useState } from 'react'
import { useEscClose } from '../lib/useEscClose'

const KEY = 'fnsprites.welcomed'

// Show once, only to genuinely new visitors (neither welcomed nor the older
// onboarding hint dismissed).
function shouldShow() {
  try {
    return localStorage.getItem(KEY) !== '1' && localStorage.getItem('fnsprites.onboarded') !== '1'
  } catch {
    return false
  }
}

const POINTS = [
  { icon: '✅', text: 'Tap any sprite, then mark each variant Have · ★ Mastered · ⇄ Trade · ♥ Want.' },
  { icon: '☁️', text: 'Log in to save to the cloud and get a shareable link with your gamertag.' },
  { icon: '🏆', text: 'Climb the Flex Score leaderboard and compare collections with other players.' },
  { icon: '🔁', text: 'Post and find trades on the Trade board — full trades or indexing.' },
  { icon: '🗺️', text: 'Check the Farming guide for the best sprite-chest hotspots and map links.' },
]

export default function WelcomeModal() {
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
  useEscClose(close, open)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl text-white">
          Welcome to FN <span className="text-[var(--brand)]">Sprite</span> Tracker 👋
        </h2>
        <p className="mt-1 text-sm text-[var(--text)]/85">
          Track every Fortnite sprite and variant — free and fan-made. Here’s the gist:
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {POINTS.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-[var(--text)]/90">
              <span className="shrink-0 text-lg leading-none">{p.icon}</span>
              <span>{p.text}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={close}
          title="Start using the tracker"
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] py-2.5 text-sm font-extrabold text-black"
        >
          Let’s go →
        </button>
        <p className="mt-3 text-center text-[11px] text-[var(--muted)]">
          Works instantly as a guest · your progress saves in this browser until you log in.
        </p>
      </div>
    </div>
  )
}
