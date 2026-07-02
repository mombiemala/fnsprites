# Handoff — FN Sprite Tracker

A fan-made Fortnite sprite-collection tracker (React 19 + Vite + Tailwind + Supabase).

## Repos & workflow

- **Develop** on branch **`sprite-tracker`** in `mombiemala/hello-portfolio`.
- **Deploy** the public site by pushing that branch to **`mombiemala/fnsprites`** main
  → Vercel auto-builds **fnsprites.vercel.app**:
  ```
  git fetch origin sprite-tracker && git push fnsprites sprite-tracker:main
  ```
  (Deploying needs both repos in scope: `hello-portfolio` for the code, `fnsprites` to publish.)
- **Supabase project ID:** `cjfproobzmqafdojzzsy` (anon key is RLS-protected / safe to expose).
- **Before pushing:** run `npm run lint && npm run build` — both must pass.
- **Changelog is part of finishing a change** — in the *same commit*, update **both**
  `src/data/changelog.js` (in-app) and `CHANGELOG.md` (repo). Full conventions in `CLAUDE.md`.

## Where things live

- Sprites & themes: `src/data/sprites.js`, `src/data/themes.js`, `src/index.css`
- Map layers / community map config: `src/data/mapMarkers.js`
- Changelog data: `src/data/changelog.js`
- Supabase client + maker links: `src/lib/supabase.js`
- Screenshot OCR: `src/lib/spriteOcr.js`; self-hosted OCR assets: `public/tesseract/`

## Recently shipped (committed on `sprite-tracker`; backend live in Supabase)

1. **Sprite modal fix** — widened to `max-w-2xl` + `scrollbar-gutter: stable` so buttons/
   tooltips no longer clip under desktop scrollbars.
2. **Per-sprite levels (0–5)** — `sprite_progress.level` is canonical (owned = level ≥ 1,
   mastered = level ≥ 5); "Lv" dots in the sprite detail; Breakdown card shows a real
   Mastery % and a "Dust to complete" estimate.
3. **Trader reputation (vouches)** — `trade_vouches` table (one per pair, no self-vouch,
   RLS, 30/day rate-limit); `👍 Vouch` on Trade Board posts; `vouches` / `i_vouched` added
   to the `trade_board_list` and `trade_matches_for_me` RPCs.
4. **Screenshot importer** — `📷 Import from a screenshot` on the collection page; in-browser
   OCR (Tesseract.js) matches locker names to the roster; review modal → one `bulkOwn`.
   The image never leaves the device.
5. **Self-hosted OCR engine** — vendored into `public/tesseract/` (~15 MB: worker + LSTM
   wasm cores + `eng` best-int data), no third-party CDN. Service worker serves
   `/tesseract/` cache-first (offline after first use). ESLint ignores `public/tesseract`.

**DB state:** migrations for levels + vouches are already applied to production
(additive / backward-compatible).

## Decisions to respect

- **No Epic auto-import.** The only route uses Fortnite's private API and risks users'
  accounts; deliberately shelved in favor of the on-device screenshot importer.
- Never put the AI model identifier in commits/PRs/code/artifacts.

## Open ideas (not started)

- Bulk "mark a whole theme/rarity owned" quick-add (uses existing `bulkOwn`).
- Items from the competitor-gap list.

## First task after deploy

Verify the live site: confirm the import card, `👍` vouch buttons, `Lv` dots, and the newest
Changelog entries all show on fnsprites.vercel.app.
