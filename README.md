# FN Sprite Tracker

A fan-made Fortnite **sprite tracker** — track every sprite across all of its
variants (Normal, Gold, Gummy, Galaxy, Gem, Holofoil, the new **Cube** & **Quack**
forms, and the special **Rift** line), see your collection and mastery progress,
save it to the cloud, compare with other players, browse the live **Item Shop**,
and look up any player's **Battle Royale stats**. Roster is current through the
**Jul 23, 2026 New Sprite Day**: the first wave of **Cube** Sprites (Batman, Boss,
Dream, Earth, Fire, Fishstick, Grim Reaper & Punk — Overdrive in the Storm) is
live, on top of the Jul 16 v41.20 DC "Hot Bat Summer" drop (Batman, Air, Seven,
plus the Mythics **Pollo** & **Vini Jr.**). Remaining Cube variants roll out on
future New Sprite Days; anything Epic hasn't confirmed — e.g. the leaked
**Spider-Man** sprite (~Jul 30, v41.30) and the **Quack** form — is flagged
**Rumored**.

> Not affiliated with Epic Games. Support the maker with **Creator Code: MOMBIE**
> in the Fortnite Item Shop. #EpicPartner

## Features

- **Accurate roster** — every released sprite & variant through the Jul 23, 2026
  New Sprite Day (wave-1 Cube line + the v41.20 Batman/Air/Seven/Pollo/Vini Jr.
  drop, the Holofoil line, Striker/Fishy/Aura/Boss/Grim, etc.); upcoming sprites &
  forms roll out in waves and are clearly flagged **unreleased**, and anything
  Epic hasn't confirmed (the leaked Spider-Man sprite, the Quack form, later Cube
  waves) wears a **Rumored**/upcoming label so leaks never read as fact.
- **Upcoming & leaked** — a card that lists every unreleased/datamined sprite
  sorted by its leaked release date, with a live **countdown** (“in 8 days”),
  tap-to-open. All clearly badged **Rumored**.
- **Real sprite art** — each variant uses the real in-game image
  (`public/sprites/<id>.png`). **Sprite images are © Epic Games, Inc.**, used for
  identification only and sourced from
  [UltronCore/sprite-tracker](https://github.com/UltronCore/sprite-tracker);
  variant forms UltronCore lacks were AI-reskinned (Google Gemini) from those
  base images. Real-person and licensed collab sprites (e.g. **Vini Jr.** /
  Vinícius Júnior, **Pollo**) use Epic's **official in-game art** with the
  background removed — never an AI-fabricated likeness. A generated SVG fallback
  covers any still-missing image.
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
- **Sprite detail view** — rarity, drop rate, ability, a **gameplay tier**
  (S/A/B/C — how strong it is, not just how rare), **how the ability scales
  to Lv 5** (e.g. Demon lifesteal ≈10→≈30 HP; it highlights the level you own),
  and every variant with its in-game **bonus** (e.g. Gummy = +10% Sprite Dust).
- **Leaderboard & Flex Score** — a rarity-weighted ranking of public
  collections, plus a **compare** view (what you both have / each are missing).
- **Player Stats** — look up any player's Battle Royale stats by Epic display
  name (or PSN/Xbox): wins, win rate, K/D, kills, matches, top-10/25, hours, and a
  solo/duo/squad breakdown. Requires the target's match history to be public. The
  stats API key is held server-side by a small serverless proxy (`api/stats.js`),
  never shipped to the browser.
- **Item Shop** — today's rotating Fortnite Item Shop (the in-game store, shown
  read-only) grouped by section, with item art, rarity and V-Bucks prices, plus
  filters (search, rarity, type, price sort). Pulls live from the free public
  [fortnite-api.com](https://fortnite-api.com).
- **Cosmetics (beta)** — a proof-of-concept that browses the newest Fortnite
  cosmetics with a local-only wishlist, trialling cosmetic tracking alongside
  Sprites.
- **News & events** — a feed that auto-detects Fortnite's current live build,
  alongside a curated events layer (Catch-Up Day, Gold & Gummy Hours, and weekly
  Mastery Mondays / Power Hours). (Epic's in-game news is pulled in when they post
  any, but that panel is mostly retired, so the events are the real content.)
  Every item shows
  its **source** and whether it's **official** (Epic) or **unofficial** (with a
  **Tentative** badge for unconfirmed dates), and live events pin to the top. A
  dismissible **announcement bar** highlights the current featured event.
- **Profile page** — manage your gamertag, public/private visibility, sign out,
  and delete your data.
- **Share & export** — set your gamertag and share a read-only public link
  (`?u=<your-id>`); **copy a ready-to-paste Discord/Reddit caption** of your
  progress; or export a **Sprite Locker–style poster** of your collection (or just
  the sprites you still need).
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

- `profiles` — one row per user (`gamertag`, `is_public`, …). Public-readable for
  sharing; owner-writable.
- `sprite_progress` — `(user_id, sprite_id)` with `owned` / `mastered` flags
  (plus dormant `for_trade` / `wanted` columns from the retired trading feature).
  Readable when the owning profile is public (or it's your own); owner-writable.
- `bug_reports` — insert-only feedback backup.

Key RPC: `leaderboard`.

(Retired features left their tables in place, non-destructively: the trading
hub — `trade_posts` / `trade_vouches` and the `find_trade_matches` RPC — and the
old crowd-sourced map — `maps`, `map_shares`, `map_markers`, `map_marker_votes`.
They're unused by the app.)

## Customizing

- Sprite types and which themes each one has: `src/data/sprites.js`
  (`sprite_id`s are derived as `${typeId}_${themeId}`).
- Theme styles & bonuses: `src/data/themes.js` + `src/index.css`.
- Player stats: client `src/lib/statsApi.js` + `src/components/StatsTab.jsx`;
  server-side key proxy `api/stats.js` (needs `FORTNITE_API_KEY` env in Vercel).
- News & events feed: `src/data/news.js`.
- Changelog entries: `src/data/changelog.js`.
