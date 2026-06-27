import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { rowsToMap } from '../lib/sharedCollection'
import { AuthContext } from './authStore'

const LOCAL_KEY = 'fnsprites.tracking'
const EMPTY = { owned: false, mastered: false, forTrade: false, wanted: false }

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
  const [tracking, setTracking] = useState(() => loadLocal())
  const [authLoading, setAuthLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  // 'synced' | 'saving' | 'error' — surfaced in the header so the user can see
  // their changes persisting to the cloud.
  const [cloudStatus, setCloudStatus] = useState('synced')
  const mergedOnce = useRef(false)

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
      const [{ data: prof }, { data: rows }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('sprite_progress').select('*').eq('user_id', user.id),
      ])
      if (cancelled) return

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
            toUpsert.push({ user_id: user.id, sprite_id: spriteId, owned, mastered, for_trade: forTrade, wanted })
          }
        }
        if (toUpsert.length) {
          await supabase.from('sprite_progress').upsert(toUpsert)
        }
      }

      if (cancelled) return
      setProfile(prof || { id: user.id, gamertag: null, is_public: true })
      setTracking(cloudMap)
      saveLocal(cloudMap)
      setSyncing(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [user])

  // Merge a patch into a sprite's state, enforce invariants, persist locally,
  // and upsert to the cloud when signed in.
  const update = useCallback(
    (spriteId, patch) => {
      const cur = tracking[spriteId] || EMPTY
      let entry = { ...cur, ...patch }
      // Invariants: mastering/trading a sprite implies you own it; losing
      // ownership clears mastery and trade-availability.
      if (entry.mastered) entry.owned = true
      if (entry.forTrade) entry.owned = true
      if (!entry.owned) entry = { ...entry, owned: false, mastered: false, forTrade: false }

      setTracking((prev) => {
        const next = { ...prev, [spriteId]: entry }
        saveLocal(next)
        return next
      })
      if (user) {
        setCloudStatus('saving')
        supabase
          .from('sprite_progress')
          .upsert({
            user_id: user.id,
            sprite_id: spriteId,
            owned: entry.owned,
            mastered: entry.mastered,
            for_trade: entry.forTrade,
            wanted: entry.wanted,
            updated_at: new Date().toISOString(),
          })
          .then(({ error }) => setCloudStatus(error ? 'error' : 'synced'))
      }
    },
    [tracking, user]
  )

  // Bulk owned toggle for many sprites at once (single local update + one upsert).
  const bulkOwn = useCallback(
    (ids, owned = true) => {
      setTracking((prev) => {
        const next = { ...prev }
        for (const id of ids) {
          const cur = next[id] || EMPTY
          next[id] = owned
            ? { ...cur, owned: true }
            : { ...cur, owned: false, mastered: false, forTrade: false }
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
            owned,
            mastered: owned ? cur.mastered : false,
            for_trade: owned ? cur.forTrade : false,
            wanted: cur.wanted,
            updated_at: new Date().toISOString(),
          }
        })
        if (rows.length) {
          setCloudStatus('saving')
          supabase.from('sprite_progress').upsert(rows).then(({ error }) => setCloudStatus(error ? 'error' : 'synced'))
        }
      }
    },
    [tracking, user]
  )

  const setOwned = useCallback((id, owned) => update(id, { owned }), [update])
  const setMastered = useCallback((id, mastered) => update(id, { mastered }), [update])
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
    setForTrade,
    setWanted,
    bulkOwn,
    findTradeMatches,
    fetchLeaderboard,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
