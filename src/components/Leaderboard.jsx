import { useState, useEffect } from 'react'
import { useAuth } from '../context/authStore'
import Tooltip from './Tooltip'
import CompareModal from './CompareModal'
import Friends from './Friends'
import { PlayerAvatar, PlayerBadges } from './PlayerAvatar'

const MEDALS = ['🥇', '🥈', '🥉']
const RING = ['#fbbf24', '#cbd5e1', '#e0954a'] // gold · silver · bronze

// ★ add / remove a player as a friend. Optimistic toggle backed by AuthContext.
function FriendStar({ userId, gamertag, className = '' }) {
  const { friendIds, addFriend, removeFriend } = useAuth()
  const isFriend = friendIds.has(userId)
  return (
    <button
      onClick={() => (isFriend ? removeFriend(userId) : addFriend(userId))}
      title={isFriend ? `Remove ${gamertag || 'player'} from friends` : `Add ${gamertag || 'player'} as a friend`}
      aria-label={isFriend ? 'Remove friend' : 'Add friend'}
      aria-pressed={isFriend}
      className={`shrink-0 rounded-lg px-1.5 py-1 text-sm transition-colors ${isFriend ? 'text-amber-300 hover:text-amber-200' : 'text-[var(--muted)] hover:text-white'} ${className}`}
    >
      {isFriend ? '★' : '☆'}
    </button>
  )
}

export default function Leaderboard({ onSignIn }) {
  const { user, fetchLeaderboard, friendIds } = useAuth()
  const [rows, setRows] = useState(null)
  const [loading, setLoading] = useState(true)
  const [compare, setCompare] = useState(null)
  const [mode, setMode] = useState('global') // 'global' | 'friends'

  const load = async () => {
    setLoading(true)
    setRows(await fetchLeaderboard())
    setLoading(false)
  }

  // Auto-load once. State is set only after the await resolves (async), so it
  // never triggers a synchronous setState-in-effect.
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

  const ranked = rows ? rows.map((r, i) => ({ ...r, rank: i })) : []
  const myRank = ranked.findIndex((r) => r.user_id === user?.id)
  const topScore = ranked.length ? Math.max(1, ranked[0].score) : 1
  const top = ranked.slice(0, 3)
  const rest = ranked.slice(3)
  // Classic 2 · 1 · 3 podium order on the top row (falls back gracefully for <3).
  const podium = top.length === 3 ? [top[1], top[0], top[2]] : top

  const canCompare = (r) => user && r.user_id !== user.id

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg text-white">
          🏆 Flex Score Leaderboard
          <Tooltip content="Score = rarity-weighted owned sprites (Mythic 20 · Legendary 8 · Epic 3 · Rare 1), +50% for each mastered. Only public collections appear. Your avatar is your first showcase Sprite.">
            <span className="grid h-4 w-4 cursor-help place-items-center rounded-full bg-[var(--panel-2)] text-[10px] text-[var(--muted)]" aria-label="How scoring works">ⓘ</span>
          </Tooltip>
        </h3>
        {mode === 'global' && rows !== null && (
          <button onClick={load} title="Reload the leaderboard" className="text-xs font-bold text-[var(--muted)] hover:text-white">↻ Refresh</button>
        )}
      </div>

      {/* Global · Friends toggle */}
      <div className="mb-4 inline-flex rounded-xl bg-[var(--bg-2)] p-1 text-xs font-bold">
        <button
          onClick={() => setMode('global')}
          className={`rounded-lg px-3 py-1.5 transition-colors ${mode === 'global' ? 'bg-[var(--brand)] text-black' : 'text-[var(--muted)] hover:text-white'}`}
        >
          🏆 Global
        </button>
        <button
          onClick={() => setMode('friends')}
          className={`rounded-lg px-3 py-1.5 transition-colors ${mode === 'friends' ? 'bg-[var(--brand)] text-black' : 'text-[var(--muted)] hover:text-white'}`}
        >
          👥 Friends{user && friendIds.size ? ` (${friendIds.size})` : ''}
        </button>
      </div>

      {mode === 'friends' ? (
        <Friends onSignIn={onSignIn} />
      ) : (
        <>
      {rows === null && loading && (
        <div className="space-y-1">
          <div className="mb-3 grid grid-cols-3 items-end gap-2">
            {[64, 80, 56].map((h, i) => <div key={i} className="animate-pulse rounded-2xl bg-[var(--bg-2)]" style={{ height: h + 60 }} />)}
          </div>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-[var(--bg-2)]" />)}
        </div>
      )}

      {rows !== null && (
        ranked.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No public collections yet — make yours public to claim #1!</p>
        ) : (
          <>
            {user && myRank >= 0 && (
              <div className="mb-3 rounded-xl bg-[var(--brand)]/15 px-3 py-2 text-xs font-bold text-[var(--brand)]">
                You’re ranked #{myRank + 1} with {Math.round(ranked[myRank].score)} pts
              </div>
            )}

            {/* Podium — top 3 as trophy cards */}
            <div className="mb-4 grid grid-cols-3 items-end gap-2 sm:gap-3">
              {podium.map((p) => {
                const me = p.user_id === user?.id
                const first = p.rank === 0
                return (
                  <div
                    key={p.user_id}
                    className={`flex flex-col items-center rounded-2xl border px-2 pb-3 text-center ${first ? 'pt-4' : 'pt-3'} ${me ? 'border-[var(--brand)]/50 bg-[var(--brand)]/15' : 'border-[var(--border)] bg-[var(--bg-2)]'}`}
                    style={first ? { boxShadow: '0 0 24px -8px #fbbf2455' } : undefined}
                  >
                    <div className={first ? 'text-2xl' : 'text-xl'}>{MEDALS[p.rank]}</div>
                    <div className="mt-1">
                      <PlayerAvatar id={p.avatar} size={first ? 64 : 48} ring={RING[p.rank]} />
                    </div>
                    <a href={`?u=${p.user_id}`} className="mt-2 flex max-w-full items-center gap-1 truncate text-sm font-bold text-white hover:text-[var(--brand)]">
                      <span className="truncate">{p.gamertag || 'Anonymous'}</span>
                    </a>
                    <div className={`font-display text-[var(--brand)] ${first ? 'text-2xl' : 'text-xl'}`}>{Math.round(p.score)}</div>
                    <div className="text-[10px] text-[var(--muted)]">{p.owned} owned · {p.mastered}★</div>
                    <div className="mt-1 flex items-center gap-1">
                      {me && <span className="text-[10px] font-bold text-[var(--brand)]">you</span>}
                      <PlayerBadges owned={p.owned} mastered={p.mastered} max={first ? 3 : 2} />
                    </div>
                    {canCompare(p) && (
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          onClick={() => setCompare({ userId: p.user_id, gamertag: p.gamertag })}
                          title={`Compare with ${p.gamertag || 'this player'}`}
                          className="rounded-lg bg-[var(--panel-2)] px-2 py-1 text-[10px] font-bold text-white hover:bg-[var(--border)]"
                        >
                          ⚖ Compare
                        </button>
                        <FriendStar userId={p.user_id} gamertag={p.gamertag} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Ranks 4+ — compact rows with a score bar */}
            {rest.length > 0 && (
              <div className="space-y-1">
                {rest.map((r) => {
                  const me = r.user_id === user?.id
                  const pct = Math.max(4, Math.round((r.score / topScore) * 100))
                  return (
                    <div
                      key={r.user_id}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 ${me ? 'bg-[var(--brand)]/15' : 'bg-[var(--bg-2)]'}`}
                    >
                      <span className="w-6 shrink-0 text-center text-sm font-extrabold text-[var(--muted)]">{r.rank + 1}</span>
                      <PlayerAvatar id={r.avatar} size={32} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <a href={`?u=${r.user_id}`} className="truncate text-sm font-bold text-white hover:text-[var(--brand)]">{r.gamertag || 'Anonymous'}</a>
                          {me && <span className="shrink-0 text-[10px] text-[var(--brand)]">you</span>}
                          <PlayerBadges owned={r.owned} mastered={r.mastered} max={2} />
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--panel-2)]">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,var(--brand),var(--brand-2))' }} />
                        </div>
                      </div>
                      <span className="hidden shrink-0 text-[11px] text-[var(--muted)] sm:inline">{r.owned} owned · {r.mastered}★</span>
                      {canCompare(r) && (
                        <>
                          <button
                            onClick={() => setCompare({ userId: r.user_id, gamertag: r.gamertag })}
                            title={`Compare your collection with ${r.gamertag || 'this player'}`}
                            className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]"
                          >
                            ⚖
                          </button>
                          <FriendStar userId={r.user_id} gamertag={r.gamertag} />
                        </>
                      )}
                      <span className="w-14 shrink-0 text-right font-display text-base text-[var(--brand)]">{Math.round(r.score)}</span>
                    </div>
                  )
                })}
              </div>
            )}

            <p className="mt-3 text-[11px] text-[var(--muted)]">
              Ranked by a rarity-weighted score (Mythic 20 · Legendary 8 · Epic 3 · Rare 1, +50% for mastered). Only public collections appear — set yours public in Profile to join. Tap ★ to save a player to your Friends tab.
            </p>
          </>
        )
      )}
        </>
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
