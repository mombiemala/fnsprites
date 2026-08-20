import { useState } from 'react'
import { useEscClose } from '../lib/useEscClose'
import { useToast } from '../context/toastStore'
import { CODES_INTRO, LOBBY_CODES } from '../data/codes'

const STATUS = {
  working: { label: 'Working', cls: 'bg-emerald-400/15 text-emerald-300' },
  regional: { label: 'Regional', cls: 'bg-amber-400/15 text-amber-300' },
  rumored: { label: 'Unverified', cls: 'bg-white/10 text-[var(--muted)]' },
}
const GROUPS = [
  { key: 'sprites', label: '🧩 Sprite unlocks (Cheatmaster)', match: (c) => c.type === 'sprite' },
  { key: 'rewards', label: '🎁 Rewards, gizmos & effects', match: (c) => (c.type === 'reward' || c.type === 'effect' || c.type === 'cosmetic') && c.status !== 'regional' && c.status !== 'rumored' },
  { key: 'regional', label: '🌍 Regional & promo (expire soon)', match: (c) => c.status === 'regional' },
  { key: 'rumored', label: '❓ Unverified — check in-game first', match: (c) => c.status === 'rumored' },
]

export default function CodesModal({ onClose }) {
  useEscClose(onClose)
  const { toast } = useToast()
  const [copied, setCopied] = useState(null)

  const copy = (code) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(
        () => { setCopied(code); toast(`Copied ${code} — paste it in the Admin Panel`); setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500) },
        () => toast('Couldn’t copy — long-press to copy the code', 'error'),
      )
    } else {
      toast('Copy not supported here — type the code manually')
    }
  }

  const working = LOBBY_CODES.filter((c) => c.status === 'working').length

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Lobby Hack codes"
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-white">🔓 {CODES_INTRO.title}</h2>
            <p className="mt-0.5 text-xs text-[var(--muted)]">Season 4 “Override” · <b className="text-emerald-300">{working}</b> codes working now</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        {/* How it works */}
        <div className="rounded-xl bg-[var(--bg-2)] p-3 text-sm text-[var(--text)]/90">
          <p>{CODES_INTRO.how}</p>
          <ul className="mt-2 space-y-1 text-[11px] text-[var(--muted)]">
            {CODES_INTRO.rules.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </div>

        {/* Code groups */}
        <div className="mt-4 flex flex-col gap-4">
          {GROUPS.map((g) => {
            const items = LOBBY_CODES.filter(g.match)
            if (!items.length) return null
            return (
              <section key={g.key}>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{g.label}</h3>
                <div className="flex flex-col gap-1.5">
                  {items.map((c) => {
                    const st = STATUS[c.status] || STATUS.rumored
                    return (
                      <div key={c.code} className="flex items-center gap-2 rounded-xl bg-[var(--bg-2)] p-2">
                        <button
                          onClick={() => copy(c.code)}
                          title="Copy code"
                          className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2.5 py-1.5 font-mono text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[var(--border)]"
                        >
                          {copied === c.code ? '✓ Copied' : c.code}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{c.unlocks}</p>
                          <p className="text-[10px] text-[var(--muted)]">
                            {c.region ? `${c.region} · ` : ''}via {c.source}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${st.cls}`}>{st.label}</span>
                        <button onClick={() => copy(c.code)} aria-label={`Copy ${c.code}`} title="Copy code" className="shrink-0 text-[var(--muted)] hover:text-white">📋</button>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <p className="mt-4 rounded-lg bg-[var(--bg-2)] px-3 py-2 text-[11px] leading-relaxed text-[var(--muted)]">
          Community-sourced and moving fast — Epic releases new codes all season and promo codes expire. <b className="text-white">Verify each code in-game</b> before relying on it; unverified ones are labelled. Not affiliated with Epic Games.
        </p>
      </div>
    </div>
  )
}
