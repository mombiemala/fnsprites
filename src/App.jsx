import { useState, useMemo, useEffect, lazy, Suspense, Fragment } from 'react'
import { useAuth } from './context/authStore'
import { useToast } from './context/toastStore'
import { fetchSharedCollection } from './lib/sharedCollection'
import { getCollection, ACTIVE_COLLECTION_ID } from './data/collections'
import { GENERATIONS } from './data/sprites'
import { generateCollectionImage, generateGardenImage, downloadDataUrl } from './lib/exportImage'
import CollectionSwitcher from './components/CollectionSwitcher'
import SpriteCard from './components/SpriteCard'
import TrainerCard from './components/TrainerCard'
import { gardenImageUrl as resolveGardenUrl } from './lib/gardenApi'
import { SpriteMark } from './components/Logo'
import Toolbar from './components/Toolbar'
import ShareBar from './components/ShareBar'
import SupportBanner from './components/SupportBanner'
import StatsBreakdown from './components/StatsBreakdown'
import NextToChase from './components/NextToChase'
import QuickCheckList from './components/QuickCheckList'
import ChestOdds from './components/ChestOdds'
import OverflowNav from './components/OverflowNav'
import UpcomingSprites from './components/UpcomingSprites'
import HowSpritesWork from './components/HowSpritesWork'
import WelcomeModal from './components/WelcomeModal'
import AnnouncementBar from './components/AnnouncementBar'
import SaveStatusPill from './components/SaveStatusPill'

// Lazy-loaded: heavy tabs + on-demand modals are code-split so the initial
// (Collection) load stays lean; each is fetched the first time it's opened.
const Leaderboard = lazy(() => import('./components/Leaderboard'))
const NewsFeed = lazy(() => import('./components/NewsFeed'))
const ShopTab = lazy(() => import('./components/ShopTab'))
const StatsTab = lazy(() => import('./components/StatsTab'))
const SpriteGuide = lazy(() => import('./components/SpriteGuide'))
const AuthModal = lazy(() => import('./components/AuthModal'))
const SpriteDetailModal = lazy(() => import('./components/SpriteDetailModal'))
const BugReportModal = lazy(() => import('./components/BugReportModal'))
const AboutModal = lazy(() => import('./components/AboutModal'))
const ChangelogModal = lazy(() => import('./components/ChangelogModal'))
const CodesView = lazy(() => import('./components/CodesView'))
const GardenGallery = lazy(() => import('./components/GardenGallery'))
const BackupModal = lazy(() => import('./components/BackupModal'))
const ProfileModal = lazy(() => import('./components/ProfileModal'))
const ScreenshotImportModal = lazy(() => import('./components/ScreenshotImportModal'))
const ShareExportModal = lazy(() => import('./components/ShareExportModal'))
import { LINKS } from './lib/supabase'

// Primary sections, in first-glance order: the collection, the sprite database,
// the timely Override codes, then social (leaderboard/trade) and reference
// (news/stats/shop). On desktop they all show inline; only narrow screens fold
// the overflow into a "⋯ More" menu (see OverflowNav).
const TABS = [
  { id: 'collection', label: 'Collection' },
  { id: 'sprites', label: '🧩 Sprites' },
  { id: 'codes', label: '🔓 Lobby Hacks' },
  { id: 'leaderboard', label: '🏆 Leaderboard' },
  { id: 'garden', label: '🌱 Garden' },
  { id: 'news', label: '📰 News' },
  { id: 'stats', label: '📊 Stats' },
  { id: 'shop', label: '🛒 Item Shop' },
]

const DEFAULT_FILTERS = {
  search: '',
  theme: 'all',
  rarity: 'all',
  ownership: 'all',
  generation: 'all',
  hideMastered: false,
  showUnreleased: true,
  groupBy: 'none',
  sort: 'default',
  view: 'grid',
}

const RARITY_RANK = { Rare: 0, Epic: 1, Legendary: 2, Mythic: 3 }
// Generation recency — higher = newer. Lets the default order float the newest
// season's Sprites to the top of the lists.
const GEN_RANK = Object.fromEntries(GENERATIONS.map((g, i) => [g.id, i]))
const genRank = (s) => GEN_RANK[s.gen || GENERATIONS[0].id] ?? 0

function useShareTarget() {
  return useMemo(() => new URLSearchParams(window.location.search).get('u'), [])
}

// Initial tab from a ?view= param so deep links (and tabs tapped from a shared
// profile) land on the right section.
function useInitialView() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const v = params.get('view')
    // The old Guide tab folded into the combined Sprites view — keep its
    // deep link (?view=guide) working by mapping it across.
    if (v === 'guide') return 'sprites'
    // The Cosmetics tab was retired (it overlapped the Item Shop); route any old
    // ?cosmetics=1 / ?view=cosmetics deep links to the Item Shop instead.
    if (params.get('cosmetics') === '1' || v === 'cosmetics') return 'shop'
    // Lobby codes used to open as a modal (?codes=1, still linked from the SEO
    // footer); it's now a tab, so route that param to the view.
    if (params.get('codes') === '1') return 'codes'
    return TABS.some((t) => t.id === v) ? v : 'collection'
  }, [])
}

// Deep-link helper so the static SEO pages can open an app modal on load — e.g.
// the footer's About/Changelog/Backup/Report-a-bug/Cosmetics links point at
// /?about=1 etc., mirroring the app footer's actions.
const openParam = (k) => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get(k) === '1'

// Fallback shown while a lazy-loaded tab chunk is fetched.
function TabLoading() {
  return (
    <div className="mb-5 grid place-items-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-10 text-sm text-[var(--muted)]">
      Loading…
    </div>
  )
}

export default function App() {
  const { user, profile, tracking, setOwned, setMastered, setLevel, bulkOwn, syncing, cloudStatus, authLoading } = useAuth()
  const { toast } = useToast()
  const shareTarget = useShareTarget()

  // Active collection ("set"). Only Sprites exists today, so the switcher stays
  // hidden and this never changes — the seam is here for when a second set lands.
  const [collectionId, setCollectionId] = useState(ACTIVE_COLLECTION_ID)
  const set = useMemo(() => getCollection(collectionId), [collectionId])

  // Layout view is deep-linkable (?view=list|grid). Falls back to the default
  // grid for anything else (the retired ?view=garden included).
  const [filters, setFilters] = useState(() => {
    try {
      const v = new URLSearchParams(window.location.search).get('view')
      if (v === 'list' || v === 'grid') return { ...DEFAULT_FILTERS, view: v }
    } catch { /* no-op */ }
    return DEFAULT_FILTERS
  })

  // Live game build for the header — auto-detected from our /api/news proxy so
  // the version label never goes stale. Falls back to the static label offline.
  const [liveBuild, setLiveBuild] = useState(null)
  useEffect(() => {
    let cancelled = false
    fetch('/api/news')
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => { if (!cancelled && body?.data?.build) setLiveBuild(String(body.data.build)) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])
  const [showAuth, setShowAuth] = useState(false)
  const [shared, setShared] = useState(null)
  const [shareLoading, setShareLoading] = useState(!!shareTarget)
  // Deep-linkable: the static /sprites "Upcoming & leaked" rows link to
  // /?sprite=<id> so they open the same detail modal the app uses. An unknown id
  // is harmless — SpriteDetailModal renders nothing when the type isn't found.
  const [detailType, setDetailType] = useState(
    () => (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('sprite')) || null,
  )
  const [view, setView] = useState(useInitialView())
  const [showBug, setShowBug] = useState(() => openParam('bug'))
  const [showAbout, setShowAbout] = useState(() => openParam('about'))
  const [showChangelog, setShowChangelog] = useState(() => openParam('changelog'))
  const [showBackup, setShowBackup] = useState(() => openParam('backup'))

  // Single source of truth for the utility/support links, so the header "More"
  // menu and the footer show the exact same set. Cosmetics is now a primary tab
  // (like the Item Shop), so it's no longer in this utility list. The "How Sprites
  // work" guide is no longer a nav item either: its content lives on the /sprites
  // landing page (#how-sprites-work), which the in-app "How Sprites work" links
  // point to.
  const utilityLinks = [
    { id: 'about', label: 'About', onClick: () => setShowAbout(true) },
    { id: 'changelog', label: 'Changelog', onClick: () => setShowChangelog(true) },
    { id: 'backup', label: 'Backup', onClick: () => setShowBackup(true) },
    { id: 'bug', label: 'Report a bug', onClick: () => setShowBug(true) },
    { id: 'tierlist', label: '🏆 Tier list', href: '/tier-list' },
    { id: 'garden', label: '🌱 Sprite Garden', href: '/sprite-garden' },
    { id: 'dust', label: '🔷 Sprite Dust', href: '/sprite-dust' },
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
  // With the React Compiler on, these are auto-memoized — no manual useMemo needed.
  const activeTracking = isShareView ? shared?.tracking || {} : tracking

  // Progress is measured against what's obtainable right now (released), so both
  // the numerator and denominator exclude unreleased/rumored forms unless the
  // user opts to show them — keeping the bar from ever reading past 100%.
  const stats = (() => {
    let owned = 0
    let mastered = 0
    for (const s of set.items) {
      if (s.unreleased) continue
      if (activeTracking[s.id]?.owned) owned++
      if (activeTracking[s.id]?.mastered) mastered++
    }
    return { owned, mastered, total: set.released }
  })()

  // Owned/total per theme for the toolbar chips.
  const themeStats = (() => {
    const out = {}
    for (const t of set.variants) out[t.id] = { owned: 0, total: 0 }
    for (const s of set.items) {
      if (!out[s.themeId]) continue
      out[s.themeId].total++
      if (activeTracking[s.id]?.owned) out[s.themeId].owned++
    }
    return out
  })()

  const visible = (() => {
    const q = filters.search.trim().toLowerCase()
    let list = set.items.filter((s) => {
      if (!filters.showUnreleased && s.unreleased) return false
      if (filters.theme !== 'all' && s.themeId !== filters.theme) return false
      if (filters.rarity !== 'all' && s.rarity !== filters.rarity) return false
      if (filters.generation !== 'all' && (s.gen || 'c7s3') !== filters.generation) return false
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
    } else {
      // Default: newest generation first, so the new-season Sprites lead the
      // list; each generation keeps its natural roster order underneath.
      list = list
        .map((s, i) => [s, i])
        .sort((a, b) => (genRank(b[0]) - genRank(a[0])) || (a[1] - b[1]))
        .map(([s]) => s)
    }
    return list
  })()

  const groups = (() => {
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
    else order = [...set.types].sort((a, b) => genRank(b) - genRank(a)).map((t) => [t.id, t.name])
    return order.filter(([k]) => buckets[k]?.length).map(([k, label]) => ({ key: k, label, items: buckets[k] }))
  })()

  const gamertag = isShareView ? shared?.profile?.gamertag : profile?.gamertag
  const effectiveView = isShareView ? 'collection' : view
  // View + sort are quick-access layout controls, not filters — so switching to
  // list view (or changing sort) must NOT light up "Clear filters", and clearing
  // must preserve them.
  const FILTER_KEYS = ['search', 'theme', 'rarity', 'ownership', 'generation', 'hideMastered', 'showUnreleased', 'groupBy']
  const hasActiveFilters = useMemo(
    () => FILTER_KEYS.some((k) => filters[k] !== DEFAULT_FILTERS[k]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  )
  const clearFilters = () => setFilters((f) => ({ ...DEFAULT_FILTERS, sort: f.sort, view: f.view }))


  // Bulk quick-add: acts on the released sprites currently shown, so filtering to
  // a theme or rarity (or searching) then hitting the button claims the whole set
  // in one go. Unreleased sprites are never bulk-owned.
  const bulkTargets = visible.filter((s) => !s.unreleased)
  const bulkOwnedCount = bulkTargets.reduce((n, s) => n + (activeTracking[s.id]?.owned ? 1 : 0), 0)
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
  const hasAnyOwned = Object.values(activeTracking).some((v) => v?.owned)
  const showOnboarding = !isShareView && !readOnly && !hintDismissed && !hasAnyOwned

  // Download the Sprite Garden as a shareable image (lush circular tiles) — a
  // showcase artifact for Discord/socials. The Garden browse-view was retired
  // (competitors deliver the showcase as an image, not a mode), so this lives in
  // the Share & export flow now. Works for guests (reads the active tracking).
  const [gardenExporting, setGardenExporting] = useState(false)
  const exportGardenImage = async () => {
    setGardenExporting(true)
    try {
      const base = `${window.location.origin}${window.location.pathname}`
      const shareUrl = user ? `${base}?u=${user.id}` : base
      const url = await generateGardenImage({ gamertag, tracking: activeTracking, shareUrl })
      downloadDataUrl(url, 'fn-sprite-garden.png')
      toast('Sprite Garden image downloaded 🌱')
    } finally {
      setGardenExporting(false)
    }
  }

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
              className="flex items-center gap-2 rounded-lg text-left text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--brand)] sm:gap-2.5"
            >
              <SpriteMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
              <span>FN <span className="text-[var(--brand)]">Sprite</span> Tracker</span>
            </button>
          </h1>
          <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
            {set.released} released variants · {liveBuild ? `v${liveBuild} live` : 'v41.30 (Jul 30, 2026)'}
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
            <button onClick={() => setShowAuth(true)} title="Log in or sign up to save your collection to the cloud & sync across devices" className="shrink-0 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-xs font-extrabold text-black">
              Log in to save
            </button>
          ))}
      </header>

      {!isShareView && <CollectionSwitcher value={collectionId} onChange={setCollectionId} />}

      {/* Primary navigation — sections + Cosmetics inline, with anything that
          doesn't fit (and the utility links, incl. the Guide) flowing into the
          ⋯ More overflow menu. Adapts to the width, tidy on desktop and mobile. */}
      <OverflowNav
        views={TABS}
        view={view}
        isShareView={isShareView}
        onSelectView={setView}
        extras={utilityLinks}
        ariaLabel="Sections"
      />

      {(effectiveView === 'leaderboard' || effectiveView === 'codes' || effectiveView === 'garden' || effectiveView === 'stats' || effectiveView === 'news' || effectiveView === 'shop') && (
        <Suspense fallback={<TabLoading />}>
          {effectiveView === 'leaderboard' && <div className="mb-5"><Leaderboard /></div>}
          {effectiveView === 'codes' && <div className="mb-5"><CodesView /></div>}
          {effectiveView === 'garden' && <div className="mb-5"><GardenGallery onRequireLogin={() => setShowAuth(true)} /></div>}
          {effectiveView === 'stats' && <div className="mb-5"><StatsTab /></div>}
          {effectiveView === 'news' && <div className="mb-5"><NewsFeed /></div>}
          {effectiveView === 'shop' && <div className="mb-5"><ShopTab /></div>}
        </Suspense>
      )}

      {/* Sprites — the combined page: the filterable/searchable "how to get every
          Sprite" board (main) beside the reference sidebar (how Sprites work,
          upcoming/leaked, chest luck, support). Mirrors the static /sprites page. */}
      {effectiveView === 'sprites' && (
        <div className="mb-5 flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <Suspense fallback={<TabLoading />}><SpriteGuide /></Suspense>
          </div>
          <aside className="flex flex-col gap-4 lg:w-80 lg:shrink-0">
            <HowSpritesWork />
            <UpcomingSprites onOpen={setDetailType} />
            <ChestOdds />
            <SupportBanner />
          </aside>
        </div>
      )}

      {effectiveView === 'collection' && (
        <>
      {isShareView && (
        <div className="mb-4">
          {shareLoading ? (
            <div className="rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-4">
              <p className="text-sm text-[var(--muted)]">Loading shared collection…</p>
            </div>
          ) : shared?.profile && (shared.profile.is_public || shared.profile.gamertag) ? (
            <>
              <TrainerCard
                gamertag={shared.profile.gamertag}
                owned={stats.owned}
                mastered={stats.mastered}
                total={set.released}
                tracking={activeTracking}
                showcaseIds={shared.profile.showcase_sprite_ids}
                epicUsername={shared.profile.epic_username}
                epicPlatform={shared.profile.epic_platform}
                gardenImageUrl={shared.profile.garden_image_path ? resolveGardenUrl(shared.profile.garden_image_path) : null}
              />
              <p className="mt-2 px-1 text-xs text-[var(--muted)]">
                Read-only view. <a href={window.location.pathname} className="font-bold text-[var(--brand)] underline">Track your own →</a>
              </p>
            </>
          ) : (
            <div className="rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-4">
              <p className="text-sm text-white">
                This collection is private or doesn’t exist.{' '}
                <a href={window.location.pathname} className="font-bold underline">Go to your tracker →</a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Full-width filters bar (sticks to the top on scroll) */}
      <div className="sticky top-0 z-30 -mx-4 mb-5 border-b border-[var(--border)] bg-[#0c0f1a]/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <Toolbar
          filters={filters}
          setFilters={setFilters}
          themeStats={themeStats}
          count={visible.length}
          total={filters.showUnreleased ? set.total : set.released}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
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
                <button onClick={() => setShowImport(true)} title="Import your sprite locker from a screenshot — reads it on your device" className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-2 text-xs font-extrabold text-black">
                  📷 Import a locker screenshot
                </button>
                {bulkTargets.length > 0 && !bulkAllOwned && (
                  <button onClick={markAllShown} title="Marks every released sprite currently shown as owned" className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
                    ✓ Mark all {bulkTargets.length} owned
                  </button>
                )}
                <a href="/sprites#how-sprites-work" title="Learn how Sprites work — extraction, leveling, mastery & trading" className="inline-flex items-center rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
                  ❔ How Sprites work
                </a>
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
                  title="Unmark every sprite currently shown as not owned"
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
              title="Import from a screenshot — on-device OCR pre-checks what it spots"
              className="flex items-center gap-3 rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-3 text-left transition-colors hover:bg-[var(--brand)]/15"
            >
              <span className="text-2xl">📷</span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-white">Import from a screenshot</span>
                <span className="block text-[11px] text-[var(--muted)]">Snap your locker — we’ll pre-check what we spot. Runs on your device.</span>
              </span>
            </button>
          )}

          {/* Share & export — pulled up directly under the import card. */}
          {!isShareView &&
            (user ? (
              <ShareBar onExport={exportImage} exporting={exporting} onExportGarden={exportGardenImage} gardenExporting={gardenExporting} />
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
                <h3 className="mb-2 font-display text-lg text-white">Share &amp; export</h3>
                <p className="mb-3 text-sm text-[var(--muted)]">
                  Preview &amp; download a collection image or copy a Discord/Reddit caption — or{' '}
                  <button onClick={() => setShowAuth(true)} title="Log in to save & sync your collection and get a shareable link" className="font-bold text-[var(--brand)] underline">log in</button>{' '}
                  to save it and get a link with your gamertag.
                </p>
                <button onClick={() => setShowShare(true)} title="Preview & download a collection image, or copy a Discord/Reddit caption" className="w-full rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-2 text-xs font-extrabold text-black hover:opacity-90">
                  📤 Share &amp; export
                </button>
              </div>
            ))}

          {/* Breakdown — the single stats hub (Collection %, Mastery %, Dust, rings). */}
          <StatsBreakdown tracking={activeTracking} />

          {/* Small guide nudge for signed-in players — links to the guide that now
              lives on the /sprites landing page (the modal + nav item were removed). */}
          {user && !isShareView && (
            <a
              href="/sprites#how-sprites-work"
              title="How Sprites work — extraction, leveling, mastery & variants"
              className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-left text-xs font-bold text-[var(--muted)] transition-colors hover:border-[var(--brand)] hover:text-white"
            >
              <span className="text-base">❔</span>
              New to Sprites? <span className="text-[var(--brand)]">Read the quick guide →</span>
            </a>
          )}

          {!isShareView && <NextToChase tracking={activeTracking} onOpen={setDetailType} />}

          {!isShareView && <UpcomingSprites onOpen={setDetailType} />}

          {!isShareView && <ChestOdds />}

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
                <button onClick={() => goToSection(t.id)} title={`Go to ${t.label.replace(/^[^\w]+\s*/, '')}`} className={`hover:text-white ${view === t.id ? 'text-white' : ''}`}>{t.label}</button>
              )}
            </Fragment>
          ))}
        </nav>
        {/* Utility & support — same set as the header ⋯ More menu. */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-semibold">
          {utilityLinks.map((l, i) => (
            <Fragment key={l.id}>
              {i > 0 && <span className="opacity-30">·</span>}
              {l.href ? (
                <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-white">{l.label}</a>
              ) : (
                <button onClick={l.onClick} title={`Open ${l.label.replace(/^[^\w]+\s*/, '')}`} className="hover:text-white">{l.label}</button>
              )}
            </Fragment>
          ))}
          <span className="opacity-30">·</span>
          <span>Creator Code <span className="font-bold text-[var(--brand)]">MOMBIE</span></span>
        </div>
        <p className="opacity-80">Fan-made sprite tracker · not affiliated with Epic Games. #EpicPartner</p>
        {/* The long attribution/credits live in a collapsed disclosure so the footer
            stays short — all the © notices, AI-art disclosure and sources are one tap away. */}
        <details className="group mt-2">
          <summary className="cursor-pointer list-none opacity-70 hover:text-white">
            <span className="underline decoration-dotted underline-offset-2">Credits, sources &amp; disclaimers</span>
            <span className="ml-1 inline-block transition-transform group-open:rotate-90">›</span>
          </summary>
          <p className="mx-auto mt-2 max-w-3xl opacity-80">
            Sprite images are © Epic Games, Inc., used for identification only. Official base art sourced from{' '}
            <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore/sprite-tracker</a>;
            some variant art — the Holofoil renders and the Air &amp; Seven sprites — is AI-generated (Google Gemini), while real-person collab sprites (Vini Jr., Pollo) use Epic&apos;s official art with the background removed, never an AI likeness. A built-in generator covers anything still missing an image.
          </p>
          <p className="mx-auto mt-2 max-w-3xl opacity-80">
            Roster, themes &amp; drop rates cross-referenced from{' '}
            <a className="underline" href="https://fortnite.gg/sprites" target="_blank" rel="noreferrer">fortnite.gg</a>,{' '}
            <a className="underline" href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore</a>{' '}
            &amp; the <a className="underline" href="https://fortnite.fandom.com/wiki/Sprites" target="_blank" rel="noreferrer">Fortnite Wiki</a>.
            Upcoming/leaked sprites &amp; forms are labelled <b>Rumored</b> until Epic confirms; gameplay tiers are a community/meta snapshot (<a className="underline" href="https://games.gg" target="_blank" rel="noreferrer">GAMES.GG</a>, <a className="underline" href="https://www.playerauctions.com" target="_blank" rel="noreferrer">PlayerAuctions</a>, <a className="underline" href="https://www.destructoid.com" target="_blank" rel="noreferrer">Destructoid</a>).
            News &amp; events from official Fortnite patch notes, <a className="underline" href="https://communities.epicgames.com" target="_blank" rel="noreferrer">Epic communities</a> &amp; <a className="underline" href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>,
            with some event details cross-referenced from community trackers (<a className="underline" href="https://www.vice.com" target="_blank" rel="noreferrer">Vice</a>, <a className="underline" href="https://beebom.com" target="_blank" rel="noreferrer">Beebom</a>, <a className="underline" href="https://allthings.how" target="_blank" rel="noreferrer">AllThings.How</a>, <a className="underline" href="https://www.hotspawn.com" target="_blank" rel="noreferrer">Hotspawn</a>, <a className="underline" href="https://insider-gaming.com" target="_blank" rel="noreferrer">Insider Gaming</a>) — each event shows its source and whether it&apos;s official. Leaks &amp; datamines are credited to HYPEX, ShiinaBR, <a className="underline" href="https://x.com/FN_Assist" target="_blank" rel="noreferrer">@FN_Assist</a> &amp; FNBRIntel, with tier &amp; farm-route context from <a className="underline" href="https://punksprite.com" target="_blank" rel="noreferrer">punksprite</a> &amp; <a className="underline" href="https://quackadex.com" target="_blank" rel="noreferrer">quackadex</a>.
            Item Shop, cosmetics &amp; player stats come from <a className="underline" href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>. Drop rates are community estimates cross-referenced from player-tracking projects (<a className="underline" href="https://accountshark.net/blog/fortnite-chapter-7-season-3-sprites" target="_blank" rel="noreferrer">AccountShark</a> &amp; <a className="underline" href="https://games.gg/fortnite" target="_blank" rel="noreferrer">GAMES.GG</a>) — Epic hasn&apos;t published official rates. Built with React, Vite &amp; Supabase.
          </p>
        </details>
      </footer>

      {!isShareView && <SaveStatusPill />}

      <Suspense fallback={null}>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        {showBug && <BugReportModal onClose={() => setShowBug(false)} />}
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
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
            onSetLevel={setLevel}
            readOnly={readOnly}
          />
        )}
      </Suspense>
    </div>
  )
}
