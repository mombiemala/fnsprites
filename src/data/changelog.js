// App changelog / release notes — technical, but written for humans. Newest
// entry first. Each release: a friendly summary, the concrete changes (tagged
// Added / Changed / Fixed / Security), and the *why* behind the bigger calls.
//
// When you ship something notable, add an entry to the TOP of this array.

export const CHANGELOG = [
  {
    date: 'July 6, 2026',
    title: 'What your level actually buys you — per-level ability scaling',
    summary:
      'Your Lv 1–5 dots now mean something concrete: each sprite’s detail view shows how its ability grows toward Lv 5, and highlights the level you’re actually at.',
    changes: [
      { tag: 'Added', text: 'A “⬆ Scales to Lv 5” line on each sprite that spells out how the ability strengthens — e.g. Demon lifesteal ≈10 → ≈30 HP, Ghost cloak ≈3s → ≈5s, Boss up to +25 HP/Shield at Lv 5, and Fishy’s full swim/move-speed curve (25%/10% → 200%/50%). If you own the sprite, it notes “you’re at Lv N/5”.' },
      { tag: 'Added', text: 'A short honesty note that these are community-reported values (Epic doesn’t publish exact per-level numbers).' },
    ],
    why:
      'Competitors list per-level ability values but in a static table; we already track your level 1–5, so tying the two together is the natural win — the tracker can tell you what mastering a sprite actually gets you and how far along you are, in one place. Where exact numbers aren’t public we describe the trend rather than invent figures, keeping with how we treat drop rates.',
  },
  {
    date: 'July 5, 2026',
    title: 'Rumored, not promised — leaked sprites now labelled, with fresh news',
    summary:
      'Followed the leaks to firmer dates and honest labels: anything Epic hasn’t confirmed now wears a “Rumored” tag, Holofoil is dated for every Sprite, and the news feed has the Holofoil and DC Summer drops.',
    changes: [
      { tag: 'Added', text: 'A “Rumored” badge on unconfirmed sprites (Air, Seven, Batman, and the datamined Wick/Drifter/Ice), and the detail view now reads “Ability (rumored):” so leaked powers aren’t mistaken for confirmed ones. The Cube & Quack forms simply read “Bonus not yet revealed” (in amber) rather than a guessed perk — we don’t invent a bonus Epic hasn’t announced.' },
      { tag: 'Added', text: 'Two upcoming events in the news feed, both Tentative: Holofoil Sprites (Jul 9 — a Holofoil for every Sprite, reported +5% squad chance to find rare Sprites) and the leaked DC Summer event (Jul 16 — Batman plus the Air & Seven Sprites).' },
      { tag: 'Changed', text: 'Rolled Holofoil out as a variant of every Sprite (still unreleased) to match the leaked Jul-9 rollout, and gave Air, Seven & Batman their reported abilities/variant lines. Holofoil’s bonus updated to the reported “+5% squad chance to find rare Sprites”.' },
      { tag: 'Added', text: 'Added the Fortnite Wiki as a roster/leak cross-reference source in the footer credits.' },
    ],
    why:
      'The tracker’s whole value is being accurate, so leaked content has to look different from confirmed content — a visible “Rumored” label lets us surface what’s coming (great for planning a hunt) without implying Epic has locked it in. Dates and powers here come from community leaks (an early Nintendo eShop listing for the DC event), which explicitly can change before launch; labelling beats leaving them out.',
  },
  {
    date: 'July 5, 2026',
    title: 'New sprites & forms on the horizon — Air, Seven, Cube, Quack (and a Bat)',
    summary:
      'Getting ahead of the next drop: two new sprites (Air & Seven), two new variant forms (Cube & Quack) rolling out across the whole roster, and a datamined Batman collab — all flagged Unreleased so you can see what’s coming.',
    changes: [
      { tag: 'Added', text: 'Two new sprites — 🌬️ Air (sprint/jump boost, no fall damage) and 7️⃣ Seven (reveals nearby footstep trails) — each ships with the full variant line, from Normal all the way to the new Cube & Quack forms.' },
      { tag: 'Added', text: 'Two new variant forms — Cube (a purple Zero-Point grid) and Quack (duck-gold) — added to every sprite in the roster, each with its in-game bonus listed.' },
      { tag: 'Added', text: 'A datamined 🦇 Batman sprite (DC collab, ~Jul 16) added to the roster.' },
      { tag: 'Added', text: 'Art for all of the above is drawn on the fly by the built-in sprite generator, so every new sprite and form stays perfectly consistent with the existing house style — no missing images.' },
      { tag: 'Changed', text: 'Everything here is clearly marked Unreleased until it goes live, so your “collectible now” counts and completion % are unaffected.' },
    ],
    why:
      'Several sprites and forms are leaking ahead of release. Adding them now — visibly flagged as upcoming — lets players plan their hunt without polluting the real collection math. Because the sprite art is procedural, a new sprite or form is a few lines of data plus a palette, not a pile of hand-drawn images — so the tracker can stay accurate the day a drop lands.',
  },
  {
    date: 'July 5, 2026',
    title: 'One-tap caption for Discord & Reddit',
    summary:
      'A “Copy caption” button that hands you a ready-to-paste brag: your count, percentage, and link — no typing.',
    changes: [
      { tag: 'Added', text: 'In Share & export: “📋 Copy caption for Discord / Reddit” copies a clean summary — e.g. “🧩 My Fortnite sprite collection: 45/61 (74%) · 12 mastered ⭐ … Track & compare yours → <your link>”. Uses your gamertag and share link, and drops to the main site link if your profile is private.' },
    ],
    why:
      'People share collections as text in Discord and on Reddit, not just images. Handing over a formatted one-liner (with your compare link baked in) is how the tracker spreads by word of mouth.',
  },
  {
    date: 'July 5, 2026',
    title: '“Next to chase” — your collection tells you what to grab next',
    summary:
      'A little guide in the sidebar that turns your progress into a to-do list: the rarest sprite you’re missing, the set you’re closest to finishing, and an easy one to grab.',
    changes: [
      { tag: 'Added', text: 'A “🎯 Next to chase” card that reads your own collection and surfaces three targets — Rarest missing (lowest drop rate you don’t own), Finish a set (the sprite you’re one or two variants from completing), and Easiest to grab (the most common miss). Tap any to open it. Shows a “caught them all” note when you’re done.' },
    ],
    why:
      'A checklist tells you what you have; the fun part is deciding what to hunt next. Since we already know every sprite’s rarity, drop rate and which you own, the app can just tell you — no more scrolling the grid to figure out your best next pickup.',
  },
  {
    date: 'July 5, 2026',
    title: 'Backend tuning for scale',
    summary:
      'Behind-the-scenes database optimizations so the app stays fast as more players pile in — nothing changes on your end.',
    changes: [
      { tag: 'Changed', text: 'Optimized how the database checks permissions on every read/write (it now resolves who you are once per query instead of once per row) — a real speedup at scale, with identical access rules.' },
      { tag: 'Changed', text: 'Added covering indexes on the maps, trades, votes and bug-report tables so lookups and cleanups stay quick as data grows.' },
    ],
    why:
      'Speed and correctness both matter as the community grows. These are the standard Postgres/Supabase optimizations, applied with zero change to who can see or do what — pure headroom.',
  },
  {
    date: 'July 5, 2026',
    title: 'Security pass on the community backend',
    summary:
      'A tune-up of the database rules ahead of more players — tightened who can see what, with no change to how the app works for you.',
    changes: [
      { tag: 'Security', text: 'Trade-match suggestions are now scoped strictly to your own account on the server — they can no longer be requested for someone else’s profile.' },
      { tag: 'Security', text: 'Removed an internal rate-limit routine from the public API surface (it only ever ran automatically behind the scenes; the vouch cap is unchanged).' },
      { tag: 'Security', text: 'Audited row-level security across profiles, progress, trades, vouches and maps — confirmed writes stay owner-scoped and the size/rate caps are enforced in the database, not just the app.' },
    ],
    why:
      'As the tracker opens up to more people, the data rules matter more than the UI. This closes a way someone could have peeked at another player’s trade preferences and trims the public surface — while leaving every legitimate feature untouched.',
  },
  {
    date: 'July 5, 2026',
    title: 'Mark a whole theme or rarity owned in one tap',
    summary:
      'Filter to a variant line or a rarity, then claim the whole set at once — no more tapping every card.',
    changes: [
      { tag: 'Added', text: 'A “✓ Mark all shown owned” button above the collection grid marks every released sprite currently shown as owned. Filter to Gold (or Legendary, or a search) and grab the lot; a running “N of M shown owned” count sits beside it.' },
      { tag: 'Added', text: 'When everything shown is already owned, the button flips to “Unmark all shown” (with a confirm). It only ever touches sprites visible under your current filters — never the ones hidden by them.' },
    ],
    why:
      'Marking a big collection one variant at a time is the most tedious part of setup. Reusing the filters you already have means one control covers “a whole theme”, “a whole rarity”, or any search result — with no new UI to learn.',
  },
  {
    date: 'July 5, 2026',
    title: 'Groundwork: room to track more than sprites',
    summary:
      'Quiet plumbing so the tracker can grow beyond sprites whenever Fortnite’s next season brings something new to collect.',
    changes: [
      { tag: 'Added', text: 'Introduced “collection sets” under the hood — Sprites is now the first set, and your saved progress is tagged to it. Nothing changes on screen today.' },
      { tag: 'Changed', text: 'Cloud saves now read and write your progress per collection, so a future collectible can live alongside sprites without touching your sprite data.' },
    ],
    why:
      'Fortnite rotates what you collect every season — sprites are the star now but won’t be forever. This is invisible insurance: it lets us add a new collectible as a simple update instead of a rebuild, while keeping every sprite you’ve already tracked exactly as-is.',
  },
  {
    date: 'July 3, 2026',
    title: 'Events refresh + clear source links',
    summary:
      'The events are current, and every event now shows where its link goes — and whether it’s official — before you leave the app.',
    changes: [
      { tag: 'Added', text: 'Gold & Gummy Hours (Sat, Jul 4): boosted Gold & Gummy Sprite spawns + faster Sprite XP (2–4 PM & 9–11 PM ET). It’s the featured banner and leads the News feed.' },
      { tag: 'Added', text: 'Holofoil Hours (~Jul 11, flagged Tentative) and a Weekly Sprite events entry — Mastery Mondays plus Saturday Power Hours (3:30 & 9:30 PM ET).' },
      { tag: 'Added', text: 'Every news item and announcement now shows its Source, whether it’s official (Epic) or unofficial, and an “opens in a new tab ↗” hint — so you know when a link takes you off-site.' },
    ],
    why:
      'Trust comes from knowing where info comes from. Labeling each event’s source (and flagging unofficial or tentative ones) is more honest than a bare link, and keeps community-sourced items clearly separate from Epic’s own announcements.',
  },
  {
    date: 'July 3, 2026',
    title: 'Set sprite levels right from the grid',
    summary:
      'The 1–5 level control now lives on each owned sprite card too — no need to open the detail view just to level up.',
    changes: [
      { tag: 'Added', text: 'Owned sprite cards show the level dots + a “Lv 3/5” readout (gold at 5). Tap a dot to set the level right there; it stays in sync with the detail modal and your Mastery %.' },
    ],
    why:
      'Levels were only settable inside the sprite modal. Putting the same control on the card lets you level a whole page of sprites at a glance without the extra tap in and out.',
  },
  {
    date: 'July 3, 2026',
    title: 'Clearer sprite levels',
    summary:
      'The 1–5 level dots on each owned variant now spell out the level next to them, so it’s obvious they’re a level control.',
    changes: [
      { tag: 'Changed', text: 'Each owned variant’s level shows a plain “Lv 3/5” readout beside the dots (turning gold as “Lv 5/5 · Mastered” at max) — the clever dot meter stays, now with an unmistakable label.' },
      { tag: 'Changed', text: 'Tapping hint + clearer labels on the dots (“Level 3 of 5 — tap a dot to set”) for discoverability and screen readers.' },
    ],
    why:
      'Levels were fully there, but the bare row of dots didn’t read as a 1–5 control at a glance. A tiny numeric readout makes it self-explanatory without losing the compact dot meter people liked.',
  },
  {
    date: 'July 2, 2026',
    title: 'Fix: page scroll and navigation stuck',
    summary:
      'Squashed a regression where the whole page could become unscrollable — and the header/tabs would seem to vanish — for returning visitors.',
    changes: [
      { tag: 'Fixed', text: 'The first-visit welcome popup was leaking its “lock the background from scrolling” behaviour onto every later visit, even though the popup itself was no longer showing. The page is scrollable again, and the header/nav are reachable.' },
      { tag: 'Fixed', text: 'Closing the welcome popup now reliably restores scrolling in the same session (it previously only restored on a full reload).' },
    ],
    why:
      'The scroll-lock hook that keeps the background still while a dialog is open was running unconditionally inside the always-mounted welcome popup, so it stayed engaged after the popup closed. Scoping the lock to the popup’s open state keeps “no background scroll behind a modal” working while making sure it never bleeds into the normal page — and if you’d reloaded mid-scroll, the frozen viewport could hide the header entirely.',
  },
  {
    date: 'July 1, 2026',
    title: 'Import your collection from a screenshot',
    summary:
      "Skip the tapping — drop in a screenshot of your in-game sprite locker and we’ll pre-check what we recognize, so you only confirm and go.",
    changes: [
      { tag: 'Added', text: 'A “📷 Import from a screenshot” tool on the collection page: upload a locker shot, review the sprites it detects (Normal variant pre-selected, add Gold/Gummy/etc. per sprite), then mark them owned in one tap.' },
      { tag: 'Added', text: 'A search-to-add step for anything the reader misses, so you can top up by hand without leaving the importer.' },
      { tag: 'Security', text: 'Recognition runs entirely in your browser (on-device OCR) — the screenshot never leaves your device or hits our servers.' },
      { tag: 'Changed', text: 'The OCR engine is self-hosted (no third-party CDN) and cached after first use, so the importer works behind strict networks and offline once loaded.' },
    ],
    why:
      "We looked hard at auto-importing from Epic and passed on it — the only route reads Fortnite’s private API and risks players’ accounts. On-device OCR gets most of the “don’t make me type it all in” payoff with zero account or privacy risk — and self-hosting the engine means no reliance on an outside CDN staying up.",
  },
  {
    date: 'July 1, 2026',
    title: 'Trader reputation — vouch for good trades',
    summary:
      "Traded with someone and it went smoothly? Vouch for them. A 👍 count now rides along on every Trade Board post so you can tell trusted collectors at a glance.",
    changes: [
      { tag: 'Added', text: 'A “👍 Vouch” button on trade posts — one vouch per collector, tap again to undo. Their total shows on every post they’ve made, board-wide.' },
      { tag: 'Added', text: 'A short “what vouches mean” note in the Trade Board explainer: community trust, not a guarantee — trade carefully either way.' },
      { tag: 'Security', text: 'Vouches are one-per-pair, can’t be self-given, and are rate-limited (30/day) to keep the signal honest.' },
    ],
    why:
      "Trading is trust with no in-game escrow, so the scariest part is not knowing who’s reliable. A lightweight, hard-to-game reputation lets the community surface its good actors without pretending the app can guarantee anything.",
  },
  {
    date: 'July 1, 2026',
    title: 'Sprite levels, real Mastery % & dust-to-complete',
    summary:
      "Track each sprite's level 1–5 (not just a mastered checkbox), see a true Mastery %, and how much Sprite Dust finishing your collection would cost.",
    changes: [
      { tag: 'Added', text: 'Per-sprite level (1–5) in the detail view — set it with the “Lv” dots; level 5 = mastered, and Owned/Mastered stay in sync automatically.' },
      { tag: 'Added', text: 'A levels-based Mastery % (progress toward maxing every sprite) and a “Dust to complete” estimate — the total Sprite Dust to summon everything you’re still missing.' },
      { tag: 'Fixed', text: 'The sprite detail popup no longer clips its buttons or tooltips on desktop — it’s a touch wider and reserves room for the scrollbar, so nothing hides under it and there’s no stray horizontal scroll.' },
    ],
    why:
      "Other trackers stop at owned/mastered, but finishing a sprite is really a 1→5 climb. Showing level progress and the dust to complete makes the long game legible — and ties two things nobody else connects: levels ↔ dust.",
  },
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
