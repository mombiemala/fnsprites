import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { rowsToMap } from '../lib/sharedCollection'
import { ACTIVE_COLLECTION_ID } from '../data/collections'
import { AuthContext } from './authStore'

const LOCAL_KEY = 'fnsprites.tracking'
const EMPTY = { owned: false, mastered: false, forTrade: false, wanted: false, level: 0 }
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v | 0))

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}
  } catch {
    return {}
  }
}

function saveLocal(tracking) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(tracking))
  } catch {
    /* ignore quota / private mode errors */
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  // Set of user_ids the signed-in player has saved as friends. Loaded on login
  // for fast membership checks (the ★ toggle on leaderboard rows). The detailed
  // list (scores, counts) is fetched on demand by the Friends panel.
  const [friendIds, setFriendIds] = useState(() => new Set())
  // user_ids the signed-in player has vouched for (trade reputation button state).
  const [vouchedIds, setVouchedIds] = useState(() => new Set())
  // Trade confirmations (Phase 2): partners YOU've marked as traded-with, and the
  // subset where they confirmed back (mutual) — vouching is gated on mutual.
  const [confirmedTradeIds, setConfirmedTradeIds] = useState(() => new Set())
  const [theyConfirmedTradeIds, setTheyConfirmedTradeIds] = useState(() => new Set())
  const [mutualTradeIds, setMutualTradeIds] = useState(() => new Set())
  const [tracking, setTracking] = useState(() => loadLocal())
  const [authLoading, setAuthLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  // 'synced' | 'saving' | 'error' — surfaced in the header so the user can see
  // their changes persisting to the cloud.
  const [cloudStatus, setCloudStatus] = useState('synced')
  const mergedOnce = useRef(false)
  // Set when the sign-in collection read failed after retries; a reconnect/focus
  // then bumps `reloadTick` to re-run the load. Guards against a transient read
  // ever presenting (or persisting) an empty collection for a user who has data.
  const loadFailedRef = useRef(false)
  const [reloadTick, setReloadTick] = useState(0)

  const user = session?.user || null

  // --- Session bootstrap ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (!s) {
        // Reset cloud-tied state on sign-out; keep local tracking for guests.
        setProfile(null)
        setFriendIds(new Set())
        setVouchedIds(new Set())
        setConfirmedTradeIds(new Set())
        setTheyConfirmedTradeIds(new Set())
        setMutualTradeIds(new Set())
        mergedOnce.current = false
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // --- Load cloud data + merge local progress when a user signs in ---
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const run = async () => {
      setSyncing(true)
      const [{ data: prof }, spriteRes, { data: friendRows }, { data: vouchRows }, { data: confirmRows }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('sprite_progress').select('*').eq('user_id', user.id).eq('collection', ACTIVE_COLLECTION_ID),
        supabase.from('friends').select('friend_id').eq('user_id', user.id),
        supabase.from('trade_vouches').select('vouchee_id').eq('voucher_id', user.id),
        // RLS returns rows where I'm either the confirmer or the partner.
        supabase.from('trade_confirmations').select('confirmer_id,partner_id'),
      ])
      if (cancelled) return

      // The collection read is the ONLY critical one — an empty result here (from
      // a transient error) would otherwise clobber the user's data. Retry it a few
      // times before trusting the result.
      let rows = spriteRes.data
      let rowsErr = spriteRes.error
      for (let attempt = 0; rowsErr && attempt < 2; attempt++) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
        if (cancelled) return
        const res = await supabase.from('sprite_progress').select('*').eq('user_id', user.id).eq('collection', ACTIVE_COLLECTION_ID)
        rows = res.data
        rowsErr = res.error
      }

      setFriendIds(new Set((friendRows || []).map((r) => r.friend_id)))
      setVouchedIds(new Set((vouchRows || []).map((r) => r.vouchee_id)))

      // Derive my-confirmed + mutual sets from the rows involving me.
      const iConfirmed = new Set()
      const theyConfirmed = new Set()
      for (const r of confirmRows || []) {
        if (r.confirmer_id === user.id) iConfirmed.add(r.partner_id)
        if (r.partner_id === user.id) theyConfirmed.add(r.confirmer_id)
      }
      setConfirmedTradeIds(iConfirmed)
      setTheyConfirmedTradeIds(theyConfirmed)
      setMutualTradeIds(new Set([...iConfirmed].filter((id) => theyConfirmed.has(id))))

      // If the collection read failed after retries, DO NOT overwrite tracking or
      // localStorage with an empty map — keep what the user already has, flag it,
      // and let a reconnect/focus re-run the load. Never flip mergedOnce here, so a
      // later successful load can still merge any local progress up. (This is the
      // guard against "signed in and my collection is empty" from a network blip.)
      if (rowsErr) {
        if (prof) setProfile(prof)
        setCloudStatus('error')
        loadFailedRef.current = true
        setSyncing(false)
        return
      }
      loadFailedRef.current = false

      const cloudMap = rowsToMap(rows)

      // One-time merge of any guest/local progress into the cloud on first login.
      if (!mergedOnce.current) {
        mergedOnce.current = true
        const local = loadLocal()
        const toUpsert = []
        for (const [spriteId, v] of Object.entries(local)) {
          const cloud = cloudMap[spriteId]
          const owned = !!v.owned || !!cloud?.owned
          const mastered = !!v.mastered || !!cloud?.mastered
          const forTrade = !!v.forTrade || !!cloud?.forTrade
          const wanted = !!v.wanted || !!cloud?.wanted
          if (
            owned !== !!cloud?.owned || mastered !== !!cloud?.mastered ||
            forTrade !== !!cloud?.forTrade || wanted !== !!cloud?.wanted
          ) {
            cloudMap[spriteId] = { owned, mastered, forTrade, wanted }
            toUpsert.push({ user_id: user.id, sprite_id: spriteId, collection: ACTIVE_COLLECTION_ID, owned, mastered, for_trade: forTrade, wanted })
          }
        }
        if (toUpsert.length) {
          await supabase.from('sprite_progress').upsert(toUpsert)
        }
      }

      if (cancelled) return
      setProfile(prof || { id: user.id, gamertag: null, is_public: true, epic_username: null, epic_platform: 'epic', showcase_sprite_ids: null, stats_public: false })
      setTracking(cloudMap)
      saveLocal(cloudMap)
      setSyncing(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [user, reloadTick])

  // If the initial collection load failed, re-run it when we regain connectivity
  // or the tab is refocused — so a user who opened to an errored/empty state
  // recovers automatically rather than seeing an empty collection.
  useEffect(() => {
    if (!user) return
    const retry = () => { if (loadFailedRef.current) setReloadTick((t) => t + 1) }
    window.addEventListener('online', retry)
    window.addEventListener('focus', retry)
    return () => {
      window.removeEventListener('online', retry)
      window.removeEventListener('focus', retry)
    }
  }, [user])

  // Pending cloud writes that failed to sync (sprite_id -> the exact current row).
  // Retried automatically on reconnect, after any later successful write, and on a
  // light interval — so a transient network blip self-heals without waiting for the
  // next sign-in. Because each entry is the full current row, this also correctly
  // syncs un-marks (which the login-time union merge, being additive, can't undo).
  const pendingRef = useRef(new Map())

  const flushPending = useCallback(async () => {
    if (!user || pendingRef.current.size === 0) return
    const snapshot = [...pendingRef.current.entries()] // [ [sprite_id, row], … ]
    setCloudStatus('saving')
    const { error } = await supabase.from('sprite_progress').upsert(snapshot.map(([, row]) => row))
    if (error) { setCloudStatus('error'); return }
    // Clear only what we just wrote AND that a newer write hasn't superseded.
    for (const [id, row] of snapshot) {
      if (pendingRef.current.get(id) === row) pendingRef.current.delete(id)
    }
    setCloudStatus(pendingRef.current.size ? 'error' : 'synced')
  }, [user])

  // Upsert collection rows to the cloud; on failure, queue them for auto-retry.
  const pushRows = useCallback((rows) => {
    if (!user || !rows?.length) return
    setCloudStatus('saving')
    supabase.from('sprite_progress').upsert(rows).then(({ error }) => {
      if (error) {
        for (const row of rows) pendingRef.current.set(row.sprite_id, row)
        setCloudStatus('error')
      } else {
        setCloudStatus('synced')
        // A good moment to drain anything queued from an earlier failure.
        if (pendingRef.current.size) flushPending()
      }
    })
  }, [user, flushPending])

  // Auto-retry queued writes: on reconnect and on a light interval while any are
  // pending. The mount attempt is deferred to a timer so no state is set
  // synchronously inside the effect.
  useEffect(() => {
    if (!user) return
    const onOnline = () => flushPending()
    window.addEventListener('online', onOnline)
    const iv = setInterval(() => { if (pendingRef.current.size) flushPending() }, 20000)
    const t = setTimeout(() => { if (pendingRef.current.size) flushPending() }, 0)
    return () => {
      window.removeEventListener('online', onOnline)
      clearInterval(iv)
      clearTimeout(t)
    }
  }, [user, flushPending])

  // Merge a patch into a sprite's state, enforce invariants, persist locally,
  // and upsert to the cloud when signed in.
  const update = useCallback(
    (spriteId, patch) => {
      const cur = tracking[spriteId] || EMPTY
      const entry = { ...cur, ...patch }
      // Level (0–5) is the source of truth. A patch may set level directly, or
      // toggle owned/mastered which we translate into a level.
      if ('level' in patch) {
        entry.level = clamp(patch.level, 0, 5)
      } else if ('mastered' in patch) {
        entry.level = patch.mastered ? 5 : cur.level >= 5 ? 4 : Math.max(cur.owned ? 1 : 0, cur.level)
      } else if ('owned' in patch) {
        entry.level = patch.owned ? Math.max(1, cur.level) : 0
      }
      // If this change drops the sprite below level 1 it means "not owned" — clear
      // for-trade first. Otherwise the "for-trade implies owned" invariant below
      // snaps the level back to 1, making a for-trade sprite impossible to un-mark
      // (it reads as a glitch: tapping "not owned" does nothing). An explicit
      // for-trade toggle in this same patch is still honored.
      if (entry.level < 1 && !patch.forTrade) entry.forTrade = false
      // Marking for-trade implies you have it (at least level 1).
      if (entry.forTrade && entry.level < 1) entry.level = 1
      entry.owned = entry.level >= 1
      entry.mastered = entry.level >= 5
      if (!entry.owned) entry.forTrade = false

      setTracking((prev) => {
        const next = { ...prev, [spriteId]: entry }
        saveLocal(next)
        return next
      })
      if (user) {
        pushRows([{
          user_id: user.id,
          sprite_id: spriteId,
          collection: ACTIVE_COLLECTION_ID,
          owned: entry.owned,
          mastered: entry.mastered,
          level: entry.level,
          for_trade: entry.forTrade,
          wanted: entry.wanted,
          updated_at: new Date().toISOString(),
        }])
      }
    },
    [tracking, user, pushRows]
  )

  // Bulk owned toggle for many sprites at once (single local update + one upsert).
  const bulkOwn = useCallback(
    (ids, owned = true) => {
      setTracking((prev) => {
        const next = { ...prev }
        for (const id of ids) {
          const cur = next[id] || EMPTY
          next[id] = owned
            ? { ...cur, owned: true, level: Math.max(1, cur.level || 0) }
            : { ...cur, owned: false, mastered: false, forTrade: false, level: 0 }
        }
        saveLocal(next)
        return next
      })
      if (user) {
        const rows = ids.map((id) => {
          const cur = tracking[id] || EMPTY
          return {
            user_id: user.id,
            sprite_id: id,
            collection: ACTIVE_COLLECTION_ID,
            owned,
            mastered: owned ? cur.mastered : false,
            level: owned ? Math.max(1, cur.level || 0) : 0,
            for_trade: owned ? cur.forTrade : false,
            wanted: cur.wanted,
            updated_at: new Date().toISOString(),
          }
        })
        pushRows(rows)
      }
    },
    [tracking, user, pushRows]
  )

  // Restore from a backup code (guest device transfer). Non-destructive merge:
  // takes the higher level per sprite and OR-s the flags, so importing never
  // wipes existing progress. Persists locally and, if signed in, to the cloud.
  const importTracking = useCallback(
    (incoming) => {
      const merged = { ...tracking }
      let changed = 0
      const rows = []
      for (const [id, e] of Object.entries(incoming || {})) {
        if (!e || typeof e !== 'object') continue
        const inLevel = clamp(e.level ?? (e.mastered ? 5 : e.owned ? 1 : 0), 0, 5)
        const cur = merged[id] || EMPTY
        const level = Math.max(cur.level || 0, inLevel)
        if (level < 1 && !e.wanted && !cur.wanted) continue
        const entry = {
          level,
          owned: level >= 1,
          mastered: level >= 5,
          forTrade: (cur.forTrade || !!e.forTrade) && level >= 1,
          wanted: cur.wanted || !!e.wanted,
        }
        merged[id] = entry
        changed++
        rows.push({
          user_id: user?.id,
          sprite_id: id,
          collection: ACTIVE_COLLECTION_ID,
          owned: entry.owned, mastered: entry.mastered, level: entry.level,
          for_trade: entry.forTrade, wanted: entry.wanted,
          updated_at: new Date().toISOString(),
        })
      }
      setTracking(merged)
      saveLocal(merged)
      if (user && rows.length) pushRows(rows)
      return changed
    },
    [tracking, user, pushRows]
  )

  const setOwned = useCallback((id, owned) => update(id, { owned }), [update])
  const setMastered = useCallback((id, mastered) => update(id, { mastered }), [update])
  const setLevel = useCallback((id, level) => update(id, { level }), [update])
  const setForTrade = useCallback((id, forTrade) => update(id, { forTrade }), [update])
  const setWanted = useCallback((id, wanted) => update(id, { wanted }), [update])

  // --- Auth actions ---
  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    if (!data.session) return { needsConfirmation: true }
    return { ok: true }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { ok: true }
  }, [])

  const signInWithProvider = useCallback(async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + window.location.pathname },
    })
    if (error) return { error: error.message }
    return { ok: true }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const updateProfile = useCallback(
    async (fields) => {
      if (!user) return { error: 'Not signed in' }
      const payload = { id: user.id, ...fields, updated_at: new Date().toISOString() }
      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload)
        .select()
        .maybeSingle()
      if (error) return { error: error.message }
      setProfile(data)
      return { ok: true }
    },
    [user]
  )

  // Two-way trade matches among public collections (Postgres RPC).
  const findTradeMatches = useCallback(async () => {
    if (!user) return []
    const { data, error } = await supabase.rpc('find_trade_matches', { target: user.id })
    if (error) return []
    return data || []
  }, [user])

  // Flex Score leaderboard across public collections (viewable by anyone).
  const fetchLeaderboard = useCallback(async () => {
    const { data, error } = await supabase.rpc('leaderboard')
    if (error) return []
    return data || []
  }, [])

  // "Who owns this Sprite" — public players who own a given Sprite type (Postgres
  // RPC; public profiles only). Viewable by anyone, signed in or not.
  const fetchSpriteHolders = useCallback(async (typeId) => {
    if (!typeId) return []
    const { data, error } = await supabase.rpc('sprite_holders', { type_id: typeId })
    if (error) return []
    return data || []
  }, [])

  // --- Friends (save players to compare with) ---
  // The detailed list (gamertag, score, owned/mastered) for the Friends panel.
  const fetchFriends = useCallback(async () => {
    if (!user) return []
    const { data, error } = await supabase.rpc('my_friends')
    if (error) return []
    return data || []
  }, [user])

  // Two-way trade matches restricted to your friends (Postgres RPC).
  const fetchFriendTradeMatches = useCallback(async () => {
    if (!user) return []
    const { data, error } = await supabase.rpc('friend_trade_matches')
    if (error) return []
    return data || []
  }, [user])

  // Search public players by gamertag so you can add a friend by name.
  const searchPlayers = useCallback(async (q) => {
    if (!q || q.trim().length < 2) return []
    const { data, error } = await supabase.rpc('search_public_profiles', { q: q.trim() })
    if (error) return []
    return (data || []).filter((r) => r.user_id !== user?.id)
  }, [user])

  const addFriend = useCallback(async (friendId) => {
    if (!user || !friendId || friendId === user.id) return { error: 'Invalid' }
    // Optimistic — the ★ flips immediately, roll back on error.
    setFriendIds((prev) => new Set(prev).add(friendId))
    const { error } = await supabase.from('friends').insert({ user_id: user.id, friend_id: friendId })
    if (error) {
      setFriendIds((prev) => {
        const next = new Set(prev)
        next.delete(friendId)
        return next
      })
      return { error: error.message }
    }
    return { ok: true }
  }, [user])

  // --- Trade reputation (vouches) ---
  // Reputation for a set of players (batched): id -> { credible_count, tier }.
  const fetchReputation = useCallback(async (uids) => {
    const list = [...new Set((uids || []).filter(Boolean))]
    if (!list.length) return {}
    const { data, error } = await supabase.rpc('trade_reputation_batch', { uids: list })
    if (error) return {}
    const map = {}
    for (const r of data || []) map[r.user_id] = { count: r.credible_count, tier: r.tier }
    return map
  }, [])

  // Public list of who vouched for a player (for the Trainer Card).
  const fetchVouchers = useCallback(async (uid) => {
    if (!uid) return []
    const { data, error } = await supabase.rpc('vouchers_for', { uid })
    if (error) return []
    return data || []
  }, [])

  // Vouch for a player you've BOTH confirmed a trade with (Phase 2 strong gate).
  // The server enforces the mutual-confirmation gate; we surface its return code.
  const addVouch = useCallback(async (targetId, note = null) => {
    if (!user || !targetId || targetId === user.id) return { error: 'invalid' }
    setVouchedIds((prev) => new Set(prev).add(targetId))
    const { data, error } = await supabase.rpc('vouch_add', { target: targetId, p_note: note })
    if (error || data !== 'ok') {
      setVouchedIds((prev) => { const n = new Set(prev); n.delete(targetId); return n })
      return { error: error?.message || data || 'failed', code: data }
    }
    return { ok: true }
  }, [user])

  const removeVouch = useCallback(async (targetId) => {
    if (!user || !targetId) return { error: 'invalid' }
    setVouchedIds((prev) => { const n = new Set(prev); n.delete(targetId); return n })
    const { error } = await supabase.from('trade_vouches').delete().eq('voucher_id', user.id).eq('vouchee_id', targetId)
    if (error) { setVouchedIds((prev) => new Set(prev).add(targetId)); return { error: error.message } }
    return { ok: true }
  }, [user])

  // --- Trade confirmations (Phase 2) ---
  // Mark that you completed a trade with a partner. When they've confirmed too the
  // trade is mutual, which unlocks vouching. Optimistic on the "I confirmed" flag.
  const confirmTrade = useCallback(async (partnerId) => {
    if (!user || !partnerId || partnerId === user.id) return { error: 'invalid' }
    setConfirmedTradeIds((prev) => new Set(prev).add(partnerId))
    const { data, error } = await supabase.rpc('trade_confirm', { partner: partnerId })
    if (error || (data !== 'ok' && data !== 'mutual')) {
      setConfirmedTradeIds((prev) => { const n = new Set(prev); n.delete(partnerId); return n })
      return { error: error?.message || data || 'failed', code: data }
    }
    if (data === 'mutual') {
      setTheyConfirmedTradeIds((prev) => new Set(prev).add(partnerId))
      setMutualTradeIds((prev) => new Set(prev).add(partnerId))
    }
    return { ok: true, mutual: data === 'mutual' }
  }, [user])

  const unconfirmTrade = useCallback(async (partnerId) => {
    if (!user || !partnerId) return { error: 'invalid' }
    setConfirmedTradeIds((prev) => { const n = new Set(prev); n.delete(partnerId); return n })
    setMutualTradeIds((prev) => { const n = new Set(prev); n.delete(partnerId); return n })
    const { error } = await supabase.rpc('trade_unconfirm', { partner: partnerId })
    if (error) return { error: error.message }
    // Removing my vouch too — a vouch with no trade behind it shouldn't stand.
    await supabase.from('trade_vouches').delete().eq('voucher_id', user.id).eq('vouchee_id', partnerId)
    setVouchedIds((prev) => { const n = new Set(prev); n.delete(partnerId); return n })
    return { ok: true }
  }, [user])

  // Per-partner confirmation status for a set of players (drives trade-match cards).
  // Also folds the results into the local sets so the UI stays consistent.
  const fetchTradeConfirmations = useCallback(async (uids) => {
    const list = [...new Set((uids || []).filter(Boolean))]
    if (!user || !list.length) return {}
    const { data, error } = await supabase.rpc('trade_confirmations_for', { uids: list })
    if (error) return {}
    const map = {}
    for (const r of data || []) {
      map[r.partner_id] = { iConfirmed: r.i_confirmed, theyConfirmed: r.they_confirmed, mutual: r.i_confirmed && r.they_confirmed }
    }
    setConfirmedTradeIds((prev) => {
      const n = new Set(prev)
      for (const r of data || []) { if (r.i_confirmed) n.add(r.partner_id); else n.delete(r.partner_id) }
      return n
    })
    setTheyConfirmedTradeIds((prev) => {
      const n = new Set(prev)
      for (const r of data || []) { if (r.they_confirmed) n.add(r.partner_id); else n.delete(r.partner_id) }
      return n
    })
    setMutualTradeIds((prev) => {
      const n = new Set(prev)
      for (const r of data || []) { if (r.i_confirmed && r.they_confirmed) n.add(r.partner_id); else n.delete(r.partner_id) }
      return n
    })
    return map
  }, [user])

  // Lightweight report on a trader (Phase 2). Recorded privately for the maker to
  // review — it does NOT auto-subtract reputation (positive-only stays un-abusable).
  const reportTrader = useCallback(async (subjectId, reason = null) => {
    if (!user || !subjectId || subjectId === user.id) return { error: 'invalid' }
    const { data, error } = await supabase.rpc('report_add', { subject: subjectId, p_reason: reason })
    if (error || data !== 'ok') return { error: error?.message || data || 'failed', code: data }
    return { ok: true }
  }, [user])

  // --- Community code reports ("still working?" votes on lobby codes) ---
  // Recent working/failing counts per code (aggregate, works for guests too).
  // Returns a map keyed by the LOWERCASED code -> { works, fails }.
  const fetchCodeReports = useCallback(async (codes) => {
    const list = [...new Set((codes || []).filter(Boolean))]
    if (!list.length) return {}
    const { data, error } = await supabase.rpc('code_reports_batch', { p_codes: list })
    if (error) return {}
    const map = {}
    for (const r of data || []) map[r.code] = { works: r.works, fails: r.fails }
    return map
  }, [])

  // The signed-in user's own votes -> map of lowercased code -> works (bool).
  const fetchMyCodeVotes = useCallback(async () => {
    if (!user) return {}
    const { data, error } = await supabase.from('code_reports').select('code,works')
    if (error) return {}
    const map = {}
    for (const r of data || []) map[r.code] = r.works
    return map
  }, [user])

  // Cast/update the user's "works / doesn't work" vote for a code.
  const setCodeReport = useCallback(async (code, works) => {
    if (!user) return { error: 'not_signed_in' }
    const { data, error } = await supabase.rpc('code_report_set', { p_code: code, p_works: works })
    if (error || data !== 'ok') return { error: error?.message || data || 'failed' }
    return { ok: true }
  }, [user])

  const removeFriend = useCallback(async (friendId) => {
    if (!user || !friendId) return { error: 'Invalid' }
    const prevHad = friendIds.has(friendId)
    setFriendIds((prev) => {
      const next = new Set(prev)
      next.delete(friendId)
      return next
    })
    const { error } = await supabase.from('friends').delete().eq('user_id', user.id).eq('friend_id', friendId)
    if (error && prevHad) {
      setFriendIds((prev) => new Set(prev).add(friendId))
      return { error: error.message }
    }
    return { ok: true }
  }, [user, friendIds])

  const value = {
    session,
    user,
    profile,
    tracking,
    authLoading,
    syncing,
    cloudStatus,
    setOwned,
    setMastered,
    setLevel,
    setForTrade,
    setWanted,
    bulkOwn,
    importTracking,
    findTradeMatches,
    fetchLeaderboard,
    fetchSpriteHolders,
    friendIds,
    fetchFriends,
    fetchFriendTradeMatches,
    searchPlayers,
    addFriend,
    removeFriend,
    vouchedIds,
    fetchReputation,
    fetchVouchers,
    addVouch,
    removeVouch,
    confirmedTradeIds,
    theyConfirmedTradeIds,
    mutualTradeIds,
    confirmTrade,
    unconfirmTrade,
    fetchTradeConfirmations,
    reportTrader,
    fetchCodeReports,
    fetchMyCodeVotes,
    setCodeReport,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
