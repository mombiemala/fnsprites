import { CREATOR_CODE, LINKS } from '../lib/supabase'
import { useEscClose } from '../lib/useEscClose'

// Edit this blurb anytime — it's just a friendly starter.
const BIO = `Hey, I'm mombie 👋

I'm a Fortnite player who got *way* too into collecting sprites — chasing every
Gold, Gummy, Galaxy and Mythic — so I built this tracker to help the community
keep tabs on their collection, find trades, and flex their score.

It's a free, fan-made labour of love that I keep updated each season. If it
helps you complete your set, supporting with Creator Code MOMBIE or a coffee
keeps it free for everyone. Thanks for being here! 🎮💜`

export default function AboutModal({ onClose }) {
  useEscClose(onClose)
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">About</h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text)]/90">{BIO}</p>

        <div className="mt-4 rounded-xl bg-[var(--bg-2)] p-3 text-sm">
          <p className="text-[var(--text)]/90">
            Support keeps it free and updated:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 font-bold text-white">
              Creator Code <span className="text-[var(--brand)]">{CREATOR_CODE.toUpperCase()}</span>
            </span>
            <a
              href={LINKS.buyMeACoffee}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[#FFDD00] px-3 py-1.5 font-bold text-black hover:opacity-90"
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-[var(--muted)]">
          Fan-made · not affiliated with Epic Games. #EpicPartner
        </p>
      </div>
    </div>
  )
}
