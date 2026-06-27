import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/authStore'
import { fetchSharedCollection } from '../lib/sharedCollection'
import { ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import SpriteArt from './SpriteArt'
import { useEscClose } from '../lib/useEscClose'

// Compare your collection against another player's. Released sprites are
// sorted into four buckets by ownership, surfaced through a segmented filter
// so the list stays a single clean view you pivot through.
const RELEASED = ALL_SPRITES.filter((s) => !s.unreleased)

const TABS = [
  { id: 'youNeed', label: 'You need', hint: 'They own it, you don’t — your trade targets' },
  { id: 'shared', label: 'Shared', hint: 'You both own it' },
  { id: 'theyNeed', label: 'They need', hint: 'You own it, they don’t — you could trade it away' },
  { id: 'neither', label: 'Neither', hint: 'Still on both your wishlists' },
]

export default function CompareModal({ userId, gamertag, onClose }) {
  useEscClose(onClose)
  const { tracking } = useAuth()
  const [their, setTheir] = useState(null) // null = loading
  const [err, setErr] = useState(false)
  const [tab, setTab] = useState('youNeed')

  useEffect(() => {
    let cancelled = false
    fetchSharedCollection(userId)
      .then((res) => {
        if (cancelled) return
        if (!res?.profile) {
          setErr(true)
          return
        }
        setTheir(res.tracking || {})
      })
      .catch(() => {
        if (!cancelled) setErr(true)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const buckets = useMemo(() => {
    const b = { youNeed: [], shared: [], theyNeed: [], neither: [] }
    if (!their) return b
    for (const s of RELEASED) {
      const mine = !!tracking[s.id]?.owned
      const theirs = !!their[s.id]?.owned
      if (mine && theirs) b.shared.push(s)
      else if (theirs && !mine) b.youNeed.push(s)
      else if (mine && !theirs) b.theyNeed.push(s)
      else b.neither.push(s)
    }
    return b
  }, [their, tracking])

  const name = gamertag || 'This player'
  const list = buckets[tab]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Compare collections with ${name}`}
        className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl text-white">
            You <span className="text-[var(--muted)]">vs</span>{' '}
            <span className="text-[var(--brand)]">{name}</span>
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        {err ? (
          <p className="py-12 text-center text-sm text-[var(--muted)]">
            Couldn’t load this collection — it may be private.
          </p>
        ) : their === null ? (
          <p className="py-12 text-center text-sm text-[var(--muted)]">Loading their collection…</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-[var(--muted)]">
              You share{' '}
              <span className="font-bold text-emerald-300">{buckets.shared.length}</span> · you need{' '}
              <span className="font-bold text-[var(--brand)]">{buckets.youNeed.length}</span> · they need{' '}
              <span className="font-bold text-amber-300">{buckets.theyNeed.length}</span>
            </p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  title={t.hint}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    tab === t.id ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
                  }`}
                >
                  {t.label} <span className="opacity-70">{buckets[t.id].length}</span>
                </button>
              ))}
            </div>

            <p className="mb-3 text-xs text-[var(--muted)]">{TABS.find((t) => t.id === tab).hint}</p>

            <div className="-mx-1 flex-1 overflow-y-auto px-1">
              {list.length === 0 ? (
                <p className="py-12 text-center text-sm text-[var(--muted)]">Nothing here — try another tab.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {list.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col items-center rounded-xl bg-[var(--bg-2)] p-2 text-center"
                      title={`${s.typeName} · ${THEME_MAP[s.themeId]?.name || ''} · ${s.rarity}`}
                    >
                      <div className="relative h-14 w-14">
                        <SpriteArt sprite={s} className="h-full w-full" />
                        <span
                          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--bg-2)]"
                          style={{ background: RARITY_COLORS[s.rarity] || '#888' }}
                        />
                      </div>
                      <span className="mt-1 line-clamp-1 w-full text-[10px] font-bold text-white">{s.typeName}</span>
                      <span className="line-clamp-1 w-full text-[9px] text-[var(--muted)]">{THEME_MAP[s.themeId]?.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
