import { useState, useEffect } from 'react'
import { useAuth } from '../context/authStore'
import Tooltip from './Tooltip'
import CompareModal from './CompareModal'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user, fetchLeaderboard } = useAuth()
  const [rows, setRows] = useState(null)
  // Start in the loading state so the auto-load effect never has to call
  // setState synchronously on mount — a leaderboard behind a "Load" click reads
  // as empty and undercuts the social proof it exists to show.
  const [loading, setLoading] = useState(true)
  const [compare, setCompare] = useState(null)

  const load = async () => {
    setLoading(true)
    setRows(await fetchLeaderboard())
    setLoading(false)
  }

  // Auto-load once when the tab mounts. State is only set after the await
  // resolves (asynchronously), so it doesn't trigger cascading renders.
  useEffect(() => {
    let alive = true
    fetchLeaderboard().then((r) => {
      if (!alive) return
      setRows(r)
      setLoading(false)
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const myRank = rows ? rows.findIndex((r) => r.user_id === user?.id) : -1

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg text-white">
          🏆 Flex Score Leaderboard
          <Tooltip content="Score = rarity-weighted owned sprites (Mythic 20 · Legendary 8 · Epic 3 · Rare 1), +50% for each mastered. Only public collections appear.">
            <span className="grid h-4 w-4 cursor-help place-items-center rounded-full bg-[var(--panel-2)] text-[10px] text-[var(--muted)]" aria-label="How scoring works">ⓘ</span>
          </Tooltip>
        </h3>
        {rows === null ? (
          <button onClick={load} disabled={loading} className="rounded-xl bg-[var(--brand)] px-3 py-1.5 text-xs font-extrabold text-black disabled:opacity-60">
            {loading ? 'Loading…' : 'Load'}
          </button>
        ) : (
          <button onClick={load} className="text-xs font-bold text-[var(--muted)] hover:text-white">↻ Refresh</button>
        )}
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">
        Public collections ranked by a rarity-weighted score (Mythic 20 · Legendary 8 · Epic 3 · Rare 1, +50% for mastered).
      </p>

      {rows === null && loading && (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-xl bg-[var(--bg-2)]" />
          ))}
        </div>
      )}

      {rows !== null && (
        rows.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No public collections yet — make yours public to claim #1!</p>
        ) : (
          <div className="space-y-1">
            {user && myRank >= 0 && (
              <div className="mb-2 rounded-xl bg-[var(--brand)]/15 px-3 py-2 text-xs font-bold text-[var(--brand)]">
                You’re ranked #{myRank + 1} with {Math.round(rows[myRank].score)} pts
              </div>
            )}
            {rows.map((r, i) => {
              const me = r.user_id === user?.id
              return (
                <div
                  key={r.user_id}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 ${me ? 'bg-[var(--brand)]/15' : 'bg-[var(--bg-2)]'}`}
                >
                  <span className="w-7 shrink-0 text-center text-sm font-extrabold text-[var(--muted)]">
                    {MEDALS[i] || i + 1}
                  </span>
                  <a href={`?u=${r.user_id}`} className="flex-1 truncate font-bold text-white hover:text-[var(--brand)]">
                    {r.gamertag || 'Anonymous'}{me && <span className="ml-1 text-[10px] text-[var(--brand)]">you</span>}
                  </a>
                  {user && !me && (
                    <button
                      onClick={() => setCompare({ userId: r.user_id, gamertag: r.gamertag })}
                      title={`Compare your collection with ${r.gamertag || 'this player'}`}
                      className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]"
                    >
                      ⚖ Compare
                    </button>
                  )}
                  <span className="hidden shrink-0 text-[11px] text-[var(--muted)] sm:inline">{r.owned} owned · {r.mastered}★</span>
                  <span className="w-16 shrink-0 text-right font-display text-base text-[var(--brand)]">{Math.round(r.score)}</span>
                </div>
              )
            })}
          </div>
        )
      )}

      {compare && (
        <CompareModal
          userId={compare.userId}
          gamertag={compare.gamertag}
          onClose={() => setCompare(null)}
        />
      )}
    </div>
  )
}
