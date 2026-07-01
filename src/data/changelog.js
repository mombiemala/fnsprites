// App changelog / release notes — technical, but written for humans. Newest
// entry first. Each release: a friendly summary, the concrete changes (tagged
// Added / Changed / Fixed / Security), and the *why* behind the bigger calls.
//
// When you ship something notable, add an entry to the TOP of this array.

export const CHANGELOG = [
  {
    date: 'July 1, 2026',
    title: 'Link previews & a warmer welcome',
    summary:
      "Shared links now unfurl into a proper branded card, and first-time visitors get a quick, friendly rundown.",
    changes: [
      { tag: 'Added', text: 'Rich link previews (Open Graph + Twitter cards) with a custom 1200×630 image — share the tracker to Discord, Twitter, etc. and it shows a title, description and artwork instead of a bare URL.' },
      { tag: 'Added', text: 'A one-time welcome for newcomers explaining how to mark sprites, save your collection, and use the leaderboard, Trade board and map.' },
      { tag: 'Fixed', text: 'Corrected the site description (it still named the removed Cube/Quack themes) and pointed previews at an absolute image URL crawlers can load.' },
    ],
    why:
      "Word of mouth is how a fan app grows — a link that previews nicely gets clicked far more, and a 10-second orientation helps new players get it instead of bouncing.",
  },
  {
    date: 'July 1, 2026',
    title: 'Trade alerts, farming links & dust costs',
    summary:
      "Three collector quality-of-life adds: know when a trade matches you, see where to farm a sprite, and what it costs in Sprite Dust to summon.",
    changes: [
      { tag: 'Added', text: 'Opt-in trade-match alerts — switch them on in the Trade tab and matching posts (they have what you want / want what you offer) surface for you, with a count badge on the Trade tab when new ones appear.' },
      { tag: 'Added', text: '“Where to find” on each sprite — how it’s farmed, with a one-tap jump to the community loot map.' },
      { tag: 'Added', text: 'Estimated Sprite Dust to (re)summon each variant, shown in the sprite detail — a reminder that indexing a trade avoids that cost.' },
      { tag: 'Fixed', text: 'Widened the sprite detail popup and fixed tooltips that were getting cut off, plus the stray horizontal scroll.' },
    ],
    why:
      "Collecting is a loop of find → trade → summon, each with its own friction. Surfacing your matches, farming spots, and dust costs right where you’re already looking cuts the hopping between tabs and wikis.",
  },
  {
    date: 'July 1, 2026',
    title: 'Trade Board — find your trades',
    summary:
      "A new Trade tab to post what you're after and browse other collectors — built around how sprite trading actually works.",
    changes: [
      { tag: 'Added', text: 'A public trade board: post what you want and can offer, choose your method (⇄ full trade or 🔁 indexing), add a contact, and browse/filter everyone else’s posts.' },
      { tag: 'Added', text: 'A short “How indexing works” explainer — the two-game give-and-return that adds a sprite to someone’s index without you losing yours (and saves Sprite Dust vs a full trade).' },
      { tag: 'Added', text: 'A clear safety notice: trades happen in-game between players; the tracker doesn’t facilitate or guarantee them and isn’t responsible for trades or scams. Never share your login or pay real money.' },
      { tag: 'Changed', text: 'Moved the auto match-finder into the Trade tab (“Suggested matches”) so all trading lives in one place.' },
      { tag: 'Fixed', text: 'The sprite detail toggles no longer mention “duplicates” (there aren’t any) — ⇄ now reads as offer-to-trade/index and ♥ as want-to-index, and both prefill your Trade Board post.' },
    ],
    why:
      "Trading is the heart of sprite collecting, but Fortnite has no in-game trade system — people rely on scattered Discords and megathreads. A board that speaks the community’s language (indexing vs full trade) brings that together, honestly framed and safety-first.",
  },
  {
    date: 'July 1, 2026',
    title: 'Live event announcements',
    summary:
      "A dismissible banner up top for live and limited-time events — so you don't miss what's happening in-game right now.",
    changes: [
      { tag: 'Added', text: 'A dismissible announcement bar for current events & important info, date-gated so it only shows while relevant. Dismiss it and it stays gone — just for that notice.' },
    ],
    why:
      "Time-limited moments (catch-up days, double XP, the season finale) are easy to miss. One tidy banner surfaces them and then gets out of your way once you've seen it.",
  },
  {
    date: 'July 1, 2026',
    title: 'Cleaner sprites & a proper collection poster',
    summary:
      "Every sprite now sits on the same consistent backdrop, and the exported collection image got a full redesign into a shareable “locker” poster.",
    changes: [
      { tag: 'Fixed', text: 'Removed the baked-in white/black boxes from 14 sprite variants (the AI-made Gold/Gummy/Galaxy forms) so every sprite is transparent and shows the same per-variant backdrop — no more mismatched backgrounds.' },
      { tag: 'Changed', text: 'Redesigned the exported collection image into a Sprite Locker–style grid: sprite types down the side, variants across the top, each on its own variant colour, with ✓ for owned, 🔒 for unreleased, dashes for N/A, a progress bar and per-row counts.' },
    ],
    why:
      "Consistency is what makes a checklist feel trustworthy and finishable — a uniform backdrop makes every sprite read the same. And a clean, poster-style export is something people actually want to screenshot and share.",
  },
  {
    date: 'July 1, 2026',
    title: 'A profile of your own',
    summary:
      "A proper profile page to manage your identity and data as more players join.",
    changes: [
      { tag: 'Added', text: 'Profile page (⚙ in the header) — edit your gamertag, toggle public/private, see how you signed in, and sign out.' },
      { tag: 'Added', text: 'A “Delete my data” option that clears your progress, maps and profile — your call, any time.' },
    ],
    why:
      "Everyone deserves a clear place to manage their identity and data. We looked hard at linking Epic accounts to auto-import your sprites, but Fortnite doesn’t expose that data to apps in any safe, allowed way — so we chose not to risk anyone’s account, and collections stay tracked manually.",
  },
  {
    date: 'July 1, 2026',
    title: 'Faster first load',
    summary:
      "The app now only loads what you need to start tracking; the Leaderboard, News, Map and pop-up dialogs are fetched the moment you first open them.",
    changes: [
      { tag: 'Changed', text: 'Code-split the heavy tabs (Leaderboard, News, Map) and modals so they no longer weigh down the initial load — the map alone was a big chunk.' },
      { tag: 'Changed', text: 'A brief “Loading…” placeholder appears the first time you open one of those, then it’s cached.' },
    ],
    why:
      "First impressions are a loading bar. Most visitors land on their collection, so everything else can wait until it's actually needed — the page gets interactive sooner, especially on phones and slower connections.",
  },
  {
    date: 'July 1, 2026',
    title: 'Getting ready for more players',
    summary:
      "Some quiet groundwork ahead of sharing the tracker more widely — privacy-friendly analytics and a few guardrails so a bad actor can't spoil the shared map for everyone.",
    changes: [
      { tag: 'Added', text: 'Privacy-friendly, cookieless analytics (Vercel Web Analytics + Speed Insights) — no tracking cookies, no consent banner needed.' },
      { tag: 'Security', text: 'A daily cap of 40 community-map markers per person (your own private maps are unlimited) to blunt flooding, enforced in the database.' },
      { tag: 'Security', text: 'Size limits on bug reports to stop spam payloads.' },
    ],
    why:
      "Opening the doors to more people means planning for the small number who misbehave. Caps and limits live in the database, not just the app, so they hold no matter how someone pokes at it — and cookieless analytics respect players' privacy while still telling us what's useful.",
  },
  {
    date: 'July 1, 2026',
    title: 'The news feed keeps itself current',
    summary:
      "The news tab used to lean on a hand-written list that quietly went stale between patches. Now it auto-pulls what Fortnite is actually running, so 'Update' items keep themselves fresh.",
    changes: [
      { tag: 'Added', text: "Auto-detects Fortnite's current live build (e.g. “Fortnite is live on v41.20”) straight from the public API, updating itself on every patch." },
      { tag: 'Changed', text: 'Official in-game news tiles are pulled live and smart-tagged as Update vs Event; the curated file is now just for editorial “upcoming” items.' },
      { tag: 'Changed', text: 'Live and curated items are merged and de-duplicated by title, so nothing shows twice, and it falls back gracefully to the curated feed if offline.' },
    ],
    why:
      "A news feed that needs manual updates is a news feed that goes stale. Automating the parts a machine can know (the live build, official news) means the only thing left to hand-write is the genuinely editorial stuff — like what's coming next.",
  },
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
