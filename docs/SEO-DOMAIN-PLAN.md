# SEO landing + custom-domain plan

**Status:** draft · July 6, 2026
**Owner:** mombie
**TL;DR:** The product is already ahead of competitors on features — the gap is
**discovery**. Rivals rank because they own keyword domains and ship
crawlable, content-rich pages. We're on `fnsprites.vercel.app` (won't rank) and
render everything client-side (invisible to crawlers). This plan fixes both:
a real domain, crawlable SEO content built from data we already have, and
prerendering so Google can actually read the page.

---

## 1. The problem, concretely

- **Domain:** `fnsprites.vercel.app` has no keyword signal and `*.vercel.app`
  won't rank for competitive terms. Competitors own `spritelocker.com`,
  `spritechecklist.com/.org/.app`, `punksprite.com`, `fnsprites.info` — each a
  literal match for "fortnite sprite checklist/tracker."
- **Rendering:** we're a client-rendered Vite SPA. The initial HTML is an empty
  `<div id="root">` — crawlers see almost no content. Competitors serve static
  HTML with the roster, drop rates and abilities in the markup.
- **No content surface:** we have the richest *data* in the niche (drop rates,
  tiers, per-level scaling, events) but none of it is in crawlable HTML, so it
  earns zero search traffic.

Net: we win once people arrive; almost nobody arrives from search.

---

## 2. Custom domain

Availability + pricing checked via Vercel Domains on July 6, 2026:

| Domain | Status | Price/yr | Notes |
|---|---|---|---|
| `fnsprites.com` | ❌ taken | — | ideal brand match, unavailable |
| `spritetracker.com` | ❌ taken | — | |
| `fortnitespritetracker.com` | ❌ taken | — | |
| **`spritetracker.gg`** | ✅ available | **$129.99** | **Recommended.** Keyword "sprite tracker", no hyphen, `.gg` = the gaming TLD (cf. fortnite.gg). Brandable + SEO. |
| **`sprite-tracker.com`** | ✅ available | **$11.25** | Best value. Exact keyword in a `.com`; the hyphen is the only downside. |
| **`fnsprites.app`** | ✅ available | **$9.99** | Keeps the current "fnsprites" brand; `.app` forces HTTPS. Weak keyword signal. |
| `fnsprites.gg` | ✅ available | $129.99 | brand + gaming TLD |
| `spritedex.gg` | ✅ available | $129.99 | "SpriteDex" brand (Dilly already uses the term) |
| `spritechest.gg` | ✅ available | $129.99 | thematic, in-game term |

**Recommendation**
- **If budget allows (~$130/yr): `spritetracker.gg`** as the primary. It's the
  cleanest keyword+brand combo and the `.gg` reads as *the* Fortnite/gaming
  space.
- **Budget path (~$11): `sprite-tracker.com`** for the exact-match keyword, or
  **`fnsprites.app`** to preserve the existing brand.
- Regardless, **grab `fnsprites.app` ($10) as a cheap brand/redirect** so the
  name we've been sharing resolves.

**Setup (Vercel):**
1. Buy the domain (Vercel Domains, or any registrar → point nameservers/`A`/`CNAME` to Vercel).
2. Add it to the `fnsprites` project → set as the **Production Domain**.
3. **301-redirect** `fnsprites.vercel.app` → the new domain (Vercel does this
   automatically once a custom prod domain is set) so we don't split ranking.
4. Update every hardcoded URL: `og:url`, canonical, sitemap, `manifest`,
   Supabase OAuth redirect allow-list, share-link origin (already derived from
   `window.location`, so those are fine), README.

---

## 3. On-page SEO (P0 — cheap, high leverage)

- **`<title>` / meta description:** target the actual searches. Current title is
  brand-first; make it keyword-first, e.g.
  `Fortnite Sprite Tracker & Checklist — Drop Rates, Tier List & Map`.
- **Canonical tag** on every route; **`<html lang>`** already set.
- **Sitemap.xml + robots.txt** (static, in `/public`). List `/`, and — once we
  build them — per-sprite routes.
- **JSON-LD structured data** in `index.html`:
  - `WebApplication` (name, category Game, price free, screenshot).
  - `FAQPage` for the questions people search ("how many Fortnite sprites are
    there", "rarest sprite", "best sprite / tier list", "all drop rates").
  - Optionally `ItemList` of sprites.
- **OG/Twitter cards** already present — keep, update URLs on domain switch.

## 4. Fix the rendering (P1 — the real unlock)

An SPA that ships an empty root won't rank no matter the domain. Options, in
order of preference:

1. **Prerender static routes at build** with `vite-plugin-prerender` /
   `react-snap` / `puppeteer` postbuild. Generates real HTML for `/` (and later
   per-sprite pages) while keeping the SPA. Lowest disruption to the current
   stack; fits Vercel.
2. **SSR/SSG via a framework** (migrate to Next.js or Astro islands) — most
   powerful, biggest lift. Overkill for now.
3. **Static SEO section in `index.html`** — a `<noscript>`/always-rendered block
   with the roster, tiers and drop rates as plain HTML. Cheapest, ugly, but
   gets *content* in front of crawlers immediately. Good stopgab before (1).

**Recommendation:** ship (3) as a stopgap this week, then (1) for the durable win.

## 5. Content we already have = keyword magnets (P1)

We're sitting on the data these searches want. Expose it as crawlable HTML
(via prerender or a dedicated landing section), each targeting a query cluster:

- **Sprite tier list** (`spritetracker.gg/tier-list`) — we just built the tier
  data; "fortnite sprite tier list" is a high-volume term with strong
  competitors. Render the S/A/B/C list as static HTML.
- **Drop rates table** — "fortnite sprite drop rates / chances." We have them.
- **All sprites & abilities + per-level scaling** — "all fortnite sprites /
  abilities."
- **Events schedule** — "fortnite sprite events / holofoil / gold gummy hours."
  Already curated with dates + sources.
- **FAQ** — count, rarest, how to level, how to extract — feeds the `FAQPage`
  schema.

## 6. Per-sprite pages (P2 — long tail)

`fortnite.gg` ranks partly on per-sprite URLs (`/sprites/33-zero-point-sprite`).
Prerender one page per sprite: `/(sprite)/zero-point` with unique title, meta,
the ability + per-level scaling + tier + drop rate + variants + "where to find,"
and an internal link back to the tracker. ~18 pages now, trivial to template
from existing data, and each targets a low-competition long-tail query.

## 7. Off-page / distribution (ongoing)

- **Google Search Console** + Bing Webmaster: verify the domain, submit the
  sitemap, watch which queries land.
- Seed where the audience already is: r/FortNiteBR, sprite/collector Discords,
  the Fortnite Facebook groups (one already links trackers), a short YouTube/Short
  demo. The **Copy-caption** and **poster export** we shipped are the built-in
  virality hooks — make sure they carry the domain.
- Consider a couple of the cheap keyword domains as **301 redirects** into the
  primary (e.g. `sprite-tracker.com` → `spritetracker.gg`) to catch type-in and
  exact-match traffic.

## 8. Measurement

- Add privacy-friendly analytics goal tracking (we already ship cookieless
  analytics) for: search → landing → first "Have" tap → sign-up.
- Track rankings for the head terms: *fortnite sprite tracker / checklist / tier
  list / drop rates*.

---

## Prioritized roadmap

| Phase | Work | Effort | Payoff |
|---|---|---|---|
| **P0** | Buy domain, set prod + 301, keyword `<title>`/meta, canonical, sitemap/robots, JSON-LD (WebApplication + FAQ) | ~half day | Ranking becomes *possible*; rich snippets |
| **P1** | Prerender `/` + a crawlable SEO content section (tier list, drop rates, abilities, events, FAQ) built from existing data | 1–2 days | The actual traffic unlock |
| **P2** | Per-sprite prerendered pages; redirect secondary domains; GSC-driven iteration | 1–2 days + ongoing | Long-tail + compounding |

**Do-first this week:** buy `spritetracker.gg` (or `sprite-tracker.com` on a
budget), wire it up with the redirect, ship the keyword title/meta + JSON-LD +
sitemap. That alone moves us from "unrankable" to "indexed and competitive,"
and it's a few hours of work on top of a product that already out-features the
field.
