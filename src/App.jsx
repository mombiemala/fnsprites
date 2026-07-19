import { useState, useMemo, useEffect, lazy, Suspense, Fragment } from 'react'
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
import QuickCheckList from './components/QuickCheckList'
import DustToComplete from './components/DustToComplete'
import UpcomingSprites from './components/UpcomingSprites'
import WelcomeModal from './components/WelcomeModal'
import AnnouncementBar from './components/AnnouncementBar'
import SaveStatusPill from './components/SaveStatusPill'

// Lazy-loaded: heavy tabs + on-demand modals are code-split so the initial
// (Collection) load stays lean; each is fetched the first time it's opened.
const Leaderboard = lazy(() => import('./components/Leaderboard'))
const NewsFeed = lazy(() => import('./components/NewsFeed'))
const SpriteFarming = lazy(() => import('./components/SpriteFarming'))
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
const ShareExportModal = lazy(() => import('./components/ShareExportModal'))
import { LINKS } from './lib/supabase'

const TABS = [
  { id: 'collection', label: 'Collection' },
  { id: 'leaderboard', label: '🏆 Leaderboard' },
  { id: 'trade', label: '🔁 Trade' },
  { id: 'news', label: '📰 News' },
  { id: 'map', label: '🗺️ Farming' },
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
  view: 'grid',
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
  const [showMore, setShowMore] = useState(false)

  // Single source of truth for the utility/support links, so the header "More"
  // menu and the footer show the exact same set. "How Sprites work" also has the
  // standalone ❔ Guide button up top, so it's filtered out of the header menu to
  // avoid a duplicate — but it stays in this list for the footer.
  const utilityLinks = [
    { id: 'help', label: 'How Sprites work', onClick: () => setShowHelp(true) },
    { id: 'about', label: 'About', onClick: () => setShowAbout(true) },
    { id: 'changelog', label: 'Changelog', onClick: () => setShowChangelog(true) },
    { id: 'backup', label: 'Backup', onClick: () => setShowBackup(true) },
    { id: 'bug', label: 'Report a bug', onClick: () => setShowBug(true) },
    { id: 'coffee', label: '☕ Buy me a coffee', href: LINKS.buyMeACoffee },
  ]

  // Jump to a primary section from the footer, mirroring the top nav.
  const goToSection = (id) => {
    setView(id)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  // The app title is "home" → the Collection. From a shared profile (?u=…),
  // home means leaving the shared view for your own tracker.
  const goHome = () => {
    if (isShareView) {
      window.location.href = window.location.pathname
      return
    }
    goToSection('collection')
  }
  const [hintDismissed, setHintDismissed] = useState(() => {
    try { return localStorage.getItem('fnsprites.hint') === '1' } catch { return false }
  })
  const dismissHint = () => {
    try { localStorage.setItem('fnsprites.hint', '1') } catch { /* ignore */ }
    setHintDismissed(true)
  }
  const [showProfile, setShowProfile] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showShare, setShowShare] = useState(false)
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

  // Progress is measured against what's obtainable right now (released), so both
  // the numerator and denominator exclude unreleased/rumored forms unless the
  // user opts to show them — keeping the bar from ever reading past 100%.
  const stats = useMemo(() => {
    let owned = 0
    let mastered = 0
    for (const s of set.items) {
      if (s.unreleased) continue
      if (activeTracking[s.id]?.owned) owned++
      if (activeTracking[s.id]?.mastered) mastered++
    }
    return { owned, mastered, total: set.released }
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
    // Confirm when it's a big sweep (e.g. the whole unfiltered roster) so a
    // curious first-time tap can't wipe out the "mark what you own" flow. When
    // you've filtered down to a handful, skip the prompt — it'd just be noise.
    if (toAdd >= 15 && !window.confirm(`Mark all ${toAdd} shown sprites as owned? You can undo with “Unmark all shown”.`)) return
    bulkOwn(bulkTargets.map((s) => s.id), true)
    toast(`Marked ${toAdd} sprite${toAdd === 1 ? '' : 's'} owned 🎉`)
  }
  const unmarkAllShown = () => {
    if (!window.confirm(`Unmark all ${bulkTargets.length} shown sprites as not owned? This won't touch sprites hidden by your filters.`)) return
    bulkOwn(bulkTargets.map((s) => s.id), false)
    toast(`Unmarked ${bulkTargets.length} sprite${bulkTargets.length === 1 ? '' : 's'}`)
  }

  // First-run onboarding gate. While it's showing we suppress the standalone
  // bulk bar and the sidebar import card, so a new visitor sees ONE clear card
  // (with both shortcuts inside it) instead of three stacked prompts.
  const hasAnyOwned = useMemo(() => Object.values(activeTracking).some((v) => v?.owned), [activeTracking])
  const showOnboarding = !isShareView && !readOnly && !hintDismissed && !hasAnyOwned

  const [exporting, setExporting] = useState(false)
  const exportImage = async (mode) => {
    setExporting(true)
    try {
      const base = `${window.location.origin}${window.location.pathname}`
      const shareUrl = user ? `${base}?u=${user.id}` : base
      const url = await generateCollectionImage({ gamertag, tracking: activeTracking, mode, shareUrl })
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
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-3xl leading-none sm:text-4xl">
            <button
              onClick={goHome}
              title={isShareView ? 'FN Sprite Tracker — go to your own tracker' : 'FN Sprite Tracker — back to your collection'}
              className="rounded-lg text-left text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              FN <span className="text-[var(--brand)]">Sprite</span> Tracker
            </button>
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
            {set.released} released variants · accurate to the Jul 16, 2026 update (v41.20 · DC Hot Bat Summer).
          </p>
        </div>
        {!authLoading &&
          (user ? (
            <div className="flex flex-col items-end gap-1">
              <button onClick={() => setShowProfile(true)} title="Profile & connections" className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
                ⚙ {profile?.gamertag || 'Profile'}
              </button>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                  cloudStatus === 'error'
                    ? 'text-red-300'
                    : cloudStatus === 'saving' || syncing
                      ? 'text-amber-300'
                      : 'text-emerald-300'
                }`}
                title={
                  cloudStatus === 'error'
                    ? 'Could not save to the cloud — check your connection'
                    : 'Your collection is saved to the cloud'
                }
              >
                {cloudStatus === 'error' ? '⚠ Sync error' : cloudStatus === 'saving' || syncing ? '↻ Saving…' : '✓ Saved'}
              </span>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} className="shrink-0 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-xs font-extrabold text-black">
              Log in to save
            </button>
          ))}
      </header>

      {!isShareView && <CollectionSwitcher value={collectionId} onChange={setCollectionId} />}

      {/* Primary navigation — every section plus the Guide & More utilities live
          in one row, so the whole app is reachable from a single place. */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5" aria-label="Sections">
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
            <button key={t.id} aria-current={active ? 'page' : undefined} onClick={() => setView(t.id)} className={`${cls} relative`}>
              {t.label}
              {t.id === 'trade' && tradeBadge && (
                <span className="ml-1 rounded-full bg-pink-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">{newTradeCount}</span>
              )}
            </button>
          )
        })}

        {/* Guide sits with the sections (it's a place people go to read), next to
            Farming; the divider sets off only the More utility menu. */}
        <button
          onClick={() => setShowHelp(true)}
          title="How Sprites work — extraction, leveling, mastery & trading"
          className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-[var(--muted)] transition-colors hover:text-white"
        >
          ❔ Guide
        </button>

        {/* Divider between sections and the More utility menu. */}
        <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" />

        <div className="relative">
          <button
            onClick={() => setShowMore((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={showMore}
            title="More — About, Changelog, Backup, Report a bug, Support"
            className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-[var(--muted)] transition-colors hover:text-white"
          >
            ⋯ More
          </button>
          {showMore && (
            <>
              <button aria-hidden="true" tabIndex={-1} onClick={() => setShowMore(false)} className="fixed inset-0 z-30 cursor-default" />
              <div role="menu" className="absolute left-0 z-40 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] py-1 text-left shadow-xl">
                {utilityLinks
                  .filter((l) => l.id !== 'help')
                  .map((l) =>
                    l.href ? (
                      <a key={l.id} href={l.href} target="_blank" rel="noreferrer" role="menuitem" onClick={() => setShowMore(false)} className="block px-3 py-2 text-xs font-bold text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-white">
                        {l.label}
                      </a>
                    ) : (
                      <button key={l.id} role="menuitem" onClick={() => { l.onClick(); setShowMore(false) }} className="block w-full px-3 py-2 text-left text-xs font-bold text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-white">
                        {l.label}
                      </button>
                    ),
                  )}
              </div>
            </>
          )}
        </div>
      </nav>

      {(effectiveView === 'leaderboard' || effectiveView === 'trade' || effectiveView === 'news' || effectiveView === 'map') && (
        <Suspense fallback={<TabLoading />}>
          {effectiveView === 'leaderboard' && <div className="mb-5"><Leaderboard /></div>}
          {effectiveView === 'trade' && <div className="mb-5"><TradeBoard /></div>}
          {effectiveView === 'news' && <div className="mb-5"><NewsFeed /></div>}
          {effectiveView === 'map' && <div className="mb-5"><SpriteFarming /></div>}
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

      <div className="mb-5 flex flex-col gap-2">
        <ProgressStats
          owned={stats.owned}
          mastered={stats.mastered}
          total={filters.showUnreleased ? set.total : set.released}
          upcoming={set.total - set.released}
        />
        <div className="flex justify-end">
          <button
            onClick={() => setShowShare(true)}
            title="Preview & download a shareable image of your collection, or copy a Discord/Reddit caption"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3.5 py-2 text-xs font-extrabold text-black transition-opacity hover:opacity-90"
          >
            📤 Share &amp; export
          </button>
        </div>
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
          {showOnboarding && (
            <div className="mb-4 rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg text-white">👋 New here? Build your collection</h2>
                  <p className="mt-1 text-sm text-[var(--text)]/90">
                    Tap any sprite to mark it <b>Have</b> — or use a shortcut to fill it in fast:
                  </p>
                </div>
                <button onClick={dismissHint} aria-label="Dismiss" className="shrink-0 text-[var(--muted)] hover:text-white">✕</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => setShowImport(true)} className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-2 text-xs font-extrabold text-black">
                  📷 Import a locker screenshot
                </button>
                {bulkTargets.length > 0 && !bulkAllOwned && (
                  <button onClick={markAllShown} title="Marks every released sprite currently shown as owned" className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
                    ✓ Mark all {bulkTargets.length} owned
                  </button>
                )}
                <button onClick={() => setShowHelp(true)} className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
                  ❔ How Sprites work
                </button>
              </div>
              <p className="mt-2 text-[11px] text-[var(--muted)]">Progress saves in this browser — log in to sync &amp; share it.</p>
            </div>
          )}
          {!readOnly && bulkTargets.length > 0 && !showOnboarding && (
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
          ) : filters.view === 'list' ? (
            <QuickCheckList groups={groups} tracking={activeTracking} onToggleOwned={setOwned} readOnly={readOnly} />
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
          {!isShareView && !readOnly && !showOnboarding && (
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

          {!isShareView && <DustToComplete tracking={activeTracking} />}

          {!isShareView &&
            (user ? (
              <ShareBar onExport={exportImage} exporting={exporting} />
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                <h3 className="mb-2 font-display text-lg text-white">Share &amp; export</h3>
                <p className="mb-3 text-sm text-[var(--muted)]">
                  Preview &amp; download a collection image or copy a Discord/Reddit caption — or{' '}
                  <button onClick={() => setShowAuth(true)} className="font-bold text-[var(--brand)] underline">log in</button>{' '}
                  to save it and get a link with your gamertag.
                </p>
                <button onClick={() => setShowShare(true)} className="w-full rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-2 text-xs font-extrabold text-black hover:opacity-90">
                  📤 Share &amp; export
                </button>
              </div>
            ))}

          {!isShareView && <SupportBanner />}
        </aside>
      </div>
        </>
      )}

      <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
        {/* Sections — mirrors the primary top nav so every section is reachable
            from the footer too. */}
        <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-semibold" aria-label="Sections">
          {TABS.map((t, i) => (
            <Fragment key={t.id}>
              {i > 0 && <span className="opacity-30">·</span>}
              {isShareView ? (
                <a href={t.id === 'collection' ? window.location.pathname : `${window.location.pathname}?view=${t.id}`} className="hover:text-white">{t.label}</a>
              ) : (
                <button onClick={() => goToSection(t.id)} className={`hover:text-white ${view === t.id ? 'text-white' : ''}`}>{t.label}</button>
              )}
            </Fragment>
          ))}
        </nav>
        {/* Utility & support — same set as the header ❔ Guide + ⋯ More menu. */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-semibold">
          {utilityLinks.map((l, i) => (
            <Fragment key={l.id}>
              {i > 0 && <span className="opacity-30">·</span>}
              {l.href ? (
                <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-white">{l.label}</a>
              ) : (
                <button onClick={l.onClick} className="hover:text-white">{l.label}</button>
              )}
            </Fragment>
          ))}
          <span className="opacity-30">·</span>
          <span>Creator Code <span className="font-bold text-[var(--brand)]">MOMBIE</span></span>
        </div>
        <p className="opacity-80">Fan-made sprite tracker · not affiliated with Epic Games. #EpicPartner</p>
        <p className="mt-2 opacity-80">
          Sprite images are © Epic Games, Inc., used for identification only. Official base art sourced from{' '}
          <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore/sprite-tracker</a>;
          some variant art — the Holofoil renders and the Air &amp; Seven sprites — is AI-generated (Google Gemini), while real-person collab sprites (Vini Jr., Pollo) use Epic&apos;s official art with the background removed, never an AI likeness. A built-in generator covers anything still missing an image.
        </p>
        <p className="mt-1 opacity-80">
          Roster, themes &amp; drop rates cross-referenced from{' '}
          <a className="underline" href="https://fortnite.gg/sprites" target="_blank" rel="noreferrer">fortnite.gg</a>,{' '}
          <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore</a>{' '}
          &amp; the <a className="underline" href="https://fortnite.fandom.com/wiki/Sprites" target="_blank" rel="noreferrer">Fortnite Wiki</a>.
          Upcoming/leaked sprites &amp; forms are labelled <b>Rumored</b> until Epic confirms; gameplay tiers are a community/meta snapshot (<a className="underline" href="https://games.gg" target="_blank" rel="noreferrer">GAMES.GG</a>, <a className="underline" href="https://www.playerauctions.com" target="_blank" rel="noreferrer">PlayerAuctions</a>, <a className="underline" href="https://www.destructoid.com" target="_blank" rel="noreferrer">Destructoid</a>).
          News &amp; events from official Fortnite patch notes, <a className="underline" href="https://communities.epicgames.com" target="_blank" rel="noreferrer">Epic communities</a> &amp; <a className="underline" href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>,
          with some event details cross-referenced from community trackers (<a className="underline" href="https://www.vice.com" target="_blank" rel="noreferrer">Vice</a>, <a className="underline" href="https://beebom.com" target="_blank" rel="noreferrer">Beebom</a>, <a className="underline" href="https://allthings.how" target="_blank" rel="noreferrer">AllThings.How</a>, <a className="underline" href="https://www.hotspawn.com" target="_blank" rel="noreferrer">Hotspawn</a>, <a className="underline" href="https://insider-gaming.com" target="_blank" rel="noreferrer">Insider Gaming</a>) — each event shows its source and whether it&apos;s official.
          Sprite-farming spots are a curated season snapshot; the interactive maps link out to <a className="underline" href="https://spritesanctuary.gg/sprite-chests.html" target="_blank" rel="noreferrer">Sprite Sanctuary</a> &amp; <a className="underline" href="https://fortnite.gg/map" target="_blank" rel="noreferrer">Fortnite.GG</a>. Drop rates are community estimates cross-referenced from player-tracking projects (<a className="underline" href="https://accountshark.net/blog/fortnite-chapter-7-season-3-sprites" target="_blank" rel="noreferrer">AccountShark</a> &amp; <a className="underline" href="https://games.gg/fortnite" target="_blank" rel="noreferrer">GAMES.GG</a>) — Epic hasn&apos;t published official rates. Built with React, Vite &amp; Supabase.
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
        {showShare && <ShareExportModal onClose={() => setShowShare(false)} />}
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
