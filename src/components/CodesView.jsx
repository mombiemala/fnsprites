import { useState } from 'react'
import { useToast } from '../context/toastStore'
import { CODES_INTRO, CODE_CATEGORIES, LOBBY_CODES } from '../data/codes'

// The "Lobby Hacks" codes as a first-class tab (was a modal). Same data as the
// prerendered /codes SEO page (src/data/codes.js); copy + redeemed-tracking are
// client-side and persist locally. Grouped by reward category (what you get);
// status is a per-code badge so freshness stays obvious.
const STATUS = {
  working: { label: 'Working', cls: 'bg-emerald-400/15 text-emerald-300' },
  regional: { label: 'Regional', cls: 'bg-amber-400/15 text-amber-300' },
  rumored: { label: 'Unverified', cls: 'bg-white/10 text-[var(--muted)]' },
}
// Within a category, lead with the codes players can use right now.
const STATUS_RANK = { working: 0, regional: 1, rumored: 2 }
const byStatus = (a, b) => (STATUS_RANK[a.status] ?? 3) - (STATUS_RANK[b.status] ?? 3)
// A code counts as "new" for ~a week after its `added` date.
const isNewCode = (c) => c.added && (Date.now() - new Date(c.added).getTime()) <= 7 * 864e5

const REDEEMED_KEY = 'fnsprites.codesRedeemed'
const HIDE_KEY = 'fnsprites.codesHideRedeemed'
const loadRedeemed = () => {
  try { return new Set(JSON.parse(localStorage.getItem(REDEEMED_KEY)) || []) } catch { return new Set() }
}
const saveRedeemed = (set) => {
  try { localStorage.setItem(REDEEMED_KEY, JSON.stringify([...set])) } catch { /* ignore */ }
}

export default function CodesView() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(null)
  const [redeemed, setRedeemed] = useState(loadRedeemed)
  const [hideRedeemed, setHideRedeemed] = useState(() => {
    try { return localStorage.getItem(HIDE_KEY) === '1' } catch { return false }
  })

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

  const toggleRedeem = (code) => {
    setRedeemed((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code); else next.add(code)
      saveRedeemed(next)
      return next
    })
  }
  const setAll = (on) => {
    const next = on ? new Set(LOBBY_CODES.map((c) => c.code)) : new Set()
    setRedeemed(next); saveRedeemed(next)
    toast(on ? 'Marked all codes redeemed' : 'Cleared redeemed codes')
  }
  const toggleHide = () => {
    setHideRedeemed((v) => { const n = !v; try { localStorage.setItem(HIDE_KEY, n ? '1' : '0') } catch { /* ignore */ } return n })
  }

  const working = LOBBY_CODES.filter((c) => c.status === 'working').length
  const redeemedCount = LOBBY_CODES.filter((c) => redeemed.has(c.code)).length

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-6">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-white">🔓 {CODES_INTRO.title}</h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            Season 4 “Override” · <b className="text-emerald-300">{working}</b> working now
            {redeemedCount > 0 && <> · <b className="text-white">{redeemedCount}/{LOBBY_CODES.length}</b> redeemed</>}
          </p>
        </div>
        <a href="/codes" title="Open the full Lobby Hacks page" className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)] hover:text-white">Full page ↗</a>
      </div>

      {/* How it works */}
      <div className="rounded-xl bg-[var(--bg-2)] p-3 text-sm text-[var(--text)]/90">
        <p>{CODES_INTRO.how}</p>
        <ul className="mt-2 space-y-1 text-[11px] text-[var(--muted)]">
          {CODES_INTRO.rules.map((r, i) => <li key={i}>• {r}</li>)}
        </ul>
      </div>

      {/* Redeemed-tracking toolbar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
          <input type="checkbox" checked={hideRedeemed} onChange={toggleHide} />
          Hide redeemed
        </label>
        <div className="flex items-center gap-2">
          <button onClick={() => setAll(true)} title="Mark every code as redeemed" className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">✓ Redeem all</button>
          <button onClick={() => setAll(false)} title="Clear all redeemed marks" className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)] hover:text-white">Clear</button>
        </div>
      </div>

      {/* Code groups — by reward category */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {CODE_CATEGORIES.map((g) => {
          const items = LOBBY_CODES
            .filter((c) => c.category === g.key)
            .filter((c) => !hideRedeemed || !redeemed.has(c.code))
            .sort(byStatus)
          if (!items.length) return null
          return (
            <section key={g.key}>
              <h3 className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{g.icon} {g.label} <span className="text-[var(--muted)]/60">· {items.length}</span></h3>
              <p className="mb-2 text-[10px] leading-snug text-[var(--muted)]/80">{g.blurb}</p>
              <div className="flex flex-col gap-1.5">
                {items.map((c) => {
                  const st = STATUS[c.status] || STATUS.rumored
                  const done = redeemed.has(c.code)
                  return (
                    <div key={c.code} className={`flex items-center gap-2 rounded-xl bg-[var(--bg-2)] p-2 ${done ? 'opacity-55' : ''}`}>
                      <button
                        onClick={() => toggleRedeem(c.code)}
                        aria-pressed={done}
                        title={done ? 'Redeemed — tap to unmark' : 'Mark as redeemed'}
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs font-black ${done ? 'border-emerald-400 bg-emerald-400 text-black' : 'border-[var(--border)] bg-[var(--panel-2)] text-transparent hover:border-[var(--muted)]'}`}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => copy(c.code)}
                        title="Copy code"
                        className={`shrink-0 rounded-lg bg-[var(--panel-2)] px-2.5 py-1.5 font-mono text-[13px] font-bold tracking-wide text-white transition-colors hover:bg-[var(--border)] ${done ? 'line-through decoration-[var(--muted)]' : ''}`}
                      >
                        {copied === c.code ? '✓ Copied' : c.code}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{c.unlocks}</p>
                        <p className="text-[10px] text-[var(--muted)]">
                          {c.region ? `${c.region} · ` : ''}via {c.source}
                        </p>
                      </div>
                      {isNewCode(c) && <span className="shrink-0 rounded bg-sky-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-sky-300" title="Added in the last week">🆕 New</span>}
                      {c.repeatable && <span className="shrink-0 rounded bg-sky-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-sky-300" title="Reusable — re-trigger any time">↻ Reusable</span>}
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${st.cls}`}>{st.label}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <p className="mt-4 rounded-lg bg-[var(--bg-2)] px-3 py-2 text-[11px] leading-relaxed text-[var(--muted)]">
        Community-sourced and moving fast — Epic releases new codes all season and promo codes expire. <b className="text-white">Verify each code in-game</b> before relying on it; unverified ones are labelled. Redeemed marks are saved on this device. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
