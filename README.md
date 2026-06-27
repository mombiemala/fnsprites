# FN Sprite Tracker

A fan-made Fortnite **sprite tracker** — track every sprite across all of its
variants (Normal, Gold, Gummy, Galaxy, Gem, Holofoil, plus the special Cube &
Quack lines), see your collection and mastery progress, save it to the cloud,
and share your collection with your gamertag. Roster is accurate to the
**Jun 25, 2026 update**.

> Not affiliated with Epic Games. Support the maker with **Creator Code: MOMBIE**
> in the Fortnite Item Shop. #EpicPartner

## Features

- **Accurate roster** — every released sprite & variant as of Jun 25, 2026
  (incl. Striker, Fishy, Aura, Boss, Grim Reaper); upcoming/datamined sprites
  are clearly flagged **unreleased**.
- **Official sprite art** — each variant uses the real in-game sprite image
  (`public/sprites/<id>.png`). **Sprite images are © Epic Games, Inc.**, used
  here for identification only and sourced from
  [UltronCore/sprite-tracker](https://github.com/UltronCore/sprite-tracker).
  A generated SVG fallback covers any missing image.
- **Drop rates** shown per sprite (community-datamined estimates; Epic does not
  publish official numbers).
- **Track ownership & mastery** with one tap — works instantly as a guest
  (saved in your browser); syncs to the cloud when you log in.
- **Sprite detail view** — tap any sprite for rarity, drop rate, ability, and
  every variant with its in-game **bonus** (e.g. Gummy = +10% Sprite Dust).
- **Share your collection** — set your gamertag and share a read-only public
  link (`?u=<your-id>`).
- **Export images** — generate a shareable **collection mosaic** or a
  **missing-sprites** image (great for trades).
- **Filter, search & group** — by theme, rarity, ownership; hide mastered, show
  unreleased; group by theme / rarity / sprite. Theme chips show owned/total.
- **Progress bars** for overall Collection % and Mastery %.

## Sprite data & credits

Roster and variant data were cross-referenced from public community resources,
with thanks:

- [fortnite.gg/sprites](https://fortnite.gg/sprites) and
  [spritelocker.com](https://spritelocker.com/)
- [UltronCore/sprite-tracker](https://github.com/UltronCore/sprite-tracker) —
  Have/Missing/Mastered model and shareable trade-image export inspiration
- [MRSessions/fn-sprite-checklist](https://github.com/MRSessions/fn-sprite-checklist)
- [staticvacant/fnsprites](https://staticvacant.github.io/fnsprites/) — original
  inspiration; [dillyapp.gg/sprites](https://dillyapp.gg/sprites) for UX ideas

All sprite art in this repo is original SVG; no game assets are bundled.

## Tech

- React 19 + Vite + Tailwind CSS
- [Supabase](https://supabase.com) for authentication and per-user tracking
  storage (Postgres + Row Level Security)

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

Database schema (applied via migration):

- `profiles` — one row per user: `gamertag`, `is_public`, etc. Public-readable
  for sharing; only the owner can edit.
- `sprite_progress` — `(user_id, sprite_id)` with `owned` / `mastered` flags.
  Readable when the owning profile is public (or it's your own); owner-writable.

## Customizing the sprite list

Sprite types and which themes each one has live in `src/data/sprites.js`; the
theme styles live in `src/data/themes.js` + `src/index.css`. Add or edit entries
there — `sprite_id`s are derived as `${typeId}_${themeId}`.
