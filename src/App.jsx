import { useState, useMemo, useEffect } from 'react'
import { useAuth } from './context/authStore'
import { fetchSharedCollection } from './lib/sharedCollection'
import { ALL_SPRITES, TOTAL_COUNT } from './data/sprites'
import { THEMES } from './data/themes'
import { CUSTOM_THEME } from './data/sprites'
import SpriteCard from './components/SpriteCard'
import ProgressStats from './components/ProgressStats'
import Toolbar from './components/Toolbar'
import AuthModal from './components/AuthModal'
import ShareBar from './components/ShareBar'
import SupportBanner from './components/SupportBanner'

const DEFAULT_FILTERS = {
  search: '',
  theme: 'all',
  rarity: 'all',
  ownership: 'all',
  hideMastered: false,
  showUnreleased: false,
  groupByTheme: false,
}

const THEME_NAME = Object.fromEntries(
  [...THEMES, CUSTOM_THEME].map((t) => [t.id, t.name])
)

function useShareTarget() {
  // Read ?u=<userId> once on mount.
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('u')
  }, [])
}

export default function App() {
  const { user, profile, tracking, setOwned, setMastered, signOut, syncing, authLoading } = useAuth()
  const shareTarget = useShareTarget()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showAuth, setShowAuth] = useState(false)
  const [shared, setShared] = useState(null)
  const [shareLoading, setShareLoading] = useState(!!shareTarget)

  // Load a shared collection in read-only view.
  useEffect(() => {
    if (!shareTarget) return
    let cancelled = false
    fetchSharedCollection(shareTarget).then((res) => {
      if (cancelled) return
      setShared(res)
      setShareLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [shareTarget])

  const isShareView = !!shareTarget
  const readOnly = isShareView
  const activeTracking = useMemo(
    () => (isShareView ? shared?.tracking || {} : tracking),
    [isShareView, shared, tracking]
  )

  // --- Stats ---
  const stats = useMemo(() => {
    let owned = 0
    let mastered = 0
    for (const s of ALL_SPRITES) {
      const st = activeTracking[s.id]
      if (st?.owned) owned++
      if (st?.mastered) mastered++
    }
    return { owned, mastered, total: TOTAL_COUNT }
  }, [activeTracking])

  // --- Filtered list ---
  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return ALL_SPRITES.filter((s) => {
      if (!filters.showUnreleased && s.unreleased) return false
      if (filters.theme !== 'all' && s.themeId !== filters.theme) return false
      if (filters.rarity !== 'all' && s.rarity !== filters.rarity) return false
      const st = activeTracking[s.id]
      if (filters.ownership === 'owned' && !st?.owned) return false
      if (filters.ownership === 'unowned' && st?.owned) return false
      if (filters.hideMastered && st?.mastered) return false
      if (q) {
        const hay = `${s.typeName} ${THEME_NAME[s.themeId]} ${s.rarity}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [filters, activeTracking])

  // Group into sections when "group by theme" is on.
  const groups = useMemo(() => {
    if (!filters.groupByTheme) return [{ key: 'all', label: null, items: visible }]
    const byTheme = {}
    for (const s of visible) {
      ;(byTheme[s.themeId] ||= []).push(s)
    }
    return [...THEMES, CUSTOM_THEME]
      .filter((t) => byTheme[t.id]?.length)
      .map((t) => ({ key: t.id, label: t.name, items: byTheme[t.id] }))
  }, [visible, filters.groupByTheme])

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-6 sm:px-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl leading-none text-white sm:text-4xl">
            FN <span className="text-[var(--brand)]">Sprite</span> Tracker
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
            Track every sprite across all {THEMES.length} themes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {syncing && <span className="text-xs text-[var(--muted)]">syncing…</span>}
          {!authLoading &&
            (user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs font-semibold text-[var(--muted)] sm:inline">
                  {profile?.gamertag || user.email}
                </span>
                <button
                  onClick={signOut}
                  className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-xs font-extrabold text-black"
              >
                Log in to save
              </button>
            ))}
        </div>
      </header>

      {/* Share view banner */}
      {isShareView && (
        <div className="mb-4 rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-4">
          {shareLoading ? (
            <p className="text-sm text-[var(--muted)]">Loading shared collection…</p>
          ) : shared?.profile && (shared.profile.is_public || shared.profile.gamertag) ? (
            <p className="text-sm text-white">
              Viewing{' '}
              <span className="font-display text-lg text-[var(--brand)]">
                {shared.profile.gamertag || 'a player'}
              </span>
              ’s collection (read-only).{' '}
              <a href={window.location.pathname} className="font-bold underline">
                Track your own →
              </a>
            </p>
          ) : (
            <p className="text-sm text-white">
              This collection is private or doesn’t exist.{' '}
              <a href={window.location.pathname} className="font-bold underline">
                Go to your tracker →
              </a>
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="mb-5">
        <ProgressStats owned={stats.owned} mastered={stats.mastered} total={stats.total} />
      </div>

      {/* Support + Share */}
      {!isShareView && (
        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <SupportBanner />
          {user ? (
            <ShareBar />
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--border)] p-5 text-center">
              <p className="text-sm text-[var(--muted)]">
                <button onClick={() => setShowAuth(true)} className="font-bold text-[var(--brand)] underline">
                  Log in
                </button>{' '}
                to save your progress to the cloud and get a shareable link with your gamertag.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-5">
        <Toolbar filters={filters} setFilters={setFilters} />
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-[var(--muted)]">No sprites match your filters.</p>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="mb-8">
            {g.label && (
              <h2 className="mb-3 font-display text-xl text-white/90">
                {g.label} <span className="text-sm text-[var(--muted)]">· {g.items.length}</span>
              </h2>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {g.items.map((s) => (
                <SpriteCard
                  key={s.id}
                  sprite={s}
                  state={activeTracking[s.id]}
                  onToggleOwned={setOwned}
                  onToggleMastered={setMastered}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </section>
        ))
      )}

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
        Fan-made sprite tracker · not affiliated with Epic Games · Support with Creator Code{' '}
        <span className="font-bold text-[var(--brand)]">MOMBIE</span>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
