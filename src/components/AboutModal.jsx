import { CREATOR_CODE, LINKS } from '../lib/supabase'
import { useEscClose } from '../lib/useEscClose'

// TODO: replace this blurb with your own bio.
const BIO = `Hey, I'm mombie 👋 — a Fortnite player and creator who got way too into
collecting sprites, so I built this tracker for the community. It's a fan-made,
free tool: track your collection, find trades, and flex your Flex Score.`

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
