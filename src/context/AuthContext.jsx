import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { rowsToMap } from '../lib/sharedCollection'
import { AuthContext } from './authStore'

const LOCAL_KEY = 'fnsprites.tracking'

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
          if (owned !== !!cloud?.owned || mastered !== !!cloud?.mastered) {
            cloudMap[spriteId] = { owned, mastered }
            toUpsert.push({ user_id: user.id, sprite_id: spriteId, owned, mastered })
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

  // Persist one sprite's state. Optimistic local update + cloud upsert if signed in.
  const persistEntry = useCallback(
    async (spriteId, entry) => {
      setTracking((prev) => {
        const next = { ...prev, [spriteId]: entry }
        saveLocal(next)
        return next
      })
      if (user) {
        await supabase.from('sprite_progress').upsert({
          user_id: user.id,
          sprite_id: spriteId,
          owned: entry.owned,
          mastered: entry.mastered,
          updated_at: new Date().toISOString(),
        })
      }
    },
    [user]
  )

  const setOwned = useCallback(
    (spriteId, owned) => {
      const cur = tracking[spriteId] || { owned: false, mastered: false }
      const entry = { owned, mastered: owned ? cur.mastered : false }
      persistEntry(spriteId, entry)
    },
    [tracking, persistEntry]
  )

  const setMastered = useCallback(
    (spriteId, mastered) => {
      const cur = tracking[spriteId] || { owned: false, mastered: false }
      // Mastering implies ownership.
      const entry = { owned: mastered ? true : cur.owned, mastered }
      persistEntry(spriteId, entry)
    },
    [tracking, persistEntry]
  )

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

  const value = {
    session,
    user,
    profile,
    tracking,
    authLoading,
    syncing,
    setOwned,
    setMastered,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
