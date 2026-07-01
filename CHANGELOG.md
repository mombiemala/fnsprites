# Changelog

All notable changes to the FN Sprite Tracker, with the reasoning behind the
bigger decisions. Technical, but written for humans. Newest first.

The in-app version of this lives in `src/data/changelog.js` (shown via the
**Changelog** link in the footer) — keep the two in sync when you ship.

Tags: **Added** (new), **Changed** (behaviour/looks), **Fixed** (bugs),
**Security** (access/data integrity).

---

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
