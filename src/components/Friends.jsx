import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { PlayerAvatar, PlayerBadges } from './PlayerAvatar'
import CompareModal from './CompareModal'

// Friends panel — the signed-in player's saved players, ranked by the same Flex
// Score as the global board, each with a one-tap Compare. Add players by name
// (public gamertag search). One-directional "save to compare" model.
export default function Friends({ onSignIn }) {
  const { user, friendIds, fetchFriends, searchPlayers, addFriend, removeFriend } = useAuth()
  const { toast } = useToast()
  const [rows, setRows] = useState(null)
  const [compare, setCompare] = useState(null)

  // Add-friend search
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null) // null = idle, [] = no matches
  const [searching, setSearching] = useState(false)
  const debounce = useRef(null)

  const load = useCallback(async () => {
    setRows(await fetchFriends())
  }, [fetchFriends])

  // fetchFriends() returns [] when signed out, so state is only set after the
  // await resolves — never synchronously inside the effect.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const r = await fetchFriends()
      if (!cancelled) setRows(r)
    })()
    return () => { cancelled = true }
  }, [user, fetchFriends])

  // Debounced gamertag search. All state updates happen inside the timeout
  // callback (asynchronously), so nothing is set synchronously in the effect.
  useEffect(() => {
    const term = q.trim()
    const t = setTimeout(async () => {
      if (term.length < 2) { setResults(null); setSearching(false); return }
      setSearching(true)
      const r = await searchPlayers(term)
      setResults(r)
      setSearching(false)
    }, term.length < 2 ? 0 : 300)
    debounce.current = t
    return () => clearTimeout(t)
  }, [q, searchPlayers])

  const handleAdd = async (p) => {
    const res = await addFriend(p.user_id)
    if (res?.error) { toast('Couldn’t add friend'); return }
    toast(`Added ${p.gamertag || 'player'}`)
    setQ('')
    setResults(null)
    load()
  }

  const handleRemove = async (r) => {
    const res = await removeFriend(r.user_id)
    if (res?.error) { toast('Couldn’t remove'); return }
    setRows((prev) => (prev || []).filter((x) => x.user_id !== r.user_id))
  }

  if (!user) {
    return (
      <div className="rounded-xl bg-[var(--bg-2)] p-6 text-center">
        <p className="text-sm text-[var(--muted)]">Sign in to save friends and compare collections.</p>
        {onSignIn && (
          <button onClick={onSignIn} className="mt-3 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-bold text-black hover:opacity-90">
            Sign in
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Add a friend by gamertag */}
      <div className="relative mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Add a friend by gamertag…"
          aria-label="Search players by gamertag"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--brand)]"
        />
        {(results !== null || searching) && q.trim().length >= 2 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl">
            {searching ? (
              <p className="px-3 py-3 text-xs text-[var(--muted)]">Searching…</p>
            ) : results.length === 0 ? (
              <p className="px-3 py-3 text-xs text-[var(--muted)]">No public players match “{q.trim()}”.</p>
            ) : (
              results.map((p) => {
                const already = friendIds.has(p.user_id)
                return (
                  <div key={p.user_id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-[var(--bg-2)]">
                    <PlayerAvatar id={p.avatar} size={28} />
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{p.gamertag}</span>
                    <button
                      onClick={() => !already && handleAdd(p)}
                      disabled={already}
                      className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold ${already ? 'bg-[var(--panel-2)] text-[var(--muted)]' : 'bg-[var(--brand)] text-black hover:opacity-90'}`}
                    >
                      {already ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Friends list */}
      {rows === null ? (
        <div className="space-y-1">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-[var(--bg-2)]" />)}
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl bg-[var(--bg-2)] px-3 py-6 text-center text-sm text-[var(--muted)]">
          No friends yet — search above, or tap ★ next to any player on the global board.
        </p>
      ) : (
        <div className="space-y-1">
          {rows.map((r, i) => (
            <div key={r.user_id} className="flex items-center gap-3 rounded-xl bg-[var(--bg-2)] px-3 py-2">
              <span className="w-5 shrink-0 text-center text-sm font-extrabold text-[var(--muted)]">{i + 1}</span>
              <PlayerAvatar id={r.avatar} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <a href={`?u=${r.user_id}`} className="truncate text-sm font-bold text-white hover:text-[var(--brand)]">{r.gamertag || 'Anonymous'}</a>
                  {r.is_public ? <PlayerBadges owned={r.owned} mastered={r.mastered} max={2} /> : (
                    <span className="shrink-0 text-[10px] text-[var(--muted)]">🔒 private</span>
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-[var(--muted)]">
                  {r.is_public ? `${r.owned} owned · ${r.mastered}★ · ${Math.round(r.score)} pts` : 'Collection is private'}
                </div>
              </div>
              {r.is_public && (
                <button
                  onClick={() => setCompare({ userId: r.user_id, gamertag: r.gamertag })}
                  title={`Compare with ${r.gamertag || 'this player'}`}
                  className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]"
                >
                  ⚖ Compare
                </button>
              )}
              <button
                onClick={() => handleRemove(r)}
                title="Remove friend"
                aria-label={`Remove ${r.gamertag || 'friend'}`}
                className="shrink-0 rounded-lg px-1.5 py-1 text-sm text-[var(--muted)] hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {compare && (
        <CompareModal userId={compare.userId} gamertag={compare.gamertag} onClose={() => setCompare(null)} />
      )}
    </div>
  )
}
