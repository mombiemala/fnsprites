# FN Sprite Tracker

A fan-made Fortnite **sprite tracker** — track every sprite across all of its
finishes (Normal, Gold, Gummy, Galaxy, **Gem**, **Holofoil**, **Cube**, **Quack**,
the Season 4 **Cheat Master**, and the datamined **Loot Hacker**), see your collection
and mastery progress, save it to the cloud, compare with other players, browse the live
**Item Shop**, and look up any player's **Battle Royale stats**. Current through
**Chapter 7 Season 4 "Override"** (Sep 2026, New Sprite Day) — **160 released variants**
across two generations: the Season 3 **"Runners"** roster (kept forever in the **Sprite
Garden**) and the live **Override** generation — Sonic, Tails, Shadow, Jazz Jackrabbit,
Klombo, Bush Ranger, Crown, Jonesy, 8-Bit Blaster, Killswitch, Adventure, Storm Scout,
Overshield, Mega Man, and the first two **Design-a-Sprite** winners **X-Ray & Onigiri** —
in **Normal, Gold & Cheat Master**, with a datamined **Loot Hacker** finish flagged
unreleased across the roster. Epic confirmed **Sprites are
kept forever**, but a new generation takes over **Battle Royale** each season: older
-gen Sprites are **preserved and displayed** (Sprite Garden + Collection) rather than
used in BR ("may return down the line"), and **Sprite Dust & Gizmos reset** at the
flip. Season 4 also adds **Hack the Lobby codes**, **Loot Hacks** (spend Sprite Dust
to customise your chest loot), and a social **Sprite Garden** island. Leaked/
unconfirmed content (upcoming Sprites, unannounced codes, exact event times) is
flagged **Rumored / Upcoming** until confirmed.

> Not affiliated with Epic Games. Support the maker with **Creator Code: MOMBIE**
> in the Fortnite Item Shop. #EpicPartner

## Features

- **Accurate roster** — every released sprite & variant, current through the
  **Sep 3 New Sprite Day** (**41 sprites / 160 released variants**). The current
  generation, **Chapter 7 Season 4 "Override,"** is **live**: Sonic, Tails, Shadow,
  Jazz Jackrabbit, Klombo, Bush Ranger, Crown, Jonesy, 8-Bit Blaster, Killswitch,
  Adventure, Storm Scout, Overshield, Mega Man, plus the first two **Design-a-Sprite**
  winners **X-Ray & Onigiri** — in Normal, Gold & Cheat Master, with the datamined
  **Loot Hacker** finish flagged unreleased across the roster. The Season 3
  **"Runners"** roster (the full Gem line, Cube, Holofoil & Quack, Ironmouse back from
  the vault, every Zero Point finish) is kept forever in the **Sprite Garden**.
  Still-datamined Sprites (Pond, Honey, Dumpster Dive, Meowscles, Squibbly, Cube,
  Headshot, BodySlam) are previewed as **Upcoming/Rumored** so leaks never read as
  fact — each news item shows its source and whether it's official.
- **🌱 Sprite Garden hub** — a **Community Gallery** where players upload screenshots
  of their in-game garden, browse a feed and like favourites (moderated: pre-upload
  check → report/auto-hide → owner/maker delete), plus a **Layout Planner** that turns
  your owned Sprites into a numbered **blueprint** to recreate in-game. A shareable
  **"My Sprite Garden" poster** export lives in Share & export.
- **🔓 Lobby Hacks** — the season's **Hack the Lobby / Admin Panel codes** as a
  first-class tab and a canonical `/codes` page: grouped by reward, per-code copy,
  redeemed-tracking, a **"new this week"** highlight + verified dates, and `upcoming`
  codes shown *before* their string drops.
- **Guides (SEO)** — prerendered explainers competitors don't have: **Sprite Garden**
  (`/sprite-garden`), **Sprite Dust & Loot Hacks** (`/sprite-dust`), **Events schedule**
  (`/events`) and the **Tier list** (`/tier-list`), each with FAQ/HowTo structured data.
- **Upcoming & leaked** — a card that lists every unreleased/datamined sprite
  sorted by its leaked release date, with a live **countdown** (“in 8 days”),
  tap-to-open. All clearly badged **Rumored**.
- **Consistent sprite art** — each variant is a per-variant image
  (`public/sprites/<id>_<variant>.png`; Season 4 **Override** art ships as `.webp`).
  **Sprite images are © Epic Games, Inc.**, used for identification only; base
  identities are sourced from [UltronCore/sprite-tracker](https://github.com/UltronCore/sprite-tracker),
  and the Season 4 Override roster uses Epic's **official datamined icons** (Normal,
  Gold, Cheat Master & Loot Hacker). Where official art doesn't exist for a finish,
  the variant renders are produced through **one shared image-to-image pipeline**
  (Google Gemini) from each sprite's Normal, so a given finish (Gold, Gummy,
  Holofoil, Cube…) looks the **same material on every sprite** rather than drifting
  per-sprite. Real-person and licensed collab sprites (e.g. **Vini Jr.** / Vinícius
  Júnior, **Pollo**) use Epic's **official in-game art** with the background removed —
  never an AI-fabricated likeness. A generated SVG fallback covers any missing image.
- **Track ownership, levels & mastery** — mark a variant owned, then set its
  **level 1–5** (level 5 = mastered) right on the grid card or in the detail
  view, with a `Lv 3/5` readout. Works instantly as a guest (saved in your
  browser) and syncs to the cloud when you log in, with a live save-status
  indicator. **Bulk quick-add:** filter to a theme or rarity and mark the whole
  shown set owned in one tap.
- **Import from a screenshot** — snap your in-game sprite locker and on-device
  OCR (Tesseract.js, running entirely in your browser) pre-checks what it
  recognizes; review and mark them owned in one go. The image never leaves your
  device.
- **Next to chase** — a guide that reads your own collection and points you at
  your **rarest missing** sprite, the set you're **closest to finishing**, and an
  **easy one to grab** — each a tap away.
- **Drop rates** per sprite (community-datamined estimates; Epic publishes none).
- **Chest luck calculator** — turns a drop rate into real expectations: average
  chests to find a sprite, chests for a 50/90/99% chance, and a live "open N
  chests → chance of at least one."
- **Per-sprite pages** (`/sprite/<name>`, e.g. `/sprite/grim-reaper`) and an
  all-sprites index (`/sprites`) — static, SEO-friendly pages with drop rate,
  Dust cost, chest odds, ability, variants and an FAQ, prerendered at build time
  from the same data the app uses (`scripts/prerender.mjs`), with JSON-LD for
  rich search results.
- **Sprite detail view** — rarity, drop rate, ability, a **gameplay tier**
  (S/A/B/C — how strong it is, not just how rare), **how the ability scales
  to Lv 5** (e.g. Demon lifesteal ≈10→≈30 HP; it highlights the level you own),
  and every variant with its in-game **bonus** (e.g. Gummy = +10% Sprite Dust).
- **Leaderboard & Flex Score** — a rarity-weighted ranking of public
  collections, plus a **compare** view (what you both have / each are missing).
- **Trade (dormant)** — the 🔁 Trade tab is currently **hidden**. Fortnite has no
  in-game trading, and it's a niche competitors skip; the matching data
  (`for_trade`/`wanted` + `find_trade_matches` RPC) is kept in place so it's easy to
  revive if a community forms.
- **Player Stats** — look up any player's Battle Royale stats by Epic display
  name (or PSN/Xbox): wins, win rate, K/D, kills, matches, top-10/25, hours, and a
  solo/duo/squad breakdown. Requires the target's match history to be public. The
  stats API key is held server-side by a small serverless proxy (`api/stats.js`),
  never shipped to the browser. **Connect your account:** signed-in players can
  save their Epic name in their Profile (or via a one-tap "save to profile" on any
  result), and the Stats tab then auto-loads their stats on open.
- **Item Shop** — today's rotating Fortnite Item Shop (the in-game store, shown
  read-only) grouped by section, with item art, rarity and V-Bucks prices, plus
  filters (search, rarity, type, price sort). **Tap any offer** for a detail view
  — big render, description, set/series/season, shop history, and every item
  bundled in the offer. Pulls live from the free public
  [fortnite-api.com](https://fortnite-api.com).
- **News & events** — a feed that auto-detects Fortnite's current live build,
  alongside a curated events layer (Gold/Gem/Shiny Hours, New Sprite Day, weekly
  Mastery Mondays / Power Hours), summarised on the **`/events` schedule page**.
  Every item shows
  its **source** and whether it's **official** (Epic) or **unofficial** (with a
  **Tentative** badge for unconfirmed dates), and live events pin to the top. A
  dismissible **announcement bar** highlights the current featured event.
- **Profile page** — manage your gamertag, public/private visibility, sign out,
  and delete your data.
- **Trainer Card** — your shared link (`?u=<your-id>`) opens a player profile:
  an avatar and up to 6 hand-picked **showcase** sprites, headline stats, and
  **earned badges** (Completionist, Shiny Hunter, Mythic Owner, Variant Hunter…)
  derived on the fly from your progress. Badges also appear on the leaderboard.
  Optionally (opt-in in Profile) surface your live **Battle Royale stats** on the
  card too.
- **Share & export** — set your gamertag and share the read-only public link
  above; **copy a ready-to-paste Discord/Reddit caption** of your progress; or
  export a **Sprite Locker–style poster** of your collection (or just the sprites
  you still need).
- **Filter, search & group** — by theme, rarity, ownership; hide mastered, show
  unreleased; group by theme / rarity / **tier** (a built-in tier list) / sprite.
  On every screen the filters tuck behind a single **Filters** button (search &
  sort stay out for quick access), so the sprite grid leads.
- **Progress & breakdown** — overall Collection % and Mastery %, per-rarity and
  per-theme breakdown, and completion badges.
- **How Sprites work** — an in-app guide to the parts players get caught out by:
  extraction (extract or lose it), leveling & Mastery Mondays, mastery, and
  variants. Reachable from the ⋯ More menu, the footer, and a small card above
  "Next to chase" once you sign in.
- **Backup & restore** — guests can copy a backup code to move progress between
  devices; restoring **merges** (never wipes). Logged-in progress auto-syncs.
- **Fast & installable** — a **PWA** (works offline), with heavy views
  code-split for a quick first load and privacy-friendly, cookieless analytics.
  **Google sign-in** + email auth.
- **How Sprites work**, **Backup**, **About**, **Changelog**, **Report a bug**,
  and **Buy Me a Coffee** in the footer.

## Changelog

Release notes — technical, but written for humans, with the reasoning behind the
bigger decisions — live in [`CHANGELOG.md`](./CHANGELOG.md) and in-app via the
**Changelog** link in the footer (`src/data/changelog.js`). Keep the two in sync
when shipping.

## Credits

Sprite art is © Epic Games, Inc., used for identification only. With thanks to:

- [UltronCore/sprite-tracker](https://github.com/UltronCore/sprite-tracker) —
  official base sprite images & the Have/Missing/Mastered model
- [fortnite.gg/sprites](https://fortnite.gg/sprites) — roster, themes & variant
  cross-reference
- [AccountShark](https://accountshark.net/blog/fortnite-chapter-7-season-3-sprites)
  & [GAMES.GG](https://games.gg/fortnite) — community drop-rate estimates and
  ability/rarity cross-reference (Epic publishes no official rates)
- [Fortnite Wiki (Fandom)](https://fortnite.fandom.com/wiki/Sprites) — roster &
  upcoming/leaked sprite cross-reference
- Gameplay **tier list** — a community/meta snapshot from
  [GAMES.GG](https://games.gg), [PlayerAuctions](https://www.playerauctions.com)
  & [Destructoid](https://www.destructoid.com)
- Some variant art (Holofoil, Air & Seven) uses AI (Google Gemini) renders where
  no official image was available; real-person collab sprites (Vini Jr., Pollo)
  use Epic's official art with the background removed — never an AI likeness.
  Other missing images fall back to a built-in SVG generator
- [staticvacant/fnsprites](https://staticvacant.github.io/fnsprites/) — the
  original tracker that inspired this
- News & events via official Fortnite patch notes,
  [Epic communities](https://communities.epicgames.com) &
  [fortnite-api.com](https://fortnite-api.com); some event details
  cross-referenced from community trackers
  ([Vice](https://www.vice.com), [Beebom](https://beebom.com),
  [AllThings.How](https://allthings.how), [Hotspawn](https://www.hotspawn.com),
  [Insider Gaming](https://insider-gaming.com)) — each event links to and labels
  its source (official vs unofficial)
- Item Shop & cosmetics data, and player Battle Royale stats, via the free public
  [fortnite-api.com](https://fortnite-api.com)

No game assets beyond the identification sprite images are bundled.

## Tech

- React 19 + Vite + Tailwind CSS
- [Supabase](https://supabase.com) — auth (email + Google OAuth) and storage
  (Postgres + Row Level Security + RPC functions)
- Google Gemini for AI-reskinned variant art; Canvas API for image exports; PWA
  (manifest + service worker)

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run lint     # lint
```

### Supabase configuration

The app ships with the project's public Supabase URL + publishable (anon) key
baked into `src/lib/supabase.js`. Those keys are safe to expose in the client —
all data access is protected by Row Level Security. To point at a different
project, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env`).

### Player stats proxy

The **Player Stats** tab calls a serverless function (`api/stats.js`, deployed on
Vercel) that forwards to [fortnite-api.com](https://fortnite-api.com) with an API
key. Set `FORTNITE_API_KEY` in the Vercel project's Environment Variables — it is
a **server-only** var (no `VITE_` prefix) so it never reaches the client bundle.
The Item Shop and Cosmetics tabs use fortnite-api.com's free, no-auth endpoints
directly and need no key.

Database schema (applied via migrations):

- `profiles` — one row per user (`gamertag`, `is_public`, `epic_username`,
  `epic_platform`, `showcase_sprite_ids`, `stats_public`, `discord`,
  `notify_trades`, …). Public-readable for
  sharing; owner-writable. Shared-link reads go through the `get_shared_profile()`
  **security-definer** RPC, which returns only public display fields plus the Epic
  account **only** when `stats_public` is on. Anonymous SELECT on the Epic columns
  is revoked at the DB level, so `epic_username` is never exposed unless the owner
  opts into public stats.
- `sprite_progress` — `(user_id, sprite_id)` with `owned` / `mastered` flags plus
  `for_trade` / `wanted` (which power the **🔁 Trade tab** — flag a spare or a
  want and the matcher pairs you with other public players).
  Readable when the owning profile is public (or it's your own); owner-writable.
- `bug_reports` — insert-only feedback backup.

Key RPCs: `leaderboard`; `find_trade_matches(uuid)` — a **security-definer**
function that returns two-way matches (partner `gamertag` + `discord`, `they_give`,
`i_give`) across **public** profiles only, so raw collections are never exposed to
the client.

(Some older tables are kept in place, non-destructively but unused by the app: the
legacy trading **hub** — `trade_posts` / `trade_vouches` (the current Trade tab
uses lightweight `for_trade`/`wanted` matching instead of posts) — and the old
crowd-sourced map — `maps`, `map_shares`, `map_markers`, `map_marker_votes`.)

## Customizing

- Sprite types and which themes each one has: `src/data/sprites.js`
  (`sprite_id`s are derived as `${typeId}_${themeId}`).
- Theme styles & bonuses: `src/data/themes.js` + `src/index.css`.
- Player stats: client `src/lib/statsApi.js` + `src/components/StatsTab.jsx`;
  server-side key proxy `api/stats.js` (needs `FORTNITE_API_KEY` env in Vercel).
- News & events feed: `src/data/news.js`.
- Changelog entries: `src/data/changelog.js`.
