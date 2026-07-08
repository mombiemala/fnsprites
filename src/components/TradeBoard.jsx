import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { ALL_SPRITES } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import { fetchTradePosts, createTradePost, deleteTradePost, fetchTradeMatches, vouchForTrader, unvouchTrader } from '../lib/tradeBoard'
import TradePanel from './TradePanel'

const RELEASED = ALL_SPRITES.filter((s) => s.released)
const LABEL = Object.fromEntries(ALL_SPRITES.map((s) => [s.id, `${s.typeName} · ${THEME_MAP[s.themeId]?.name || ''}`]))
const ACCENT = Object.fromEntries(ALL_SPRITES.map((s) => [s.id, THEME_MAP[s.themeId]?.accent || '#888']))

const METHODS = [
  { id: 'index', label: '🔁 Indexing' },
  { id: 'full', label: '⇄ Full trade' },
]
const WHY_LABEL = {
  both: '↔ Mutual match',
  offers_your_want: '⬅ Has what you want',
  wants_your_offer: '➡ Wants what you offer',
}

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function Chips({ ids }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <span key={id} className="rounded-full px-2 py-0.5 text-[11px] font-bold text-black" style={{ background: ACCENT[id] }}>{LABEL[id] || id}</span>
      ))}
    </div>
  )
}

function PostCard({ p, why, onDelete, onVouch, canVouch }) {
  const vouches = p.vouches || 0
  return (
    <div className="rounded-xl bg-[var(--bg-2)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-white">{p.contact || 'A collector'}</span>
          {vouches > 0 && (
            <span
              title={`${vouches} collector${vouches === 1 ? '' : 's'} vouched for this trader`}
              className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300"
            >
              👍 {vouches}
            </span>
          )}
          {why && <span className="rounded bg-[var(--brand)]/20 px-1.5 py-0.5 text-[10px] font-bold text-[var(--brand)]">{WHY_LABEL[why] || 'Match'}</span>}
          {p.methods.map((m) => (
            <span key={m} className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted)]">{m === 'index' ? '🔁 Index' : '⇄ Full'}</span>
          ))}
          <span className="text-[11px] text-[var(--muted)]">· {timeAgo(p.created_at)}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {canVouch && !p.mine && onVouch && (
            <button
              onClick={() => onVouch(p)}
              title={p.i_vouched ? 'You vouched for this trader — tap to undo' : "Vouch for a collector you've traded with successfully"}
              className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-colors ${p.i_vouched ? 'bg-emerald-400 text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'}`}
            >
              {p.i_vouched ? '👍 Vouched' : '👍 Vouch'}
            </button>
          )}
          {p.mine && onDelete && (
            <button onClick={() => onDelete(p.id)} className="text-[11px] font-bold text-red-300 hover:text-red-200">Delete</button>
          )}
        </div>
      </div>
      {p.wants.length > 0 && (
        <div className="mt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300">Wants</span>
          <Chips ids={p.wants} />
        </div>
      )}
      {p.offers.length > 0 && (
        <div className="mt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Offers</span>
          <Chips ids={p.offers} />
        </div>
      )}
      {p.note && <p className="mt-2 text-xs text-[var(--text)]/80">{p.note}</p>}
    </div>
  )
}

// Compact searchable multi-select of released sprites.
function SpritePicker({ value, onChange, placeholder }) {
  const [q, setQ] = useState('')
  const opts = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return []
    return RELEASED.filter((s) => !value.includes(s.id) && LABEL[s.id].toLowerCase().includes(query)).slice(0, 6)
  }, [q, value])

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {value.map((id) => (
            <span key={id} className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold text-black" style={{ background: ACCENT[id] }}>
              {LABEL[id]}
              <button onClick={() => onChange(value.filter((v) => v !== id))} className="opacity-70 hover:opacity-100">✕</button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
        />
        {opts.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel-2)] shadow-xl">
            {opts.map((s) => (
              <button key={s.id} onClick={() => { onChange([...value, s.id]); setQ('') }} className="block w-full px-3 py-1.5 text-left text-xs text-white hover:bg-[var(--brand)]/20">
                {LABEL[s.id]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TradeBoard() {
  const { user, profile, tracking, updateProfile } = useAuth()
  const { toast } = useToast()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [matches, setMatches] = useState([])

  const notifyOn = !!profile?.notify_trades

  const myWanted = useMemo(() => RELEASED.filter((s) => tracking[s.id]?.wanted).map((s) => s.id), [tracking])
  const myForTrade = useMemo(() => RELEASED.filter((s) => tracking[s.id]?.forTrade).map((s) => s.id), [tracking])
  const [wants, setWants] = useState([])
  const [offers, setOffers] = useState([])
  const [methods, setMethods] = useState(['index', 'full'])
  const [contact, setContact] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [seeded, setSeeded] = useState(false)

  if (!seeded && (profile || myWanted.length || myForTrade.length)) {
    setSeeded(true)
    setWants(myWanted)
    setOffers(myForTrade)
    setContact(profile?.gamertag || '')
  }

  const load = async () => { setPosts(await fetchTradePosts()); setLoading(false) }
  useEffect(() => {
    let cancelled = false
    ;(async () => { const p = await fetchTradePosts(); if (!cancelled) { setPosts(p); setLoading(false) } })()
    return () => { cancelled = true }
  }, [])

  // Opted-in: load matches, and mark trades seen (clears the nav badge).
  useEffect(() => {
    if (!user || !notifyOn) return
    let cancelled = false
    ;(async () => { const m = await fetchTradeMatches(); if (!cancelled) setMatches(m) })()
    updateProfile({ trades_seen_at: new Date().toISOString() })
    return () => { cancelled = true }
  }, [user, notifyOn, updateProfile])

  const toggleNotify = async () => {
    const res = await updateProfile({ notify_trades: !notifyOn })
    if (res?.error) toast('Could not update preference', 'error')
  }

  const submit = async () => {
    if (!user) return
    if (!wants.length && !offers.length) { toast('Add at least one sprite you want or can offer', 'error'); return }
    if (!methods.length) { toast('Pick at least one trade method', 'error'); return }
    setBusy(true)
    const { error } = await createTradePost({ wants, offers, methods, note: note.trim(), contact: contact.trim(), userId: user.id })
    setBusy(false)
    if (error) { toast(error.message || 'Could not post', 'error'); return }
    toast('Trade posted to the board 🎉')
    setNote('')
    load()
  }

  const remove = async (id) => {
    const { error } = await deleteTradePost(id)
    if (error) { toast('Could not delete', 'error'); return }
    setPosts((p) => p.filter((x) => x.id !== id))
    setMatches((p) => p.filter((x) => x.id !== id))
  }

  // Vouch / un-vouch a trader. Optimistically update every post by that user so
  // their reputation count moves everywhere they appear on the board at once.
  const vouch = async (post) => {
    if (!user) return
    const next = !post.i_vouched
    const apply = (list) => list.map((x) =>
      x.user_id === post.user_id
        ? { ...x, i_vouched: next, vouches: Math.max(0, (x.vouches || 0) + (next ? 1 : -1)) }
        : x)
    setPosts(apply)
    setMatches(apply)
    const { error } = next ? await vouchForTrader(post.user_id) : await unvouchTrader(post.user_id)
    if (error) {
      // roll back on failure
      const revert = (list) => list.map((x) =>
        x.user_id === post.user_id
          ? { ...x, i_vouched: post.i_vouched, vouches: Math.max(0, (x.vouches || 0) + (next ? -1 : 1)) }
          : x)
      setPosts(revert)
      setMatches(revert)
      toast(error.message || 'Could not update vouch', 'error')
    }
  }

  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => [...p.wants, ...p.offers].some((id) => (LABEL[id] || '').toLowerCase().includes(q)))
  }, [posts, filter])

  const toggleMethod = (m) => setMethods((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]))

  return (
    <div className="flex flex-col gap-4">
      {/* Explainer + safety/disclaimer */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
        <h3 className="font-display text-lg text-white">🔁 Trade Board</h3>
        <p className="mt-1 text-sm text-[var(--text)]/85">
          Post what you’re after and browse other collectors. Trades happen in-game — this board just helps you find each other.
        </p>
        <details className="mt-3 rounded-xl bg-[var(--bg-2)] p-3 text-sm">
          <summary className="cursor-pointer font-bold text-white">How indexing works &amp; trade types</summary>
          <div className="mt-2 space-y-2 text-[var(--text)]/85">
            <p><b className="text-white">⇄ Full trade:</b> you give a sprite to another player. To use it again you’ll need to re-summon it, which costs <b>Sprite Dust</b>.</p>
            <p><b className="text-white">🔁 Indexing:</b> a two-game favour. Game 1 you hand the sprite over; game 2 they hand it back. You keep yours (no dust spent) <i>and</i> they now have it indexed to re-summon with their own dust — a friendly way to help someone complete their index.</p>
            <p><b className="text-white">👍 Vouches:</b> after a trade goes well, tap <b>Vouch</b> on that collector’s post to build their reputation. The count is community trust, not a guarantee — still trade carefully.</p>
          </div>
        </details>
        <details className="mt-2 rounded-xl bg-[var(--bg-2)] p-3 text-sm">
          <summary className="cursor-pointer font-bold text-white">How a trade works in-game &amp; staying safe</summary>
          <div className="mt-2 space-y-2 text-[var(--text)]/85">
            <p>There’s no official trade menu — you trade by <b className="text-white">dropping</b> a Sprite for the other player to <b className="text-white">pick up and extract</b>:</p>
            <p>1. Both land together in a quiet spot (a <b>bot lobby</b> is safest).<br />2. Equip the Sprite, drop it, they pick it up.<br />3. They <b className="text-white">extract while carrying it</b> to lock it in — then repeat for your side.</p>
            <p className="text-amber-200/90">⚠️ <b>Watch for the “grab-and-run”</b> — someone grabs your dropped Sprite and extracts without giving anything back. <b className="text-white">Don’t drop first</b>, go one item at a time, and stick to <b>vouched</b> partners.</p>
          </div>
        </details>
        <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[11px] text-amber-200/90">
          ⚠️ <b>Trade at your own risk.</b> This tracker doesn’t facilitate, verify, or guarantee any trade and isn’t responsible for trades, scams, or lost items. Never share your account login or pay real money — use bot lobbies and trusted partners.
        </p>
        {user && (
          <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
            <input type="checkbox" checked={notifyOn} onChange={toggleNotify} />
            🔔 Show me matching trades here when new ones are posted
          </label>
        )}
      </div>

      {/* Matches for you */}
      {user && notifyOn && matches.length > 0 && (
        <div className="rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-4">
          <h4 className="mb-2 font-display text-base text-white">🔔 Matches for you <span className="text-sm text-[var(--muted)]">· {matches.length}</span></h4>
          <div className="flex flex-col gap-2">
            {matches.map((p) => <PostCard key={p.id} p={p} why={p.why} onDelete={remove} onVouch={vouch} canVouch={!!user} />)}
          </div>
        </div>
      )}

      {/* Post a trade */}
      {user ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
          <h4 className="mb-3 font-display text-base text-white">Post a trade</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">♥ I want to index / get</label>
              <SpritePicker value={wants} onChange={setWants} placeholder="Search a sprite you want…" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">⇄ I can offer / help index</label>
              <SpritePicker value={offers} onChange={setOffers} placeholder="Search a sprite you can trade…" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[var(--muted)]">Open to:</span>
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMethod(m.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${methods.includes(m.id) ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={120}
            placeholder="Contact — gamertag or Discord (so people can reach you)"
            className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Optional note — timezone, availability, specifics…"
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
          <button onClick={submit} disabled={busy} className="mt-3 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-sm font-extrabold text-black disabled:opacity-60">
            {busy ? 'Posting…' : 'Post to board'}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--muted)]">
          Log in to post a trade. You can still browse the board below.
        </div>
      )}

      {/* Board */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-display text-base text-white">Open trades <span className="text-sm text-[var(--muted)]">· {shown.length}</span></h4>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by sprite…"
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-[var(--muted)]">Loading trades…</p>
        ) : shown.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--muted)]">No trades yet{filter ? ' for that sprite' : ''} — be the first to post!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {shown.map((p) => <PostCard key={p.id} p={p} onDelete={remove} onVouch={vouch} canVouch={!!user} />)}
          </div>
        )}
      </div>

      {/* Auto match-finder from public collections (logged in) */}
      {user && (
        <div>
          <h4 className="mb-2 px-1 font-display text-base text-white">Suggested matches</h4>
          <TradePanel />
        </div>
      )}
    </div>
  )
}
