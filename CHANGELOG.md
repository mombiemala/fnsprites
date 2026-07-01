# Changelog

All notable changes to the FN Sprite Tracker, with the reasoning behind the
bigger decisions. Technical, but written for humans. Newest first.

The in-app version of this lives in `src/data/changelog.js` (shown via the
**Changelog** link in the footer) — keep the two in sync when you ship.

Tags: **Added** (new), **Changed** (behaviour/looks), **Fixed** (bugs),
**Security** (access/data integrity).

---

## July 1, 2026 — Sprite levels, real Mastery % & dust-to-complete

- **Added:** Per-sprite `level` (0–5) on `sprite_progress` (owned = level ≥ 1,
  mastered = level ≥ 5, kept in sync). Set it via "Lv" dots in the sprite detail.
- **Added:** Levels-based Mastery % and a "Dust to complete" figure (total summon
  dust for missing variants) in the Breakdown card, using `dustCost`.
- **Fixed:** Sprite detail popup clipped its rightmost buttons/tooltips under the
  vertical scrollbar on desktop — widened to `max-w-2xl` and added
  `scrollbar-gutter: stable` so content never sits under the scrollbar and there's
  no stray horizontal scroll.

> **Why:** Finishing a sprite is a 1→5 climb, not a checkbox. Showing level
> progress + dust-to-complete makes the long game legible and links levels ↔
> dust — a tie no competitor makes.

## July 1, 2026 — Link previews & a warmer welcome

- **Added:** Rich social link previews — Open Graph + Twitter card tags in
  `index.html` with a custom `public/og-image.png` (1200×630, sprites + brand).
- **Added:** First-visit `WelcomeModal` (shown once, gated on `welcomed` /
  `onboarded`) orienting new players; replaced the small inline `OnboardingHint`.
- **Fixed:** Site description no longer names the removed Cube/Quack themes;
  preview image is now an absolute URL crawlers can load.

> **Why:** Word of mouth grows a fan app — a link that previews nicely gets
> clicked more, and a quick orientation helps newcomers stick.

## July 1, 2026 — Trade alerts, farming links & dust costs

- **Added:** Opt-in trade-match alerts (`profiles.notify_trades` +
  `trades_seen_at`, `trade_matches_for_me` RPC). Matching posts surface in the
  Trade tab; a count badge appears on the tab when new ones are posted.
- **Added:** "Where to find" on each sprite (`spriteSource`) with a jump to the
  community loot map (`onOpenMap`).
- **Added:** Estimated Sprite Dust to (re)summon each variant (`dustCost`) in the
  sprite detail — Rare 100/4,000 · Epic 3,000/6,000 · Legendary 5,000/10,000 ·
  Mythic 7,500/15,000 (base/variant). Indexing a trade avoids the cost.
- **Fixed:** Widened the sprite detail modal (`max-w-lg` → `max-w-xl`,
  `overflow-x-hidden`) and switched its row tooltips to native `title` so they
  no longer clip or trigger a horizontal scrollbar.

> **Why:** Collecting is a loop of find → trade → summon, each with friction.
> Surfacing matches, farming spots, and dust costs where you're already looking
> cuts the hopping between tabs and wikis.

## July 1, 2026 — Trade Board — find your trades

- **Added:** A **Trade tab** with a public board (`trade_posts` table + RLS +
  `trade_board_list` RPC, capped at 15 posts/user). Post wants + offers, pick a
  method (⇄ full trade / 🔁 indexing), add a contact, browse/filter posts.
- **Added:** A "How indexing works" explainer (the two-game give-and-return that
  indexes a sprite for someone without the giver losing theirs; saves Sprite
  Dust vs a full trade).
- **Added:** A safety/liability notice — trades are player-to-player and in-game;
  the tracker doesn't facilitate, verify, or guarantee them and isn't
  responsible for trades/scams. Never share login or pay real money.
- **Changed:** Folded the auto match-finder into the Trade tab ("Suggested
  matches") and removed it from the Collection sidebar.
- **Fixed:** Sprite detail toggles no longer say "duplicate" — ⇄ = offer to
  trade/index, ♥ = want to index, and both prefill the Trade Board post.

> **Why:** Trading is the heart of sprite collecting, but Fortnite has no
> in-game trade system — a board that speaks the community's language (indexing
> vs full trade) brings it into one honest, safety-first place.

## July 1, 2026 — Live event announcements

- **Added:** A dismissible announcement bar (`src/components/AnnouncementBar.jsx`
  + `src/data/announcements.js`) for live / limited-time events and important
  info. Date-gated (auto-shows within a start–end window) and dismissal is
  remembered per-notice in `localStorage`.

> **Why:** Time-limited moments (catch-up days, double XP, the season finale) are
> easy to miss. One tidy banner surfaces them, then gets out of the way.

## July 1, 2026 — Cleaner sprites & a proper collection poster

- **Fixed:** Removed baked-in white/black backgrounds from 14 sprite variants
  (the AI-reskinned Gold/Gummy/Galaxy forms) via edge flood-fill, so all 78
  sprite PNGs are transparent and render on the same per-variant backdrop.
- **Changed:** Rebuilt the collection image export (`src/lib/exportImage.js`) as
  a Sprite Locker–style matrix — types × variants, each cell on a consistent
  variant gradient, with ✓ owned / 🔒 unreleased / dashed N/A, a progress bar and
  per-row counts. Verified by headless render.

> **Why:** Consistency makes a checklist feel trustworthy and finishable, and a
> poster-style export is something people actually want to screenshot and share.

## July 1, 2026 — A profile of your own

- **Added:** Profile page (⚙ in the header) — edit gamertag, toggle
  public/private, see how you signed in, and sign out.
- **Added:** "Delete my data" — clears progress, owned maps and profile, then
  signs out.

> **Why:** More players means everyone needs a clear place to manage identity
> and data. We evaluated linking Epic accounts to auto-import sprites, but
> Fortnite exposes no owned-sprite data to apps in any safe, allowed way — so we
> chose not to risk anyone's account, and collections stay tracked manually.

## July 1, 2026 — Faster first load

- **Changed:** Code-split the heavy tabs (Leaderboard, News, Map) and all modals
  via `React.lazy` + `Suspense`, so the initial (Collection) bundle stays lean —
  each is fetched on first open. Main bundle ~139 KB → ~130 KB gzip, with MapView
  (~7 KB gzip) and others now separate chunks.
- **Changed:** A brief "Loading…" placeholder shows on first open, then cached.

> **Why:** Most visitors land on their collection; everything else can wait
> until it's actually needed, so the page gets interactive sooner — especially on
> phones and slower connections.

## July 1, 2026 — Getting ready for more players

- **Added:** Privacy-friendly, cookieless analytics (Vercel Web Analytics +
  Speed Insights) wired into `src/main.jsx` — no-op until enabled in the Vercel
  dashboard; no consent banner needed.
- **Security:** Daily cap of 40 community-map markers per user (personal/shared
  maps unlimited), enforced by a `BEFORE INSERT` trigger on `map_markers`.
- **Security:** `char_length` check constraints on `bug_reports` (message
  1–2000, contact ≤ 320) to stop spam payloads.

> **Why:** More players means planning for the few who misbehave. Rate limits
> and size caps live in the database, not just the UI, so they hold regardless
> of how someone pokes at the API — and cookieless analytics respect privacy.

## July 1, 2026 — The news feed keeps itself current

- **Added:** Auto-detects Fortnite's current live build from the public API
  (e.g. "Fortnite is live on v41.20"), updating itself on every patch.
- **Changed:** Official in-game news tiles are pulled live and smart-tagged
  (Update vs Event); the curated `src/data/news.js` file is now only for
  editorial "upcoming" items.
- **Changed:** Live + curated items are merged and de-duplicated by title, with
  a graceful fallback to the curated feed when offline. Live-news fetch lives in
  `src/lib/liveNews.js`.

> **Why:** A news feed that needs manual updates goes stale. Automating what a
> machine can know (live build, official news) leaves only the genuinely
> editorial parts — like what's coming next — to hand-write.

## June 28, 2026 — A zoomable map you can actually read

- **Added:** In-app zoom (`＋`/`−`, double-tap, up to 5×) and drag-to-pan on the
  map — replacing the out-link to a third-party site to "enlarge."
- **Changed:** Markers are now symbol badges (📦 chest, ✨ sprite chest, 🎣
  fishing, 🪙 gold pond, 🏃 path) on a dark pill with a colour-coded ring —
  legible at a glance and counter-scaled to stay constant-size at any zoom.
- **Changed:** Marker state still reads clearly — dashed = unconfirmed, greyed =
  retired, white halo = selected. `touch-none` only engages while zoomed/placing
  so the page still scrolls over the map at default zoom.

> **Why:** Sending people to another site to see detail is a dead end, and a 3px
> dot tells you nothing. Owning the zoom and giving each spot a real symbol makes
> the map useful on its own — no need to generate a bespoke map (no source
> geometry, huge effort); zooming the official image covers it.

## June 28, 2026 — A calmer Collection page

- **Changed:** Sprite grid + a full-width filter bar now sit directly under your
  progress summary, so the sprites are the first thing you reach.
- **Changed:** Breakdown, Share & export, Trading and Support moved into a
  static sidebar beside the grid (stacks below on mobile); cards are always
  expanded (dropped the collapsibles).
- **Changed:** Reformatted the Support card so Creator Code and Buy Me a Coffee
  each sit directly above their own button.
- **Fixed:** Shared profile pages (`?u=…`) had no navigation. The primary tabs
  now render there and link back into the app, backed by `?view=` deep links.
- **Added:** This changelog (footer link + `CHANGELOG.md`) and a refreshed README.

> **Why:** Vertical space is the scarcest resource on a phone. A tracker should
> show sprites first; secondary tools belong one glance to the side.

## June 28, 2026 — Maps: yours, shared, and protected

- **Added:** Personal maps — private, or shared with specific players as
  viewer/editor. Backed by `maps` + `map_shares` tables.
- **Added:** Retire-for-history — archive a marker instead of deleting it
  (hidden from the live map, restorable, browsable via "Show retired").
- **Added:** Move-by-tap repositioning for markers you manage.
- **Security:** Confirmed community spots (net ≥ 3) can't be hard-deleted (a DB
  trigger enforces it), only retired; downvote-to-hide auto-buries stale spots;
  all access is enforced with Row Level Security, not just the UI.

> **Why:** Community data only works if people trust it. Deletion is
> owner-scoped, popular spots are locked, and the crowd can retire stale ones
> without destroying history.

## June 28, 2026 — Putting chests on the map

- **Added:** 29 sprite-chest markers seeded from public guides across all 13
  Shattered Coast POIs, each with source attribution.
- **Added:** Per-marker source links; seeded-but-unconfirmed markers show a 📋
  badge and dashed outline until players confirm them.
- **Added:** Submit / confirm / flag spots; markers fade by confidence.
- **Changed:** POIs pulled live from `fortnite-api.com` (auto-updates each
  season); map image self-hosted with an API fallback to avoid rate limits.
- **Fixed:** Much clearer add-a-marker instructions and an add-mode banner.

> **Why:** Precise loot coordinates are proprietary (fortnite.gg) and a scraper
> would only return guide prose, not coordinates. Seeding from documented guides
> with attribution + crowd-sourcing the exact spots is the honest path.

## June 27, 2026 — Compare, compete, and feel your saves

- **Added:** Leaderboard compare — shared / you need / they need / neither, a
  read-only diff against any public collection.
- **Added:** Floating save-status pill so cloud saves are visible mid-grid.
- **Added:** Report-a-bug (emails the maker), About page, Buy Me a Coffee,
  fuller footer credits.
- **Fixed:** Cloud-sync errors are surfaced instead of failing silently.

> **Why:** Saving worked but had no visible confirmation — invisible success
> feels like failure. An honest, quiet status indicator builds trust.

## June 27, 2026 — Real art and the missing variants

- **Added:** Official Epic sprite images + AI-reskinned Gold/Gummy/Galaxy
  variants for Striker, Fishy, Aura, Boss, Grim Reaper.
- **Added:** Leaderboard + Flex Score, Fortnite news feed, island map (tabbed
  nav).
- **Added:** Trading hub — for-trade/wanted flags, matching, trade-card export.
- **Changed:** Full UX pass — tooltips, toasts, onboarding, sticky filters, a11y.
- **Fixed:** Export images use real sprite thumbnails (not coloured squares).

> **Why:** Sprites must be instantly identifiable; real art + consistent
> per-variant treatments make the grid scannable at a glance.

## June 26, 2026 — Finding the sprites' look

- **Changed:** Art iterated SVG → retro pixel → modern cute → real Epic images,
  chasing "instantly identifiable."
- **Fixed:** Corrected roster, themes and drop rates to June 2026 accuracy
  (including the Rift special theme).
- **Added:** Foundations — accurate tracking, detail view, shareable exports.

> **Why:** Nailing the data and visual language first kept everything built on
> top — trading, leaderboards, maps — consistent and trustworthy.
