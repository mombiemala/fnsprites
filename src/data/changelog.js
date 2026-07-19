// App changelog / release notes — technical, but written for humans. Newest
// entry first. Each release: a friendly summary, the concrete changes (tagged
// Added / Changed / Fixed / Security), and the *why* behind the bigger calls.
//
// When you ship something notable, add an entry to the TOP of this array.

export const CHANGELOG = [
  {
    date: 'July 17, 2026',
    title: 'Quick-check list, Dust-to-complete & export backgrounds',
    summary:
      'Three collector tools: a fast list view for ticking off lots of variants, a running estimate of the Sprite Dust left to finish your set, and pick-a-background styling for the share image.',
    changes: [
      { tag: 'Added', text: 'Quick-check list view — a new ▦ / ☰ toggle by the Sort control switches the collection to a dense one-row-per-sprite list where each variant is a tappable chip. Much faster than opening cards when you’re entering a lot at once; it respects all your current filters and grouping.' },
      { tag: 'Added', text: '“Dust to complete” card in the sidebar — a running estimate of how much Sprite Dust it’d take to summon every released variant you’re still missing, broken down by rarity. Clearly labelled an estimate (most Sprites come from Chests).' },
      { tag: 'Added', text: 'Export backgrounds — the Share & Export dialog now has a row of background themes (Midnight, Galaxy, Ember, Slate, Forest) that restyle your collection image, previewed live before you download.' },
    ],
    why:
      'These fill the gaps competitors cover: bulk manual entry (their checklists are list-first), a summon-cost/“value” number collectors like to chase, and customisable share cards. Each is self-contained and reuses data/logic already in the app (the filtered list, the dust-cost table, the export renderer), so they add utility without new dependencies.',
  },
  {
    date: 'July 17, 2026',
    title: 'Share & export, front and center (with a live preview + Holofoil)',
    summary:
      'Sharing your collection is no longer tucked in the sidebar — a prominent button by the progress bars opens a proper Share & Export dialog with a live image preview, and the export card finally includes the Holofoil column.',
    changes: [
      { tag: 'Added', text: 'A “📤 Share & export” button right under the progress bars (for everyone, guest or logged-in) opens a dialog with a live preview of your collection image, a Collection/“Sprites I need” toggle, PNG download, the Discord/Reddit caption, and your share link.' },
      { tag: 'Added', text: 'The exported Sprite-Locker image now includes a Holofoil column (iridescent styling), alongside Normal/Gold/Gummy/Galaxy — so shared cards reflect the full live roster.' },
      { tag: 'Fixed', text: 'The export now reads release state from the live sprite list, so date-gated forms (Holofoil) show as collectible instead of drawing a lock on every cell.' },
      { tag: 'Changed', text: 'Tidied the sidebar share card down to a single button that opens the new dialog, removing the duplicated export/caption buttons.' },
    ],
    why:
      'Export was genuinely hard to find (buried in a sidebar card) and its output was already a strong share asset that competitors lean on hard — so putting it one obvious click from the progress you’re proud of, with a preview so you see what you’re posting before you download, turns it into the growth loop it should be. Holofoil’s been live since Jul 9, so leaving it off the card made shares look out of date.',
  },
  {
    date: 'July 17, 2026',
    title: 'Release-state audit + Cube & Lucky Locator on the radar',
    summary:
      'Double-checked every “live” variant against the current game state, and added the freshly-teased/leaked items that are on the way.',
    changes: [
      { tag: 'Changed', text: 'Verified the released roster against multiple sources: Air, Seven & Batman are correctly live with their full Gold/Gummy/Galaxy/Holofoil lines (Batman’s specials ramp up during Jul 18 Shiny Hours), and Pollo, Vini Jr. & Burnt Peanut are correctly Normal-only. No sprite or variant is marked live before it actually is.' },
      { tag: 'Added', text: 'News: a teased Cube Sprite variant (a new special finish expected late July, ~Jul 23–30) — Cube already shows as a Rumored form on each sprite, so nothing flips live until it’s confirmed.' },
      { tag: 'Added', text: 'News: the leaked Lucky Locator item (v41.30, ~Jul 30) that reportedly guarantees a Sprite you don’t own yet.' },
    ],
    why:
      'The tracker’s whole value is being trustworthy about what’s actually obtainable, so “is everything that says live really live?” is worth auditing whenever a wave of Sprites drops. The leaked Cube/Lucky-Locator dates are deliberately kept out of the auto-release date-gate (they’re predictions, not firm) — they live in News as tentative so nothing releases early by mistake.',
  },
  {
    date: 'July 17, 2026',
    title: 'Shiny Hours (Jul 18) added to the events feed',
    summary:
      'Prepped the app for tomorrow’s Power Hour so it surfaces automatically on the day.',
    changes: [
      { tag: 'Added', text: 'Shiny Hours event (Sat, Jul 18 · 2 PM & 9 PM ET) — boosted Batman Sprite & Special-variant (Gold/Gummy/Galaxy/Holofoil) spawns, everyone starts with a Batman Grapnel Gun & Self-Revive, and new Quests unlock the Batman Sprite. Added to both the announcement bar and the News feed.' },
      { tag: 'Fixed', text: 'Corrected the recurring “Weekly Sprite events” note — Saturday Power Hours run 2 PM & 9 PM ET (not 3:30 & 9:30), matching every dated Power Hour this season.' },
    ],
    why:
      'Both entries are date-gated to Jul 18, so the announcement bar leads with Shiny Hours (and it pins to the top of News) only on the day, then falls back to the general DC “Hot Bat Summer” notice — no manual toggling needed.',
  },
  {
    date: 'July 16, 2026',
    title: 'Cleaner header & one-row navigation',
    summary:
      'Reorganised the top of the app so everything lives in one predictable place: the title takes you home, every section and utility sits in a single nav row, and the save status moved somewhere it actually reads.',
    changes: [
      { tag: 'Added', text: 'The “FN Sprite Tracker” title is now clickable — it takes you back to your Collection (home). From a shared profile it takes you to your own tracker.' },
      { tag: 'Changed', text: 'Collection, Leaderboard, Trade, News, Farming and Guide now sit together in one navigation row, with only the More menu set off by a divider, instead of Guide/More floating in the header separate from the section tabs.' },
      { tag: 'Changed', text: 'The “✓ Saved” cloud-sync status moved out of the crowded header row to sit directly under your profile name, where it clearly refers to your account.' },
    ],
    why:
      'The header had two competing clusters — section tabs in one place, Guide/More/account controls in another — so “where do I click for X?” wasn’t obvious. One nav row for everything, a clickable title as the universal “home,” and status text anchored to the thing it describes make the app easier to move around. Home stays the Collection itself (not a separate landing page) so returning players reach the tool in zero clicks.',
  },
  {
    date: 'July 16, 2026',
    title: 'Trade examples, one-card onboarding & SEO groundwork',
    summary:
      'Three follow-ups from the UX review: the Trade board now teaches its format instead of looking dead when empty, the new-visitor prompts collapse into a single card, and the app finally gives search engines and slow connections real content on first paint.',
    changes: [
      { tag: 'Added', text: 'When the Trade board has no live posts, it now shows a few clearly-labelled “Example” trades (what a good want/offer post looks like) with a “be the first to post a real one” nudge — they’re inert, badged, and vanish the instant a real trade exists, so nothing is ever faked as activity.' },
      { tag: 'Changed', text: 'Onboarding consolidated: new visitors used to see three stacked prompts (a hint, a screenshot-import card, and a bulk “mark all” bar). Now it’s one card with all the shortcuts inside — Import a screenshot, Mark all owned, How Sprites work — and the standalone import card/bulk bar only appear once you’ve started, so there’s exactly one import entry point at any time.' },
      { tag: 'Added', text: 'SEO & first-paint: the page now serves a real, crawlable hero (title + tagline) and a loading state instantly instead of a blank screen while the app boots, plus JSON-LD structured data, a canonical URL, robots.txt and a sitemap.' },
    ],
    why:
      'Empty social surfaces (the map, and nearly the Trade board) are what make a tool feel dead — showing the *format* teaches newcomers and invites the first real post without deceiving anyone. Consolidating onboarding removes the “wall of prompts” that competed for a new user’s first tap. And a client-only SPA hands crawlers and link-unfurlers a blank div; static first-paint content + structured data make the app discoverable and its shared links rich — which compounds the guest-sharing loop we just added.',
  },
  {
    date: 'July 16, 2026',
    title: 'UX polish — first-impression fixes & guest sharing',
    summary:
      'A pass over the workflows a new visitor hits first: fixed stale onboarding copy, made the leaderboard actually show on open, guarded the bulk “mark all owned” button, and let logged-out players copy a share caption.',
    changes: [
      { tag: 'Fixed', text: 'The welcome modal no longer points new visitors at the retired community loot map — it now describes the Farming guide that replaced it.' },
      { tag: 'Changed', text: 'The Leaderboard now loads automatically when you open the tab (with a loading skeleton) instead of sitting empty behind a “Load” button — a leaderboard you have to click to see undercuts the point of it.' },
      { tag: 'Added', text: 'Logged-out players can now copy a ready-to-paste Discord/Reddit caption of their progress (with a link back), not just export images — sharing no longer requires an account.' },
      { tag: 'Changed', text: 'Bulk “Mark all shown owned” now asks for confirmation on a big sweep (15+), so a curious first tap can’t mark the whole roster owned by accident. Filtered handfuls still mark instantly.' },
      { tag: 'Changed', text: 'Trimmed the live-event announcement bar headline so it doesn’t swallow the top of the screen on mobile.' },
    ],
    why:
      'Competitor trackers are lean and lead hard with the “copy your collection to Discord” loop; our depth already beats them, but the first-run experience had rough edges (an empty leaderboard, share gated behind login, stale map copy) that cost us on exactly the moments that decide whether a new visitor stays.',
  },
  {
    date: 'July 16, 2026',
    title: 'Source refresh — data re-verified, credits & README brought current',
    summary:
      'Did a full pass over every open source we cite to confirm the roster, abilities and events are still accurate after v41.20, added a couple of new drop-rate sources, and cleaned the stale bits out of the footer and README.',
    changes: [
      { tag: 'Changed', text: 'Re-verified the v41.20 roster against Beebom, Vice, GAMES.GG, AllThings.How and Epic patch notes — Batman/Air/Seven abilities, Seven’s variant line (Normal/Gold/Gummy/Galaxy/Holofoil) and Pollo/Vini Jr. (Normal-only) all confirmed accurate; the leaked Spider-Man sprite (~Jul 30, v41.30) stays labelled Rumored.' },
      { tag: 'Added', text: 'Credited two community drop-rate trackers — AccountShark and GAMES.GG — on the drop-rate line (Epic still publishes no official rates).' },
      { tag: 'Fixed', text: 'Footer art credit no longer calls Air & Seven “upcoming” (they’re live), and now notes that real-person collab sprites (Vini Jr., Pollo) use official art with the background removed — never an AI likeness.' },
      { tag: 'Changed', text: 'README refreshed: roster date moved to Jul 16 (v41.20), the retired crowd-sourced map is described as the curated farming guide it became, filter behaviour and the DB-schema/customizing notes were corrected.' },
    ],
    why:
      'The tracker’s credibility rests on the data being right and the sourcing being transparent — so a periodic sweep of the open sources (and pruning docs that still described nixed features like the community map) is worth doing even when nothing player-facing changed.',
  },
  {
    date: 'July 16, 2026',
    title: 'Progress that counts what you can actually collect (redesign, part 2)',
    summary:
      'The progress bars now measure against the variants that are obtainable right now, so 100% means “done with everything live” — and the leftover rumored/upcoming forms are called out instead of quietly inflating the total.',
    changes: [
      { tag: 'Changed', text: 'Collection & Mastery progress now use the released/obtainable count as the denominator (e.g. /93) instead of the full roster including unreleased forms (/141). Owned counts exclude unreleased forms to match, so the bar can never read past 100%.' },
      { tag: 'Added', text: 'A caption under the bars spells it out: “N variants obtainable now · M more rumored/upcoming (toggle Show unreleased in Filters to include them).”' },
    ],
    why:
      'A fresh player seeing “0/141” had no way to know 48 of those aren’t even in the game yet — it made the collection feel unfinishable. Measuring against what’s live (and naming the upcoming remainder) makes progress honest and the goal reachable, while power users can still opt the leaked forms in.',
  },
  {
    date: 'July 16, 2026',
    title: 'Cleaner collection filters (redesign, part 1)',
    summary:
      'The collection page no longer buries the sprites under a wall of controls — the filters now tuck behind a single button on every screen size.',
    changes: [
      { tag: 'Changed', text: 'On desktop, the theme/rarity chips, ownership, grouping and toggles now collapse behind a single “⚙ Filters” button (with an active-count badge) — just like mobile already did. Search and Sort stay out for quick access, so the sprite grid shows immediately instead of after two rows of chips.' },
      { tag: 'Changed', text: 'Inside the panel, controls are grouped under clear “Variant” and “Rarity” headings.' },
    ],
    why:
      'The old desktop layout dumped a search box, three dropdowns, two checkboxes and ~15 filter chips above the grid — you had to scroll past all of it to see a sprite. Collapsing it keeps power-user filtering one tap away while letting the collection lead. (First step of a larger top-of-page tidy-up.)',
  },
  {
    date: 'July 16, 2026',
    title: 'Seven Sprite is now live',
    summary:
      'Seven released with v41.20 after all — flipped it to collectible with its variant line.',
    changes: [
      { tag: 'Changed', text: 'Seven Sprite (reveals enemy foot trails for your squad, 10→30s by level) is now released, with Normal, Gold, Gummy, Galaxy & Holofoil. News entry updated to match.' },
    ],
    why:
      'Despite Epic’s earlier schedule showing only Batman & Air, Seven shipped in the Jul 16 update — so it’s now marked collectible rather than held back.',
  },
  {
    date: 'July 16, 2026',
    title: 'Official art for Pollo & Vini Jr. (Normal-only)',
    summary:
      'Both new Mythics now use their real in-game artwork, and are correctly set to Normal-only for now (like Burnt Peanut).',
    changes: [
      { tag: 'Added', text: 'Official sprite art for Pollo (a gamer character — headset, esports jersey, red beak) and Vini Jr. (Vinícius Júnior in the Brazil kit), background-removed and matched to the roster’s transparent format. These are the official in-game renders used for identification — not AI-generated likenesses.' },
      { tag: 'Fixed', text: 'Set both to Normal-only (no Gold/Gummy/Galaxy/Holofoil line yet), like Burnt Peanut, and corrected the News entry to match.' },
    ],
    why:
      'A real footballer’s sprite should be the official art, never an AI-fabricated likeness — so these use Epic’s own renders (background removed), consistent with how the rest of the roster uses official art.',
  },
  {
    date: 'July 16, 2026',
    title: 'Pollo & Vini Jr. Mythic Sprites added — now live',
    summary:
      'Two Mythic football-collab Sprites went live in v41.20 — added to the roster as collectible, with their abilities and full variant lines.',
    changes: [
      { tag: 'Added', text: 'Pollo (Mythic) — on an elimination, slowly replenish shield for you and nearby squad (scales per level).' },
      { tag: 'Added', text: 'Vini Jr. / Vinícius Júnior (Mythic) — sprint briefly to make your slide destructive; slide-kicking enemies boosts fire rate & reload. Both are live (found in Sprite Chests) with Gold, Gummy, Galaxy & Holofoil, and appear in the News feed.' },
    ],
    why:
      'They shipped in v41.20 alongside the Batman drop and are confirmed obtainable, so they’re marked collectible like the rest of the roster. (Art comes from the official sprites at first chance — Vini Jr. is a real player, so no AI-generated likeness.)',
  },
  {
    date: 'July 16, 2026',
    title: 'DC “Hot Bat Summer” is live — roster caught up to v41.20',
    summary:
      'The July 16 update landed, so the tracker now reflects what actually shipped: Batman & Air are collectible, Batman’s power is filled in, and the news/announcement/farming notes are updated.',
    changes: [
      { tag: 'Added', text: 'Batman’s revealed power: deploy the Bat Cape midair for a glide. Batman & Air Sprites are now live (auto-released with the Jul 16 date) — Batman is Mythic with Gold, Gummy, Galaxy & Holofoil.' },
      { tag: 'Changed', text: 'The DC news item flipped from a tentative leak to a live “Hot Bat Summer” event (with the v41.20 patch-notes link), and a live announcement banner runs through Jul 20. Added a farming note for the new Bat Cave landmark under Wonkeeland.' },
      { tag: 'Changed', text: 'Held Seven back: despite the launch, Epic’s official New Sprite Day list still shows only Batman & Air, so Seven stays unreleased/unconfirmed rather than auto-releasing.' },
    ],
    why:
      'Drop day is exactly when accuracy matters most — following Epic’s confirmed patch notes (Batman + Air, Batman’s Bat Cape power, the Bat Cave POI) keeps the tracker honest, while not over-claiming Seven until Epic lists it.',
  },
  {
    date: 'July 16, 2026',
    title: 'Batman Sprite art — real renders for launch day',
    summary:
      'Batman drops today, so it now has real rendered artwork for all its forms, matching the rest of the collection. Also gave the Seven Sprite a proper Normal render.',
    changes: [
      { tag: 'Added', text: 'Rendered artwork for the Batman Sprite across all its released forms — Normal, Gold, Gummy, Galaxy and Holofoil — in the same 3D chibi collectible style as the rest of the roster, so it no longer falls back to placeholder art on launch day.' },
      { tag: 'Fixed', text: 'Replaced the Seven Sprite’s Normal render (the old one had an uncut background and off-style look) with a clean one that matches its other variants.' },
      { tag: 'Changed', text: 'Audited every released Sprite × form — all of them now have consistent real art (no more SVG fallbacks for released sprites).' },
    ],
    why:
      'A collection tracker should look complete the day a Sprite launches — half the shelf as real renders and Batman as a flat placeholder would read as unfinished. Now every released form is covered.',
  },
  {
    date: 'July 14, 2026',
    title: 'Removed a broken Seven Sprite image',
    summary:
      'The Seven Sprite’s Normal art was a mismatched render with an uncut background — pulled it so it falls back to the clean in-app art until a proper render replaces it.',
    changes: [
      { tag: 'Fixed', text: 'Removed the broken Normal render for the (unreleased) Seven Sprite — its background was never cut and the style didn’t match the rest of the roster. It now uses the consistent generated art. Seven’s other variants were already correct, and the Air Sprite’s full set checks out.' },
    ],
    why:
      'A half-finished image looks worse than the clean fallback. Batman and Spider-Man still need real renders to match the roster — that needs image generation, which is queued for when an API key is available.',
  },
  {
    date: 'July 14, 2026',
    title: 'Known Issues can now be marked “Resolved”',
    summary:
      'Bugs Epic fixes no longer just vanish from the feed — they get a green “✓ Resolved” badge and stick around a while so you can see what was fixed and when.',
    changes: [
      { tag: 'Added', text: 'A “Resolved” state for Known Issue entries — set `resolved: true` (+ the patch it was fixed in) and the red “Known Issue” badge becomes a green “✓ Resolved · vXX.XX”. Resolved items sort below the still-open ones by their fix date.' },
      { tag: 'Changed', text: 'Marked the v41.10 Sprite fixes (Dream Legendary loot, Fire vs. airborne targets) as Resolved. Rechecked the open ones — the Aura/Fire shield-damage bug is still unfixed, so it stays a live Known Issue.' },
    ],
    why:
      'Deleting a bug the moment it’s fixed loses useful history — players wondering “did they ever fix X?” get a clear answer. Keeping resolved items briefly, clearly marked and sorted below current issues, is more informative than silence.',
  },
  {
    date: 'July 13, 2026',
    title: 'Drop rates filled in & reconciled',
    summary:
      'Cross-checked every Sprite’s drop rate against community sources, filled the blanks, and made clear these are estimates (Epic doesn’t publish official rates).',
    changes: [
      { tag: 'Added', text: 'Drop rates for the five Sprites that were blank — Striker & Fishy (8.73%, Rare), Aura (5.22%, Epic), Boss (2.436%, Legendary), and Grim Reaper (~0.000098%, the rarest Sprite in the game).' },
      { tag: 'Changed', text: 'Burnt Peanut updated to ~2.97% (was 1.01%) — multiple sources agree it drops far more often than other Mythics because it has no variant slots. Water/Earth/Fire (8.73%) and Zero Point (0.00034%) were already in line with community data.' },
      { tag: 'Changed', text: 'Reworded the note so it’s explicit these are cross-referenced community estimates (accountshark, fortnite.gg, wikis) that vary by source — Epic never publishes official rates.' },
    ],
    why:
      'Blank drop rates left obvious gaps, and precise-looking numbers with no caveat overstate certainty. Filling them from the tier bases + widely-cited Mythic figures, while labeling the whole thing an estimate, is the honest middle ground.',
  },
  {
    date: 'July 13, 2026',
    title: 'Jul 16 New Sprite Day lined up — Batman & Air (Seven held back)',
    summary:
      'Rechecked the upcoming drop against Epic’s weekly schedule and corrected who’s actually coming Jul 16 and with which variants.',
    changes: [
      { tag: 'Fixed', text: 'Batman is Mythic (was Legendary) and gains its Gold variant — Epic’s marketing shows Gold, Gummy, Galaxy & Holofoil. It’s on Epic’s Jul 16 New Sprite Day schedule and will auto-release then.' },
      { tag: 'Changed', text: 'Seven is no longer date-gated to Jul 16 — Epic’s weekly schedule shows only Batman & Air on New Sprite Day, so Seven stays “rumored/unreleased” (some leaks say ~Jul 23, unconfirmed) instead of auto-releasing on the 16th.' },
      { tag: 'Fixed', text: 'When a leaked Sprite auto-releases, its still-rumored variant forms (Gem — disabled; Cube/Quack — bonuses unrevealed) no longer flip to “collectible” with it. So Batman/Air will release with their real variant lines, matching how the rest of the roster treats those forms.' },
    ],
    why:
      'A tracker that says a Sprite dropped when it didn’t — or lists variants that aren’t obtainable — is worse than silence, especially the day of a release. Following Epic’s own posted schedule (Batman + Air, not Seven) keeps drop day accurate, and the variant-gate fix prevents phantom “collectible” forms.',
  },
  {
    date: 'July 12, 2026',
    title: 'Event tidy-up + retired map tables removed',
    summary:
      'Freshened the events feed now that Holofoil Hours has passed, and finished cleaning up after the old community map.',
    changes: [
      { tag: 'Changed', text: 'Holofoil Hours (Jul 11) moved from “upcoming” to a past event now that it’s run — so it no longer sits at the top of the upcoming list. Weekend Power Hours continue every Saturday (covered by the Weekly events entry).' },
      { tag: 'Added', text: 'A News entry for Epic’s “Design A Sprite” contest (ran Jun 17 – Jul 1) — a notable community event we’d missed; winners are still to be announced.' },
      { tag: 'Removed', text: 'Dropped the now-unused Supabase tables from the retired community map (map_markers, map_marker_votes, maps, map_shares) and their access policies. No player data was affected — they only held seed markers.' },
    ],
    why:
      'A dated “upcoming” event that’s already happened is just noise, and leaving orphaned tables around is avoidable attack surface — cleaning both keeps the app honest and tidy.',
  },
  {
    date: 'July 10, 2026',
    title: 'News: proper chronological order + search',
    summary:
      'The News feed now sorts by real dates instead of hand-kept order, and you can search it.',
    changes: [
      { tag: 'Fixed', text: 'News is now genuinely chronological: a live event stays pinned at top, upcoming items list soonest-first, and past updates run newest-first — sorted by each item’s actual date rather than its position in the list.' },
      { tag: 'Added', text: 'A search box in the News tab that filters by title, body, source or tag, with a clear “no matches” state. Current/evergreen entries (weekly events, known issues) sort in with today’s news so they stay visible.' },
    ],
    why:
      'The feed had been ordered by hand, so adding an item in the wrong spot could make the timeline read out of order; sorting on the real date makes it self-correcting. Search keeps the growing feed usable without scrolling.',
  },
  {
    date: 'July 10, 2026',
    title: 'Consistent navigation — everything reachable top and bottom',
    summary:
      'The header and footer now expose the same links, so you never have to hunt for a section or page depending on where you are on the screen.',
    changes: [
      { tag: 'Added', text: 'A footer “Sections” row that mirrors the top tabs (Collection, Leaderboard, Trade, News, Farming) — every section is now reachable from the bottom of the page too.' },
      { tag: 'Added', text: 'A “⋯ More” menu in the header with About, Changelog, Backup, Report a bug and Buy me a coffee — the same utility links that live in the footer, now available up top alongside the ❔ Guide button.' },
      { tag: 'Changed', text: 'The links are driven by a single shared list, so the header and footer stay in sync automatically. Also renamed the old “Map” tab to “Farming” to match its new content.' },
    ],
    why:
      'Links that appeared in only one place made the app feel inconsistent — a section on the top bar but nowhere in the footer, or a page in the footer but not up top. Sharing one source of truth guarantees parity and means adding a link once shows it everywhere.',
  },
  {
    date: 'July 10, 2026',
    title: 'Map → a focused “Where to farm Sprites” guide',
    summary:
      'Replaced the crowd-sourced community map with a lightweight, curated farming guide — the chest hotspots that actually matter, plus links to the best interactive maps. No login, no clutter.',
    changes: [
      { tag: 'Changed', text: 'The Map tab is now “Farming”: what a Sprite Chest looks like (blue glow + pink crystal), the top chest hotspots (Sinister Strip = 4, Wonkeeland / Calamari Canyon / Heatwave Harbor / Shaken Sanctuary = 3 each), farming tips, and links out to the full Sprite Sanctuary and Fortnite.GG interactive maps.' },
      { tag: 'Removed', text: 'The crowd-sourced loot map (add / move / confirm-vote markers, personal maps, gamertag sharing). It required a login to contribute and had seen zero player-added markers, while dedicated tools already map every Sprite Chest from the game’s fixed spawn data.' },
    ],
    why:
      'Sprite Chests spawn from a known, fixed set of points — so asking players to log in and hand-place approximate markers recreated data that’s already published and mapped better elsewhere, and it never got adoption. A short curated hotspot list that points at the authoritative maps is more useful to a new player and near-zero to maintain, and it lets the app focus on what it does best: tracking your collection.',
  },
  {
    date: 'July 10, 2026',
    title: 'Accuracy pass: corrected Sprite abilities + a Known Issues feed',
    summary:
      'A full re-check of every Sprite’s ability and each variant’s bonus against current sources turned up a lot of drift — many abilities were early guesses, not what actually shipped. Fixed all of them, corrected two variant percentages, and added a Known Issues section to the news feed.',
    changes: [
      { tag: 'Fixed', text: 'Rewrote the abilities that were wrong to match the live game: Zero Point (spawns a Shield Bubble Jr. on self-heal, not “teleports”), Boss (max HP/Shield boost, not “hires henchmen”), Ghost (cloak on reload), Dream (random loot, Legendary at max level), Demon (siphon health+shields on elim), Punk (random buff; infinite-ammo chance at max), King (pickaxe damage), Fishy (swim speed), Aura (Shock Rock charge on damage), Grim Reaper (marks whoever damages you), Striker (Overdrive on Mantle/Hurdle), plus small clarifications to Water, Fire and Duck.' },
      { tag: 'Fixed', text: 'Variant bonuses corrected: Gummy is +20% Sprite Dust (was +10%) and Galaxy is +30% ammo (was +20%). Gem is now flagged datamined/unconfirmed — it was disabled on Jun 25 and isn’t currently obtainable. Gold and Holofoil were already correct.' },
      { tag: 'Added', text: 'A “Known Issue” tag and section in the news feed, seeded from Epic’s official Live Issues page and patch notes — currently the Aura/Fire shield-damage bug and the Ranked Slap stamina-bar visual bug, plus a note on the Sprite bugs fixed in v41.10. Filter the feed to “Known Issue” to see just these.' },
    ],
    why:
      'A tracker’s whole value is being right — an ability that reads well but describes the wrong power is worse than no text. These are now sourced from the community wiki, Fortnite.GG, GameSpot and Epic’s own notes. For bugs specifically, the durable move is curating from Epic’s official issues list and patch notes rather than scraping Reddit/Twitter: it’s authoritative, safe to show, and low-maintenance (remove an entry when Epic ships the fix).',
  },
  {
    date: 'July 10, 2026',
    title: 'DC Summer (Jul 16) leak firmed up',
    summary:
      'Rechecked the events and rumors against current reporting. Everything still lines up; the July 16 DC Summer leak has strengthened, so its news entry now carries the fuller, better-sourced details.',
    changes: [
      { tag: 'Changed', text: 'DC Summer news item: dataminer HYPEX now corroborates the earlier Nintendo eShop listing, so the entry adds the ~7 AM ET go-live, Seven’s “~30s at max level” trail-tracking, and the wider collab (summer Harley Quinn / Poison Ivy / Catwoman skins, Batmobile, “Ace” dog sidekick). Still flagged tentative/unofficial until Epic posts patch notes.' },
    ],
    why:
      'Two independent leak sources agreeing is a meaningful step up from a lone retailer listing, so the entry should reflect that — while still making clear it isn’t official, since the date traces to leaks, not Epic.',
  },
  {
    date: 'July 10, 2026',
    title: 'Holofoil Hours details filled in',
    summary:
      'Ahead of Saturday’s Holofoil Hours, the news item and announcement now spell out the full event details, not just “boosted spawns.”',
    changes: [
      { tag: 'Changed', text: 'Holofoil Hours (Sat, Jul 11) now notes the two extended 2-hour sessions (2 PM & 9 PM ET) and that every player starts the match with a Self-Revive Device and Shock Rocks, on top of the boosted Holofoil spawns.' },
    ],
    why:
      'The extra loadout and the longer sessions change how you’d plan the grind, so it’s worth stating plainly rather than making players cross-reference an outside schedule.',
  },
  {
    date: 'July 9, 2026',
    title: 'Real Holofoil artwork across the whole roster',
    summary:
      'Every live Holofoil Sprite now shows a real rendered image with the iridescent Holofoil sheen — the last 10 that were still falling back to the placeholder art are done, so the shelf looks consistent.',
    changes: [
      { tag: 'Added', text: 'Rendered Holofoil artwork for the remaining 10 Sprites (Earth, Duck, Dream, Demon, Punk, Striker, Fishy, Aura, Boss, Grim), matching the look of the first five so all 15 live Holofoils are consistent.' },
      { tag: 'Fixed', text: 'Cleaned up the render backgrounds so they’re fully transparent — no stray checkerboard patches behind any Sprite.' },
    ],
    why:
      'A collection tracker lives or dies on its shelf looking right. Half the Holofoils showing real art and half showing the generated placeholder read as unfinished, so bringing every live Holofoil up to the same rendered quality was worth doing before moving on.',
  },
  {
    date: 'July 9, 2026',
    title: 'Guide one tap away + accurate Sprite locations',
    summary:
      'The “How Sprites work” guide is now a button in the header (not just the footer), and the “where to find” info is corrected — Sprites aren’t location-locked.',
    changes: [
      { tag: 'Added', text: 'A ❔ Guide button in the header opens “How Sprites work” from anywhere.' },
      { tag: 'Fixed', text: 'Corrected the “where to find” notes: every Sprite comes from Sprite Chests island-wide (any chest can drop any Sprite — rarity sets the odds, not location), so the old “Fishy: better near water” hint (which implied location-based drops) is gone.' },
      { tag: 'Added', text: 'The guide now includes real farming tips — chests glow blue with a pink crystal, turn on Visualized Sounds to spot them, and Sinister Strip (4 chests) is the busiest spot.' },
      { tag: 'Changed', text: 'Footer credits caught up: the Air/Seven Gemini renders, the tier-list sources (GAMES.GG, PlayerAuctions, Destructoid), and the Hotspawn / Insider Gaming news sources are now attributed.' },
    ],
    why:
      'The guide answers the questions new players actually have, so it shouldn’t be buried at the bottom of the page. And accuracy is the brand — implying a Sprite drops more in one spot when drops are pure RNG from chests is exactly the kind of thing to get right.',
  },
  {
    date: 'July 9, 2026',
    title: 'Holofoil Sprites are live — auto-released across the roster',
    summary:
      'Holofoil variants unlocked for every Sprite today. They flipped from Unreleased to collectible automatically — the tracker now date-gates known form drops so it’s accurate the moment they land.',
    changes: [
      { tag: 'Added', text: 'Holofoil is now a collectible variant on 15 Sprites — every released Sprite except the Normal-only Burnt Peanut — mark, level and master them like any other. Bonus: +5% squad chance to find rare Gold/Gummy/Galaxy Sprites from chests, and they’re easier to spot on the map.' },
      { tag: 'Changed', text: 'Confirmed live: Epic announced Holofoil on the community site, so the news item and announcement bar now read “live” and official (not a leak). Reverted Burnt Peanut to Normal-only to match Epic’s 15-variant rollout.' },
      { tag: 'Added', text: 'A date-gated release mechanism: variant forms and upcoming sprites auto-flip from Unreleased to collectible on their expected date (evaluated each visit), so the roster stays correct on drop day with no manual edit. Set up now: Holofoil (today), Air/Seven/Batman (~Jul 16) and Spider-Man (~Jul 30) — the latter dates are leaked, so we’ll recheck them before each drop; a wrong date is a one-line fix.' },
      { tag: 'Changed', text: 'Roster now reads “accurate to the Jul 9, 2026 update (Holofoil).”' },
    ],
    why:
      'Accuracy is the whole point, and a form that rolls out across the entire roster on a known date shouldn’t need someone hand-editing 16 entries on release morning. Auto-gating firmly-dated drops keeps the tracker right the instant they go live, while leaving leaked dates under human control.',
  },
  {
    date: 'July 8, 2026',
    title: 'Beginner-friendly: a Sprite guide, trade-safety steps & backup codes',
    summary:
      'Four UX upgrades based on what players actually search for — an in-app guide to the confusing bits, clearer trade-safety, a friendlier first-run, and progress backup codes for guests.',
    changes: [
      { tag: 'Added', text: 'A “How Sprites work” guide (footer) covering the things people get caught out by: extract-or-lose-it, how leveling points work (+ Mastery Mondays), that Mastery needs an extract at Lv 5, variants, and how trading works.' },
      { tag: 'Added', text: 'Trade Board now spells out the in-game trade steps (drop → co-extract) and how to dodge the “grab-and-run” scam — don’t drop first, go one at a time, trade vouched partners.' },
      { tag: 'Added', text: 'A friendly first-run hint for new visitors (tap to mark, import a screenshot, or read how Sprites work) — dismissible.' },
      { tag: 'Added', text: 'Backup & restore codes (footer → Backup): copy a code to move your guest progress to another device; restoring merges (it never wipes what you have). Logged-in collections still auto-sync to the cloud.' },
    ],
    why:
      'Research into what Sprite players want kept pointing at the same thing: the systems confuse people (extraction and mastery most of all) and trading is scam-prone — but the app tracked everything without teaching any of it. Adding a guidance layer meets the top real need, helps beginners, and sets the tracker apart from bare checklists.',
  },
  {
    date: 'July 8, 2026',
    title: '“Upcoming & leaked” section — see what’s coming, with countdowns',
    summary:
      'A new sidebar card that turns all the leak-tracking into a feature: every unreleased sprite, sorted by its leaked release date, with a live countdown. Spider-Man is now in the roster too.',
    changes: [
      { tag: 'Added', text: 'A “🔮 Upcoming & leaked” card listing every unreleased sprite — Seven, Air, Batman (Jul 16), Spider-Man (~Jul 30), and the datamined Wick / Drifter / Ice (TBA) — soonest first, each with a countdown (“in 8 days”) and tap-to-open. Clearly badged Rumored.' },
      { tag: 'Added', text: 'Spider-Man added to the roster — a leaked Marvel collab Sprite (web-swinging, ~Jul 30 / v41.30) with generated art; the official render will swap in on release.' },
      { tag: 'Added', text: 'Leaked release dates on the upcoming sprites (Seven/Air/Batman = Jul 16, Spider-Man = Jul 30) power the countdowns.' },
    ],
    why:
      'We’d been quietly tracking a growing pile of leaked sprites; surfacing them as a dated “what’s next” list is genuinely useful for collectors planning their hunt — and doing it in one place, all flagged Rumored with countdowns, keeps the leaks clearly separate from the confirmed roster.',
  },
  {
    date: 'July 8, 2026',
    title: 'News: Spider-Man Sprite leak added',
    summary:
      'Added the datamined Spider-Man Sprite to the news feed — a web-swinging Sprite reportedly landing ~July 30, flagged Tentative.',
    changes: [
      { tag: 'Added', text: 'News entry for the leaked Spider-Man Sprite + “Spider-Man Power Hour” (~Jul 30 / v41.30, timed with the Spider-Man: Brand New Day film). Marked Tentative/unofficial — it would be Fortnite’s first Marvel + DC Sprite overlap (with the Jul 16 Batman collab).' },
    ],
    why:
      'The feed should reflect what collectors are hearing about, but leaks must look like leaks — so it carries the same Tentative badge and source link as the other unconfirmed items rather than being presented as fact.',
  },
  {
    date: 'July 8, 2026',
    title: 'Real renders for the upcoming Air & Seven Sprites',
    summary:
      'Air and Seven (and every one of their variants) now use real 3D-rendered images instead of the vector placeholder, so the upcoming Sprites look just like the released ones.',
    changes: [
      { tag: 'Added', text: 'Rendered art for Air and Seven across all forms — Normal, Gold, Gummy, Galaxy, Gem, Holofoil, Cube and Quack — generated to match the existing sprite style, cut to a transparent background and sized to the app’s 320px art. They replace the generated vector art automatically.' },
      { tag: 'Changed', text: 'Batman keeps its vector cowl art for now — it’s a DC character, so we’ll swap in the official render when it releases rather than generate one.' },
    ],
    why:
      'There’s no official image for these Sprites yet (they haven’t launched), and the open community sets don’t have them either — so rather than leave them as obvious vector placeholders, we rendered on-style art so the roster looks finished. They’re still clearly flagged Unreleased/Rumored, and when Epic ships the real renders we can drop those straight in.',
  },
  {
    date: 'July 6, 2026',
    title: 'Better art for the upcoming Sprites (Batman, Seven, Air)',
    summary:
      'Sharpened the generated art for the leaked Sprites so they’re instantly recognisable and sit better next to the real ones — Batman now actually looks like Batman.',
    changes: [
      { tag: 'Changed', text: 'Batman gets a proper cowl (pointed ears + white eye-slits) and a gold bat chest emblem instead of a plain face; Seven has a bolder agent-style “7” on a chest plate; Air’s wind swirls are crisper. All render consistently across every variant (Gold, Gummy, Galaxy, Holofoil, Cube, Quack…).' },
      { tag: 'Changed', text: 'Small news precision: Holofoil’s Jul 9 release now notes the reported ~9 AM ET / 6 AM PT time.' },
    ],
    why:
      'These Sprites aren’t out yet, so there’s no official image — they’re drawn on the fly by the built-in generator. Making them more on-model keeps the roster looking intentional (not like placeholders) without any external art. True photo-real art to match the released Sprites would need generated raster images; this is the best no-cost, always-consistent version until then.',
  },
  {
    date: 'July 6, 2026',
    title: 'News & banner refreshed — Holofoil is on the schedule',
    summary:
      'Caught the events up: the Holofoil drop and Holofoil Hours firmed up from leaks into dated events, and the announcement banner now features the imminent Holofoil release instead of the far-off season end.',
    changes: [
      { tag: 'Changed', text: 'Holofoil Sprites (Jul 9) and Holofoil Hours (Jul 11, 2 PM & 9 PM ET) are no longer marked Tentative — both are now widely reported / Epic-announced, so their dates read as scheduled.' },
      { tag: 'Added', text: 'The dismissible announcement bar now leads with the Holofoil Sprites drop (Jul 6–10) and then Holofoil Hours (Jul 11), so the most timely event is front-and-centre.' },
      { tag: 'Added', text: 'Added the new Duck Mansion POI to the map’s offline fallback list (the live map layer already refreshes each season automatically).' },
    ],
    why:
      'A tracker people check for “what’s on right now” has to reflect the current week. As leaked events get confirmed we drop the Tentative badge, and the banner should surface what’s happening in days — not an end-of-season note two months out.',
  },
  {
    date: 'July 6, 2026',
    title: 'Sprite tier list — how strong each one actually is',
    summary:
      'Rarity tells you how *hard* a sprite is to find; the new gameplay tier tells you how *good* it is. Every sprite now shows an S/A/B/C tier, and you can group the grid into a full tier list.',
    changes: [
      { tag: 'Added', text: 'A gameplay tier badge (S / A / B / C) on each sprite in the detail view — e.g. Striker, Demon, Ghost & Zero Point are S-Tier; Water/Fire/Punk are C-Tier.' },
      { tag: 'Added', text: 'A “Group by tier” option that turns the collection grid into a tier list (S-Tier, A-Tier, …), so you can see the meta at a glance and prioritise what to level.' },
      { tag: 'Changed', text: 'Tiers are a community/meta snapshot (cross-referenced from GAMES.GG, Beebom, PlayerAuctions & Destructoid), kept separate from rarity; unreleased/leaked sprites stay Unranked until they settle.' },
    ],
    why:
      'Competitors publish static tier lists as a separate page; because we already know your collection and levels, folding a tier into the tracker is more useful — the app can tell you not just what you’re missing but what’s worth chasing and mastering first. Keeping tier distinct from rarity avoids implying a Mythic is automatically “better,” which often isn’t true (Grim Reaper is Mythic but mid-tier).',
  },
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
