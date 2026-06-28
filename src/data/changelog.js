// App changelog / release notes — technical, but written for humans. Newest
// entry first. Each release: a friendly summary, the concrete changes (tagged
// Added / Changed / Fixed / Security), and the *why* behind the bigger calls.
//
// When you ship something notable, add an entry to the TOP of this array.

export const CHANGELOG = [
  {
    date: 'June 28, 2026',
    title: 'A zoomable map you can actually read',
    summary:
      "The map used to send you to a third-party site to see anything in detail, and the spots were tiny coloured dots. Now you zoom and pan right here, and every spot is a clear symbol.",
    changes: [
      { tag: 'Added', text: '＋/− and double-tap to zoom (up to 5×) and drag to pan — all in-app. No more out-linking just to enlarge.' },
      { tag: 'Changed', text: 'Markers are now symbol badges (📦 chest, ✨ sprite chest, 🎣 fishing, 🪙 gold pond, 🏃 path) on a dark pill with a colour-coded ring — legible at a glance and constant-size at any zoom.' },
      { tag: 'Changed', text: 'Marker state still reads clearly: dashed = unconfirmed, greyed = retired, white halo = selected.' },
    ],
    why:
      "Sending people to another site to see detail is a dead end, and a 3px dot tells you nothing. Owning the zoom and giving each spot a real symbol makes the map useful on its own.",
  },
  {
    date: 'June 28, 2026',
    title: 'A calmer Collection page',
    summary:
      "The Collection tab had grown top-heavy — breakdown, sharing, trading and support cards were pushing the actual sprites way down the page. We rebalanced everything so the sprites come first.",
    changes: [
      { tag: 'Changed', text: 'Sprite grid and a full-width filter bar now sit right under your progress, so you reach the sprites immediately.' },
      { tag: 'Changed', text: 'Breakdown, Share & export, Trading and Support moved into a static sidebar beside the grid (it stacks below on phones); the cards are always open — no collapsing.' },
      { tag: 'Changed', text: 'Reformatted the Support card so the Creator Code and Buy Me a Coffee asks each sit directly above their own button, easy to read.' },
      { tag: 'Fixed', text: 'Shared profile links (?u=…) were a dead end — no nav. The Collection / Leaderboard / News / Map tabs now show there and link you back into the app, plus ?view= deep links.' },
      { tag: 'Added', text: 'This changelog (footer link) and a refreshed project README.' },
    ],
    why:
      "Vertical space is the scarcest thing on a phone. A tracker’s job is to show you sprites, so secondary tools should be one glance to the side — present, but never in the way.",
  },
  {
    date: 'June 28, 2026',
    title: 'Maps: yours, shared, and protected',
    summary:
      "The map became more than one shared pile of pins. You can now keep your own maps, share them with specific friends, and we added real guardrails so a useful spot can’t just vanish.",
    changes: [
      { tag: 'Added', text: 'Personal maps — make your own, keep them private, or share with specific players as viewers or editors.' },
      { tag: 'Added', text: 'Retire a marker: instead of deleting, you can archive a spot (kept for history, hidden from the live map, restorable). Toggle “Show retired” to browse them.' },
      { tag: 'Added', text: 'Move a marker by tapping a new spot — handy for nudging approximate pins to the exact location.' },
      { tag: 'Security', text: 'Confirmed community spots (3+ confirmations) can’t be hard-deleted — only retired. Enough “not here” votes auto-hides a spot. All enforced at the database level (RLS), not just the UI.' },
    ],
    why:
      "Community data only works if people trust it. Letting anyone delete a popular, verified spot would be fragile — so deletion is owner-scoped, popular spots are locked, and the crowd can quietly retire stale ones without destroying the history.",
  },
  {
    date: 'June 28, 2026',
    title: 'Putting chests on the map',
    summary:
      "There’s no open dataset of Fortnite chest coordinates — that data lives behind fortnite.gg. So instead of scraping, we seeded the map from public guides and let the community refine it.",
    changes: [
      { tag: 'Added', text: '29 sprite-chest markers seeded across all 13 Shattered Coast POIs, with counts pulled from community guides (Sinister Strip 4, Wonkeeland 3, …).' },
      { tag: 'Added', text: 'Every marker can carry a source link, and seeded ones show 📋 “from guide” with a dashed outline until players confirm them.' },
      { tag: 'Added', text: 'Submit / confirm / flag spots, with markers fading by confidence so verified spots stand out.' },
      { tag: 'Changed', text: 'POIs are pulled live from the Fortnite map API (auto-updates each season); the map image is self-hosted with an API fallback to dodge rate-limit errors.' },
      { tag: 'Fixed', text: 'Clearer add-a-marker instructions — a persistent tip plus a “tap the map to place it” banner.' },
    ],
    why:
      "Precise loot data is proprietary and a scraper would only return guide prose, not coordinates. Seeding from documented guides (with attribution) and crowd-sourcing the exact spots is the honest, sustainable path that also keeps the community involved.",
  },
  {
    date: 'June 27, 2026',
    title: 'Compare, compete, and feel your saves',
    summary:
      "A batch of social and trust features: see how your collection stacks up against others, and never wonder whether your progress actually saved.",
    changes: [
      { tag: 'Added', text: 'Leaderboard compare — tap a player to see what you both have, what you’re missing, what they’re missing, and what neither of you has (great for spotting trades).' },
      { tag: 'Added', text: 'A floating save-status pill so you can watch changes save to the cloud while you’re deep in the grid.' },
      { tag: 'Added', text: 'Report-a-bug (emails the maker), an About page, a Buy Me a Coffee link, and fuller footer credits.' },
      { tag: 'Fixed', text: 'Surfaced cloud-sync errors instead of failing silently.' },
    ],
    why:
      "Saving worked, but there was no visible confirmation — and invisible success feels like failure. A small, honest status indicator builds trust without nagging.",
  },
  {
    date: 'June 27, 2026',
    title: 'Real art and the missing variants',
    summary:
      "Sprites now use real Epic artwork, and we filled in the variant forms that were missing.",
    changes: [
      { tag: 'Added', text: 'Official Epic sprite images, plus AI-reskinned Gold / Gummy / Galaxy variants for Striker, Fishy, Aura, Boss and Grim Reaper.' },
      { tag: 'Added', text: 'Leaderboard + Flex Score, a Fortnite news feed, and the island map — all under a tabbed nav.' },
      { tag: 'Added', text: 'Trading hub: mark sprites for-trade / wanted, find matches, and export a trade card.' },
      { tag: 'Changed', text: 'A full UX pass — tooltips everywhere, toasts, onboarding hints, sticky filters and accessibility fixes.' },
      { tag: 'Fixed', text: 'Export images now use real sprite thumbnails instead of coloured squares.' },
    ],
    why:
      "Sprites need to be instantly identifiable. Real art (credited to Epic) plus consistent per-variant treatments makes the grid scannable at a glance.",
  },
  {
    date: 'June 26, 2026',
    title: 'Finding the sprites’ look',
    summary:
      "Before the real images, we iterated hard on how to draw sprites that were cute, modern, and unmistakable — and got the underlying data right.",
    changes: [
      { tag: 'Changed', text: 'Art went through several looks — hand-built SVG → retro pixel-art → modern cute characters → real Epic images — chasing “instantly identifiable.”' },
      { tag: 'Fixed', text: 'Corrected the roster, themes and drop rates to be accurate as of June 2026 (including fixing the Rift special theme).' },
      { tag: 'Added', text: 'Foundations: accurate tracking, a detail view, and shareable collection exports.' },
    ],
    why:
      "Getting the data and the visual language right first meant everything built on top — trading, leaderboards, maps — could stay consistent and trustworthy.",
  },
]
