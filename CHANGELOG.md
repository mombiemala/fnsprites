# Changelog

All notable changes to the FN Sprite Tracker, with the reasoning behind the
bigger decisions. Technical, but written for humans. Newest first.

The in-app version of this lives in `src/data/changelog.js` (shown via the
**Changelog** link in the footer) — keep the two in sync when you ship.

Tags: **Added** (new), **Changed** (behaviour/looks), **Fixed** (bugs),
**Security** (access/data integrity).

---

## July 16, 2026 — Cleaner header & one-row navigation

- **Added:** the "FN Sprite Tracker" title is now clickable — it takes you back
  to your Collection (home); from a shared profile it goes to your own tracker.
- **Changed:** Collection, Leaderboard, Trade, News, Farming and Guide now sit
  together in one navigation row, with only the More menu set off by a divider,
  instead of Guide/More floating in the header separate from the section tabs.
- **Changed:** the "✓ Saved" cloud-sync status moved out of the crowded header
  row to sit directly under your profile name, where it clearly refers to your
  account.

*Why:* the header had two competing clusters — section tabs in one place,
Guide/More/account controls in another — so "where do I click for X?" wasn't
obvious. One nav row for everything, a clickable title as the universal "home,"
and status anchored to the thing it describes make the app easier to move around.
Home stays the Collection itself (not a separate landing page) so returning
players reach the tool in zero clicks.

---

## July 16, 2026 — Trade examples, one-card onboarding & SEO groundwork

- **Added:** when the Trade board has no live posts it shows a few clearly-labelled
  **Example** trades (what a good want/offer post looks like) with a "be the first
  to post a real one" nudge — inert, badged, and gone the instant a real trade
  exists, so nothing is faked as activity.
- **Changed:** onboarding consolidated from three stacked prompts (hint +
  screenshot-import card + bulk "mark all" bar) into **one card** with all the
  shortcuts inside; the standalone import card/bulk bar only appear once you've
  started, so there's exactly one import entry point at any time.
- **Added:** SEO & first-paint — the page serves a real, crawlable hero (title +
  tagline) and a loading state instantly instead of a blank screen while the app
  boots, plus JSON-LD structured data, a canonical URL, `robots.txt` and a
  `sitemap.xml`.

*Why:* empty social surfaces are what make a tool feel dead — showing the *format*
teaches newcomers and invites the first real post without deceiving anyone.
Consolidating onboarding removes the "wall of prompts" competing for a new user's
first tap. And a client-only SPA hands crawlers and link-unfurlers a blank div;
static first-paint content + structured data make the app discoverable and its
shared links rich — compounding the guest-sharing loop.

---

## July 16, 2026 — UX polish (first-impression fixes & guest sharing)

- **Fixed:** the welcome modal no longer points new visitors at the retired
  community loot map — it now describes the Farming guide that replaced it.
- **Changed:** the Leaderboard loads automatically on open (with a loading
  skeleton) instead of sitting empty behind a "Load" button.
- **Added:** logged-out players can copy a ready-to-paste Discord/Reddit caption
  of their progress (with a link back), not just export images — sharing no
  longer requires an account.
- **Changed:** bulk "Mark all shown owned" now confirms on a big sweep (15+), so
  a curious first tap can't mark the whole roster owned by accident. Filtered
  handfuls still mark instantly.
- **Changed:** trimmed the live-event announcement headline so it doesn't swallow
  the top of the screen on mobile.

*Why:* competitor trackers are lean and lead with the "copy your collection to
Discord" loop; our depth already beats them, but the first-run experience had
rough edges (empty leaderboard, share gated behind login, stale map copy) that
cost us at exactly the moments that decide whether a new visitor stays.

---

## July 16, 2026 — Source refresh (data re-verified, credits & README current)

- **Changed:** re-verified the v41.20 roster against Beebom, Vice, GAMES.GG,
  AllThings.How and Epic patch notes — Batman/Air/Seven abilities, Seven's variant
  line (Normal/Gold/Gummy/Galaxy/Holofoil) and Pollo/Vini Jr. (Normal-only) all
  confirmed; the leaked Spider-Man sprite (~Jul 30, v41.30) stays **Rumored**.
- **Added:** credited two community drop-rate trackers — **AccountShark** and
  **GAMES.GG** — on the drop-rate line (Epic publishes no official rates).
- **Fixed:** footer art credit no longer calls Air & Seven "upcoming" (they're
  live) and now notes real-person collab sprites (Vini Jr., Pollo) use official
  art with the background removed — never an AI likeness.
- **Changed:** README refreshed — roster date → Jul 16 (v41.20), the retired
  crowd-sourced map is now described as the curated farming guide, and the filter
  behaviour + DB-schema/customizing notes were corrected.

*Why:* the tracker's credibility rests on the data being right and the sourcing
transparent — a periodic sweep of the open sources (and pruning docs that still
described nixed features) is worth doing even when nothing player-facing changed.

---

## July 16, 2026 — Progress counts what you can actually collect (redesign, part 2)

- **Changed:** Collection & Mastery progress now measure against the
  released/obtainable count (e.g. `/93`) instead of the full roster including
  unreleased forms (`/141`). Owned counts exclude unreleased forms to match, so
  the bar can never read past 100%.
- **Added:** a caption under the bars — “*N* variants obtainable now · *M* more
  rumored/upcoming (toggle **Show unreleased** in Filters to include them).”

*Why:* a fresh player seeing “0/141” had no way to know 48 of those aren't in the
game yet — it made the collection feel unfinishable. Measuring against what's live
(and naming the upcoming remainder) makes progress honest and the goal reachable,
while power users can still opt leaked forms in.

---

## July 16, 2026 — Cleaner collection filters (redesign, part 1)

- **Changed:** on desktop, the theme/rarity chips, ownership, grouping and toggles
  now collapse behind a single **“⚙ Filters”** button (with an active-count badge) —
  just like mobile already did. Search and Sort stay out for quick access, so the
  sprite grid shows immediately instead of after two rows of chips.
- **Changed:** inside the panel, controls are grouped under clear **Variant** and
  **Rarity** headings.

*Why:* the old desktop layout dumped a search box, three dropdowns, two checkboxes
and ~15 filter chips above the grid — you had to scroll past all of it to see a
sprite. Collapsing it keeps power-user filtering one tap away while letting the
collection lead. First step of a larger top-of-page tidy-up.

---

## July 16, 2026 — Seven Sprite is now live

- **Changed:** Seven (reveals enemy foot trails for your squad, 10→30s by level)
  is now released with Normal/Gold/Gummy/Galaxy/Holofoil; news entry updated.

*Why:* despite Epic's earlier schedule (Batman & Air only), Seven shipped in v41.20.

---

## July 16, 2026 — Official art for Pollo & Vini Jr. (Normal-only)

- **Added:** official in-game art for **Pollo** (gamer character — headset, esports
  jersey, red beak) and **Vini Jr.** (Vinícius Júnior, Brazil kit), background-removed
  to the roster's transparent format. Official renders for identification — **not
  AI-generated likenesses**.
- **Fixed:** set both to **Normal-only** (no Gold/Gummy/Galaxy/Holofoil yet, like
  Burnt Peanut) and corrected the News entry.

*Why:* a real footballer's sprite should be the official art, never an AI likeness.

---

## July 16, 2026 — Pollo & Vini Jr. Mythic Sprites (live)

- **Added:** **Pollo** (Mythic) — on an elimination, slowly replenish shield for
  you and nearby squad (scales per level).
- **Added:** **Vini Jr.** / Vinícius Júnior (Mythic) — sprint briefly to make your
  slide destructive; slide-kicking enemies boosts fire rate & reload.
- Both **live** in v41.20 (found in Sprite Chests) with Gold/Gummy/Galaxy/Holofoil,
  and added to the News feed. Official art at first chance (Vini Jr. is a real
  player — no AI-generated likeness).

*Why:* confirmed obtainable in v41.20, so marked collectible like the rest.

---

## July 16, 2026 — DC "Hot Bat Summer" live (v41.20)

- **Added:** Batman's revealed power — deploy the **Bat Cape midair** (glide).
  Batman & Air are now collectible (auto-released on the Jul 16 date); Batman is
  Mythic with Gold/Gummy/Galaxy/Holofoil.
- **Changed:** DC news item flipped from tentative leak → live "Hot Bat Summer"
  event (v41.20 patch-notes link) + a live announcement banner through Jul 20;
  farming note added for the new **Bat Cave** landmark under Wonkeeland.
- **Changed:** kept **Seven** unreleased — Epic's official New Sprite Day list
  still shows only Batman & Air, so it stays unconfirmed rather than auto-releasing.

*Why:* drop day is when accuracy matters most — follow Epic's confirmed notes,
don't over-claim Seven.

---

## July 16, 2026 — Batman Sprite art (launch day)

- **Added:** rendered artwork for the **Batman Sprite** across all released forms —
  Normal, Gold, Gummy, Galaxy, Holofoil — in the roster's 3D chibi collectible
  style (generated + background-cut), so it doesn't fall back to placeholder art
  on launch day.
- **Fixed:** replaced the **Seven** Sprite's Normal render (uncut background /
  off-style) with a clean one matching its variants.
- **Changed:** audited every released Sprite × form — all now have consistent real
  art; no SVG fallbacks remain for released sprites.

*Why:* the shelf should look complete the day a Sprite launches.

---

## July 14, 2026 — Removed a broken Seven Sprite image

- **Fixed:** deleted `public/sprites/seven_normal.png` — a mismatched render with
  an uncut background (off-style vs the roster). Seven (unreleased) now falls back
  to the clean generated art; its other variants were already correct, and Air's
  full set checks out. Batman & Spider-Man still render via SVG and need real art
  (image generation, pending an API key).

*Why:* a half-finished image looks worse than the clean fallback.

---

## July 14, 2026 — Known Issues can be marked "Resolved"

- **Added:** a `resolved` state for `tag: 'bug'` news entries — set `resolved: true`
  (+ `resolvedOn: 'vXX.XX'`) and the red "Known Issue" badge renders as a green
  "✓ Resolved · vXX.XX". Give `ts` the fix date so it sorts below current issues.
- **Changed:** marked the v41.10 Sprite fixes (Dream Legendary loot, Fire vs.
  airborne) Resolved. Aura/Fire shield-damage bug rechecked — still open.

*Why:* deleting a bug the instant it's fixed loses useful history; a briefly-kept,
clearly-marked resolved entry answers "did they fix X?" better than silence.

---

## July 13, 2026 — Drop rates filled in & reconciled

- **Added:** drop rates for the five blank Sprites — Striker & Fishy (8.73%),
  Aura (5.22%), Boss (2.436%), Grim Reaper (~0.000098%, rarest in the game).
- **Changed:** Burnt Peanut → ~2.97% (was 1.01%); it drops far more than other
  Mythics (no variant slots). Water/Earth/Fire (8.73%) & Zero Point (0.00034%)
  already matched community data.
- **Changed:** the `dropRate` note now states plainly these are cross-referenced
  community estimates (accountshark, fortnite.gg, wikis) — Epic publishes none.

*Why:* blanks left gaps and precise-looking numbers without a caveat overstate
certainty. Tier bases + cited Mythic figures, clearly labeled estimates.

---

## July 13, 2026 — Jul 16 New Sprite Day: Batman & Air (Seven held back)

- **Fixed:** Batman is **Mythic** (was Legendary) and gains its **Gold** variant
  (Epic marketing: Gold, Gummy, Galaxy & Holofoil). Stays date-gated to Jul 16.
- **Changed:** **Seven un-gated from Jul 16** — Epic's weekly schedule shows only
  Batman & Air on New Sprite Day, so Seven stays rumored/unreleased (leaks say
  ~Jul 23, unconfirmed). News item + roster updated to match.
- **Fixed:** the date-gate no longer auto-releases still-rumored variant forms
  (Gem/Cube/Quack via `THEME_MAP[k]?.rumored`) when a leaked Sprite goes live, so
  Batman/Air release with their real variant lines.

*Why:* on drop day, saying a Sprite released when it didn't — or listing
non-obtainable variants — is worse than silence. Following Epic's posted schedule
keeps it accurate.

---

## July 12, 2026 — Event tidy-up + retired map tables removed

- **Changed:** Holofoil Hours (Jul 11) retagged `upcoming` → `event` now that it's
  passed, so it no longer leads the upcoming list; body reworded to past tense.
- **Added:** a News entry for Epic's "Design A Sprite" contest (Jun 17 – Jul 1);
  winners still to be announced.
- **Removed:** dropped the unused Supabase map tables (`map_markers`,
  `map_marker_votes`, `maps`, `map_shares`) + their RLS policies via migration
  `drop_retired_map_tables`. Seed data only — no player data affected.

*Why:* a past event tagged "upcoming" is noise, and orphaned tables are avoidable
attack surface.

---

## July 10, 2026 — News: chronological order + search

- **Fixed:** `NewsFeed` now sorts each group by the item's real date (`ts`/`start`)
  — live pinned, upcoming soonest-first, history newest-first — instead of relying
  on hand-maintained array order. Undated/evergreen items (weekly events, known
  issues) count as "today" so they stay near current news.
- **Added:** a search box filtering by title/body/source/tag, with an empty state.
- **Changed:** footer AI-art credit now notes the Holofoil renders (not just Air/Seven).

*Why:* hand-ordering meant a misplaced entry broke the timeline; sorting on the
real date is self-correcting, and search keeps the growing feed usable.

---

## July 10, 2026 — Consistent navigation (header ⇄ footer parity)

- **Added:** a footer **Sections** row mirroring the top tabs (Collection,
  Leaderboard, Trade, News, Farming) — every section is reachable from the footer.
- **Added:** a header **⋯ More** menu (About, Changelog, Backup, Report a bug,
  Buy me a coffee) — the footer's utility links, now surfaced up top next to ❔ Guide.
- **Changed:** header + footer links are driven by one shared `utilityLinks` list
  (and `TABS`) so they can't drift out of sync; renamed the "Map" tab to "Farming".

*Why:* links that lived in only one place read as inconsistent. One source of truth
guarantees the same set appears in both spots — add a link once, it shows everywhere.

---

## July 10, 2026 — Map → a focused "Where to farm Sprites" guide

- **Changed:** the Map tab is now **Farming** (`SpriteFarming.jsx` + `data/farming.js`):
  what a Sprite Chest looks like, the top chest hotspots (Sinister Strip = 4,
  Wonkeeland / Calamari Canyon / Heatwave Harbor / Shaken Sanctuary = 3 each),
  farming tips, and links to the Sprite Sanctuary and Fortnite.GG interactive maps.
- **Removed:** the crowd-sourced loot map — `MapView.jsx`, `data/mapMarkers.js`,
  `lib/mapMarkersDb.js`, `lib/maps.js`, `lib/livePois.js` (add/move/vote markers,
  personal maps, gamertag sharing). It needed a login to contribute and had zero
  player-added markers; the Supabase `map_markers` / `maps` tables are now unused
  (left in place, safe to drop later).

*Why:* Sprite Chests spawn from a fixed, published set of points, so crowd-sourcing
approximate markers duplicated better free tools (fortnite.gg, spritesanctuary.gg)
and never got adoption. A curated hotspot list + links to the authoritative maps is
more useful to new players and near-zero maintenance, and keeps the app focused on
collection tracking.

---

## July 10, 2026 — Accuracy pass: corrected Sprite abilities + a Known Issues feed

- **Fixed:** re-checked every Sprite ability against current sources (Fandom wiki,
  Fortnite.GG, GameSpot, GAMES.GG, Epic notes) and corrected the ones that had
  drifted from what shipped — Zero Point (Shield Bubble Jr. on self-heal, not
  "teleports"), Boss (max HP/Shield boost, not "henchmen"), Ghost (cloak on
  reload), Dream (random loot → Legendary at max), Demon (siphon health+shields on
  elim), Punk (random buff; infinite-ammo chance at max), King (pickaxe damage),
  Fishy (swim speed), Aura (Shock Rock charge), Grim Reaper (marks whoever damages
  you), Striker (Overdrive on Mantle/Hurdle), plus Water/Fire/Duck clarifications.
- **Fixed:** variant bonuses — Gummy +20% Sprite Dust (was +10%), Galaxy +30% ammo
  (was +20%). Gem flagged datamined/unconfirmed (disabled Jun 25, not obtainable).
- **Added:** a `bug` / "Known Issue" news tag + section, curated from Epic's
  official Live Issues page and patch notes (Aura/Fire shield-damage bug, Ranked
  Slap stamina visual bug, and the v41.10 Sprite fixes). Feed filters by tag.

*Why:* a tracker's value is accuracy — an ability that reads well but names the
wrong power is worse than nothing. For bugs, curating from Epic's official issues
list + patch notes is the durable, safe choice over scraping Reddit/Twitter:
authoritative, moderation-safe to display, and low-maintenance (drop an entry when
Epic ships the fix).

---

## July 10, 2026 — DC Summer (Jul 16) leak firmed up

- **Changed:** DC Summer news item (`news.js`) — dataminer HYPEX now corroborates
  the earlier Nintendo eShop listing, so the entry adds the ~7 AM ET go-live,
  Seven's "~30s at max level" trail-tracking, and the wider collab (summer Harley
  Quinn / Poison Ivy / Catwoman skins, Batmobile, "Ace" dog sidekick). Source
  swapped to Beebom's write-up. Still flagged tentative/unofficial until Epic
  posts patch notes.

*Why:* two independent leak sources agreeing is a meaningful step up from a lone
retailer listing, so the entry should reflect that — while still making clear it
isn't official, since the date traces to leaks, not Epic.

*(Rechecked all other events/rumors — Holofoil Hours, Mastery Mondays, v41.20
Sprite Pod styles, and the Spider-Man Jul 30 rumor — against current reporting;
all still accurate, no other changes needed.)*

---

## July 10, 2026 — Holofoil Hours details filled in

- **Changed:** the Holofoil Hours entry (news + announcement bar) for Sat, Jul 11
  now spells out the two extended 2-hour sessions (2 PM & 9 PM ET) and that every
  player starts with a Self-Revive Device and Shock Rocks, not just "boosted
  spawns."

*Why:* the loadout and longer sessions change how you'd plan the grind, so it's
worth stating plainly instead of making players cross-reference an outside schedule.

---

## July 9, 2026 — Real Holofoil artwork across the whole roster

- **Added:** rendered Holofoil artwork for the remaining 10 Sprites (Earth, Duck,
  Dream, Demon, Punk, Striker, Fishy, Aura, Boss, Grim) in `public/sprites/` —
  `SpriteArt` already prefers the PNG over the generated fallback, so all 15 live
  Holofoils now show consistent real art with the iridescent sheen.
- **Fixed:** transparent-background cleanup on the renders (neutral-light mask +
  interior hole-fill) so no checkerboard patches remain behind any Sprite.

*Why:* a collection tracker's shelf has to look right — half real art, half
placeholder read as unfinished, so every live Holofoil was brought up to the same
rendered quality.

---

## July 9, 2026 — Guide in the header + accurate Sprite locations

- **Added:** a **❔ Guide** button in the header (`App.jsx`) opening "How Sprites
  work" — no longer footer-only.
- **Fixed:** `spriteSource()` (`sprites.js`) — every Sprite is RNG from Sprite
  Chests island-wide (any chest, any Sprite; rarity = odds, not location). Removed
  the misleading "Fishy: better near water" note and clarified the default.
- **Added:** guide "Getting Sprites" now has real farming tips (Visualized Sounds,
  chests glow blue w/ pink crystal, Sinister Strip = 4 chests).
- **Changed:** footer credits + README updated — Air/Seven Gemini renders,
  tier-list sources (GAMES.GG, PlayerAuctions, Destructoid) and Hotspawn /
  Insider Gaming news sources now attributed.

*Why:* the guide answers new-player questions, so it shouldn't be buried; and
"where to find" implying location-based drops was inaccurate (drops are pure RNG).

---

## July 9, 2026 — Holofoil live (date-gated auto-release)

- **Added:** Holofoil is now collectible on 15 Sprites (every released Sprite
  except the Normal-only Burnt Peanut; +15 to `RELEASED_COUNT`, 61 → 76). Confirmed
  live/official via Epic Communities; news item + announcement bar updated to
  "live", and Peanut reverted to Normal-only to match Epic's 15-variant rollout.
- **Added:** `FORM_RELEASE` + a date-gate in `buildSpriteList` (`sprites.js`) —
  an unreleased variant form auto-flips to released once its date arrives
  (browser-local, evaluated per load), but only while the sprite type is
  released. Only firmly-dated forms are listed (`holofoil: 2026-07-09`); leaked
  forms stay out so nothing releases early.
- **Added:** the same date-gate applied to upcoming **sprites** via their
  `releaseDate` — a leaked type auto-flips to released (and un-`rumored`, variants
  collectible) on its date and drops off the "Upcoming & leaked" card. Wired up:
  Air/Seven/Batman `2026-07-16`, Spider-Man `2026-07-30`. Verified by clock mock:
  Jul 9 = 76 released, Jul 16 = 96, Jul 30 = 97. Dates are leaked — recheck before
  each drop.
- **Changed:** roster subtitle + README → "accurate to the Jul 9, 2026 update
  (Holofoil)."

*Why:* a roster-wide form drop on a known date shouldn't need 16 hand-edits on
release morning — date-gating keeps the "accurate" promise automatically, while
leaked/uncertain content stays manual.

---

## July 8, 2026 — Guidance layer: guide, trade safety, first-run, backup

Research-driven UX: the app tracked everything but taught none of the confusing
mechanics. Fix that.

- **Added:** `HowItWorksModal.jsx` (footer → **How Sprites work**) — extract-or-
  lose-it, leveling points (+ Mastery Mondays), Mastery = extract at Lv 5,
  variants, and trading. Plain language, community-sourced caveats.
- **Added:** Trade Board explainer now includes the in-game trade steps
  (drop → co-extract) and **grab-and-run** scam avoidance (`TradeBoard.jsx`).
- **Added:** a dismissible **first-run hint** on the collection grid for guests
  with nothing owned (tap to mark / import screenshot / how it works).
- **Added:** **Backup & restore codes** — `BackupModal.jsx` (footer → **Backup**)
  encodes local progress to a copyable `FNS1:` code; `importTracking()` in
  `AuthContext` restores via a non-destructive **merge** (higher level per
  sprite, OR-ed flags) and upserts to the cloud when signed in.

*Why:* what Sprite players search for most is *how the systems work* (extraction
& mastery confusion) and *how to trade safely* — so a guidance layer is the
highest-value UX add and differentiates us from bare-checklist competitors.

---

## July 8, 2026 — "Upcoming & leaked" sprites section

Turn the leak-tracking into a feature.

- **Added:** `UpcomingSprites.jsx` sidebar card — every unreleased sprite sorted
  by leaked `releaseDate`, with a live countdown ("in 8 days" / "Today" /
  "Any day now" / "Datamined · TBA") and tap-to-open. Badged Rumored. Wired into
  the collection sidebar under "Next to chase".
- **Added:** **Spider-Man** to the roster (`sprites.js`) — leaked Marvel collab
  Sprite (web-swinging, ~Jul 30 / v41.30), with a palette + mask/web/spider-
  emblem feature in `SpriteArt.jsx` (default eyes suppressed, like Batman).
  Vector for now; official render swaps in on release.
- **Added:** `releaseDate` on the upcoming sprites (Seven/Air/Batman = 2026-07-16,
  Spider-Man = 2026-07-30) driving the countdowns.

*Why:* a growing set of leaked sprites is more useful shown as a dated "what's
next" list than scattered across the grid — and consolidating them, all flagged
Rumored, keeps leaks clearly separate from the confirmed roster.

---

## July 8, 2026 — News: Spider-Man Sprite leak

- **Added:** a Tentative `news.js` entry for the datamined **Spider-Man Sprite**
  (web-swinging) + **Spider-Man Power Hour**, reportedly landing ~Jul 30 with
  v41.30 (timed with *Spider-Man: Brand New Day*). Source: Insider Gaming;
  flagged unofficial. Would be Fortnite's first Marvel + DC Sprite overlap.

*Why:* keep the feed current with what collectors are hearing, but leaks wear the
Tentative badge + source link so they never read as confirmed.

---

## July 8, 2026 — Rendered art for Air & Seven

Real 3D-style images instead of vector placeholders for the upcoming Sprites.

- **Added:** `public/sprites/air_*.png` and `seven_*.png` for every variant
  (Normal→Quack). Generated with Gemini (image-to-image reskins from a matched
  base / the existing `seven_normal`), background-removed to true alpha, and
  downscaled to the app's 320² format. No code change — `SpriteArt` already
  prefers a real PNG and only falls back to the SVG when one is missing.
- **Changed:** Batman stays on the vector cowl (DC character — swap in the
  official render on release rather than generate one).

*Why:* these Sprites have no official image yet and aren't in the community image
sets, so they were rendering as obvious vector placeholders. On-style renders make
the roster look finished; they stay flagged Unreleased/Rumored, and official art
can drop straight in later. Generation workflow is documented in
`docs/SPRITE-ART-PROMPTS.md`.

---

## July 6, 2026 — Sharper art for the upcoming Sprites

Make the leaked Sprites recognisable, not placeholder-y.

- **Changed:** in `SpriteArt.jsx`, **Batman** now wears a cowl (pointed ears +
  white eye-slits, default kawaii eyes suppressed like Boss) with a gold bat
  chest emblem; **Seven** has a bolder agent "7" on a subtle chest plate;
  **Air**'s wind swirls are crisper. All still render across every variant
  treatment (Gold/Gummy/Galaxy/Holofoil/Cube/Quack).
- **Changed:** `news.js` — Holofoil's Jul 9 release notes the reported
  ~9 AM ET / 6 AM PT time.

*Why:* these Sprites have no official image yet (unreleased), so they're drawn by
the procedural generator. On-model art keeps the roster looking intentional
without any external assets. Matching the *photo-real* released renders would
require generated raster images (an image model) — this is the best no-cost,
always-consistent version until then.

---

## July 6, 2026 — News & banner refresh (Holofoil confirmed)

Keep the events current for the week of Jul 6.

- **Changed:** dropped the `tentative` flag on **Holofoil Sprites** (Jul 9) and
  **Holofoil Hours** (Jul 11, 2 PM & 9 PM ET) in `news.js` — both are now widely
  reported / Epic-announced, so they read as scheduled rather than leaked.
- **Added:** two `announcements.js` banner entries — Holofoil Sprites (Jul 6–10
  window) and Holofoil Hours (Jul 11) — so the bar leads with the imminent event
  instead of the Aug 19 season-end note.
- **Added:** the new **Duck Mansion** POI to `mapMarkers.js` `FALLBACK_POIS`
  (the live POI layer already self-updates each season; the fallback is the
  offline safety net).

*Why:* a "what's on now" tracker has to match the current week — confirmed
events shed the Tentative badge, and the banner should surface what's days away,
not two months out.

---

## July 6, 2026 — Gameplay tier list (S/A/B/C)

Rarity = how hard to find; tier = how good. Now both.

- **Added:** a `TIER_META` / `TIER_ORDER` / `SPRITE_TIER` map + `spriteTier()` in
  `sprites.js`, and a `tier` field on each flattened sprite. S: Striker, Demon,
  Ghost, Zero Point · A: Earth, Fishy · B: Boss, Duck, Dream, King, Aura, Grim ·
  C: Water, Fire, Punk. Unreleased/leaked sprites + Peanut stay unranked.
- **Added:** a tier badge in `SpriteDetailModal` (next to rarity, with a
  meta-ranking tooltip), and a **"Group by tier"** option (`Toolbar` +
  `App.jsx` grouping + `collections.tierOrder`) that renders the grid as a tier
  list (S-Tier · N, …).
- **Changed:** tiers are a community/meta snapshot (GAMES.GG, Beebom,
  PlayerAuctions, Destructoid), deliberately separate from rarity.

*Why:* rival tier lists live on a separate static page; we already know your
collection + levels, so folding tier into the tracker lets it prioritise what to
chase and master first. Keeping tier apart from rarity avoids implying Mythic =
best (Grim Reaper is Mythic but mid-tier).

---

## July 6, 2026 — Per-level ability scaling in the detail view

Make the Lv 1–5 tracker mean something concrete.

- **Added:** a **"⬆ Scales to Lv 5"** row in `SpriteDetailModal`, backed by a
  `SPRITE_SCALING` map + `spriteScaling()` in `sprites.js`. Describes how each
  ability grows — e.g. Demon lifesteal ≈10→≈30 HP, Ghost cloak ≈3→≈5s, Boss up
  to +25 HP/Shield at Lv 5, Fishy's full swim/move curve (25%/10% → 200%/50%).
  When you own the sprite it appends **"you're at Lv N/5"** (max level across the
  owned variants).
- **Added:** a caveat that values are community-reported (Epic doesn't publish
  exact per-level numbers), consistent with how drop rates are framed.

*Why:* rival trackers show per-level values in a static table; we already track
your level 1–5, so tying the two together is the differentiated win — the app
tells you what mastering a sprite actually gets you and how far along you are, in
one place. Where exact figures aren't public we describe the trend rather than
fabricate numbers.

---

## July 5, 2026 — "Rumored" labels for leaks + fresh news

Made leaked content look different from confirmed content, and caught the feed up.

- **Added:** a **Rumored** badge on unconfirmed sprites (`type.rumored` — Air,
  Seven, Batman, Wick, Drifter, Ice) in `SpriteDetailModal`, and an
  **"Ability (rumored):"** label. Unconfirmed variant forms (`theme.rumored` —
  Cube, Quack) read **"Bonus not yet revealed"** in amber rather than a guessed
  perk. `buildSpriteList` now carries a `rumored` flag (sprite- or
  variant-form-level).
- **Added:** two Tentative upcoming events in `news.js` — **Holofoil Sprites**
  (Jul 9; a Holofoil for every Sprite, reported +5% squad chance to find rare
  Sprites) and the leaked **DC Summer event** (Jul 16; Batman + Air & Seven).
- **Changed:** rolled **Holofoil** out as an (unreleased) variant of every Sprite
  to match the leaked Jul-9 rollout; gave Air/Seven/Batman their reported
  abilities and variant lines; updated Holofoil's `bonus` to the reported "+5%
  squad chance to find rare Sprites".
- **Added:** **Fortnite Wiki** as a roster/leak cross-reference in the footer
  credits (`App.jsx`).

*Why:* accuracy is the product. A visible **Rumored** label lets us surface
what's coming — useful for planning a hunt — without implying Epic has confirmed
it. These dates/powers come from community leaks (incl. an early Nintendo eShop
listing for the DC event) that can change before launch, so labelling beats
either omitting them or presenting them as fact.

---

## July 5, 2026 — New sprites & forms: Air, Seven, Cube, Quack (+ Batman)

Getting ahead of the next drop — all additions flagged **Unreleased**.

- **Added:** two new sprites — **🌬️ Air** (sprint/jump boost, no fall damage) and
  **7️⃣ Seven** (reveals nearby footstep trails), each carrying the full variant
  line from Normal through the new Cube & Quack forms (`sprites.js`).
- **Added:** two new variant forms — **Cube** (purple Zero-Point grid) and
  **Quack** (duck-gold) — rolled out across the whole roster, with `bonus` copy
  and card treatments (`themes.js`, `.theme-cube` in `index.css`; `treatment()`
  cases already existed in `SpriteArt.jsx`).
- **Added:** a datamined **🦇 Batman** sprite (DC collab, ~Jul 16) with its own
  palette + bat-ears/emblem feature in `SpriteArt.jsx`.
- **Added:** procedural art for every new sprite/form — the SVG generator draws
  them from a palette + variant treatment, so no PNGs are needed and the house
  style stays consistent.
- **Changed:** all new entries are `released: false` / variant `U`, so
  `RELEASED_COUNT` and completion math are unaffected until they go live.

*Why:* several sprites and forms are leaking ahead of release. Adding them now,
visibly flagged as upcoming, lets players plan the hunt without polluting the
real collection math. Procedural art means a new sprite/form is a few lines of
data plus a palette — not a pile of hand-drawn images — so the tracker can be
accurate the day a drop lands, with no Gemini/API step required.

---

## July 5, 2026 — One-tap Discord/Reddit caption

- **Added:** a **"📋 Copy caption for Discord / Reddit"** button in Share & export
  (`ShareBar`). Copies a ready-to-paste text summary — count, %, mastered count,
  and the compare link (personal `?u=` link when public, else the main site).
  Counts against the released roster (`RELEASED_COUNT`).

*Why:* collections get shared as text in Discord/Reddit, not just as images.
A formatted one-liner with the compare link baked in is how the tracker spreads.

---

## July 5, 2026 — "Next to chase" collection guide

- **Added:** a **🎯 Next to chase** sidebar card (`NextToChase.jsx`) that reads your
  own tracking and recommends three targets — **Rarest missing** (lowest drop
  rate unowned), **Finish a set** (the sprite type you're closest to completing,
  with the count of variants left), and **Easiest to grab** (highest drop rate
  unowned). Each row opens that sprite's detail; a "caught them all" state shows
  at 100%. Owner view only. All computed client-side from rarity/drop-rate/theme
  data already on hand.

*Why:* a checklist tells you what you have — the engaging part is deciding what to
hunt next. It's the one thing rival trackers lead with that we didn't have, and
we already had every ingredient to do it well.

---

## July 5, 2026 — Backend tuning for scale (performance advisor)

Ran Supabase's performance advisors and applied the standard fixes. No
user-facing or behavioral change — pure scale headroom.

- **Changed:** wrapped `auth.uid()` as `(select auth.uid())` in all 24 RLS
  policies (profiles, sprite_progress, maps, map_shares, map_markers,
  map_marker_votes, trade_posts, trade_vouches) so it's evaluated once per query
  instead of per row (`auth_rls_initplan`). Applied via `ALTER POLICY`, preserving
  every expression exactly — verified the access logic is unchanged.
- **Changed:** added covering indexes on the 7 unindexed foreign keys
  (`maps.owner_id`, `map_shares.user_id`, `map_markers.created_by/map_id`,
  `map_marker_votes.user_id`, `trade_posts.user_id`, `bug_reports.user_id`).
- **Left as-is:** the two `unused_index` INFO hints on `sprite_progress`
  (`trade_idx`/`want_idx`) — they back the trade queries and just haven't seen
  traffic yet; their write cost is trivial. (The 7 new FK indexes also show as
  "unused" for now simply because they're brand new.)

*Why:* the RLS re-evaluation and unindexed FKs only bite at scale, but they're the
cheap, standard hardening to do before growth — semantically identical rules,
just faster.

---

## July 5, 2026 — Security pass on the community backend

Ran Supabase's security advisors + a manual RLS/RPC review ahead of growth.

- **Security:** `find_trade_matches` trusted a client-supplied `target` uuid while
  running as `SECURITY DEFINER`, so anyone could pass another player's id (exposed
  via `?u=` share links) and enumerate that player's two-way trade matches. It now
  scopes to `auth.uid()` — the app only ever called it with the caller's own id,
  so behavior is unchanged for legitimate use.
- **Security:** revoked `EXECUTE` (from `PUBLIC`) on the trigger function
  `enforce_vouch_rate_limit()`, removing it from the callable REST surface. The
  `trg_vouch_rate` trigger still fires, so the 30/day vouch cap is unchanged.
- **Reviewed / accepted:** the `can_read/edit/manage_map` helpers are used inside
  RLS policies (must stay executable); `map_shares_list` is owner-gated;
  `find_user_by_gamertag` returns only a uuid and the shared view still enforces
  `is_public`; `bug_reports`/`trade_posts` have DB-level size caps, so the open
  bug-report INSERT is bounded.
- **Recommendation (dashboard):** enable Auth → leaked-password protection
  (HaveIBeenPwned) — it's currently off and can't be toggled from SQL.

*Why:* as the tracker opens up, the backend rules matter more than the UI. This
closes a real (if modest) way to peek at another player's trade preferences and
trims the public API surface, without touching any working feature.

---

## July 5, 2026 — Mark a whole theme or rarity owned in one tap

- **Added:** a **“✓ Mark all shown owned”** bar above the collection grid. It acts
  on the **released sprites currently shown**, so filtering to a theme (e.g. Gold)
  or a rarity (e.g. Legendary) — or a search — and clicking it claims the whole
  set via the existing `bulkOwn`. A live “N of M shown owned” count sits beside it.
- **Added:** when all shown are owned, the button flips to **“Unmark all shown”**
  (with a confirm). Unreleased sprites are never bulk-owned, and the action only
  ever touches sprites visible under the current filters.

*Why:* one-variant-at-a-time marking is the most tedious part of setup. Reusing
the filters already in place makes a single control cover "a whole theme", "a
whole rarity", or any search — no new UI to learn.

---

## July 5, 2026 — Groundwork: room to track more than sprites (Phase 0)

Invisible seam so the app can track collectibles beyond sprites later, with zero
user-facing change today.

- **Added:** a **collection sets** registry (`src/data/collections.js`) —
  `COLLECTIONS`, `ACTIVE_COLLECTION_ID`, `getActiveCollection()`. Sprites is set
  #1; a future collectible becomes a data entry, not new machinery.
- **Added (schema):** `sprite_progress.collection` — `text NOT NULL DEFAULT
  'sprites'`, plus a `(user_id, collection)` index. Additive and
  backward-compatible; all existing rows backfill to `'sprites'`. The primary key
  stays `(user_id, sprite_id)` until a second set lands.
- **Changed:** `AuthContext` reads progress filtered by the active collection and
  tags every write with it, so a future set lives alongside sprites without
  touching sprite data.

*Why:* Fortnite rotates the headline collectible every season. This is the
low-risk insurance from the roadmap's Phase 0 — it makes "add a new collectible"
a data change rather than a rewrite, and leaves every tracked sprite untouched.
Trade Board, leaderboard and the rest become collection-aware in Phase 1, when a
second set actually exists.

---

## July 3, 2026 — Events refresh + clear source links

- **Added:** Gold & Gummy Hours (Sat, Jul 4) — boosted Gold & Gummy Sprite spawns
  + faster Sprite XP (2–4 PM & 9–11 PM ET). Now the featured announcement and the
  lead item in the News feed.
- **Added:** Holofoil Hours (~Jul 11, flagged **Tentative**) and a **Weekly Sprite
  events** entry — Mastery Mondays plus Saturday Power Hours (3:30 & 9:30 PM ET).
- **Added:** source attribution on every news item and announcement — a `source`
  name, an **official** (Epic) vs **unofficial** marker, an optional `tentative`
  badge, and an "opens in a new tab ↗" hint so it's clear when a link leaves the
  app. New `source` / `official` / `tentative` fields in `news.js` and
  `announcements.js`, rendered by `NewsFeed` and `AnnouncementBar`.

*Why:* trust comes from knowing where info comes from. Labeling each event's
source (and flagging unofficial/tentative ones) is more honest than a bare link,
and keeps community-sourced items clearly separate from Epic's own announcements.

---

## July 3, 2026 — Set sprite levels from the grid

- **Added:** owned sprite cards in the collection grid now carry the same 1–5
  level control as the detail modal — the dot meter plus a `Lv 3/5` readout
  (gold at 5). Tapping a dot calls `setLevel`, so it stays in sync with the
  modal, Mastery %, and the cloud. `SpriteCard` takes a new `onSetLevel` prop
  (threaded from `App.jsx`).

*Why:* levels were only settable inside the sprite modal. Surfacing the control
on the card lets you level a whole page of sprites without opening each one.

---

## July 3, 2026 — Clearer sprite levels

- **Changed:** the per-variant 1–5 level dots in the sprite detail modal now show
  a numeric readout beside them — `Lv 3/5`, turning gold as `Lv 5/5 · Mastered`
  at max. The dot meter is unchanged; it just has a self-explanatory label now.
- **Changed:** dot tooltip now hints tappability (`Level 3 of 5 — tap a dot to
  set`) and per-dot `aria-label`s read `Set level N of 5`.

*Why:* levels already worked, but a bare row of dots didn't read as a level
control at a glance. A tiny label makes it obvious without enlarging the row or
dropping the compact dot meter.

---

## July 2, 2026 — Fix: leaked scroll-lock froze the page

- **Fixed:** `useEscClose` locks `document.body` scroll while a modal is open, but
  `WelcomeModal` is always mounted and calls the hook *before* its `if (!open)
  return null`. So for returning visitors (welcome already dismissed) the hook
  still ran and left `body { overflow: hidden }` set with no dialog on screen —
  the whole page became unscrollable, and if the browser restored a prior scroll
  position on reload, the frozen viewport hid the header/nav entirely.
- **Fixed:** the same effect only cleaned up on unmount, so even a fresh visitor
  who *closed* the welcome stayed locked until a reload.
- **How:** `useEscClose(onClose, active = true)` now gates the listener + lock on
  `active`, and `WelcomeModal` passes its `open` state. The effect re-runs when
  `open` flips false, restoring scroll immediately. All other modals are mounted
  only while open, so the `true` default leaves them unchanged.

*Why:* the "don't scroll the background behind a dialog" behaviour is correct —
it just must be scoped to when a dialog is actually visible. Tying the lock to
the popup's open state keeps that guarantee without ever bleeding into the
normal page.

---

## July 1, 2026 — Screenshot collection importer

- **Added:** `📷 Import from a screenshot` on the collection page — `spriteOcr.js`
  runs Tesseract.js (lazy-loaded worker) on an uploaded locker image, fuzzy-matches
  names to the roster (Levenshtein ratio ≥ 0.84), and a review modal lets you
  confirm/adjust variants before a single `bulkOwn`.
- **Added:** Search-to-add in the importer for anything OCR misses.
- **Security/Privacy:** OCR is 100% client-side — the image never leaves the device.
- **Changed:** Self-hosted the OCR engine (`public/tesseract/`: worker + LSTM
  wasm cores + `eng` best-int data, ~15MB) instead of the jsdelivr CDN. Loaded
  on demand, runtime-cached by the service worker (immutable, no revalidation),
  so it works behind strict networks and offline after first use.

> **Why:** Chosen over Epic auto-import (which requires the ToS-gray private
> Fortnite API and risks user accounts). On-device OCR delivers most of the
> low-friction value with zero account or privacy risk.

## July 1, 2026 — Trader reputation (vouches)

- **Added:** `trade_vouches` table + `vouchForTrader`/`unvouchTrader` — a "👍 Vouch"
  toggle on every Trade Board post; the count rides along on all of that user's
  posts (optimistic update across board + matches).
- **Added:** `vouches` / `i_vouched` fields on `trade_board_list` and
  `trade_matches_for_me`; a short "what vouches mean" note in the explainer.
- **Security:** One vouch per (voucher, vouchee) pair, `no_self_vouch` check, RLS
  (`voucher_id = auth.uid()`), and a 30/day rate-limit trigger.

> **Why:** Trading has no in-game escrow; the risk is not knowing who's reliable.
> A lightweight, hard-to-game reputation surfaces good actors without implying the
> app guarantees any trade.

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
