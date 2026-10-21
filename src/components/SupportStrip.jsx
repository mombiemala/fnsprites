import { useState } from 'react'
import { CREATOR_CODE, LINKS } from '../lib/supabase'
import { useToast } from '../context/toastStore'

// Slim, dismissible support strip pinned near the top of the app (under the
// nav), so the two ways to support the maker — Epic's Creator Code and Buy Me
// a Coffee — are visible above the fold on every view instead of only low in
// the sidebar. Leads with the Creator Code: it's the highest-value ask (Epic
// pays the maker ~5% of in-shop spend, at no cost to the player) and the whole
// audience already shops in Fortnite. Dismissal is remembered per browser so
// it's prominent by default but never nags.
const DISMISS_KEY = 'fnsprites:supportStripDismissed'

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export default function SupportStrip() {
  const [dismissed, setDismissed] = useState(readDismissed)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (dismissed) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CREATOR_CODE)
      setCopied(true)
      toast(`Creator code ${CREATOR_CODE.toUpperCase()} copied — thank you! 💜`)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast('Could not copy — long-press the code to copy it', 'error')
    }
  }

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* private mode / blocked storage — it just reappears next load */
    }
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--brand-2)]/20 to-[var(--brand)]/12 px-4 py-2.5">
      <p className="min-w-0 flex-1 text-sm text-[var(--text)]/90">
        <span className="font-semibold text-white">Enjoying the free tracker?</span>{' '}
        Support it with Creator Code{' '}
        <span className="font-display text-base tracking-wider text-[var(--brand)]">{CREATOR_CODE.toUpperCase()}</span>{' '}
        in the Fortnite Item Shop — no extra cost to you. <span className="text-[var(--muted)]">#EpicPartner</span>
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={copy}
          title="Copy the Creator Code to your clipboard"
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-extrabold text-black transition-transform hover:scale-[1.03]"
        >
          {copied ? 'Copied ✓' : `Copy ${CREATOR_CODE.toUpperCase()}`}
        </button>
        <a
          href={LINKS.buyMeACoffee}
          target="_blank"
          rel="noreferrer"
          title="Buy the maker a coffee to help cover hosting"
          className="rounded-lg bg-[#FFDD00] px-3 py-1.5 text-xs font-extrabold text-black transition-transform hover:scale-[1.03]"
        >
          ☕ Coffee
        </a>
        <button
          onClick={dismiss}
          title="Hide this"
          aria-label="Hide support bar"
          className="rounded-lg px-1.5 py-1 text-base leading-none text-[var(--muted)] hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
