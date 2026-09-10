import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { PlayerAvatar, PlayerBadges } from './PlayerAvatar'
import CompareModal from './CompareModal'
import SpriteArt from './SpriteArt'
import { SPRITE_BY_ID, RARITY_COLORS } from '../data/sprites'
import { THEME_MAP } from '../data/themes'

// A row of Sprite mini-icons resolved from variant ids (they_give / i_give).
function SpriteRow({ ids }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const s = SPRITE_BY_ID[id]
        if (!s) return null
        return (
          <div key={id} className="relative h-9 w-9" title={`${s.typeName} · ${THEME_MAP[s.themeId]?.name || ''}`}>
            <SpriteArt sprite={s} className="h-full w-full" />
            <span
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-[var(--bg-2)]"
              style={{ background: RARITY_COLORS[s.rarity] || '#888' }}
            />
          </div>
        )
      })}
    </div>
  )
}

// Friends panel — the signed-in player's saved players, ranked by the same Flex
// Score as the global board, each with a one-tap Compare. A Trades sub-view
// surfaces two-way trade matches limited to your friends. One-directional
// "save to compare" model.
export default function Friends({ onSignIn }) {
  const { user, friendIds, fetchFriends, fetchFriendTradeMatches, searchPlayers, addFriend, removeFriend } = useAuth()
  const { toast } = useToast()
  const [view, setView] = useState('list') // 'list' | 'trades'
  const [rows, setRows] = useState(null)
  const [trades, setTrades] = useState(null)
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

  // Load trade matches lazily the first time the Trades sub-view is opened.
  useEffect(() => {
    if (view !== 'trades' || trades !== null || !user) return
    let cancelled = false
    ;(async () => {
      const t = await fetchFriendTradeMatches()
      if (!cancelled) setTrades(t)
    })()
    return () => { cancelled = true }
  }, [view, trades, user, fetchFriendTradeMatches])

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
    setTrades(null) // new friend may change trade matches
    load()
  }

  const handleRemove = async (r) => {
    const res = await removeFriend(r.user_id)
    if (res?.error) { toast('Couldn’t remove'); return }
    setRows((prev) => (prev || []).filter((x) => x.user_id !== r.user_id))
    setTrades((prev) => (prev ? prev.filter((x) => x.partner_id !== r.user_id) : prev))
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
      {/* List · Trades sub-toggle */}
      <div className="mb-3 flex gap-1.5 text-xs font-bold">
        <button
          onClick={() => setView('list')}
          className={`rounded-full px-3 py-1.5 transition-colors ${view === 'list' ? 'bg-[var(--panel-2)] text-white' : 'text-[var(--muted)] hover:text-white'}`}
        >
          👥 Friends{rows?.length ? ` (${rows.length})` : ''}
        </button>
        <button
          onClick={() => setView('trades')}
          className={`rounded-full px-3 py-1.5 transition-colors ${view === 'trades' ? 'bg-[var(--panel-2)] text-white' : 'text-[var(--muted)] hover:text-white'}`}
        >
          🔄 Trade matches{trades?.length ? ` (${trades.length})` : ''}
        </button>
      </div>

      {view === 'trades' ? (
        <TradesView trades={trades} />
      ) : (
        <>
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
        </>
      )}

      {compare && (
        <CompareModal userId={compare.userId} gamertag={compare.gamertag} onClose={() => setCompare(null)} />
      )}
    </div>
  )
}

// Trade matches limited to friends: for each matched friend, the Sprites they'd
// give you (they marked for-trade & you want) and the ones you'd give them.
function TradesView({ trades }) {
  if (trades === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--bg-2)]" />)}
      </div>
    )
  }
  if (trades.length === 0) {
    return (
      <div className="rounded-xl bg-[var(--bg-2)] px-3 py-6 text-center text-sm text-[var(--muted)]">
        No trade matches among your friends yet.
        <span className="mt-1 block text-xs">
          Mark your spare Sprites <b className="text-amber-300">For trade</b> and the ones you’re after <b className="text-[var(--brand)]">Wanted</b> — matches appear when a friend’s spares line up with your wants.
        </span>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {trades.map((t) => {
        const twoWay = t.they_give.length > 0 && t.i_give.length > 0
        return (
          <div key={t.partner_id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
            <div className="mb-2 flex items-center gap-2">
              <a href={`?u=${t.partner_id}`} className="text-sm font-bold text-white hover:text-[var(--brand)]">{t.gamertag || 'Anonymous'}</a>
              {twoWay && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">✓ Two-way match</span>}
              {t.discord && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-[#5865F2]/15 px-2 py-0.5 text-[10px] font-bold text-[#aab4ff]" title="Coordinate the trade on Discord">
                  <span aria-hidden>🎮</span>{t.discord}
                </span>
              )}
            </div>
            {t.they_give.length > 0 && (
              <div className="mb-2">
                <p className="mb-1 text-[11px] font-bold text-emerald-300">They’d give you ({t.they_give.length})</p>
                <SpriteRow ids={t.they_give} />
              </div>
            )}
            {t.i_give.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-bold text-amber-300">You’d give them ({t.i_give.length})</p>
                <SpriteRow ids={t.i_give} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
