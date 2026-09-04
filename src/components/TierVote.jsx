import { useState, useEffect } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { VOTE_TIERS, fetchTierResults, fetchMyVotes, castVote, clearVote } from '../lib/tierVotes'

// Community tier voting for a single (current-season) Sprite. Shows the consensus
// tier + a distribution across S–D, and lets a logged-in player cast/change/clear
// their vote. Self-contained: fetches its own results + the viewer's own vote.
const TIER_COLOR = { S: '#f6c945', A: '#34d399', B: '#3da9fc', C: '#a99fb8', D: '#8b93a7' }
const EMPTY = { counts: { S: 0, A: 0, B: 0, C: 0, D: 0 }, total: 0, consensus: null }

export default function TierVote({ typeId, typeName }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [result, setResult] = useState(EMPTY)
  const [myVote, setMyVote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [res, mine] = await Promise.all([fetchTierResults(), fetchMyVotes()])
      if (cancelled) return
      setResult(res[typeId] || EMPTY)
      setMyVote(mine[typeId] || null)
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [typeId, user])

  const refresh = async () => {
    const [res, mine] = await Promise.all([fetchTierResults(), fetchMyVotes()])
    setResult(res[typeId] || EMPTY)
    setMyVote(mine[typeId] || null)
  }

  const vote = async (tier) => {
    if (!user) { toast('Log in to vote on Sprite tiers'); return }
    const prev = myVote
    const clearing = prev === tier
    // Optimistic update so the bars move instantly.
    setResult((r) => {
      const c = { ...r.counts }
      if (prev) c[prev] = Math.max(0, c[prev] - 1)
      if (!clearing) c[tier] = (c[tier] || 0) + 1
      const total = VOTE_TIERS.reduce((s, t) => s + c[t], 0)
      const consensus = total ? VOTE_TIERS.reduce((b, t) => (c[t] > c[b] ? t : b), 'S') : null
      return { counts: c, total, consensus }
    })
    setMyVote(clearing ? null : tier)
    const { error } = clearing ? await clearVote(typeId) : await castVote(typeId, tier)
    if (error) { toast('Vote didn’t save — try again', 'error'); refresh() }
    else toast(clearing ? 'Vote removed' : `Voted ${tier} for ${typeName}`)
  }

  const { counts, total, consensus } = result

  return (
    <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-white">🗳️ Community tier</span>
        {loading ? (
          <span className="text-[11px] text-[var(--muted)]">loading…</span>
        ) : total ? (
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
            consensus
            <span className="rounded px-1.5 py-0.5 text-[11px] font-extrabold" style={{ color: TIER_COLOR[consensus], background: `${TIER_COLOR[consensus]}22` }}>{consensus}</span>
            · {total} vote{total === 1 ? '' : 's'}
          </span>
        ) : (
          <span className="text-[11px] text-[var(--muted)]">no votes yet — be first</span>
        )}
      </div>

      {/* Distribution */}
      {total > 0 && (
        <div className="mb-2 space-y-1">
          {VOTE_TIERS.map((t) => {
            const pct = total ? Math.round((counts[t] / total) * 100) : 0
            return (
              <div key={t} className="flex items-center gap-2">
                <span className="w-4 text-[11px] font-extrabold" style={{ color: TIER_COLOR[t] }}>{t}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--panel)]">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: TIER_COLOR[t] }} />
                </div>
                <span className="w-8 text-right text-[10px] text-[var(--muted)]">{counts[t]}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Vote buttons */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-[var(--muted)]">{user ? (myVote ? 'Your vote:' : 'Vote:') : 'Log in to vote:'}</span>
        {VOTE_TIERS.map((t) => (
          <button
            key={t}
            onClick={() => vote(t)}
            disabled={!user}
            aria-pressed={myVote === t}
            title={user ? (myVote === t ? `Remove your ${t} vote` : `Vote ${t}`) : 'Log in to vote'}
            className={`h-7 w-7 rounded-lg text-xs font-extrabold transition-colors disabled:opacity-50 ${myVote === t ? 'text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'}`}
            style={myVote === t ? { background: TIER_COLOR[t] } : undefined}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-[var(--muted)]">Community-voted meta for the new Override Sprites — one vote per account, tap your vote again to remove it.</p>
    </div>
  )
}
