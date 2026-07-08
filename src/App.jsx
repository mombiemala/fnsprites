import { useState, useMemo, useEffect, lazy, Suspense } from 'react'
import { useAuth } from './context/authStore'
import { useToast } from './context/toastStore'
import { fetchSharedCollection } from './lib/sharedCollection'
import { fetchTradeMatches } from './lib/tradeBoard'
import { getCollection, ACTIVE_COLLECTION_ID } from './data/collections'
import { generateCollectionImage, downloadDataUrl } from './lib/exportImage'
import CollectionSwitcher from './components/CollectionSwitcher'
import SpriteCard from './components/SpriteCard'
import ProgressStats from './components/ProgressStats'
import Toolbar from './components/Toolbar'
import ShareBar from './components/ShareBar'
import SupportBanner from './components/SupportBanner'
import StatsBreakdown from './components/StatsBreakdown'
import NextToChase from './components/NextToChase'
import UpcomingSprites from './components/UpcomingSprites'
import WelcomeModal from './components/WelcomeModal'
import AnnouncementBar from './components/AnnouncementBar'
import SaveStatusPill from './components/SaveStatusPill'

// Lazy-loaded: heavy tabs + on-demand modals are code-split so the initial
// (Collection) load stays lean; each is fetched the first time it's opened.
const Leaderboard = lazy(() => import('./components/Leaderboard'))
const NewsFeed = lazy(() => import('./components/NewsFeed'))
const MapView = lazy(() => import('./components/MapView'))
const TradeBoard = lazy(() => import('./components/TradeBoard'))
const AuthModal = lazy(() => import('./components/AuthModal'))
const SpriteDetailModal = lazy(() => import('./components/SpriteDetailModal'))
const BugReportModal = lazy(() => import('./components/BugReportModal'))
const AboutModal = lazy(() => import('./components/AboutModal'))
const ChangelogModal = lazy(() => import('./components/ChangelogModal'))
const HowItWorksModal = lazy(() => import('./components/HowItWorksModal'))
const BackupModal = lazy(() => import('./components/BackupModal'))
const ProfileModal = lazy(() => import('./components/ProfileModal'))
const ScreenshotImportModal = lazy(() => import('./components/ScreenshotImportModal'))
import { LINKS } from './lib/supabase'

const TABS = [
  { id: 'collection', label: 'Collection' },
  { id: 'leaderboard', label: '🏆 Leaderboard' },
  { id: 'trade', label: '🔁 Trade' },
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

// Initial tab from a ?view= param so deep links (and tabs tapped from a shared
// profile) land on the right section.
function useInitialView() {
  return useMemo(() => {
    const v = new URLSearchParams(window.location.search).get('view')
    return TABS.some((t) => t.id === v) ? v : 'collection'
  }, [])
}

// Fallback shown while a lazy-loaded tab chunk is fetched.
function TabLoading() {
  return (
    <div className="mb-5 grid place-items-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-10 text-sm text-[var(--muted)]">
      Loading…
    </div>
  )
}

export default function App() {
  const { user, profile, tracking, setOwned, setMastered, setLevel, setForTrade, setWanted, bulkOwn, syncing, cloudStatus, authLoading } = useAuth()
  const { toast } = useToast()
  const shareTarget = useShareTarget()

  // Active collection ("set"). Only Sprites exists today, so the switcher stays
  // hidden and this never changes — the seam is here for when a second set lands.
  const [collectionId, setCollectionId] = useState(ACTIVE_COLLECTION_ID)
  const set = useMemo(() => getCollection(collectionId), [collectionId])

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showAuth, setShowAuth] = useState(false)
  const [shared, setShared] = useState(null)
  const [shareLoading, setShareLoading] = useState(!!shareTarget)
  const [detailType, setDetailType] = useState(null)
  const [view, setView] = useState(useInitialView())
  const [showBug, setShowBug] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showBackup, setShowBackup] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(() => {
    try { return localStorage.getItem('fnsprites.hint') === '1' } catch { return false }
  })
  const dismissHint = () => {
    try { localStorage.setItem('fnsprites.hint', '1') } catch { /* ignore */ }
    setHintDismissed(true)
  }
  const [showProfile, setShowProfile] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [newTradeCount, setNewTradeCount] = useState(0)

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

  // Trade-match badge: for opted-in users, count trade posts newer than last-seen
  // that match their wants/offers. Cleared when the Trade tab marks them seen.
  useEffect(() => {
    if (!user || !profile?.notify_trades) return
    let cancelled = false
    ;(async () => {
      const m = await fetchTradeMatches(profile.trades_seen_at)
      if (!cancelled) setNewTradeCount(m.length)
    })()
    return () => { cancelled = true }
  }, [user, profile?.notify_trades, profile?.trades_seen_at])

  const isShareView = !!shareTarget
  const tradeBadge = !!user && !!profile?.notify_trades && newTradeCount > 0
  const readOnly = isShareView
  const activeTracking = useMemo(
    () => (isShareView ? shared?.tracking || {} : tracking),
    [isShareView, shared, tracking]
  )

  const stats = useMemo(() => {
    let owned = 0
    let mastered = 0
    for (const s of set.items) {
      if (activeTracking[s.id]?.owned) owned++
      if (activeTracking[s.id]?.mastered) mastered++
    }
    return { owned, mastered, total: set.total }
  }, [activeTracking, set])

  // Owned/total per theme for the toolbar chips.
  const themeStats = useMemo(() => {
    const out = {}
    for (const t of set.variants) out[t.id] = { owned: 0, total: 0 }
    for (const s of set.items) {
      if (!out[s.themeId]) continue
      out[s.themeId].total++
      if (activeTracking[s.id]?.owned) out[s.themeId].owned++
    }
    return out
  }, [activeTracking, set])

  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    let list = set.items.filter((s) => {
      if (!filters.showUnreleased && s.unreleased) return false
      if (filters.theme !== 'all' && s.themeId !== filters.theme) return false
      if (filters.rarity !== 'all' && s.rarity !== filters.rarity) return false
      const st = activeTracking[s.id]
      if (filters.ownership === 'owned' && !st?.owned) return false
      if (filters.ownership === 'unowned' && st?.owned) return false
      if (filters.hideMastered && st?.mastered) return false
      if (q) {
        const hay = `${s.typeName} ${set.variantMap[s.themeId]?.name} ${s.rarity}`.toLowerCase()
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
  }, [filters, activeTracking, set])

  const groups = useMemo(() => {
    if (filters.groupBy === 'none') return [{ key: 'all', label: null, items: visible }]
    const buckets = {}
    for (const s of visible) {
      const k = filters.groupBy === 'theme' ? s.themeId
        : filters.groupBy === 'rarity' ? s.rarity
        : filters.groupBy === 'tier' ? (s.tier || 'Unranked')
        : s.typeId
      ;(buckets[k] ||= []).push(s)
    }
    let order
    if (filters.groupBy === 'theme') order = set.variants.map((t) => [t.id, t.name])
    else if (filters.groupBy === 'rarity') order = set.rarityOrder.map((r) => [r, r])
    else if (filters.groupBy === 'tier') order = [...(set.tierOrder || []), ['Unranked', 'Unranked']]
    else order = set.types.map((t) => [t.id, t.name])
    return order.filter(([k]) => buckets[k]?.length).map(([k, label]) => ({ key: k, label, items: buckets[k] }))
  }, [visible, filters.groupBy, set])

  const gamertag = isShareView ? shared?.profile?.gamertag : profile?.gamertag
  const effectiveView = isShareView ? 'collection' : view
  const hasActiveFilters = useMemo(
    () => JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS),
    [filters]
  )

  // Bulk quick-add: acts on the released sprites currently shown, so filtering to
  // a theme or rarity (or searching) then hitting the button claims the whole set
  // in one go. Unreleased sprites are never bulk-owned.
  const bulkTargets = useMemo(() => visible.filter((s) => !s.unreleased), [visible])
  const bulkOwnedCount = useMemo(
    () => bulkTargets.reduce((n, s) => n + (activeTracking[s.id]?.owned ? 1 : 0), 0),
    [bulkTargets, activeTracking]
  )
  const bulkAllOwned = bulkTargets.length > 0 && bulkOwnedCount === bulkTargets.length
  const markAllShown = () => {
    const toAdd = bulkTargets.length - bulkOwnedCount
    if (!toAdd) return
    bulkOwn(bulkTargets.map((s) => s.id), true)
    toast(`Marked ${toAdd} sprite${toAdd === 1 ? '' : 's'} owned 🎉`)
  }
  const unmarkAllShown = () => {
    if (!window.confirm(`Unmark all ${bulkTargets.length} shown sprites as not owned? This won't touch sprites hidden by your filters.`)) return
    bulkOwn(bulkTargets.map((s) => s.id), false)
    toast(`Unmarked ${bulkTargets.length} sprite${bulkTargets.length === 1 ? '' : 's'}`)
  }

  const [exporting, setExporting] = useState(false)
  const exportImage = async (mode) => {
    setExporting(true)
    try {
      const url = await generateCollectionImage({ gamertag, tracking: activeTracking, mode })
      downloadDataUrl(url, `fn-sprites-${mode}.png`)
      toast(mode === 'missing' ? 'Missing-sprites image downloaded' : 'Collection image downloaded')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-6 sm:px-6">
      <WelcomeModal />
      <AnnouncementBar />
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl leading-none text-white sm:text-4xl">
            FN <span className="text-[var(--brand)]">Sprite</span> Tracker
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
            {set.released} released variants · accurate to the Jun 25, 2026 update.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!authLoading &&
            (user ? (
              <div className="flex items-center gap-2">
                <span
                  className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold sm:inline-flex ${
                    cloudStatus === 'error'
                      ? 'bg-red-500/15 text-red-300'
                      : cloudStatus === 'saving' || syncing
                        ? 'bg-amber-400/15 text-amber-300'
                        : 'bg-emerald-400/15 text-emerald-300'
                  }`}
                  title={
                    cloudStatus === 'error'
                      ? 'Could not save to the cloud — check your connection'
                      : 'Your collection is saved to the cloud'
                  }
                >
                  {cloudStatus === 'error' ? '⚠ Sync error' : cloudStatus === 'saving' || syncing ? '↻ Saving…' : '✓ Saved'}
                </span>
                <button onClick={() => setShowProfile(true)} title="Profile & connections" className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
                  ⚙ {profile?.gamertag || 'Profile'}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-xs font-extrabold text-black">
                Log in to save
              </button>
            ))}
        </div>
      </header>

      {!isShareView && <CollectionSwitcher value={collectionId} onChange={setCollectionId} />}

      <nav className="mb-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Sections">
        {TABS.map((t) => {
          const active = !isShareView && view === t.id
          const cls = `rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
            active ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
          }`
          // From a shared profile (?u=…) the tabs are links back into the main
          // app: Collection → your own tracker, others → that section.
          if (isShareView) {
            const href = t.id === 'collection' ? window.location.pathname : `${window.location.pathname}?view=${t.id}`
            return (
              <a key={t.id} href={href} className={cls}>
                {t.label}
              </a>
            )
          }
          return (
            <button key={t.id} role="tab" aria-selected={active} onClick={() => setView(t.id)} className={`${cls} relative`}>
              {t.label}
              {t.id === 'trade' && tradeBadge && (
                <span className="ml-1 rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">{newTradeCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      {(effectiveView === 'leaderboard' || effectiveView === 'trade' || effectiveView === 'news' || effectiveView === 'map') && (
        <Suspense fallback={<TabLoading />}>
          {effectiveView === 'leaderboard' && <div className="mb-5"><Leaderboard /></div>}
          {effectiveView === 'trade' && <div className="mb-5"><TradeBoard /></div>}
          {effectiveView === 'news' && <div className="mb-5"><NewsFeed /></div>}
          {effectiveView === 'map' && <div className="mb-5"><MapView /></div>}
        </Suspense>
      )}

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

      {/* Full-width filters bar (sticks to the top on scroll) */}
      <div className="sticky top-0 z-30 -mx-4 mb-5 border-b border-[var(--border)] bg-[#0c0f1a]/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <Toolbar
          filters={filters}
          setFilters={setFilters}
          themeStats={themeStats}
          count={visible.length}
          total={filters.showUnreleased ? set.total : set.released}
          hasActiveFilters={hasActiveFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      {/* Collection: sprite grid + a static sidebar of secondary cards on
          desktop; the sidebar stacks below the grid on mobile. */}
      <div className="lg:flex lg:items-start lg:gap-6">
        {/* Main column: grid */}
        <div className="min-w-0 lg:flex-1">
          {!isShareView && !readOnly && !hintDismissed && !Object.values(activeTracking).some((v) => v?.owned) && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 px-3 py-2.5">
              <span className="text-lg leading-none">👋</span>
              <div className="min-w-0 flex-1 text-sm text-[var(--text)]/90">
                <b className="text-white">New here?</b> Tap any sprite to mark it <b>Have</b>, or{' '}
                <button onClick={() => setShowImport(true)} className="font-bold text-[var(--brand)] underline">import your locker screenshot</button>{' '}
                to fill it in fast. Progress saves in this browser — new to Sprites?{' '}
                <button onClick={() => setShowHelp(true)} className="font-bold text-[var(--brand)] underline">how they work</button>.
              </div>
              <button onClick={dismissHint} aria-label="Dismiss" className="shrink-0 text-[var(--muted)] hover:text-white">✕</button>
            </div>
          )}
          {!readOnly && bulkTargets.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2">
              <span className="text-xs text-[var(--muted)]">
                <b className="text-white">{bulkOwnedCount}</b> of <b className="text-white">{bulkTargets.length}</b> shown owned
                {hasActiveFilters && <span className="ml-1 text-[var(--brand)]">· filtered</span>}
              </span>
              {bulkAllOwned ? (
                <button
                  onClick={unmarkAllShown}
                  className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] transition-colors hover:text-white"
                >
                  Unmark all shown
                </button>
              ) : (
                <button
                  onClick={markAllShown}
                  title="Marks every released sprite currently shown as owned"
                  className="rounded-lg bg-[var(--brand)] px-3 py-1.5 text-xs font-extrabold text-black transition-opacity hover:opacity-90"
                >
                  ✓ Mark all {bulkTargets.length} shown owned
                </button>
              )}
            </div>
          )}
          {isShareView && shareLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-[var(--panel)]" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-[var(--muted)]">No sprites match your filters.</p>
          ) : (
            groups.map((g) => (
              <section key={g.key} className="mb-8">
                {g.label && (
                  <h2 className="mb-3 font-display text-xl text-white/90">
                    {g.label} <span className="text-sm text-[var(--muted)]">· {g.items.length}</span>
                  </h2>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {g.items.map((s) => (
                    <SpriteCard
                      key={s.id}
                      sprite={s}
                      state={activeTracking[s.id]}
                      onToggleOwned={setOwned}
                      onToggleMastered={setMastered}
                      onSetLevel={setLevel}
                      onOpen={(sp) => setDetailType(sp.typeId)}
                      readOnly={readOnly}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Sidebar: a static column beside the grid that scrolls with the page */}
        <aside className="mt-8 flex flex-col gap-4 lg:mt-0 lg:w-80 lg:shrink-0">
          {!isShareView && !readOnly && (
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-3 rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-3 text-left transition-colors hover:bg-[var(--brand)]/15"
            >
              <span className="text-2xl">📷</span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-white">Import from a screenshot</span>
                <span className="block text-[11px] text-[var(--muted)]">Snap your locker — we’ll pre-check what we spot. Runs on your device.</span>
              </span>
            </button>
          )}

          {!isShareView && <NextToChase tracking={activeTracking} onOpen={setDetailType} />}

          {!isShareView && <UpcomingSprites onOpen={setDetailType} />}

          <StatsBreakdown tracking={activeTracking} />

          {!isShareView &&
            (user ? (
              <ShareBar onExport={exportImage} exporting={exporting} />
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                <h3 className="mb-2 font-display text-lg text-white">Share &amp; export</h3>
                <p className="mb-3 text-sm text-[var(--muted)]">
                  <button onClick={() => setShowAuth(true)} className="font-bold text-[var(--brand)] underline">Log in</button>{' '}
                  to save your progress and get a shareable link with your gamertag.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => exportImage('collection')} disabled={exporting} className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60">
                    {exporting ? 'Rendering…' : '⬇️ Collection image'}
                  </button>
                  <button onClick={() => exportImage('missing')} disabled={exporting} className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60">
                    {exporting ? 'Rendering…' : '⬇️ Missing-sprites image'}
                  </button>
                </div>
              </div>
            ))}

          {!isShareView && <SupportBanner />}
        </aside>
      </div>
        </>
      )}

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-semibold">
          <button onClick={() => setShowHelp(true)} className="hover:text-white">How Sprites work</button>
          <span className="opacity-30">·</span>
          <button onClick={() => setShowAbout(true)} className="hover:text-white">About</button>
          <span className="opacity-30">·</span>
          <button onClick={() => setShowChangelog(true)} className="hover:text-white">Changelog</button>
          <span className="opacity-30">·</span>
          <button onClick={() => setShowBackup(true)} className="hover:text-white">Backup</button>
          <span className="opacity-30">·</span>
          <button onClick={() => setShowBug(true)} className="hover:text-white">Report a bug</button>
          <span className="opacity-30">·</span>
          <a href={LINKS.buyMeACoffee} target="_blank" rel="noreferrer" className="hover:text-white">☕ Buy me a coffee</a>
          <span className="opacity-30">·</span>
          <span>Creator Code <span className="font-bold text-[var(--brand)]">MOMBIE</span></span>
        </div>
        <p className="opacity-80">Fan-made sprite tracker · not affiliated with Epic Games. #EpicPartner</p>
        <p className="mt-2 opacity-80">
          Sprite images are © Epic Games, Inc., used for identification only. Official base art sourced from{' '}
          <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore/sprite-tracker</a>;
          some variant art is AI-generated (Google Gemini) from those base images.
        </p>
        <p className="mt-1 opacity-80">
          Roster, themes &amp; drop rates cross-referenced from{' '}
          <a className="underline" href="https://fortnite.gg/sprites" target="_blank" rel="noreferrer">fortnite.gg</a>,{' '}
          <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore</a>{' '}
          &amp; the <a className="underline" href="https://fortnite.fandom.com/wiki/Sprites" target="_blank" rel="noreferrer">Fortnite Wiki</a>.
          Upcoming/leaked sprites &amp; forms are labelled <b>Rumored</b> until Epic confirms.
          News &amp; events from official Fortnite patch notes, <a className="underline" href="https://communities.epicgames.com" target="_blank" rel="noreferrer">Epic communities</a> &amp; <a className="underline" href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>,
          with some event details cross-referenced from community trackers (<a className="underline" href="https://www.vice.com" target="_blank" rel="noreferrer">Vice</a>, <a className="underline" href="https://beebom.com" target="_blank" rel="noreferrer">Beebom</a>, <a className="underline" href="https://allthings.how" target="_blank" rel="noreferrer">AllThings.How</a>) — each event shows its source and whether it&apos;s official.
          Map image &amp; live POIs via <a className="underline" href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>;
          community loot-map spots (sprite chests, fishing, ponds) are submitted &amp; confirmed by players. Drop rates are community estimates. Built with React, Vite &amp; Supabase.
        </p>
      </footer>

      {!isShareView && <SaveStatusPill />}

      <Suspense fallback={null}>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        {showBug && <BugReportModal onClose={() => setShowBug(false)} />}
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        {showHelp && <HowItWorksModal onClose={() => setShowHelp(false)} />}
        {showBackup && <BackupModal onClose={() => setShowBackup(false)} />}
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
        {showImport && <ScreenshotImportModal onClose={() => setShowImport(false)} />}
        {detailType && (
          <SpriteDetailModal
            typeId={detailType}
            tracking={activeTracking}
            onClose={() => setDetailType(null)}
            onToggleOwned={setOwned}
            onToggleMastered={setMastered}
            onToggleTrade={setForTrade}
            onToggleWanted={setWanted}
            onSetLevel={setLevel}
            onOpenMap={() => { setDetailType(null); setView('map') }}
            readOnly={readOnly}
          />
        )}
      </Suspense>
    </div>
  )
}
