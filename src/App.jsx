import { useState, useMemo, useEffect } from 'react'
import { useAuth } from './context/authStore'
import { fetchSharedCollection } from './lib/sharedCollection'
import { ALL_SPRITES, TOTAL_COUNT, RELEASED_COUNT, SPRITE_TYPES, RARITY_ORDER } from './data/sprites'
import { THEMES, THEME_MAP } from './data/themes'
import { generateCollectionImage, downloadDataUrl } from './lib/exportImage'
import SpriteCard from './components/SpriteCard'
import ProgressStats from './components/ProgressStats'
import Toolbar from './components/Toolbar'
import AuthModal from './components/AuthModal'
import ShareBar from './components/ShareBar'
import SupportBanner from './components/SupportBanner'
import SpriteDetailModal from './components/SpriteDetailModal'
import TradePanel from './components/TradePanel'
import StatsBreakdown from './components/StatsBreakdown'
import Leaderboard from './components/Leaderboard'
import NewsFeed from './components/NewsFeed'
import MapView from './components/MapView'

const TABS = [
  { id: 'collection', label: 'Collection' },
  { id: 'leaderboard', label: '🏆 Leaderboard' },
  { id: 'news', label: '📰 News' },
  { id: 'map', label: '🗺️ Map' },
]

const DEFAULT_FILTERS = {
  search: '',
  theme: 'all',
  rarity: 'all',
  ownership: 'all',
  hideMastered: false,
  showUnreleased: false,
  groupBy: 'none',
  sort: 'default',
}

const RARITY_RANK = { Rare: 0, Epic: 1, Legendary: 2, Mythic: 3 }

function useShareTarget() {
  return useMemo(() => new URLSearchParams(window.location.search).get('u'), [])
}

export default function App() {
  const { user, profile, tracking, setOwned, setMastered, setForTrade, setWanted, bulkOwn, signOut, syncing, authLoading } = useAuth()
  const shareTarget = useShareTarget()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showAuth, setShowAuth] = useState(false)
  const [shared, setShared] = useState(null)
  const [shareLoading, setShareLoading] = useState(!!shareTarget)
  const [detailType, setDetailType] = useState(null)
  const [view, setView] = useState('collection')

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

  const stats = useMemo(() => {
    let owned = 0
    let mastered = 0
    for (const s of ALL_SPRITES) {
      if (activeTracking[s.id]?.owned) owned++
      if (activeTracking[s.id]?.mastered) mastered++
    }
    return { owned, mastered, total: TOTAL_COUNT }
  }, [activeTracking])

  // Owned/total per theme for the toolbar chips.
  const themeStats = useMemo(() => {
    const out = {}
    for (const t of THEMES) out[t.id] = { owned: 0, total: 0 }
    for (const s of ALL_SPRITES) {
      if (!out[s.themeId]) continue
      out[s.themeId].total++
      if (activeTracking[s.id]?.owned) out[s.themeId].owned++
    }
    return out
  }, [activeTracking])

  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    let list = ALL_SPRITES.filter((s) => {
      if (!filters.showUnreleased && s.unreleased) return false
      if (filters.theme !== 'all' && s.themeId !== filters.theme) return false
      if (filters.rarity !== 'all' && s.rarity !== filters.rarity) return false
      const st = activeTracking[s.id]
      if (filters.ownership === 'owned' && !st?.owned) return false
      if (filters.ownership === 'unowned' && st?.owned) return false
      if (filters.hideMastered && st?.mastered) return false
      if (q) {
        const hay = `${s.typeName} ${THEME_MAP[s.themeId]?.name} ${s.rarity}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    if (filters.sort === 'name') {
      list = [...list].sort((a, b) => a.typeName.localeCompare(b.typeName) || a.themeId.localeCompare(b.themeId))
    } else if (filters.sort === 'rarity') {
      list = [...list].sort((a, b) => (RARITY_RANK[a.rarity] - RARITY_RANK[b.rarity]) || a.typeName.localeCompare(b.typeName))
    }
    return list
  }, [filters, activeTracking])

  const groups = useMemo(() => {
    if (filters.groupBy === 'none') return [{ key: 'all', label: null, items: visible }]
    const buckets = {}
    for (const s of visible) {
      const k = filters.groupBy === 'theme' ? s.themeId : filters.groupBy === 'rarity' ? s.rarity : s.typeId
      ;(buckets[k] ||= []).push(s)
    }
    let order
    if (filters.groupBy === 'theme') order = THEMES.map((t) => [t.id, t.name])
    else if (filters.groupBy === 'rarity') order = RARITY_ORDER.map((r) => [r, r])
    else order = SPRITE_TYPES.map((t) => [t.id, t.name])
    return order.filter(([k]) => buckets[k]?.length).map(([k, label]) => ({ key: k, label, items: buckets[k] }))
  }, [visible, filters.groupBy])

  const gamertag = isShareView ? shared?.profile?.gamertag : profile?.gamertag
  const effectiveView = isShareView ? 'collection' : view

  const exportImage = (mode) => {
    const url = generateCollectionImage({ gamertag, tracking: activeTracking, mode })
    downloadDataUrl(url, `fn-sprites-${mode}.png`)
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-6 sm:px-6">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl leading-none text-white sm:text-4xl">
            FN <span className="text-[var(--brand)]">Sprite</span> Tracker
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
            {RELEASED_COUNT} released variants · accurate to the Jun 25, 2026 update.
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
                <button onClick={signOut} className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
                  Sign out
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-xs font-extrabold text-black">
                Log in to save
              </button>
            ))}
        </div>
      </header>

      {!isShareView && (
        <nav className="mb-5 flex flex-wrap gap-1.5" aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                view === t.id ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}

      {effectiveView === 'leaderboard' && <div className="mb-5"><Leaderboard /></div>}
      {effectiveView === 'news' && <div className="mb-5"><NewsFeed /></div>}
      {effectiveView === 'map' && <div className="mb-5"><MapView /></div>}

      {effectiveView === 'collection' && (
        <>
      {isShareView && (
        <div className="mb-4 rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-4">
          {shareLoading ? (
            <p className="text-sm text-[var(--muted)]">Loading shared collection…</p>
          ) : shared?.profile && (shared.profile.is_public || shared.profile.gamertag) ? (
            <p className="text-sm text-white">
              Viewing <span className="font-display text-lg text-[var(--brand)]">{shared.profile.gamertag || 'a player'}</span>’s collection (read-only).{' '}
              <a href={window.location.pathname} className="font-bold underline">Track your own →</a>
            </p>
          ) : (
            <p className="text-sm text-white">
              This collection is private or doesn’t exist.{' '}
              <a href={window.location.pathname} className="font-bold underline">Go to your tracker →</a>
            </p>
          )}
        </div>
      )}

      <div className="mb-5">
        <ProgressStats owned={stats.owned} mastered={stats.mastered} total={stats.total} />
      </div>

      <div className="mb-5">
        <StatsBreakdown tracking={activeTracking} />
      </div>

      {/* Export + bulk actions */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button onClick={() => exportImage('collection')} className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
          📸 Collection image
        </button>
        <button onClick={() => exportImage('missing')} className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
          🔍 Missing-sprites image
        </button>
        {!isShareView && (
          <button
            onClick={() => {
              const ids = visible.filter((s) => s.released).map((s) => s.id)
              if (ids.length && window.confirm(`Mark all ${ids.length} shown sprites as owned?`)) bulkOwn(ids, true)
            }}
            className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]"
          >
            ✓ Own all shown
          </button>
        )}
      </div>

      {!isShareView && (
        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <SupportBanner />
          {user ? (
            <ShareBar />
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-[var(--border)] p-5 text-center">
              <p className="text-sm text-[var(--muted)]">
                <button onClick={() => setShowAuth(true)} className="font-bold text-[var(--brand)] underline">Log in</button>{' '}
                to save your progress to the cloud and get a shareable link with your gamertag.
              </p>
            </div>
          )}
        </div>
      )}

      {!isShareView && user && (
        <div className="mb-5">
          <TradePanel />
        </div>
      )}

      <div className="mb-5">
        <Toolbar filters={filters} setFilters={setFilters} themeStats={themeStats} />
      </div>

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
                  onOpen={(sp) => setDetailType(sp.typeId)}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </section>
        ))
      )}
        </>
      )}

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
        <p>
          Fan-made sprite tracker · not affiliated with Epic Games · Support with Creator Code{' '}
          <span className="font-bold text-[var(--brand)]">MOMBIE</span>
        </p>
        <p className="mt-2 opacity-80">
          Sprite images are © Epic Games, Inc. — used here for identification only;
          sourced from{' '}
          <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore/sprite-tracker</a>.
        </p>
        <p className="mt-1 opacity-80">
          Sprite data &amp; drop rates cross-referenced from{' '}
          <a className="underline" href="https://fortnite.gg/sprites" target="_blank" rel="noreferrer">fortnite.gg</a>,{' '}
          <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore</a>,{' '}
          <a className="underline" href="https://github.com/MRSessions/fn-sprite-checklist" target="_blank" rel="noreferrer">MRSessions</a>{' '}
          &amp; <a className="underline" href="https://staticvacant.github.io/fnsprites/" target="_blank" rel="noreferrer">staticvacant/fnsprites</a>.
          Drop rates are community estimates.
        </p>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {detailType && (
        <SpriteDetailModal
          typeId={detailType}
          tracking={activeTracking}
          onClose={() => setDetailType(null)}
          onToggleOwned={setOwned}
          onToggleMastered={setMastered}
          onToggleTrade={setForTrade}
          onToggleWanted={setWanted}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}
