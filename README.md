# FN Sprite Tracker

A fan-made Fortnite **sprite tracker** — track every sprite across all of its
variants (Normal, Gold, Gummy, Galaxy, Gem, Holofoil, and the special **Rift**
line), see your collection and mastery progress, save it to the cloud, compare
with other players, trade, and explore a community-built loot map. Roster is
accurate to the **Jun 25, 2026 update**.

> Not affiliated with Epic Games. Support the maker with **Creator Code: MOMBIE**
> in the Fortnite Item Shop. #EpicPartner

## Features

- **Accurate roster** — every released sprite & variant as of Jun 25, 2026
  (incl. Striker, Fishy, Aura, Boss, Grim Reaper); upcoming/datamined sprites are
  clearly flagged **unreleased**.
- **Real sprite art** — each variant uses the real in-game image
  (`public/sprites/<id>.png`). **Sprite images are © Epic Games, Inc.**, used for
  identification only and sourced from
  [UltronCore/sprite-tracker](https://github.com/UltronCore/sprite-tracker);
  variant forms UltronCore lacks were AI-reskinned (Google Gemini) from those
  base images. A generated SVG fallback covers any missing image.
- **Track ownership & mastery** with one tap — works instantly as a guest
  (saved in your browser) and syncs to the cloud when you log in, with a live
  save-status indicator.
- **Drop rates** per sprite (community-datamined estimates; Epic publishes none).
- **Sprite detail view** — rarity, drop rate, ability, and every variant with its
  in-game **bonus** (e.g. Gummy = +10% Sprite Dust).
- **Leaderboard & Flex Score** — a rarity-weighted ranking of public
  collections, plus a **compare** view (what you both have / each are missing).
- **Trading hub** — mark sprites for-trade / wanted, find matches with other
  players, and export a trade card.
- **Community loot map** — submit/confirm/flag sprite-chest, fishing and pond
  spots; sprite-chest locations are **seeded from public guides** (with source
  attribution) and refined by the community. Make **personal or shared maps**,
  reposition markers, and **retire** spots for history. POIs are pulled live.
- **News feed** — official patch notes and upcoming/datamined updates.
- **Share your collection** — set your gamertag and share a read-only public link
  (`?u=<your-id>`); **export** a collection mosaic or missing-sprites image.
- **Filter, search & group** — by theme, rarity, ownership; hide mastered, show
  unreleased; group by theme / rarity / sprite. Filters collapse on mobile.
- **Progress & breakdown** — overall Collection % and Mastery %, per-rarity and
  per-theme breakdown, and completion badges.
- **PWA** — installable, works offline. **Google sign-in** + email auth.
- **Report a bug**, **About**, **Changelog**, and **Buy Me a Coffee** in the
  footer.

## Changelog

Release notes — technical, but written for humans, with the reasoning behind the
bigger decisions — live in [`CHANGELOG.md`](./CHANGELOG.md) and in-app via the
**Changelog** link in the footer (`src/data/changelog.js`). Keep the two in sync
when shipping.

## Credits

Sprite art is © Epic Games, Inc., used for identification only. With thanks to:

- [UltronCore/sprite-tracker](https://github.com/UltronCore/sprite-tracker) —
  official base sprite images & the Have/Missing/Mastered model
- [fortnite.gg/sprites](https://fortnite.gg/sprites) — roster, themes & drop-rate
  cross-reference, and the interactive map
- [staticvacant/fnsprites](https://staticvacant.github.io/fnsprites/) — the
  original tracker that inspired this
- News via official patch notes & [fortnite-api.com](https://fortnite-api.com)
  (also the map image & live POIs)
- Sprite-chest map locations seeded from community guides
  ([gamingpromax](https://gamingpromax.com/fortnite-sprite-chest-locations/),
  [beebom](https://beebom.com/fortnite-sprite-chest-locations/))

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

Database schema (applied via migrations):

- `profiles` — one row per user (`gamertag`, `is_public`, …). Public-readable for
  sharing; owner-writable.
- `sprite_progress` — `(user_id, sprite_id)` with `owned` / `mastered` /
  `for_trade` / `wanted` flags. Readable when the owning profile is public (or
  it's your own); owner-writable.
- `bug_reports` — insert-only feedback backup.
- `maps` / `map_shares` — map containers (community / private / shared) and
  per-user sharing (viewer / editor).
- `map_markers` / `map_marker_votes` — community loot markers and confirm/flag
  votes. Confirmed community spots can be retired but not hard-deleted (enforced
  by a trigger); access via RPCs and RLS helper functions.

Key RPCs: `leaderboard`, `find_trade_matches`, `maps_list`, `map_markers_list`,
`map_shares_list`.

## Customizing

- Sprite types and which themes each one has: `src/data/sprites.js`
  (`sprite_id`s are derived as `${typeId}_${themeId}`).
- Theme styles & bonuses: `src/data/themes.js` + `src/index.css`.
- Map layers & the seeded-from-guides community map: `src/data/mapMarkers.js`.
- Changelog entries: `src/data/changelog.js`.
