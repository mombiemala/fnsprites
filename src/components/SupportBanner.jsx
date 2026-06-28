import { useState } from 'react'
import { CREATOR_CODE, LINKS } from '../lib/supabase'
import { useToast } from '../context/toastStore'

export default function SupportBanner() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CREATOR_CODE)
      setCopied(true)
      toast(`Creator code ${CREATOR_CODE.toUpperCase()} copied — thank you! 💜`)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast('Could not copy — long-press to copy manually', 'error')
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--brand-2)]/25 to-[var(--brand)]/15 p-5">
      <h3 className="font-display text-xl text-white">Support the maker 💜</h3>
      <p className="mt-1 text-sm text-[var(--text)]/85">
        This tracker is a free, fan-made labour of love. Two easy ways to help keep it going:
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {/* Creator code — blurb paired with its button */}
        <div className="rounded-xl bg-black/20 p-3">
          <p className="text-sm leading-relaxed text-[var(--text)]/90">
            Enter Creator Code{' '}
            <span className="font-display text-lg tracking-wider text-[var(--brand)]">{CREATOR_CODE.toUpperCase()}</span>{' '}
            in the Fortnite Item Shop at checkout — it supports me at no extra cost to you. #EpicPartner
          </p>
          <button
            onClick={copy}
            className="mt-2.5 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-black transition-transform hover:scale-[1.02]"
          >
            {copied ? 'Copied ✓' : `Copy code: ${CREATOR_CODE.toUpperCase()}`}
          </button>
        </div>

        {/* Buy me a coffee — blurb paired with its button */}
        <div className="rounded-xl bg-black/20 p-3">
          <p className="text-sm leading-relaxed text-[var(--text)]/90">
            Prefer a one-off tip? Buy me a coffee to help cover hosting and keep the seasonal updates coming.
          </p>
          <a
            href={LINKS.buyMeACoffee}
            target="_blank"
            rel="noreferrer"
            className="mt-2.5 block w-full rounded-xl bg-[#FFDD00] px-4 py-2.5 text-center text-sm font-extrabold text-black transition-transform hover:scale-[1.02]"
          >
            ☕ Buy me a coffee
          </a>
        </div>
      </div>
    </div>
  )
}
