// App changelog / release notes — technical, but written for humans. Newest
// entry first. Each release: a friendly summary, the concrete changes (tagged
// Added / Changed / Fixed / Security), and the *why* behind the bigger calls.
//
// When you ship something notable, add an entry to the TOP of this array.
//
// This in-app list is capped to a recent window (~60 entries) to keep the bundle
// small — the COMPLETE history lives in CHANGELOG.md (and git). When this grows
// past ~80 entries, trim the oldest ones here; they stay in CHANGELOG.md.

export const CHANGELOG = [
  {
    date: 'October 10, 2026',
    title: 'Fixed the duplicated event notice at the top of the page',
    changes: [
      { tag: 'Fixed', text: 'When a Power Hours (or similar) event was both announced in the banner and shown as the live/next event just below it, the top card repeated the same event name and description twice. Announcements now link to their event (via an `eventId`), and the banner is hidden while that event is the one already shown live/next — so each event appears once, in the richer live row (with its LIVE badge and countdown).' },
    ],
    summary: 'The top-of-page card no longer shows the same event twice (announcement banner + live-event row) — it keeps the one with the LIVE badge and countdown.',
    why: 'The announcement bar and the live-event row were both describing the current Power Hours, so the card read as duplicated. Linking a banner to its event and suppressing the redundant copy keeps the card tight without losing any info.',
  },
  {
    date: 'October 10, 2026',
    title: 'Fixed cut-off variant descriptions in the Sprite detail popup',
    changes: [
      { tag: 'Fixed', text: 'In a Sprite’s detail popup, each variant’s description (its in-game bonus/finish note) was clipped to one line with a “…”, hiding most of the text — e.g. the Cheat Master and Loot Hacker finish explanations. The description now wraps and shows in full.' },
    ],
    summary: 'Variant bonus descriptions in the detail popup no longer get cut off with “…” — they wrap and show the full text.',
    why: 'The row used a single-line truncate, which made longer finish descriptions (how a finish is unlocked, what bonus it gives) unreadable. Letting them wrap is a tiny layout cost for information players actually need when deciding what to chase.',
  },
  {
    date: 'October 9, 2026',
    title: 'Fixed the Dumpster Dive “where to find” tip',
    changes: [
      { tag: 'Fixed', text: 'Corrected the Dumpster Dive Sprite’s farming tip — it previously said to “check spots with dumpsters,” but you can’t actually get it by diving into dumpsters. It’s not tied to a POI: it comes from Pumpkin / rare chests, Cheat Codes, or eliminating opponents & bosses carrying it, with the richest rare chests in the Vaults (Stone Sanctum & the Mega Maze landmark). Also verified our current-season POI names (Stone Sanctum, Wonkeeland, Cluster Coast) are correct against the authoritative map sources.' },
    ],
    summary: 'Fixed misleading “dive into dumpsters” advice on the Dumpster Dive Sprite and confirmed our spawn-location POI names are accurate.',
    why: 'The old tip sent players hunting dumpsters for a Sprite that doesn’t drop that way — a small but real time-waster. While verifying, a community map used different POI spellings (Stoic Sanctum / Wonikeeland / Cluster), but reputable guides confirm ours (Stone Sanctum / Wonkeeland / Cluster Coast) are the correct names, so no rename was needed.',
  },
  {
    date: 'October 9, 2026',
    title: 'Spooky Dash Power Hours added (Sat, Oct 10)',
    changes: [
      { tag: 'Added', text: 'Epic confirmed Spooky Dash Power Hours for Saturday Oct 10 — the Island’s spookiest Sprites spawn in bigger numbers with extra Pumpkin Chests, in the usual two 2-hour windows (2–4 PM & 9–11 PM ET). Added both windows to the events so the home-card countdown and LIVE badge light up, plus a dated announcement bar and a news entry.' },
    ],
    summary: 'Wired up Saturday’s Spooky Dash Power Hours (Oct 10) so the tracker counts down to it and flags it live during both windows — the best time to farm the Fortnitemares Sprites you’re missing.',
    why: 'Epic’s own Battle Royale page lists the event, so it goes in as confirmed — the data-driven top card and announcement bar handle the rest automatically. No boosted-finish shortcut here: this Power Hours boosts specific Fortnitemares Sprites (Spooky Dash & co.), not a cosmetic finish, so there’s no “Farm my missing <finish>” filter to attach.',
  },
  {
    date: 'October 8, 2026',
    title: 'Trick-or-Treat finish is live — all 24 Sprites',
    changes: [
      { tag: 'Added', text: 'The Trick-or-Treat (Fortnitemares) finish is now live across the whole roster — every Sprite has its spooky Trick-or-Treat variant, up from just the Crown. It unlocked with today’s (Oct 8) daily reset, so the finish now reads as released everywhere: the grid, the finish filter, the detail pages, the per-Sprite SEO pages and the released-variant count (now 263).' },
      { tag: 'Changed', text: 'No stale “drops Oct 8 / upcoming” copy got left behind — the finish was date-gated to flip on its own today, so the news feed, the Fortnitemares pages and the “coming up” feed all treat Trick-or-Treat as out rather than incoming.' },
    ],
    summary: 'The Trick-or-Treat Halloween finish went live today (Oct 8) across all 24 Sprites — it now shows as released everywhere, and the released-variant count ticked up to 263.',
    why: 'We date-gated Trick-or-Treat to auto-release on Oct 8 (rather than hand-flipping each variant) precisely so the site would be accurate the moment the finish dropped, with no scramble. Today it flipped on its own — this entry records that it’s now genuinely live, not a leak. No brand-new Sprite characters dropped today; the next new Sprites (Honey & Obsession) are tracked as ~Oct 15.',
  },
  {
    date: 'October 5, 2026',
    title: 'Mastery Monday is live · Trick-or-Treat now fully gated to Oct 8',
    changes: [
      { tag: 'Added', text: 'Mastery Monday (Mon Oct 5) is live — 2× Sprite XP & 2× Sprite Dust from extractions, boosted Legendary/Mythic spawns, and extra Portable Extractors, for 24 hours. It shows on the top card’s event countdown.' },
      { tag: 'Fixed', text: 'The Trick-or-Treat Crown is no longer shown as released. The whole Trick-or-Treat finish (all 24 Sprites) now reads as dropping Oct 8. The Crown’s version is technically reachable earlier only through the Crown Victory-Royale chain (winning with the Bounty Hunter Crown) — a niche progression unlock, not the general drop — so it’s no longer flagged live ahead of the Oct 8 rollout.' },
    ],
    summary: 'Added today’s Mastery Monday to the events, and stopped showing the Trick-or-Treat Crown as released — the whole finish now reads as Oct 8.',
    why: 'Marking the T-o-T Crown “live” overstated availability: it’s only reachable through the multi-win Crown chain, not the general drop, so players saw a finish that effectively isn’t out yet. Treating all 24 as the Oct 8 rollout is clearer and matches what’s actually obtainable.',
  },
  {
    date: 'October 4, 2026',
    title: 'Refreshed FAQs & info for the current season',
    changes: [
      { tag: 'Fixed', text: 'Updated the Bounty Hunter FAQ — the finish is now live across the whole roster (since Sep 24), not “only the Crown, rest coming weeks.” Fixed the Fortnitemares pages to show the Trick-or-Treat finish as Crown-only for now with the rest arriving Oct 8 (they previously said it was live across all 24), added that Oct 8 drop to the “coming up” feed, and corrected Pond’s entry (its Bounty Hunter finish is live). Also reworded the “best Sprite” answer around the current Override meta instead of last season’s.' },
      { tag: 'Changed', text: 'Past-season sprites no longer show a Sprite Dust re-summon cost — Dust is a per-season currency that resets, so last season’s Dust prices don’t apply to archived Sprites. The detail popup drops the dust badges and the info pages drop the dust stat/FAQ for them.' },
    ],
    summary: 'Brought the FAQs and info up to date for Season 4 (Bounty Hunter fully live, Trick-or-Treat Oct 8 timing), and stopped showing Dust costs on archived past-season Sprites.',
    why: 'Stale answers (Bounty Hunter “still rolling out,” Trick-or-Treat “live across 24”) misstate what you can actually get right now, and showing a Dust re-summon price on Sprites you can’t obtain — with a currency that resets each season — is misleading. Keeping the current-season facts accurate is the whole point of the tracker.',
  },
  {
    date: 'October 4, 2026',
    title: 'Archived (past-season) sprites now read as historical',
    changes: [
      { tag: 'Changed', text: 'Past-season Season 3 “Runners” Sprites are archived — kept in your collection & Sprite Garden but no longer obtainable in Battle Royale — so their drop rate and “where to find” no longer apply. The detail popup now hides the live drop-rate chip and swaps the location line for an “Archived” note on those Sprites, and their info pages phrase the old drop rate in the past tense (“originally dropped at ~X”) instead of as a current stat.' },
    ],
    summary: 'Reframed archived past-season Sprites as historical — no live drop rate / location, past-tense wording.',
    why: 'Those Sprites can’t be chased anymore, so presenting a current drop rate and farm location was misleading. Keeping them collectible but clearly archived (with the rarity data shown as history) is accurate without hiding the roster.',
  },
  {
    date: 'October 4, 2026',
    title: 'Trick-or-Treat: only the Crown is live yet (rest drop Oct 8)',
    changes: [
      { tag: 'Fixed', text: 'Corrected the Trick-or-Treat finish availability: only the Trick-or-Treat Crown is obtainable right now (it went live Oct 1, auto-granted to anyone who mastered the Bounty Hunter Crown). The other 23 Trick-or-Treat variants were showing as available too early — they’re datamined but don’t actually drop until Oct 8. They’re now gated to auto-release on that date.' },
    ],
    summary: 'Gated the Trick-or-Treat finish to its real timing — only the Crown is live now; the rest auto-release Oct 8.',
    why: 'Multiple trackers (Vice, Sprite Checklist, The Click) confirm only the T-o-T Crown dropped with Fortnitemares on Oct 1, and the full 24-variant roster lands Oct 8. Showing them all as obtainable now would send players chasing Sprites they can’t get yet, so they’re date-gated to flip automatically on the 8th.',
  },
  {
    date: 'October 4, 2026',
    title: 'Corrected the Zero Point base drop rate',
    changes: [
      { tag: 'Fixed', text: 'Zero Point’s base (Normal) Sprite-Chest drop rate now reads ~0.03% (about 1 in 3,317), matching the current community consensus — it was previously showing a much lower figure (0.00034%) that actually belongs to its ultra-rare variants. Grim Reaper (~0.000098%) is still the single rarest Sprite. The other drop-rate figures and the rarity-tier bases were verified correct.' },
    ],
    summary: 'Fixed Zero Point’s base drop rate to ~0.03% (was 0.00034%, a variant-tier figure).',
    why: 'Drop rate feeds the Rarest-Sprites ranking and the chest-odds calculator, so a base rate off by ~88× distorts both. Current trackers (thespike, allthings.how, spritechecklist) consistently cite ~0.03% / “1 in 3,317” for the base Normal — the sub-0.0001% numbers are the Gem/Cube/Gummy/Gold variants.',
  },
  {
    date: 'October 4, 2026',
    title: 'Corrected six sprite rarities',
    changes: [
      { tag: 'Fixed', text: 'Fixed the rarity on six Override Sprites after cross-checking current guides: X-Ray, Blinky and Crash Bandicoot are Legendary (were marked Epic); Mega Man, Onigiri and Overshield are Rare (were marked Epic). Rarity drives the rarity badge, the Rarest-Sprites list and the implied chest drop rate, so these now read correctly.' },
    ],
    summary: 'Corrected six Override sprite rarities (X-Ray/Blinky/Crash → Legendary; Mega Man/Onigiri/Overshield → Rare).',
    why: 'Rarity sets a Sprite’s chest drop-rate tier (Rare 8.73% · Epic 5.22% · Legendary 2.436%) and how it’s ranked, so a wrong tier misleads planning. Multiple reputable trackers (allthings.how, igeeksblog, Beebom, Insider Gaming) agree on these — e.g. X-Ray needs Gold cheat codes (Legendary), while Mega Man/Onigiri/Overshield come from blue codes (Rare).',
  },
  {
    date: 'October 3, 2026',
    title: 'Filled in the missing Override sprite abilities',
    changes: [
      { tag: 'Added', text: 'Documented the in-game ability for the Override Sprites that previously read “not documented yet”: Sonic (sprint speed), Bush Ranger (wraps you in a Bush for cover — and after an elim at max level), 8-Bit Blaster (an 8-Bit Shotgun with a score multiplier in your first Chest), Onigiri (Overdrive after a consumable, scaling per level), Mega Man (less friction sliding/swimming, so you go farther), and Overshield (bonus Overshield that scales each level).' },
    ],
    summary: 'Added the real in-game abilities for six Override Sprites that were previously marked “not documented.”',
    why: 'These abilities were confirmed by multiple guides (GameSpot, GameRant and others) — and Mega Man’s matches our internal “ImprovedSlide” codename, a good cross-check. Players judge which Sprites to chase by their effect, so leaving six blank left real gaps on the sprite pages.',
  },
  {
    date: 'October 3, 2026',
    title: 'Fixed the “more filters” menu getting cut off on phones',
    changes: [
      { tag: 'Fixed', text: 'The advanced-filters (⚙) menu on the collection — Ownership, Rarity, Group by, Hide mastered, Show unreleased — could open half-off the screen edge on mobile, cutting off its options. It now stays fully on-screen at every width.' },
    ],
    summary: 'Fixed the ⚙ advanced-filters menu opening partly off-screen on phones.',
    why: 'The menu was anchored to the gear button, but the toolbar wraps on mobile so the gear lands at a different spot depending on width — anchoring to it pushed the panel off the left edge (or the right, on other widths). Anchoring it to the full-width filter row instead keeps it on-screen no matter where the gear wraps.',
  },
  {
    date: 'October 2, 2026',
    title: 'Fixed the Lobby Hacks page scrolling sideways on phones',
    changes: [
      { tag: 'Fixed', text: 'On mobile, the Lobby Hacks / Admin Panel codes page could be swiped far to the right — the code list blew out to several times the screen width. The two-column layout now collapses cleanly to one readable column on phones.' },
      { tag: 'Changed', text: 'Code titles now wrap to show the full reward on every screen instead of being cut off with a “…”. On desktop that means long entries (e.g. the Geno story-quest Dust codes, the Fortnitemares lobby transforms) are fully readable; on mobile you can finally tell which Sprite each Cheatmaster code unlocks.' },
    ],
    summary: 'Fixed a horizontal-scroll bug on the Lobby Hacks page on phones, and let code titles wrap in full instead of truncating.',
    why: 'The code grid used an implicit single track on mobile; because grid items don’t shrink below their content and the titles were set to never wrap, one long title forced the whole page ~5× wider than the screen. Pinning the mobile layout to `grid-cols-1` (a `minmax(0,1fr)` track) lets it shrink to the viewport, and switching titles from clip-to-ellipsis to wrapping makes the full reward readable everywhere.',
  },
  {
    date: 'October 2, 2026',
    title: 'Fixed the invisible “Start tracking” button on guide pages',
    changes: [
      { tag: 'Fixed', text: 'The gold “Start tracking your collection” call-to-action in the sidebar of the guide/SEO pages was rendering invisible (dark text on a dark card) — a CSS ordering bug where the generic card style overrode its gradient. It now shows as the intended gold button.' },
    ],
    summary: 'Fixed the sidebar “Start tracking” CTA on prerendered pages rendering invisible (dark-on-dark).',
    why: 'A `.card` rule defined after `.ctacard` overrode its gradient background (same specificity, later wins), so the button lost its fill and its dark text disappeared. Scoping the rule to `.card.ctacard` restores the gradient everywhere it’s used.',
  },
  {
    date: 'October 2, 2026',
    title: 'Bounty Hunter Power Hours this weekend (Sat Oct 3)',
    changes: [
      { tag: 'Added', text: 'Added the confirmed Bounty Hunter Power Hours on Sat Oct 3 — Bounty Hunter-finish Sprites are rate-boosted in two 2-hour windows (2–4 PM & 9–11 PM ET); everyone drops with Dual Fiend Hunters, and 1-Up Tokens & Portable Extractors can drop from chests. The top card’s “Farm my missing Bounty Hunter Sprites” shortcut lights up during the event, with a heads-up banner.' },
    ],
    summary: 'Added the Sat Oct 3 Bounty Hunter Power Hours (finish rate-up, two windows) with a live banner and the farm shortcut.',
    why: 'Power Hours are the best time to fill in a specific finish; surfacing the dated Bounty Hunter window (with the one-tap “farm my missing” filter) helps players use it. (Corrected from an initial “Golden” label — The Click + FortniteFNLK confirm it’s the Bounty Hunter finish.)',
  },
  {
    date: 'October 2, 2026',
    title: 'Finishes guide + branded share images site-wide',
    changes: [
      { tag: 'Added', text: 'A “Finishes explained” guide — every Sprite finish (Normal, Gold, Cheat Master, Loot Hacker, Bounty Hunter, Trick-or-Treat, plus the older Gummy/Galaxy/Gem/Holofoil/Cube/Quack), what bonus each gives, and how to get it.' },
      { tag: 'Changed', text: 'Every page now generates its own branded share/preview image (title-specific) instead of the generic logo, so any link you share shows what the page actually is.' },
    ],
    summary: 'Added a Sprite-finishes guide and gave every page its own title-specific social share image.',
    why: 'Finishes are a core part of collecting but weren’t explained anywhere in one place, and per-page share cards help every page spread when linked — both deepen the site and help it get found.',
  },
  {
    date: 'October 2, 2026',
    title: 'New guide: how to find & farm Cheat Codes',
    changes: [
      { tag: 'Added', text: 'A guide to the in-world Cheat Codes — the fastest way to collect Override Sprites: what they are (and how they differ from Lobby Hack codes), where they spawn, the densest POIs, and the two settings (Visualize Sound Effects + a Cheat Code Locator) that make hunting quick.' },
    ],
    summary: 'Added a Cheat Codes farming guide for collecting Override Sprites in-match.',
    why: 'Finding Cheat Codes is the core Override collecting loop, and “Fortnite cheat codes” is a high-intent search — a dedicated, clearly-distinct-from-Lobby-Hacks guide helps players and brings in traffic.',
  },
  {
    date: 'October 2, 2026',
    title: 'Decluttered the collection sidebar',
    changes: [
      { tag: 'Changed', text: 'The sidebar now leads with your progress (collection %, mastery, Dust) instead of a ten-card stack, and the Next-to-chase, Upcoming, Season countdown and Loot Hacks cards are folded into a single tabbed “What’s next” card. Ten cards become about five focused blocks — far less scrolling to reach what matters.' },
    ],
    summary: 'Rebuilt the collection sidebar: progress first, and four reference cards combined into one tabbed card.',
    why: 'The sidebar had grown to ~10 stacked cards, so your progress competed with support banners and reference info. Leading with progress and tabbing the “what’s next” cards (per the mockup) keeps everything one tap away without the long scroll.',
  },
  {
    date: 'October 2, 2026',
    title: 'Share images for guides + accessibility polish',
    changes: [
      { tag: 'Added', text: 'The guide pages now generate their own branded share/preview images, so links to them look sharp when posted on Discord, Reddit or socials (instead of the generic site image).' },
      { tag: 'Changed', text: 'Accessibility: added a clear keyboard-focus ring across the app (shown only for keyboard users), and made Sprite images read their finish to screen readers (e.g. “Jonesy Sprite, Gold finish”) so same-named variants are distinguishable.' },
    ],
    summary: 'Per-guide social share images, plus a keyboard-focus ring and richer image labels for accessibility.',
    why: 'Good share previews help the guides spread (and bring the traffic that matters for a content site), and the focus ring + descriptive image labels make the app usable by keyboard and screen-reader users.',
  },
  {
    date: 'October 2, 2026',
    title: 'New beginner’s guide: “What are Fortnite Sprites?”',
    changes: [
      { tag: 'Added', text: 'A start-here guide for newcomers — what Sprites do, how to get your first one, the “extract it or lose it” rule, what the finishes mean, how leveling & mastery work, and the common beginner mistakes. Linked from the Guides hub.' },
    ],
    summary: 'Added a beginner “What are Fortnite Sprites?” guide for people new to the system.',
    why: 'The reference pages assume you already know the basics; a plain-English on-ramp helps new players (and brings in top-of-funnel search traffic) without duplicating the FAQ or the how-to pages.',
  },
  {
    date: 'October 2, 2026',
    title: 'New Terms page + a Sprite leveling & mastery guide',
    changes: [
      { tag: 'Added', text: 'A Terms of Use page (linked in the footer alongside Privacy) — plain-English terms for a free fan tool: the service, your account & content, acceptable use, Epic Games trademarks, disclaimers and contact.' },
      { tag: 'Added', text: 'A new guide: “Sprite leveling & mastery” — how level points work (and the fastest way to earn them), how to actually master a Sprite (extract at Lv 5), the Mastery Monday 2× window, the free Quack milestone finishes, and the extraction mistakes that lose you a Sprite.' },
    ],
    summary: 'Added a Terms of Use page and an original Sprite leveling & mastery guide.',
    why: 'Clear terms (next to the privacy policy) are part of being a trustworthy, ad-eligible site, and a proper leveling/mastery walkthrough is high-intent, genuinely original content — both deepen the site beyond the auto-generated pages.',
  },
  {
    date: 'October 2, 2026',
    title: 'Redeemed Lobby Hack codes now sync across devices',
    changes: [
      { tag: 'Fixed', text: 'The codes you’ve marked as redeemed weren’t showing up on other devices — they were saved only in each browser. Now, when you’re signed in, your redeemed codes sync to your account, so they follow you from desktop to mobile and back. Existing marks on a device are merged up the first time you sign in there.' },
      { tag: 'Security', text: 'Added a redeemed_codes field to your profile to store this; it’s written only by you (same per-user rules as the rest of your collection).' },
    ],
    summary: 'Redeemed Lobby Hack codes now sync to your account and appear across devices when signed in (were previously saved per-browser only).',
    why: 'Redeemed-state was localStorage-only, so claiming a code on desktop never reached mobile even when logged into the same account. Persisting it to your profile (like your collection) makes it device-independent — the behaviour players expect from a signed-in account.',
  },
  {
    date: 'October 1, 2026',
    title: 'Fortnitemares page refreshed — what’s live, not just leaks',
    changes: [
      { tag: 'Changed', text: 'The Fortnitemares page now reflects the live event instead of pre-launch leaks: the four new Sprites, the Trick-or-Treat finish, the FNAF & Ghostface crossovers, the Loot Hacks refresh and the map shake-up are all marked “Live,” with only genuinely-upcoming items (Honey & Obsession, ~Oct 15) still tagged as leaks.' },
    ],
    summary: 'Refreshed the Fortnitemares page from a pre-launch leak list to an accurate “what’s live now” overview.',
    why: 'The event went live Oct 1, but the page still read as “leaked / not yet announced” — stale, inaccurate content is bad for players and for search quality. Now each item is tagged Live / Leak / Rumor and links to the farming guide.',
  },
  {
    date: 'October 1, 2026',
    title: 'Richer, less-repetitive Sprite page FAQs',
    changes: [
      { tag: 'Added', text: 'Every Sprite page now has a “What finishes does X have?” answer listing its actual finishes and which are obtainable.' },
      { tag: 'Changed', text: 'Rewrote the FAQ answers to be specific to each Sprite — its rarity, finishes and (for the Fortnitemares Sprites) where players find it — instead of the same generic text on every page.' },
    ],
    summary: 'Made each Sprite page’s FAQ answers specific to that Sprite rather than identical boilerplate.',
    why: 'Near-identical FAQ text across dozens of pages reads as thin/duplicate content to search engines and is less useful to readers. Tying each answer to the Sprite’s own facts makes the pages genuinely distinct and more informative.',
  },
  {
    date: 'October 1, 2026',
    title: 'Lighter, faster changelog',
    changes: [
      { tag: 'Changed', text: 'The in-app changelog now shows the most recent ~60 updates with a link to the complete history on GitHub, instead of loading all 300+ entries at once.' },
    ],
    summary: 'Trimmed the in-app changelog to a recent window (full history still on GitHub) — ~80% smaller download when you open it.',
    why: 'The changelog had grown to 300+ entries (~370 KB), so opening it pulled a big file. It’s lazy-loaded so it never slowed the initial page, but capping the in-app list to recent updates makes the panel snappy and keeps the repo lean — nothing’s lost, the full log lives in the repo.',
  },
  {
    date: 'October 1, 2026',
    title: 'New guide: Best Override Sprites, ranked & explained',
    changes: [
      { tag: 'Added', text: 'A hand-written “Best Sprites” guide that ranks the live Override Sprites into S / A / B tiers with the reasoning behind each pick, plus “best for mobility / sustain / info / easy wins” calls. It’s the opinionated companion to the sortable tier list — the “what should I actually chase?” version.' },
    ],
    summary: 'Added an opinionated, tiered “Best Override Sprites” guide with reasoning per pick.',
    why: 'The tier list answers “how do they rank”; players also want “which should I chase for my playstyle.” A prose, judgement-led guide is genuinely original editorial content (not generated from data) and gives the site more real depth.',
  },
  {
    date: 'October 1, 2026',
    title: '“Where to find it” spawn info + a Fortnitemares farming guide',
    changes: [
      { tag: 'Added', text: 'Each live Fortnitemares Sprite page now has a “Where to find it” section — which chests drop it, the most-reported hotspot POIs, and any special method (e.g. Vampire from the FNAF animatronics at Freddy Fazbear’s Pizzeria). It only shows where we have genuinely-sourced location intel, so no made-up spots.' },
      { tag: 'Added', text: 'New guide: Fortnitemares 2026 Sprites — a hand-written walkthrough of all four live Sprites (what each power actually does, every finish, where to farm them, and which to chase first), plus the two coming ~Oct 15.' },
      { tag: 'Changed', text: 'The Fortnitemares event page now shows a “live now” banner linking to the new farming guide, instead of reading as all-leaks.' },
    ],
    summary: 'Added per-Sprite spawn locations and an original Fortnitemares farming guide.',
    why: 'Players kept asking where the new Sprites actually drop, and spawn/farming info is genuinely useful original content (not auto-generated from the roster) — the kind of depth that makes the pages worth visiting and reads as real editorial value.',
  },
  {
    date: 'October 1, 2026',
    title: 'Trick-or-Treat finish added to 8 more Sprites',
    changes: [
      { tag: 'Added', text: 'Wired up the official Trick-or-Treat art for eight more Sprites: Sonic, Tails, Crash Bandicoot, Blinky, Adventure, X-Ray, Onigiri and Pond. That brings the spooky Fortnitemares recolour to 24 Sprites total.' },
    ],
    summary: 'Added official Trick-or-Treat art to 8 more Sprites (Sonic, Tails, Crash, Blinky, Adventure, X-Ray, Onigiri, Pond).',
    why: 'Epic’s Fortnitemares drop included Trick-or-Treat versions of these eight under internal codenames (e.g. the Sonic trio as “NarrowFlea”, Adventure as “Dwarf”, the Design-a-Sprite winners as “WinnerA/B/C”). Matched each by its art and finish so collectors can track the full Trick-or-Treat set.',
  },
  {
    date: 'October 1, 2026',
    title: 'Rebuilt the list view — fast one-tap ticking',
    changes: [
      { tag: 'Changed', text: 'The list (quick-check) view is now a clean fortnite.gg-style layout: one row per Sprite with its art thumbnail, an owned count, and a round, tappable toggle for each finish (BASE · GOLD · CHEAT · HACKER · HUNTER · TRICK), labelled and colour-coded. Tap a circle to mark that finish owned — the quickest way to log a lot at once.' },
      { tag: 'Changed', text: 'Finishes that aren’t out yet (or are vaulted) show a locked ○ instead of a tappable circle, so you can see what’s still coming without it looking checkable.' },
    ],
    summary: 'Rebuilt the list view into a fortnite.gg-style grid of tappable finish circles per Sprite.',
    why: 'The old list used text chips that were awkward to scan and tap. Round per-finish toggles with the art thumbnail line up down the page, make ownership obvious at a glance, and are much faster for bulk entry — the whole point of the list mode.',
  },
  {
    date: 'October 1, 2026',
    title: 'New Sprite Day — The Deer & Dumpster Dive live + Loot Hacks refresh',
    changes: [
      { tag: 'Added', text: 'The Deer Sprite is live — a Legendary 99 Nights in the Forest collab whose melee attacks hit harder (more each level) — with its official art across all finishes: Normal, Gold, Cheat Master, Loot Hacker, Bounty Hunter and Trick-or-Treat.' },
      { tag: 'Changed', text: 'Dumpster Dive flipped from rumored to live with its official art: dive into a hiding spot for food that restores extra Health. All six finishes are in (Normal, Gold, Cheat Master, Loot Hacker, Bounty Hunter, Trick-or-Treat).' },
      { tag: 'Changed', text: 'Loot Hacks pool refreshed for Fortnitemares (v42.30): in came the Infantry Rifle, LMG, Pumpkin Launcher, Last Call and Slap Candy Corn (out went Rocket Ram, Reaper Sniper, the Mammoth & Hyperburst Pistols, Deadeye DMR and Flowberry Fizz).' },
      { tag: 'Changed', text: 'Heads-up feed updated: Honey and the new Obsession Sprite are expected around Oct 15.' },
    ],
    summary: 'The Deer and Dumpster Dive Sprites are live with official art (all six finishes), and the Loot Hacks pool refreshed for Fortnitemares.',
    why: 'Fortnitemares launched four Sprites on Oct 1 — Vampire and Spooky Dash were already in; The Deer and Dumpster Dive are the other two, confirmed live by multiple outlets and now in with their official art (The Deer = the “IncreasedMelee” icon, Dumpster Dive = the “WinnerD” raccoon). Two more (Honey, Obsession) are slated for ~Oct 15.',
  },
  {
    date: 'October 1, 2026',
    title: 'Content-quality pass for search (and ad eligibility)',
    changes: [
      { tag: 'Changed', text: 'Rumored / not-yet-released Sprite pages (Honey, Bullet, Dumpster Dive, Meowscles, Squibbly, Cube, Head Shot) are now kept out of search indexes until they actually go live — there’s no drop rate, finishes or confirmed ability to show yet, so they were thin pages. They stay fully browsable in the app and flip to indexable automatically the day they release.' },
      { tag: 'Changed', text: 'Dropped those unreleased pages from the sitemap for the same reason, so search engines only see pages with real, substantial content.' },
      { tag: 'Added', text: 'Gave the home page a real first-paint landing section — a plain-English “what this does” plus links to the checklist, codes, tier list, calculator and more. Live visitors still get the full app instantly; this is for the first paint, no-JS readers and crawlers.' },
    ],
    summary: 'Kept thin unreleased-Sprite pages out of search until they go live, and gave the home page substantial first-paint content.',
    why: 'Google AdSense flagged “low value content”: the auto-generated pages for rumored Sprites were ~95% shared boilerplate with almost nothing unique (no drop rate, no live finishes). Rather than pad them with filler — which would read as exactly the thin content being flagged — the right move is to not index a page until it has something real to say, and to make the home page (the actual tool) present genuine, crawlable value. The released-Sprite pages already carry unique data (ability, finishes, codes, odds) and were left as-is.',
  },
  {
    date: 'October 1, 2026',
    title: 'Six new Fortnitemares Lobby Hack codes',
    changes: [
      { tag: 'Added', text: 'Added the six Admin Panel codes from the Oct 1 update: CrowsAreAfraid (turn the lobby into Scarecrows) and PumpkinSpiceLife (turn the lobby into Pumpkins) — both reusable Fortnitemares transforms; IThinkTheKeyFoundMeChat (Extraction Accelerator); s7h-50p-r03 (Geno glitches your lobby, after Stage 4 of the Hope Quest); and runSystemOverride + ImTheRealEdgelord (5,000 Sprite Dust each, after the Geno and Wrixel story quests).' },
    ],
    summary: 'Added the six new Fortnitemares Admin Panel codes from the Oct 1 update (two lobby transforms, an Accelerator, and three quest-gated rewards).',
    why: 'Fortnitemares (v42.30) dropped a fresh batch of Lobby Hacks; the two lobby transforms are the fun headline ones, the other four are easy Sprite Dust / Accelerator pickups, so collectors want them in the list right away.',
  },
  {
    date: 'October 1, 2026',
    title: 'Removed the Map tab',
    changes: [
      { tag: 'Removed', text: 'Took out the Map tab (and the /map page). For the full interactive Fortnite map with toggleable POI, chest and loot layers, fortnite.gg does it best — the tracker isn’t trying to rebuild that.' },
      { tag: 'Changed', text: 'Sprites aren’t tied to specific map locations anyway — they come from in-world Cheat Codes, Sprite Chests and events — so the map wasn’t pulling its weight here. The nav is lighter for it.' },
    ],
    summary: 'Removed the Map tab and /map page — a link-out to a partial map wasn’t adding value.',
    why: 'We tried an interactive POI map and a link-out card, but neither matched what fortnite.gg already does well, and Sprites aren’t POI-locked, so the feature never earned its spot. Rather than ship a half-map, we removed it and keep the tracker focused on what it’s actually for — the collection, codes and events.',
  },
  {
    date: 'October 1, 2026',
    title: 'Fixed the top status card when there’s no live event',
    changes: [
      { tag: 'Fixed', text: 'The top-of-page card could look broken after you dismissed the announcement — an empty row with a lone “new codes” button floating on the right. Now the “Today” row only appears when there’s a real live/next event or genuinely-new codes, and with no event the codes button sits neatly on the left instead of drifting.' },
    ],
    summary: 'Fixed the top status card rendering an empty row / floating button once the announcement was dismissed.',
    why: 'The recent “collapse when idle” change left a gap: with no active event it still drew the Today row, so dismissing the notice exposed an empty left side and a stray button. Gating the row on real content keeps the card tight whether or not anything’s happening.',
  },
  {
    date: 'October 1, 2026',
    title: 'Naming fix — the dash Sprite is “Spooky Dash”',
    changes: [
      { tag: 'Fixed', text: 'Corrected the second Fortnitemares Sprite: it’s the Mythic Spooky Dash (dash charges that let you phase through objects), not a headshot-blocking “Pumpkin” — that was an early-leak mix-up. It’s the same Sprite we’d also been tracking under the datamined name “Phase Dash,” so the two are now merged into one correct Spooky Dash (with its real art), and the duplicate is gone.' },
    ],
    summary: 'Fixed the dash Sprite to the correct “Spooky Dash” (Mythic) and removed the bogus “Pumpkin” duplicate.',
    why: 'Early Fortnitemares leaks called it a pumpkin/headshot Sprite; the live version is the Spooky Dash dash Sprite, which we’d also listed under the datamined name “Phase Dash.” One Sprite, one entry — the roster now matches what’s actually in-game.',
  },
  {
    date: 'October 1, 2026',
    title: 'Simpler filtering & search',
    changes: [
      { tag: 'Changed', text: 'Rebuilt the collection filter bar to be cleaner and quicker to scan: season tabs (All Seasons / C7 S3 / C7 S4), then one row of Search · Variant · Sprite · Sort · grid/list. The less-used options (ownership, rarity, grouping, hide-mastered, show-unreleased) now tuck behind a ⚙ gear so the common path stays uncluttered.' },
      { tag: 'Added', text: 'A “Sprite” filter to jump straight to one Sprite’s variants (e.g. just Jonesy’s finishes).' },
    ],
    summary: 'Streamlined the filter bar — season tabs + Search/Variant/Sprite/Sort, with advanced options behind a gear.',
    why: 'The old bar stacked rarity and variant chip rows plus several inline toggles, which crowded the top of the page. A tabbed, dropdown-based layout (inspired by fortnite.gg) reads faster and keeps the power-user filters one tap away.',
  },
  {
    date: 'October 1, 2026',
    title: 'New Trick-or-Treat finish (Fortnitemares)',
    changes: [
      { tag: 'Added', text: 'Added the Fortnitemares Trick-or-Treat finish — a spooky Halloween recolour — with official art on 14 Sprites: Crown, Jonesy, Bush Ranger, 8-Bit Blaster, Birthday, Killswitch, Storm Scout, Klombo, Overshield, Vampire, Phase Dash, Morgana, Shadow and Jazz Jackrabbit. It’s a cosmetic finish (keeps the base ability). A few more Trick-or-Treat icons in the drop use Epic internal names we haven’t matched to our roster yet — those will follow once mapped.' },
    ],
    summary: 'Added the Fortnitemares Trick-or-Treat finish with real art on 14 Sprites.',
    why: 'Trick-or-Treat is the headline Fortnitemares (v42.30) finish; the official icons arrived for a first batch, so the finish and its art are in now, with the rest to follow as they’re confirmed.',
  },
  {
    date: 'October 1, 2026',
    title: 'Real Vampire art + all five finishes',
    changes: [
      { tag: 'Added', text: 'Dropped in the official Vampire Sprite art (replacing the placeholder) across all five finishes — Normal, Gold, Cheat Master, Loot Hacker and Bounty Hunter — so the live Fortnitemares Sprite now shows its real look. Added the Spooky Dash art from the same drop too.' },
    ],
    summary: 'Added the real Vampire Sprite art in all five finishes (plus the Spooky Dash art).',
    why: 'The Vampire went live today with placeholder art; the real icons arrived, so they’re in now — along with the Spooky Dash art from the same drop.',
  },
  {
    date: 'October 1, 2026',
    title: 'Fortnitemares is live — Vampire & Spooky Dash Sprites + map changes',
    changes: [
      { tag: 'Added', text: 'New Sprite Day: flipped the Vampire and Spooky Dash Sprites live for Fortnitemares (v42.30, Oct 1). Vampire recovers Health when you damage an enemy (scaling per level); Spooky Dash (Mythic) holds dash charges that recharge over time and let you phase through some objects. Both come from Pumpkin chests and Cheat Codes (Vampire can also drop from the FNAF animatronics at Freddy Fazbear’s Pizzeria; Spooky Dash turns up around Nightmare Neighborhood).' },
      { tag: 'Changed', text: 'Refreshed the map POIs for Fortnitemares: Battlewoods → Gravegate (haunted houses + an Elm Street area), the Arcade landmark → Freddy Fazbear’s Pizzeria (FNAF collab, animatronic bosses), and a new Nightmare Neighborhood POI with Freddy Krueger.' },
      { tag: 'Added', text: 'A Fortnitemares-live announcement banner and a New Sprite Day news post.' },
    ],
    summary: 'Flipped the Vampire & Spooky Dash Sprites live and refreshed the map POIs for the Fortnitemares (v42.30) launch.',
    why: 'Fortnitemares went live Oct 1 and multiple outlets (Vice, Beebom, FRVR) confirmed the two Sprites are obtainable and the map changes are in — so they move from leak to live, with their official art.',
  },
  {
    date: 'October 1, 2026',
    title: 'Tidier top status bar + plainer wording',
    changes: [
      { tag: 'Changed', text: 'The top-of-page status card now collapses when nothing’s happening — it drops the generic “weekly events” filler line and hides entirely when there’s no live event, new code, or upcoming drop, so it stops taking up space.' },
      { tag: 'Changed', text: 'Swapped internal/technical wording across the site for plain player language — unreleased Sprites and upcoming drops now read as “leaked”, “unreleased” or “ahead of release” instead of developer shorthand.' },
    ],
    summary: 'Collapsed the top status bar when idle, and replaced internal jargon with plain wording.',
    why: 'The top bar ate screen space even with nothing active, and some copy used developer shorthand that reads as jargon to players — both changes make the page cleaner and friendlier to read.',
  },
  {
    date: 'September 29, 2026',
    title: 'Chapter 8 estimate moved to ~Nov 28 (Epic Trello roadmap)',
    changes: [
      { tag: 'Changed', text: 'Updated the Chapter 8 estimate from the earlier ~Dec 5 leak to ~Nov 28 (v44.00), per Epic’s public Trello roadmap (via Vice & esports.gg). Refreshed the season timing, the Chapter 8 heads-up card, and the schedule News post. The Nov 1 bridge mini-season is unchanged, and it’s still a roadmap date that can shift.' },
    ],
    summary: 'Firmed up the Chapter 8 estimate to ~Nov 28 from Epic’s Trello roadmap (was ~Dec 5).',
    why: 'An Epic-sourced roadmap date is firmer than the earlier third-party leak, so the countdown and heads-up feed should reflect it — kept labelled as an estimate since roadmap dates still move.',
  },
  {
    date: 'September 29, 2026',
    title: 'Fortnitemares Sprites leaked — Spooky Dash & Vampire (Oct 1)',
    changes: [
      { tag: 'Added', text: 'Added the two leaked Fortnitemares Sprites to the roster as rumored — the Spooky Dash Sprite and the Vampire — both expected to headline the event when it goes live Oct 1. Leaked powers: Spooky Dash has dash charges that let you phase through objects; Vampire siphons up to ~50% of the damage you deal back as white Health. Both are flagged as leaks (they don’t count toward your total), with a Coming Oct 1 badge and a leak-labelled News post.' },
    ],
    summary: 'Added the leaked Fortnitemares Sprites (Spooky Dash + Vampire) with their leaked powers, ahead of Oct 1.',
    why: 'Vice’s leak gives credible names and powers for the Halloween pair, so they go in as clearly-labelled leaks now (with a Coming Oct 1 badge) and will flip to released with real art the moment they’re obtainable — keeping the “leaked vs live” line honest.',
  },
  {
    date: 'September 28, 2026',
    title: 'Map tab now opens fortnite.gg’s interactive map',
    changes: [
      { tag: 'Changed', text: 'The 🗺️ Map tab and the /map page now link straight to fortnite.gg’s full interactive map — zoomable, with POI/chest/loot layers you can toggle — instead of an embedded image. It’s the best free map tool and runs on the same Epic data. We keep the current, live POI list here for quick reference.' },
      { tag: 'Fixed', text: 'Removed the embedded map image that had stopped loading (its image host went away), which had left the Map looking broken and empty.' },
    ],
    summary: 'The Map tab now sends you to fortnite.gg for the real interactive map and keeps a live POI list — no more broken map image.',
    why: 'A static (and lately broken) image plus a name list wasn’t pulling its weight, and cloning a dedicated map tool blind wasn’t worth the upkeep. Pointing to fortnite.gg gives players the best experience in one click, while the crawlable POI list stays for reference and search.',
  },
  {
    date: 'September 28, 2026',
    title: 'FNAF collab confirmed for Fortnitemares; Loot Hack refresh date fixed',
    changes: [
      { tag: 'Changed', text: 'Upgraded the Five Nights at Freddy’s × Fortnite collab from leak to Epic-confirmed after Epic’s Sep 27 trailer — Freddy Fazbear’s Pizzeria arrives as a map POI with the four animatronics (Freddy, Bonnie, Chica, Foxy) on Oct 1. Updated the News feed and the Fortnitemares heads-up card; Black Clover and Chucky stay flagged as leaks.' },
      { tag: 'Fixed', text: 'Pointed the Loot Hack “next refresh” at the confirmed Oct 1 (Fortnitemares v42.30) beat. The v42.20 set has held since Sep 17, so the /loot-hacks page now reads “refreshes in ~N days” instead of a stale “refresh due — check in game.”' },
    ],
    summary: 'FNAF is officially in for Fortnitemares (Oct 1), and the Loot Hack refresh date now points at the real next beat.',
    why: 'Epic’s own trailer moved FNAF from rumor to fact, so it belongs on the confirmed side of the feed while genuinely unconfirmed collabs stay labelled as leaks — keeping the “verified vs leaked” line honest. The map POIs themselves haven’t flipped yet, so those stay on the daily watch for Oct 1.',
  },
  {
    date: 'September 27, 2026',
    title: 'Reusable lobby codes tagged consistently',
    changes: [
      { tag: 'Fixed', text: 'Tagged the Arcade Machine (InsertCoinToContinue) and Toilet (BRB) lobby-transformation codes as ↻ Reusable — they re-trigger the transform every time, same as the Tetris-block codes, but were missing the badge. Reworded the Lobby Hacks intro and code notes so “reusable” covers all lobby-transformation codes, not just the two Tetris ones.' },
    ],
    summary: 'Fixed the Reusable badge so every lobby-transformation code shows it — the Arcade and Toilet codes were missing it.',
    why: 'A transformation code re-fires the lobby effect on every submit instead of granting a one-time item, so all four (Tetris blocks, Arcade, Toilet) are reusable. The old copy only named the Tetris pair, which read as if the others were one-time.',
  },
  {
    date: 'September 26, 2026',
    title: 'Three FNCS-livestream lobby codes added',
    changes: [
      { tag: 'Added', text: 'Three Admin Panel codes Epic dropped during the Sep 26 FNCS livestream (championship + birthday): DustySprites (5,000 Sprite Dust), WhoCrackedTheCode (40,000 XP), and WeAreTheWorldChampionsToday (FNCS Back Bling). All confirmed working and live on the Lobby Hacks page.' },
    ],
    summary: 'Added the three FNCS-livestream codes — Sprite Dust, 40k XP, and an FNCS Back Bling.',
    why: 'Confirmed working by Vice, the FNCS broadcast, and in-game redemption, so they went straight in as Working (not rumored).',
  },
  {
    date: 'September 26, 2026',
    title: 'New Sprite Day — the Birthday Sprite is LIVE',
    changes: [
      { tag: 'Added', text: 'The Birthday Sprite (Rare) went live at 2 PM ET in all five finishes (Normal, Gold, Cheat Master, Loot Hacker, Bounty Hunter) — flipped live in the checklist. While equipped, chests (and elims at max level) can spawn cake slices that restore both Health & Shield. This completes the v42.20 Sprite wave.' },
    ],
    summary: 'Flipped the Birthday Sprite live for its Sep 26 debut — the last drop of the v42.20 wave.',
    why: 'Vice confirmed the 2 PM ET enable time; its official art was already in the repo, so it renders immediately. The 9th-Birthday drop landing with the Power Hours closes out the v42.20 roster.',
  },
  {
    date: 'September 26, 2026',
    title: 'Birthday Power Hours corrected — 3-hour windows',
    changes: [
      { tag: 'Fixed', text: 'Corrected the Birthday Power Hours timing: this year they’re two THREE-hour windows (2–5 PM & 9 PM–12 AM ET), not the usual two hours. Added the confirmed perks — everyone starts with Presents, the Exotic Balloon Popper AR joins the loot pool, Birthday Sprites give Cake Slices from chests (and elims at max level), and Portable Extractors & 1-Up Tokens drop from Chests.' },
    ],
    summary: 'Fixed the Birthday Power Hours to the confirmed 3-hour windows and added the event’s perks.',
    why: 'Initial times assumed the standard 2-hour cadence; FN_Assist and community posts confirmed 3-hour windows for the 9th-Birthday hours, so the countdown and banner now match the real schedule.',
  },
  {
    date: 'September 25, 2026',
    title: 'Birthday Power Hours (Sat) + Fortnitemares confirmed for Oct 1',
    changes: [
      { tag: 'Added', text: 'Birthday Power Hours on the top card & events page — Sat Sep 26, 2–4 PM & 9–11 PM ET: boosted spawns of the new Birthday Sprite (Rare) and other hard-to-find Sprites. While a Birthday Sprite is equipped, cake from chests and eliminations restores both Health & Shield.' },
      { tag: 'Changed', text: 'Fortnitemares 2026 is now Epic-confirmed (was a leak): Oct 1 → Oct 31, slogan “The Game Is Cursed” (update v42.30). The Coming-up card is upgraded to a confirmed date, with reported collabs (FNAF, Black Clover, Chucky), skins (Bunnybone, Osric the Uninvited, Gold Punk) and map changes still flagged as leaks until they go live. Added a News post.' },
    ],
    summary: 'Added tomorrow’s Birthday Sprite Power Hours and upgraded Fortnitemares to an Epic-confirmed Oct 1 date.',
    why: 'Epic’s teaser locked the Fortnitemares date, so the card moves from estimate to confirmed while keeping unconfirmed skins/collabs/map details clearly leak-labelled. The Birthday Power Hours go in as a dated event so the countdown surfaces them tomorrow.',
  },
  {
    date: 'September 24, 2026',
    title: 'New Sprite Day — Bounty Hunter finish + Morgana are LIVE',
    changes: [
      { tag: 'Added', text: 'The Bounty Hunter finish went live across the roster (17 Sprites, plus the Crown that dropped early) — marked obtainable in the checklist. It’s the fighting finish: a chance to spawn extra Sprites on eliminations, and it levels only from eliminations (mastery like Klombo/the Crown).' },
      { tag: 'Added', text: 'The Persona 5 Morgana Sprite (Epic — boosts healing items) is live in all five finishes: Normal, Gold, Cheat Master, Loot Hacker and Bounty Hunter.' },
      { tag: 'Changed', text: 'Heads-up feed trimmed to the last piece of the wave — the Birthday Sprite (Rare), reported for Sat Sep 26.' },
    ],
    summary: 'Flipped the Bounty Hunter finish and Morgana live for New Sprite Day (Sep 24); Birthday follows Sep 26.',
    why: 'Vice confirmed the 9 AM ET drop (17 Bounty Hunter variants + Morgana = 22 new). The finish released roster-wide on one date, so it’s date-gated via FORM_RELEASE rather than 17 hand flips — which also keeps it correctly gated on the still-unreleased Birthday until that Sprite goes live Saturday. Official leaked art was already in place, so everything renders immediately.',
  },
  {
    date: 'September 22, 2026',
    title: 'Slimmer deploys — OCR engine loads from a CDN',
    changes: [
      { tag: 'Changed', text: 'The optional “scan your locker screenshot” OCR now loads its Tesseract engine from a CDN on demand instead of bundling ~14 MB of assets into every deployment — cutting each build ~36% smaller (39 MB → 25 MB). OCR works exactly the same when you use it; it just fetches the engine at that moment.' },
    ],
    summary: 'Trimmed ~14 MB off every deploy by loading the OCR engine from a CDN instead of self-hosting it.',
    why: 'Deployment storage had reached 75% of the free 10 GB because every build re-shipped the full OCR engine. OCR is a lazy, optional feature, so serving its assets from Tesseract’s version-pinned CDN keeps deploys lean with no change to the core tracker.',
  },
  {
    date: 'September 21, 2026',
    title: '9th Birthday event code — 9YEARS (confirmed working)',
    changes: [
      { tag: 'Added', text: 'Fortnite’s 9th Birthday event is live (Sep 21). The Admin Panel code 9YEARS redeems the 9th Birthday Sprite Spray — now confirmed working in-game and marked Working on the Lobby Hacks page.' },
    ],
    summary: 'Added the 9YEARS code (9th Birthday Sprite Spray), verified working in-game.',
    why: 'It first surfaced from a single unverified social post, so it went up as “Rumored,” then was promoted to “Working” once an in-game redemption confirmed it. Keeping that rumor→verified flow visible is how the codes list stays trustworthy.',
  },
  {
    date: 'September 21, 2026',
    title: 'Mastery Monday code — ALMOSTSCARINGSEASON',
    changes: [
      { tag: 'Added', text: 'This week’s Mastery Monday Admin Panel code: ALMOSTSCARINGSEASON grants 2× Cheat Code Locators — enter it in the lobby Admin Panel. Mastery Monday (Mon Sep 21, 9 AM ET, 24h) also gives 2× Sprite XP & Dust, the fastest day to level and master Sprites.' },
    ],
    summary: 'Added the Sep 21 Mastery Monday code (ALMOSTSCARINGSEASON → 2× Cheat Code Locators).',
    why: 'Mastery Monday drops a fresh free code each week; adding it promptly keeps the Lobby Hacks list complete while the double Dust/XP window is live. (The name also winks at the approaching “scaring season” — Fortnitemares ~Oct 1.)',
  },
  {
    date: 'September 20, 2026',
    title: 'New About & Contact pages + deeper Sprite content',
    changes: [
      { tag: 'Added', text: 'Real, crawlable About and Contact pages (About used to be an in-app pop-up only). About covers what the tracker is, who makes it, and exactly how every Sprite, code, drop rate and event is sourced and verified; Contact explains how to reach us for corrections, bugs, data or privacy requests. Both are linked from the nav and footer.' },
      { tag: 'Added', text: 'A unique overview paragraph at the top of every per-Sprite page (built from that Sprite’s own facts), plus six new FAQ answers — the Bounty Hunter finish, what each finish means, Power Hours & Mastery Monday, trading, and what carries over between seasons.' },
    ],
    summary: 'Added proper About & Contact pages and deepened the per-Sprite pages and FAQ with substantial, original writing.',
    why: 'Google AdSense flagged the site as “low value / thin content” — common for tracker/tool sites heavy on interactive data but light on readable substance and clear authorship. This pass adds genuine written depth (unique per-Sprite overviews, a larger FAQ) and the trust pages (About/Contact, how the data is sourced) that ad review looks for, so the crawlable pages clearly stand on their own ahead of a re-review request.',
  },
  {
    date: 'September 20, 2026',
    title: 'Added the Bounty Hunter Crown (it’s already live)',
    changes: [
      { tag: 'Added', text: 'The Bounty Hunter Crown — the Crown Sprite’s Bounty Hunter finish — is now marked live. It shipped with v42.20 (Sep 17) and unlocks by winning a match with the Loot Hacker Crown equipped, making it the first Bounty Hunter finish obtainable ahead of the rest of that wave.' },
      { tag: 'Changed', text: 'Refined the v42.20 heads-up: the Birthday Sprite is now noted for Sat Sep 26, and the Coming-up card reflects that the Bounty Hunter Crown is already live while the rest of the finish rolls out over the week.' },
    ],
    summary: 'Marked the Bounty Hunter Crown live (we’d missed it) and tidied the v42.20 rollout dates.',
    why: 'Epic staggered the Bounty Hunter finish — the Crown dropped first (Sep 17, via a Loot Hacker Crown win) while the rest stays leaked. Per-variant gating lets us flip just the Crown live without releasing the whole finish, so the roster matches exactly what’s obtainable in-game.',
  },
  {
    date: 'September 20, 2026',
    title: 'Heads-up card — Fortnitemares 2026 (~Oct 1)',
    changes: [
      { tag: 'Added', text: 'A “Fortnitemares 2026” card in the Coming-up heads-up feed, dated ~Oct 1 (leak). Notes the leaked Five Nights at Freddy’s & Black Clover crossovers, Horde Rush’s return, and spooky new Loot Hack items — and ties to the already-leaked Vampire Sprite, which now shows a “Coming ~Oct 1” badge.' },
    ],
    summary: 'Added a Fortnitemares (~Oct 1) heads-up so the Halloween event — the next big thing after this week’s New Sprite Day — is on the radar, with the Vampire Sprite linked to it.',
    why: 'Fortnitemares is an annual, near-certain event and it’s where the leaked Vampire Sprite most likely lands, so surfacing it early helps collectors plan Dust spending before the season winds down. It’s a leaked date (HYPEX/Dexerto/Vice), so it uses the “~” estimate convention and stays clearly leak-labelled; the daily & Season 5 watches firm it up as Epic confirms.',
  },
  {
    date: 'September 20, 2026',
    title: 'Fixed: the Map tab now actually loads its POIs',
    changes: [
      { tag: 'Fixed', text: 'The “🗺️ Map” tab could get stuck with no Points of Interest because the browser can’t call fortnite-api.com’s map endpoint directly (it isn’t open to cross-site requests). Added a small server-side proxy (/api/map) that fetches it for us, so the live minimap + full POI list load reliably now — with an 8-second timeout that drops to the built-in fallback list instead of spinning forever.' },
    ],
    summary: 'Fixed the Map tab hanging with no POIs — it now loads through a server-side proxy, with a guaranteed fallback so it never just spins.',
    why: 'The first cut fetched the map vendor straight from the browser, but that endpoint blocks cross-origin requests, so the fetch failed and the POI list could stall on “Loading…”. Routing it through our own /api/map (same pattern as player stats) sidesteps that entirely and lets us cache it at the edge; the timeout guarantees the tab always resolves to a rendered list.',
  },
  {
    date: 'September 20, 2026',
    title: 'New: a live Map & POIs reference',
    changes: [
      { tag: 'Added', text: 'A “🗺️ Map” tab showing the current Chapter 7 Season 4 “Override” minimap and its full Points-of-Interest list, pulled live from fortnite-api.com (via our own proxy — no login, always current) with a static fallback if it’s unreachable. Plus a crawlable /map page for search.' },
    ],
    summary: 'Added a live map & POI reference so you can see the current island and its named locations at a glance.',
    why: 'It’s the most-requested “what does the map look like now” context, and it doubles as an SEO landing page. Kept honest: Override Sprites aren’t POI-locked (they come from Cheat Codes, Chests & events), so the map is framed as a general chest-farm reference, not a “go here for Sprite X” tool. Uses the same trusted vendor (fortnite-api.com) we already use for the Shop & stats — no new key, no paid API.',
  },
  {
    date: 'September 20, 2026',
    title: 'Top card refreshed — Mastery Monday (Sep 21) is next up',
    changes: [
      { tag: 'Changed', text: 'The top-of-page event card now counts down to Mastery Monday (Mon, Sep 21 — 2× Sprite Dust & XP) now that the Kingdom Hearts Power Hours have wrapped, with a matching banner and News post. The countdown/LIVE badge is data-driven, so it lights up automatically at 9 AM ET.' },
    ],
    summary: 'Rolled the top card forward from the (now-finished) Power Hours to Monday’s Mastery Monday — the best day to bank 2× Dust/XP before Thursday’s New Sprite Day.',
    why: 'Once an event window passes the card would otherwise sit empty; surfacing the next dated event (Mastery Monday) keeps it useful. It’s marked “expected” (Epic’s weekly cadence) rather than hard-confirmed until Epic posts a specific note.',
  },
  {
    date: 'September 19, 2026',
    title: 'Heads-up card — Chapter 8 (~Dec 5)',
    changes: [
      { tag: 'Added', text: 'A “Chapter 8 — a brand-new Sprite generation” card in the Coming-up heads-up feed, dated ~Dec 5 (leak). Split the season-flip card so it now reads: bridge mini-season (~Nov 1) → Chapter 8 (~Dec 5).' },
    ],
    summary: 'Added a Chapter 8 heads-up (~Dec 5) so the whole road ahead — Fortnitemares, the Nov 1 mini-season, then Chapter 8 — is visible at a glance.',
    why: 'Chapter 8 means a fresh Sprite generation to chase, and it’s the biggest thing on the horizon for collectors. It’s a leaked date (HYPEX/ShiinaBR), so it uses the “~” estimate convention; the Season 5 watch firms it up as Epic confirms.',
  },
  {
    date: 'September 19, 2026',
    title: 'New leaked Sprite — Vampire (likely Fortnitemares)',
    changes: [
      { tag: 'Added', text: 'A leaked “Vampire” Sprite added to the roster as rumored/upcoming (it won’t count toward your total). Leaked ability: converts a portion of the damage you deal into siphoned white Health, scaling from ~10% at Level 1 to ~50% at max. Ships with a stylised placeholder until official art surfaces, plus a labelled leak entry in the News feed.' },
    ],
    summary: 'Added the newly-leaked Vampire Sprite — a likely Fortnitemares (Halloween) addition — as a clearly-labelled leak.',
    why: 'A fresh leak surfaced a Vampire Sprite that fits the ~Oct 1 Fortnitemares timing. It’s leak-only (Epic hasn’t confirmed it), so it goes in as rumored/leaked with a source, never counted toward completion — the daily watch will flip it live with real art the moment it’s actually obtainable.',
  },
  {
    date: 'September 18, 2026',
    title: 'Copy-for-Discord export + a Power Hours “farm my missing ones” shortcut',
    changes: [
      { tag: 'Added', text: 'A “🎮 Copy for Discord” button in Share & export — copies a formatted breakdown of your collection (completion %, a per-finish tally, and a few Sprites you’re still missing) ready to paste into a server, alongside the existing short caption.' },
      { tag: 'Added', text: 'A Power Hours tie-in on the top card: when a finish-boosting event is live or imminent (e.g. Saturday’s Loot Hacker Power Hours), a one-tap “🎯 Farm my N missing Loot Hacker Sprites” button filters the grid to exactly the ones you still need and scrolls you there.' },
    ],
    summary: 'Share your collection to Discord in one tap with a proper breakdown, and jump straight to the Sprites worth farming during a boosted-finish event.',
    why: 'Discord export is the one thing rival checklists had that we didn’t — an easy, shareable breakdown doubles as free word-of-mouth. The Power Hours shortcut turns “a finish is boosted right now” into immediate action (filter to your missing ones) instead of leaving players to hunt through the grid during the short event window.',
  },
  {
    date: 'September 18, 2026',
    title: 'Kingdom Hearts Power Hours (Sat Sep 19) — Loot Hacker Sprites boosted',
    changes: [
      { tag: 'Added', text: 'The Kingdom Hearts Power Hours are on the schedule: both windows Saturday Sep 19 (2–4 PM & 9–11 PM ET) now drive the top-card countdown/LIVE badge, with a top-of-page banner and a News post. “Hacker” (Loot Hacker) Sprite variants are boosted — the week’s best window to fill in Loot Hacker finishes.' },
    ],
    summary: 'Wired up Saturday’s Kingdom Hearts Power Hours so the tracker counts down to it and flags it live during both windows — a great Loot Hacker farming window.',
    why: 'Epic announced it directly (both ET windows), so it goes in as a confirmed event — the data-driven top card lights up automatically, and collectors get the heads-up that this is the moment to chase the Loot Hacker finish.',
  },
]
