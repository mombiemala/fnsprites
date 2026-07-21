# Project conventions — FN Sprite Tracker

## Changelog: keep it current as we ship (standing habit)

Whenever a change ships that is **user-facing or otherwise notable** (a feature,
a meaningful UX/layout change, a fix players would notice, a schema/security
change), updating the changelog is **part of finishing that change** — not a
follow-up. Do it in the same commit as the change, before pushing.

Update **both**, kept in sync:

1. `src/data/changelog.js` — the in-app changelog (footer → **Changelog**).
2. `CHANGELOG.md` — the repo/developer-facing version.

Entry style (technical, but humanized):

- Add to the **top** (newest first). Group related work into one entry with a
  friendly `title` and a short human `summary`.
- List concrete `changes` tagged **Added / Changed / Fixed / Security**.
- Include a **`why`** capturing the reasoning/decision behind the bigger calls —
  this is the point of the changelog, not just *what* but *why*.
- Match the date format already in the files (e.g. `June 28, 2026`).

**Skip** changelog entries for trivial/internal-only churn (typos, lint-only
tweaks, comment changes, dependency bumps with no user effect). When unsure
whether something is "notable," lean toward adding a brief entry.

Don't wait to be asked — if a turn ships notable work without a changelog
update, that turn isn't done.

## Where things live

- Sprites & themes: `src/data/sprites.js`, `src/data/themes.js`, `src/index.css`
- Changelog data: `src/data/changelog.js`
- Supabase client + maker links (Creator Code, Buy Me a Coffee, report email):
  `src/lib/supabase.js`
- Player stats: client `src/lib/statsApi.js` + `src/components/StatsTab.jsx`,
  server-side key proxy `api/stats.js` (needs `FORTNITE_API_KEY` env in Vercel).

## Before pushing

Run `npm run lint && npm run build` — both must pass. Develop on the
`sprite-tracker` branch; the public deploy repo is `mombiemala/fnsprites`.
