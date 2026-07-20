import { useState, useMemo } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { ALL_SPRITES } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import { generateTradeImage, downloadDataUrl } from '../lib/exportImage'

const SPRITE_BY_ID = Object.fromEntries(ALL_SPRITES.map((s) => [s.id, s]))
function label(id) {
  const s = SPRITE_BY_ID[id]
  return s ? `${s.typeName} · ${THEME_MAP[s.themeId]?.name || ''}`.trim() : id
}
function accent(id) {
  return THEME_MAP[SPRITE_BY_ID[id]?.themeId]?.accent || '#888'
}

function Chips({ ids, empty }) {
  if (!ids.length) return <p className="text-xs text-[var(--muted)]">{empty}</p>
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <span key={id} className="flex items-center gap-1 rounded-full bg-[var(--bg-2)] px-2 py-1 text-[11px] font-semibold text-white">
          <span className="h-2 w-2 rounded-full" style={{ background: accent(id) }} />
          {label(id)}
        </span>
      ))}
    </div>
  )
}

export default function TradePanel() {
  const { user, profile, tracking, findTradeMatches } = useAuth()
  const { toast } = useToast()
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(false)

  const haves = useMemo(() => ALL_SPRITES.filter((s) => tracking[s.id]?.forTrade).map((s) => s.id), [tracking])
  const wants = useMemo(() => ALL_SPRITES.filter((s) => tracking[s.id]?.wanted).map((s) => s.id), [tracking])

  if (!user) return null

  const runMatch = async () => {
    setLoading(true)
    setMatches(await findTradeMatches())
    setLoading(false)
  }

  const exportCard = () => {
    const url = generateTradeImage({
      gamertag: profile?.gamertag,
      haves: haves.map((id) => ({ label: label(id), accent: accent(id) })),
      wants: wants.map((id) => ({ label: label(id), accent: accent(id) })),
    })
    downloadDataUrl(url, 'fn-sprite-trades.png')
    toast('Trade card downloaded')
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg text-white">Trading</h3>
        <button onClick={exportCard} title="Export a shareable trade-card image (for trade / looking for)" className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">
          📸 Trade card
        </button>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">
        Mark a sprite <span className="font-bold text-emerald-400">⇄ for trade</span> or{' '}
        <span className="font-bold text-pink-400">♥ wanted</span> from any sprite’s detail view, then find matches.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-emerald-400">⇄ For trade ({haves.length})</span>
          <Chips ids={haves} empty="Nothing marked for trade yet." />
        </div>
        <div>
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-pink-400">♥ Looking for ({wants.length})</span>
          <Chips ids={wants} empty="No wishlist yet." />
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--border)] pt-3">
        <button
          onClick={runMatch}
          disabled={loading || (!haves.length && !wants.length)}
          title="Find players whose wants/offers match yours"
          className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-sm font-extrabold text-black disabled:opacity-50"
        >
          {loading ? 'Finding matches…' : 'Find trade matches'}
        </button>

        {matches !== null && (
          <div className="mt-3 space-y-2">
            {matches.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No matches yet — share the tracker so more players make their lists public!</p>
            ) : (
              matches.map((m) => (
                <div key={m.partner_id} className="rounded-xl bg-[var(--bg-2)] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-display text-base text-[var(--brand)]">{m.gamertag || 'A player'}</span>
                    <a href={`?u=${m.partner_id}`} className="text-[11px] font-bold text-[var(--muted)] underline">view collection</a>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <span className="mb-1 block text-[10px] font-bold uppercase text-emerald-400">They give you</span>
                      <Chips ids={m.they_give || []} empty="—" />
                    </div>
                    <div>
                      <span className="mb-1 block text-[10px] font-bold uppercase text-pink-400">You give them</span>
                      <Chips ids={m.i_give || []} empty="—" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
