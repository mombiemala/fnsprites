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
  {
    date: 'September 17, 2026',
    title: 'Heads-up — Morgana, Birthday & the Bounty Hunter finish coming Sep 24',
    changes: [
      { tag: 'Added', text: 'A “Coming Sep 24” heads-up (and a countdown on the top card) for the rest of the v42.20 wave — the Morgana and Birthday Sprites and the whole Bounty Hunter finish — which reports peg to next Thursday’s New Sprite Day. Those cards now show a “~Sep 24” badge.' },
    ],
    summary: 'Added a dated heads-up for the next drop (Morgana, Birthday and Bounty Hunter, reported for Sep 24) so you can see exactly what’s coming and when.',
    why: 'The date is from Vice/leakers rather than an official Epic post, so it’s marked as an estimate (the “~” convention) — solid enough to plan around without over-claiming. The daily watch flips each one live the moment it’s actually obtainable.',
  },
  {
    date: 'September 17, 2026',
    title: 'Release dates everywhere — “New” badges, Newest sort & grouping, finish tooltips',
    changes: [
      { tag: 'Added', text: 'A green “NEW” badge on Sprites released in the last ~8 days (both the collection cards and the detail modal), so drop-week additions stand out at a glance.' },
      { tag: 'Added', text: 'A “Group by release date” option — browse the roster by when each Sprite dropped (newest update first).' },
      { tag: 'Added', text: 'A “Newest” sort on the public /sprites board too (not just the app collection), matching the in-app sort.' },
      { tag: 'Added', text: 'Real release dates for the whole Chapter 7 Season 4 roster (Aug 20 launch, Aug 29, Sep 3 and Sep 17 New Sprite Days), which power all of the above.' },
      { tag: 'Changed', text: 'Hovering a Sprite card now shows that finish’s perk (e.g. what the Bounty Hunter finish does), and the detail modal already lists every finish’s perk per variant.' },
    ],
    summary: 'The tracker now knows when each Override Sprite released — so new drops get a NEW badge, you can sort or group by release date (on the app and the public board), and finish perks show on hover.',
    why: 'Drop weeks are the busiest time here, and “what just came out?” is the top question. Giving every Sprite a real release date lets the UI answer that consistently — a NEW badge, a Newest sort, and update-grouping — instead of players hunting through the grid. Season 3 legacy Sprites are left undated on purpose, so they naturally sort last rather than getting a guessed date.',
  },
  {
    date: 'September 17, 2026',
    title: 'Official art for the v42.20 Sprites + the Bounty Hunter finish, and a “Newest” sort',
    changes: [
      { tag: 'Added', text: 'Official leaked art for the new Sprites — Crash Bandicoot, Blinky, Pond, Morgana and Birthday now show their real icons in every finish (Normal, Gold, Loot Hacker, Cheat Master), replacing the placeholder art.' },
      { tag: 'Added', text: 'Official Bounty Hunter art for 20 Sprites (Sonic, Tails, Shadow, Klombo, Jonesy, Killswitch, Adventure, Bush Ranger, Storm Scout, Crown, 8-Bit, Jazz, Overshield, X-Ray, Onigiri, Pond, Blinky, Crash Bandicoot, Morgana, Birthday) — so the upcoming Bounty Hunter cards show the real icon instead of a placeholder.' },
      { tag: 'Added', text: 'A new “Newest (release date)” sort on the collection — the most recently released Sprites float to the top, so drop-day additions are easy to find.' },
      { tag: 'Added', text: 'Six more lobby codes now that they’re confirmed live: NOCTURNEOP55N1 & DestinyAwaits (Extraction Accelerators / Llama Drops), ChatFindAnotherCode & NoProLlama, PlayToLevelUp (2,000 Dust) and SAYH12WR1X3L (Wrixel’s Hero Portrait Spray).' },
      { tag: 'Fixed', text: 'The leaked “BodySlam” entry turned out to be Crash Bandicoot’s internal codename (his spin attack), not a separate Sprite — merged it into Crash so it’s no longer double-listed.' },
    ],
    summary: 'The just-dropped Sprites (Crash Bandicoot included) now use Epic’s real art, the whole Bounty Hunter finish is pre-loaded with official icons, and you can sort the collection by newest release.',
    why: 'We had stylised placeholders since drop day; swapping in the official leaked art makes the board look finished. Loading the Bounty Hunter icons now (even though the finish isn’t obtainable yet) means the moment it goes live the cards are already correct. The “Newest” sort answers the most common drop-week question — “what just came out?” — using only the release dates we actually know (undated Sprites fall to the bottom rather than guessing).',
  },
  {
    date: 'September 17, 2026',
    title: 'Placeholder art for the v42.20 Sprites (until official art lands)',
    changes: [
      { tag: 'Added', text: 'Stylised placeholder art for the new v42.20 Sprites — Crash Bandicoot, Blinky, Morgana, Birthday and Phase Dash — plus a distinct look for the new Bounty Hunter finish. Crash and Blinky were showing a generic blob since they went live this morning; now every new Sprite has a recognisable card until Epic’s official art is added.' },
    ],
    summary: 'The just-dropped (and upcoming) v42.20 Sprites now render proper stylised placeholder art instead of a generic shape, so the board looks right the moment each one goes live.',
    why: 'Our art fallback only draws a per-character motif for Sprites it has a design for, so brand-new ones fell back to a plain blob. Adding original stylised motifs (colour + a simple shape that reads as the character — never a copy of the real IP art or an AI likeness, same approach as Peely/Batman) keeps the tracker looking finished on drop day. Real leaked art replaces these automatically once the image files are added.',
  },
  {
    date: 'September 17, 2026',
    title: 'New Sprite Day — Crash Bandicoot, Blinky & Pond are live (v42.20)',
    changes: [
      { tag: 'Added', text: 'The v42.20 update went live, so three new Sprites are now marked released in Normal, Gold, Loot Hacker and Cheat Master: Crash Bandicoot (whirlwind spin on an air-jump), Blinky — Pac-Man’s red ghost (a cloak when you take damage) and Pond, the Design-a-Sprite winner (a Super Jump after landing).' },
      { tag: 'Changed', text: 'Refreshed the Loot Hacks rotation to the v42.20 set Epic posted — Rocket Ram, Reaper Sniper Rifle, Mammoth Pistol, Hyperburst Pistol, Deadeye DMR and Flowberry Fizz (the Sep 3 pool rotated out).' },
      { tag: 'Added', text: 'New lobby code: BLINKYINKYPINKYCLYDE for 5,000 Sprite Dust.' },
      { tag: 'Changed', text: 'Added a New Sprite Day news post + top-of-page announcement, and marked the Sep 17 event live.' },
    ],
    summary: 'v42.20 shipped: Crash Bandicoot, Blinky and Pond are collectible now (with Gold/Loot Hacker/Cheat Master), a new Loot Hack rotation is live, and a fresh 5,000-Dust code dropped.',
    why: 'Of the 42 leaked Sprites, Epic only made 13 obtainable at launch (the three new characters + their finishes) and is holding the Bounty Hunter finish, Morgana and Birthday for the following weeks. We flip only what’s actually obtainable and keep the rest leaked/upcoming, so the tracker never over-claims. Official art for the new Sprites isn’t out yet, so they use our generated placeholder art until the assets land.',
  },
  {
    date: 'September 16, 2026',
    title: 'v42.20 leak — 42 new Sprites, a Bounty Hunter finish, 5 new Sprites',
    changes: [
      { tag: 'Added', text: 'A new “Bounty Hunter” finish (Season 4 “Override”), leaked in the v42.20 update. In-game it gives a chance to find Sprites when you eliminate opponents, and it only earns Sprite XP from eliminations — so it levels by fighting rather than from chests. It’s on the 15 already-live Override Sprites plus Pond and the new arrivals below, all marked leaked/upcoming.' },
      { tag: 'Added', text: 'Five brand-new base Sprites with their leaked abilities: Pond (Design-a-Sprite winner — a Super Jump when you jump shortly after landing), Morgana (Persona 5 — boosts healing-item effectiveness), Crash Bandicoot (a whirlwind attack when you jump in the air), Blinky (Pac-Man’s red ghost — a cloak when you take damage at night) and Birthday (chests can spawn cake). Pond also picked up its confirmed finish set.' },
      { tag: 'Changed', text: 'Pond now shows its confirmed v42.20 ability (Super Jump) instead of the older “egg → frog” design concept, and the leaked “Headshot” Sprite is renamed to its proper name, “Head Shot”.' },
      { tag: 'Added', text: 'A News item and a refreshed Sep 17 New Sprite Day event card covering the wave, both clearly labelled leak (Vice / FireMonkey).' },
    ],
    summary: 'The Sep 17 (v42.20) update leaked 42 new Sprites — a third Override finish (Bounty Hunter) and five new base Sprites (Pond, Morgana, Crash Bandicoot, Blinky, Birthday) — all added to the roster as leaked/upcoming.',
    why: 'Epic adds all the files in one update but releases the variants gradually over the following weeks, so everything is added as leaked/rumored (it doesn’t count toward your total) and will flip to live per-drop — the same wave handling we use for Cube/Holofoil/Loot Hacker. Getting the roster in early lets collectors see exactly what’s coming and plan, while keeping our verified-only discipline: only the abilities Epic detailed are shown, everything else is marked TBC.',
  },
  {
    date: 'September 15, 2026',
    title: 'Heads-up for guests — “sign in to save your collection across devices”',
    changes: [
      { tag: 'Added', text: 'If you’ve started tracking Sprites without signing in, a friendly banner now reminds you that your progress is saved on this device only, with a one-tap Sign in. Your current progress carries over when you do. It only appears once you’ve marked at least one Sprite, and it’s dismissible.' },
    ],
    summary: 'A gentle nudge so guests know their collection is device-local until they sign in — and can back it up in one tap.',
    why: 'A player recently signed in on a new device and found an empty collection because their earlier progress was guest data stranded in another browser. Guest progress only reaches the cloud on your first sign-in, so making that explicit (and easy to act on) prevents the “where did my collection go?” surprise and saves more collections.',
  },
  {
    date: 'September 15, 2026',
    title: 'New: a Fortnitemares 2026 hub (Halloween leaks, clearly labelled)',
    changes: [
      { tag: 'Added', text: 'A dedicated /fortnitemares page rounding up everything known about Fortnite’s Halloween event: the estimated start (~Oct 1), the leaked Trick-or-Treat Sprite finish, the reported FNAF and Ghostface crossovers, Halloween Loot Hacks and map changes — each tagged Leak or Rumor, since Epic hasn’t announced it yet. It links into the checklist, codes and Loot Hacks so you can get ready.' },
      { tag: 'Fixed', text: 'Removed a stray “Confirmed & dated only — hover for details” caption under the “Coming up” chips on the top card; it didn’t make sense there.' },
    ],
    summary: 'A Halloween landing page for Fortnitemares 2026 — the biggest Fortnite search spike of the season — with every leak honestly labelled.',
    why: 'Halloween drives a huge organic-traffic surge, and “Fortnitemares 2026” + the FNAF collab are already trending. A dedicated, well-sourced hub captures that search intent and funnels it into the tracker, while keeping our verified-only discipline (everything is badged Leak/Rumor until Epic confirms).',
  },
  {
    date: 'September 15, 2026',
    title: 'Community code check — tell everyone whether a code still works',
    changes: [
      { tag: 'Added', text: 'Every lobby code now has a “Still working? 👍 / 👎” control. Signed-in players can report whether a code worked, and everyone sees the recent tally — so dead codes get flagged by the community fast instead of waiting on a site update. A code with several recent “didn’t work” reports shows a ⚠️ “may be dead” hint.' },
      { tag: 'Security', text: 'Votes are one-per-person-per-code (changeable), and only aggregate counts are exposed — nobody’s individual votes are visible. Counts are read through a definer function; reporting requires sign-in.' },
    ],
    summary: 'Crowd-sourced freshness on the codes page: players vote a code working or dead, and the recent tally shows for everyone.',
    why: 'Codes expire unpredictably and our once-a-day watch can lag reality by hours. Letting the community flag a dead code the moment it stops working keeps the highest-traffic page trustworthy, while keeping our verified-only discipline (reports are a freshness signal shown alongside the code, not an auto-delete).',
  },
  {
    date: 'September 15, 2026',
    title: 'Faster loads — split the big libraries into their own cached chunks',
    changes: [
      { tag: 'Changed', text: 'The app used to ship as one ~590 KB JavaScript file. It’s now split so React, Supabase and other libraries load as separate chunks that the browser fetches in parallel and keeps cached — the app’s own code dropped to ~195 KB. In practice: after each update we ship, you re-download only the small app chunk instead of everything, so return visits load noticeably quicker.' },
    ],
    summary: 'Split the bundle so libraries are cached separately from app code — quicker repeat loads, especially since the site updates often.',
    why: 'Everything was bundled together, so every deploy invalidated the whole 590 KB download for returning visitors, and the build kept warning about the oversized chunk. Splitting the rarely-changing vendor libraries (React, Supabase) from the frequently-updated app code lets browsers reuse the cached libraries across deploys, and the parallel fetch helps first load too. Faster pages also help SEO and ad performance.' },
  {
    date: 'September 14, 2026',
    title: 'Event countdown is now data-driven — no more assuming an event is live',
    changes: [
      { tag: 'Changed', text: 'The top card used to assume a Mastery Monday every Monday and Power Hours every Saturday, so it could show “LIVE” for an event that wasn’t actually running. It now reads from a list of confirmed, dated events (src/data/events.js): it only shows “LIVE” when a real event window is happening, counts down to the next dated one (labelled “expected” when it’s from the in-game timer rather than an Epic post), and otherwise just notes that weekly events usually run Mon/Thu/Sat with a link to the schedule.' },
    ],
    summary: 'The live-event badge and countdown now come from confirmed dates, not a hard-coded weekly guess — so it never claims an event is on when it isn’t.',
    why: 'The weekly cadence is a real pattern, but Epic doesn’t always run every event every week, so a fixed “every Monday = Mastery Monday” rule risked showing a false “LIVE.” Tying it to a small, sourced events list keeps the countdown honest and makes it trivial to light up a confirmed event the moment we have a date.',
  },
  {
    date: 'September 13, 2026',
    title: 'Content accuracy pass — Cheatmaster finish no longer reads as “unconfirmed”',
    changes: [
      { tag: 'Fixed', text: 'The Cheatmaster finish description still said its bonus was “not yet confirmed by Epic (leaked)” — left over from before launch. It’s been live all season, so it now correctly reads as the Season 4 “Override” premium finish: unlocked per-Sprite by a specific Hack the Lobby code, cosmetic (keeps the Sprite’s base ability).' },
      { tag: 'Fixed', text: 'Cleaned up leftover “leaked / unconfirmed until Epic’s patch notes” wording on Season 3 collab Sprites (John Wick, Air) that have long since shipped and are now archived — their descriptions now say so plainly.' },
    ],
    summary: 'Swept the roster and finishes for stale pre-launch “leaked/unconfirmed” copy and corrected it to match what’s actually live.',
    why: 'Some hand-written descriptions were written while a finish or Sprite was still leaked, and the release logic outran the prose — so live content still read as speculative. A quick audit caught the Cheatmaster finish (the most visible one) plus a few archived Season 3 collabs; the counts and release flags were already correct, this was just wording.',
  },
  {
    date: 'September 13, 2026',
    title: 'Tidier top of page — three stacked banners merged into one compact card',
    changes: [
      { tag: 'Changed', text: 'The event announcement, the “Today” event countdown, and the “Heads up — you heard it here first” upcoming feed used to be three separate full-width blocks stacked down the page. They’re now one small card at the top: a slim dismissible announcement line, the live/next event + new-codes row, and upcoming drops shown as compact chips (hover for details). Much less scrolling before you reach your collection.' },
      { tag: 'Removed', text: 'Dropped the “Dust to finish season” stat from the Breakdown card — it wasn’t a number people actually track (finishes like Cheatmaster aren’t Dust-summoned anyway), so it was just noise.' },
    ],
    summary: 'Reclaimed a big chunk of vertical space at the top: the three separate info banners are now one tight card, and a low-value stat is gone.',
    why: 'The three blocks each earned their keep individually but together pushed the actual collection way down the page — especially on phones. Merging them keeps every signal (announcement, live event, what’s coming) while cutting the height, and trimming the Dust-to-finish stat removes a metric that didn’t map to how players think about completing a season.',
  },
  {
    date: 'September 13, 2026',
    title: 'A network blip at sign-in can no longer show an empty collection',
    changes: [
      { tag: 'Fixed', text: 'When you sign in, if the very first read of your collection from the cloud hiccups (a dropped or slow connection), the app used to fall back to showing — and then saving — an empty collection. Now that read is retried, and if it still fails the app keeps what you already have instead of blanking it out, then re-syncs automatically the moment you’re back online or return to the tab.' },
    ],
    summary: 'Signing in during a network blip won’t make your collection look empty anymore — a failed load is retried and never overwrites your data with a blank.',
    why: 'The load path trusted the first cloud read unconditionally; a transient failure returned “no rows,” which then got written to local storage as if the collection were genuinely empty. Your data on the server was never actually lost, but the experience was alarming. Guarding the read (retry, and never clobber with an empty result) fixes the scary “logged in and everything’s gone” case. Note: collection data is still device-local until your first sign-in on that browser — so guest progress added on one device appears only after you sign in there.',
  },
  {
    date: 'September 13, 2026',
    title: 'Your collection now self-heals if a save ever fails',
    changes: [
      { tag: 'Added', text: 'If a save to the cloud fails (a dropped connection, a flaky moment), that change is now queued and retried automatically — the instant you’re back online, after your next successful save, and on a quiet background timer. You don’t have to do anything; it catches up on its own.' },
      { tag: 'Fixed', text: 'A rare edge where un-marking a Sprite (or un-flagging For trade / Wanted) might not stick if that exact save failed — the retry now re-sends your true current state, so removals sync correctly too, not just additions.' },
    ],
    summary: 'Belt-and-suspenders for collection saving: failed cloud writes are queued and retried until they land, so a network blip can’t quietly lose (or resurrect) a change.',
    why: 'Saves were already local-first (nothing is lost) and reconciled at sign-in, but that sign-in merge is additive — it can’t undo an un-mark that failed to reach the cloud. A tiny retry queue that re-sends the full current row closes that gap and means transient failures fix themselves without waiting for the next login.',
  },
  {
    date: 'September 13, 2026',
    title: 'Trade reputation Phase 2 — vouches now backed by a confirmed trade',
    changes: [
      { tag: 'Added', text: 'Every trade-match card (and friend) now has a 🔁 “Mark as traded” button. When both of you mark the same trade, it becomes ✅ mutual — and only then does the 🤝 Vouch button unlock. So a vouch now means a real, two-sided trade actually happened, not just “we’re friends.”' },
      { tag: 'Added', text: 'A lightweight ⚑ Report on any trader — sent privately to us to review. It never auto-lowers anyone’s score (so it can’t be weaponised), it just flags problems for a human.' },
      { tag: 'Security', text: 'Vouching is re-gated: it now requires a mutual trade confirmation (was: just being friends). Reputation tiers got collusion capping too — the ✅ Verified and ⭐ Top tiers only count vouchers who you did NOT vouch back for, so two accounts can’t “I-scratch-yours” each other into a high badge. And we closed a gap that let the app write vouch rows directly — all vouches now go through the gated function only.' },
    ],
    summary: 'Reputation you can trust more: a vouch requires both traders to confirm the trade, reciprocal back-vouches can’t inflate the top tiers, and there’s a quiet way to report bad actors.',
    why: 'Phase 1 opened vouching to any friend, which is easy to fake — friend each other, vouch each other. The strongest, simplest fix is to anchor a vouch to an actual confirmed trade (both sides say it happened), then discount mutual back-vouches so rings can’t farm the top badges. Reports stay advisory-only on purpose: an automatic “report lowers score” is trivially abused, so a human stays in the loop.',
  },
  {
    date: 'September 13, 2026',
    title: 'The road to Chapter 8 — season timing corrected to the leaked 2026 schedule',
    changes: [
      { tag: 'Changed', text: 'Our forward-looking season data no longer calls the next drop “Chapter 7 Season 5.” A widely-reported leaked 2026 schedule says Season 4 “Override” wraps around Nov 1, followed by a short bridge mini-season, with Chapter 8 Season 1 launching ~Dec 5 — so the countdown, the Heads Up spotlight and the season-transition page now describe it that way.' },
      { tag: 'Added', text: 'A News item mapping out the rest of 2026 — Fortnitemares in October, the mini-season, then the Chapter 8 flip — clearly labelled as a leak (source: Vice), not an Epic announcement.' },
    ],
    summary: 'Corrected our “what’s next” timing to match the leaked 2026 roadmap: a bridge mini-season after Override, then Chapter 8 in early December.',
    why: 'We’d assumed the next flip would be a straightforward “Season 5.” The leaked schedule (well-corroborated across outlets) points to a mini-season bridge into a new chapter instead — a bigger deal for collectors, since a chapter flip brings a fresh Sprite generation. Better to describe it accurately now and mark it tentative than to state a season name Epic never used.',
  },
  {
    date: 'September 13, 2026',
    title: 'Trade reputation — vouch for traders you trust',
    changes: [
      { tag: 'Added', text: 'You can now 🤝 vouch for a friend you’ve traded with. A trader’s reputation shows as a badge (🤝 Trusted → ✅ Verified → ⭐ Top trader) on their Friends row and on trade-match cards, so you can tell trustworthy traders at a glance.' },
      { tag: 'Security', text: 'A vouch only counts toward reputation if it’s from a credible account — public, at least 3 days old, and owning 10+ Sprites — so throwaway accounts can’t inflate anyone. You can only vouch for friends (max 5/day), it’s positive-only (no downvotes to abuse), and you can remove your vouch anytime. Counts are served by definer functions; nobody’s raw vouch list is exposed.' },
    ],
    summary: 'A hard-to-game trust signal for trading: vouch for friends, and see who the community trusts.',
    why: 'Opening trades to the whole community (the Want Board) makes trust matter more. Reputation is deliberately a count of credible vouchers, not a star average — averages are trivially gamed and stars invite retaliation. The Sybil bar + friend gate + positive-only design keep it honest; a stronger trade-confirmation gate is the planned Phase 2.',
  },
  {
    date: 'September 12, 2026',
    title: 'Public Want Board — trade-match with any collector',
    changes: [
      { tag: 'Added', text: 'Trade matches now has a “👥 Friends / 🌐 Everyone” toggle. “Everyone” is a community Want Board: it lines up your Wanted list against every public collector’s spares (and your spares against their wants), not just your friends — with their Discord to coordinate. Mark Sprites For trade / Wanted and you show up for others too.' },
    ],
    summary: 'Find a trade with anyone in the community, not only your friends — a public Want Board built on the trade matcher.',
    why: 'Friends-only matching is high-signal but small; opening it to all public collectors is the biggest trade differentiator rivals lean on. The matching + privacy were already in place (a global matcher existed but was never surfaced), so this is mostly making an existing capability visible.',
  },
  {
    date: 'September 12, 2026',
    title: 'Friends & trade matcher are now easy to find',
    changes: [
      { tag: 'Changed', text: 'The Leaderboard tab is now “🏆 Leaderboard & Friends,” so saving friends and the trade matcher aren’t hidden behind an unlabelled toggle anymore.' },
      { tag: 'Added', text: 'Deep links: /?view=leaderboard&tab=friends opens straight to your Friends list, and &tab=trades jumps right into Trade matches — and the “How to trade Sprites” guide now links directly there instead of just saying where to look.' },
    ],
    summary: 'Friends and the trade matcher are discoverable in the nav and one click away from the trading guide.',
    why: 'These are among the stickiest features but were buried three levels deep with no nav label — our own trade guide pointed people to a path they couldn’t find. Naming it in the nav and adding deep links closes that gap.',
  },
  {
    date: 'September 12, 2026',
    title: 'Mobile: progress & Next-to-chase moved above the grid',
    changes: [
      { tag: 'Changed', text: 'On phones, your Collection %/Mastery breakdown and the “Next to chase” pick now sit right above the Sprite grid instead of all the way at the bottom below the entire roster — so the most useful cards are reachable without scrolling past everything. On desktop they stay in the sidebar as before.' },
      { tag: 'Changed', text: 'Removed the last-season Chest-luck (drop-odds) card from the Collection sidebar — it’s a Season 3 tool and already lives on the Sprites board and the /drop-rate-calculator page. Declutters the rail.' },
    ],
    summary: 'Mobile players see their progress and next target first; the collection sidebar is a bit leaner.',
    why: 'On a phone the sidebar rendered below the whole grid, so the genuinely useful cards (progress, next-to-chase) were effectively unreachable. Hoisting them up top fixes the single biggest mobile issue, and dropping the legacy Season-3 odds card trims sidebar noise.',
  },
  {
    date: 'September 12, 2026',
    title: 'Fix: /codes page highlighted the wrong nav item',
    changes: [
      { tag: 'Fixed', text: 'On the Lobby Hacks (/codes) guide page, the top nav was highlighting “News” instead of “Lobby Hacks.” Now the correct tab is marked active.' },
    ],
    summary: 'Small nav-highlight fix on the codes page.',
    why: 'A UX pass caught the wrong active-nav key on /codes — a quick correctness fix so the highlighted tab matches the page you’re on.',
  },
]
