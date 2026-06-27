import { useState } from 'react'
import { CREATOR_CODE } from '../lib/supabase'
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
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--brand-2)]/25 to-[var(--brand)]/15 p-5">
      <div className="relative z-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl text-white">Support the maker 💜</h3>
          <p className="mt-1 max-w-md text-sm text-[var(--text)]/90">
            Enjoying the tracker? Use Creator Code{' '}
            <span className="font-display text-lg tracking-wider text-[var(--brand)]">
              {CREATOR_CODE.toUpperCase()}
            </span>{' '}
            in the Fortnite Item Shop to support me. #EpicPartner
          </p>
        </div>
        <button
          onClick={copy}
          className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-black transition-transform hover:scale-105"
        >
          {copied ? 'Copied ✓' : `Copy code: ${CREATOR_CODE}`}
        </button>
      </div>
    </div>
  )
}
