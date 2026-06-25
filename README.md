# FN Sprite Tracker

A fan-made Fortnite **sprite tracker** — track every sprite type across all of
its themes (Basic, Gold, Gummy, Galaxy, Gem, Holofoil, Rift), see your
collection and mastery progress, save it to the cloud, and share your collection
with your gamertag.

> Not affiliated with Epic Games. Support the maker with **Creator Code: MOMBIE**
> in the Fortnite Item Shop. #EpicPartner

## Features

- **Browse every sprite** across all theme variants with stylized, theme-accurate
  art (gold shine, galaxy starfield, holofoil rainbow, gem facets, rift energy…).
- **Track ownership & mastery** with one tap — works instantly as a guest
  (saved in your browser).
- **Log in to save** — create an account to sync your collection to the cloud
  and across devices. Guest progress merges in automatically on first login.
- **Share your collection** — set your gamertag and share a read-only public
  link (`?u=<your-id>`) so others can see what you've collected.
- **Filter & search** — by theme, rarity, ownership, hide mastered, show
  unreleased, and group by theme.
- **Progress bars** for overall Collection % and Mastery %.

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
