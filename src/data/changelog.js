// App changelog / release notes — technical, but written for humans. Newest
// entry first. Each release: a friendly summary, the concrete changes (tagged
// Added / Changed / Fixed / Security), and the *why* behind the bigger calls.
//
// When you ship something notable, add an entry to the TOP of this array.

export const CHANGELOG = [
  {
    date: 'August 15, 2026',
    title: 'Next-season preview: Override Sprites added as Upcoming 🔮',
    summary:
      'The Upcoming & Rumored lists now preview Chapter 7 Season 4 “Override” — the five Epic-confirmed Design-a-Sprite winners plus headliner Sonic — so the “what’s coming” card isn’t empty ahead of the Aug 20 drop.',
    changes: [
      { tag: 'Added', text: 'Six upcoming Sprites, filed under the new Season 4 generation: Sonic (the confirmed “Gaming Legends” headliner) and the five Design-a-Sprite contest winners — Pond, Bullet, Honey, Dumpster Dive and X-Ray — with their designers’ abilities. They show across the app and the SEO pages.' },
      { tag: 'Added', text: 'All are clearly badged Rumored — abilities are as designed/leaked and may change, and they carry no drop rate or variants until they actually ship.' },
    ],
    why:
      'Everything currently in the game is released, so the “Upcoming & leaked” card sat empty. Previewing the confirmed next-gen Sprites gives collectors a heads-up and keeps the tracker ahead of the drop. We stuck to sourced, confirmed items (Epic’s revealed Design-a-Sprite winners + the announced Sonic headliner) rather than the full rumor list, and left them dateless so nothing auto-releases with placeholder data before the real Aug 20 staging.',
  },
  {
    date: 'August 15, 2026',
    title: 'Leaderboard glow-up: a real podium 🏆',
    summary:
      'The Flex Score leaderboard is now a proper flex — a top-3 podium with each player’s Sprite as their avatar, plus score bars, medals and badges down the ranks.',
    changes: [
      { tag: 'Changed', text: 'Top 3 now sit on a 🥇🥈🥉 podium (gold/silver/bronze rings, #1 raised and highlighted), each showing the player’s first showcase Sprite as a finish-tinted avatar, their score, owned/mastered and badges.' },
      { tag: 'Changed', text: 'Ranks 4+ are compact rows with a Sprite avatar and a score bar scaled to #1, so relative standing is visible at a glance. Compare is one tap from any row.' },
      { tag: 'Added', text: 'The leaderboard now serves each player’s avatar Sprite (their first showcase pick) — set a showcase in Profile to choose yours.' },
    ],
    why:
      'A plain text list undersells a “flex” page — the whole point is to show off. A podium with real Sprite avatars and visual score bars makes rank feel earned and gives players a reason to climb (and to pick a showcase).',
  },
  {
    date: 'August 15, 2026',
    title: 'Profile: clearer saving, honest trade info, full Sprite showcase',
    summary:
      'The Profile now has one always-visible save bar that tells you exactly whether your changes are saved, the showcase lets you feature any Sprite you own (including the newest ones), and the trading section no longer implies emails we don’t send.',
    changes: [
      { tag: 'Added', text: 'A sticky “● Unsaved changes / ✓ All changes saved” bar with Save and Discard — it’s never ambiguous whether your edits stored. Replaces the easy-to-miss inline Save button and the scattered “saved with the button above” notes.' },
      { tag: 'Fixed', text: 'The showcase picker now lists every Sprite you own, including newly-added ones — it previously hid Sprites that weren’t flagged “released,” which could drop the newest ones from the selection.' },
      { tag: 'Changed', text: 'The trading section now says plainly that new matches just appear in the Trade tab when you open it — there are no email notifications. Removed the misleading “notify me” toggle.' },
    ],
    why:
      'Every one of these was a “wait, did that save / where did my Sprite go / will this email me?” moment. A single honest save indicator, an ownership-based showcase, and copy that promises only what the app actually does remove the guesswork.',
  },
  {
    date: 'August 15, 2026',
    title: 'Consistency pass: one header & nav everywhere, Cosmetics retired',
    summary:
      'The app and the SEO/landing pages now share the exact same header and navigation, a logged-in visitor no longer sees “Log in to save” on the static pages, and the experimental Cosmetics tab has been retired (it overlapped the Item Shop).',
    changes: [
      { tag: 'Changed', text: 'The static pages’ top nav now mirrors the in-app tabs exactly — same order, and the 🔁 Trade tab is included — so moving between the app and a Sprite page feels seamless.' },
      { tag: 'Changed', text: 'On the static pages, the header now detects your login (same browser session) and shows “⚙ Profile” instead of “Log in to save,” and the version tag auto-updates to the live build — matching the app.' },
      { tag: 'Removed', text: 'The experimental 🧢 Cosmetics tab. It duplicated the Item Shop and its “want” list only saved locally with nowhere to go; old links now land on the Item Shop.' },
    ],
    why:
      'Two slightly different headers/navs made the site feel like two products bolted together; making them identical is the point of the SEO pages sharing the app’s design. Cosmetics was a proof-of-concept that never grew a purpose distinct from the Item Shop — cutting it removes a confusing, dead-end tab.',
  },
  {
    date: 'August 15, 2026',
    title: 'Share your Sprite Garden as an image 📸',
    summary:
      'The Garden view can now export a lush image of your collection — circular, finish-tinted tiles with mastered Sprites ringed in gold — ready to post to Discord, Reddit or socials.',
    changes: [
      { tag: 'Added', text: 'A “📸 Image” button in the Garden that downloads your owned Sprites as circular finish-tinted tiles (mastered ones ringed gold with a ★), with planted/mastered counts, a progress bar, and a scannable QR that links back to your Garden.' },
      { tag: 'Added', text: 'Works for guests too (reads your local collection); signed-in players get a QR/link straight to their shareable Garden (?u=…&view=garden).' },
    ],
    why:
      'The Garden’s “Share” copies a link, but a link is bare text in most feeds — an actual image is what spreads. A picture of your collection is far more shareable (and recruits new trackers via the QR) than a URL that may not even unfurl.',
  },
  {
    date: 'August 15, 2026',
    title: 'New: a Trade tab — find players to swap Sprites with 🔁',
    summary:
      'Fortnite has no in-game trading, so it’s player-to-player. Mark your spare duplicates “For trade” and the Sprites you want, and the new Trade tab matches you with other players whose spares line up with your wishlist — then you DM to arrange the swap.',
    changes: [
      { tag: 'Added', text: 'A 🔁 Trade tab that finds two-way matches: for each player, what they can give you (spares you want) and what you can give them (spares they want), ranked by how well you line up.' },
      { tag: 'Added', text: 'Per-sprite “🔁 For trade” (on owned) and “🎯 Want” (on missing) toggles in the sprite detail view — these feed the matcher.' },
      { tag: 'Added', text: 'A Discord handle + “notify me about new matches” option in Profile. A match shows a one-tap copy of the partner’s Discord so you can DM them; connections happen on Discord, not here.' },
      { tag: 'Security', text: 'Matching only ever considers players who’ve made their profile public, and runs server-side (a security-definer function) so no one’s raw collection is exposed to the client.' },
    ],
    why:
      'Finding rare variants is the #1 grind, and trading duplicates is how players skip the luck — but today that means scattered Discord/Reddit posts. We already tracked owned/spare data, so an in-app “who has what I need / needs what I have” matcher was the highest-value thing we could add. We deliberately did NOT build a Discord community to run: the app is the product; Discord is just the meeting room, wired in via a handle so people connect where sprite traders already are.',
  },
  {
    date: 'August 7, 2026',
    title: 'Sprite Garden: real generation grouping (Override-ready)',
    summary:
      'The Garden now groups by an actual generation field in the data — so Chapter 7 Season 4 “Override” Sprites will file into their own section automatically when they drop.',
    changes: [
      { tag: 'Added', text: 'A GENERATIONS model + a per-sprite `gen` field (defaults to Chapter 7 Season 3). The Garden renders a section per released generation and a teaser for upcoming ones — so adding the Override generation on Aug 20 is a data change, no UI work.' },
      { tag: 'Changed', text: 'The Garden’s “Season 3 · Runners” / “Season 4 · Override” sections are now data-driven instead of hardcoded.' },
    ],
    why:
      'The grouping was scaffolding on a hardcoded label; making it data-driven turns it into the real thing ahead of the Override drop, when Sprites start spanning multiple generations that all live in your Garden forever.',
  },
  {
    date: 'August 7, 2026',
    title: 'Header version now auto-detects the live build',
    summary:
      'The header showed a hardcoded “v41.30” next to the variant count; it now reads the current build from the live game data so it never goes stale.',
    changes: [
      { tag: 'Changed', text: 'The header tagline’s version is auto-detected from the live game build (via the same /api/news proxy the feed uses) — it self-updates on every Fortnite patch (e.g. when Season 4 “Override” / v42.00 goes live), falling back to the static label offline. The released-variant count was already derived from the roster (currently 118).' },
    ],
    why:
      'A hardcoded version drifts out of date the moment Epic patches; reading the build the app already fetches keeps it honest with zero upkeep.',
  },
  {
    date: 'August 7, 2026',
    title: 'New (beta): a Sprite Garden view 🌱',
    summary:
      'A new way to look at your collection — a “Sprite Garden” showcase of the Sprites you own, inspired by the Sprite Garden coming to Fortnite in Chapter 7 Season 4. Shipping in beta.',
    changes: [
      { tag: 'Added', text: 'A third view (🌱, next to Grid and Quick-check list): your owned Sprites rendered as circular, finish-tinted tiles — sorted rarest-first, mastered ones ringed in gold with a ★ — with live “planted / mastered” counts. Tap any Sprite to open its details.' },
      { tag: 'Added', text: 'Generation grouping: your current Sprites sit under “Chapter 7 Season 3 · Runners,” with a “Chapter 7 Season 4 · Override” section ready for the new generation on Aug 20 — since Sprites now stay forever, they’ll file in by generation.' },
      { tag: 'Added', text: 'The layout view is now deep-linkable (?view=garden).' },
      { tag: 'Added', text: 'Share your Garden — a “Share” button (when logged in) copies a link friends can open read-only (?u=<id>&view=garden); a shared garden shows the owner’s gamertag in the header.' },
    ],
    why:
      'Fortnite’s upcoming Sprite Garden turns your collection into a place you visit and show off; this is our take on that inside the tracker. It’s labelled Beta while we iterate — a lusher backdrop, sharing, and per-generation filing (once Override sprites exist) are the next steps.',
  },
  {
    date: 'August 7, 2026',
    title: 'Sprite Spree Week added (Aug 15–19) + Aug 15 times fixed',
    summary:
      'Logged the end-of-season “Sprite Spree Week” — a themed Sprite Power Hour every day — and corrected the Unstable/Mythic Aug 15 timing.',
    changes: [
      { tag: 'Added', text: 'A “Sprite Spree Week” roundup: Aug 15 “Unstable” Story Moment (2 PM ET) + Mythic Sprite Hours, then daily 24-hour finish-hours from Sun Aug 16 — Galaxy (16), Holofoil (17), Cube (18), Gem (19) — with week-long bonuses: 2×–4× Sprite XP, extra Lucky Locators guaranteed to point at a Sprite you’re missing, a free Gem Zero Point via Bonus Quests, and (Epic-confirmed) free, Dust-less re-summons of lost Sprites from Aug 16 to season end.' },
      { tag: 'Changed', text: 'Corrected the timing: the Unstable live event is Aug 15 at 2 PM ET, and Sprite Spree Week’s daily finish-hours start Sunday Aug 16 (each runs a full 24 hours).' },
    ],
    why:
      'The final week is packed with daily finish-specific hours — a gift for collectors racing to complete Galaxy/Holofoil/Cube/Gem lines before the season ends, so it belongs in the feed.',
  },
  {
    date: 'August 7, 2026',
    title: 'Deep-dive: the Sprite Garden + Season 4 “Override” resources',
    summary:
      'Pulled everything current on the incoming Sprite generation and the Sprite Garden and folded the new resources into the news feed.',
    changes: [
      { tag: 'Changed', text: 'Sprite Garden: added the confirmed mechanics — it’s a UEFN island (built with Fairview Portals & Beyond Creative); Season 3 Sprites are preserved automatically and new Override Sprites auto-add; a Sprite that goes down in a match is never lost from the Garden; and it’ll keep growing with player feedback.' },
      { tag: 'Changed', text: 'Season 4 “Override” entry: added the leaked ~4 AM ET Thursday Aug 20 go-live (after the v42.00 downtime), flagged Sonic as the headliner (rumored Green Hill Zone POI), and added Vampire Survivors to the leaked Gaming Legends roster. Noted no specific new-Sprite names are datamined yet beyond the five Design-a-Sprite winners, and that per-collab themed Sprites aren’t confirmed.' },
      { tag: 'Added', text: 'A pinned “Rumors vs official notices — how to read this feed” explainer that lays out which Season 4 items are Epic-confirmed vs leaked, so the two never blur together.' },
    ],
    why:
      'The next-season Sprite story is the biggest thing on the horizon for a collection tracker — worth capturing in full, while clearly separating confirmed (Sprite Garden, Override name/date) from leaked (collab roster, per-collab Sprites).',
  },
  {
    date: 'August 7, 2026',
    title: 'Holofoil Zero Point now Available — every Zero Point finish complete',
    summary:
      'A source sweep (confirmed in-game) shows Holofoil Zero Point is obtainable, not staged — flipped it to Available, which completes the Zero Point finish set. Also logged the Aug 7 sprite-sound hotfix.',
    changes: [
      { tag: 'Fixed', text: 'Holofoil Zero Point flipped from “Soon” to Available — it drops from Vault / keycard Sprite Chests at roughly 0.00028% (confirmed in-game). With Cube Zero Point already obtainable, every Zero Point finish is now marked available; the released-variant count moves 117 → 118 and nothing is left flagged “Soon.”' },
      { tag: 'Added', text: 'Minor known-issue note: an Aug 7 hotfix muted the Water, Air and Zero Point Sprite sound effects (cosmetic only — they still spawn and function).' },
      { tag: 'Changed', text: 'Pointed the resolved Ironmouse known-issue at Epic’s actual “fixed” Fortnite Status post (was the earlier “investigating” one).' },
    ],
    why:
      'Holofoil Zero Point had been the lone “Soon” variant on conflicting reports; an in-game confirmation resolved it. Keeping the tracker’s obtainable set exactly right is the whole point, so the last unresolved variant needed settling.',
  },
  {
    date: 'August 6, 2026',
    title: '“Unstable” Story Moment + Mythic Sprite Hours (Aug 15); S4 “Override” dated Aug 20',
    summary:
      'Added the season’s end-of-story event and its Mythic Sprite Power Hour (Sat Aug 15), and firmed up the next-season date now that Epic has dated Chapter 7 Season 4 “Override.”',
    changes: [
      { tag: 'Added', text: 'A news entry for the “Unstable” Story Moment (Sat Aug 15, 2:00 PM ET; log in 1:55 PM ET near the Zero Point Stabilizer) and the Mythic Sprite Power Hour right after (2–4 PM ET, plus a reported ~9–11 PM ET window) — boosted Mythic spawns, Grim & Zero Point most of all, raised loot, everyone starts with a Self-Revive, and extracting a Sprite fully heals you + grants Slap. Flagged community/datamined (times converted from a JST source; Epic hasn’t posted the closing event).' },
      { tag: 'Changed', text: 'Next-season entry updated to Epic’s confirmed date: Chapter 7 Season 4 “Override” (tagline “Break the rules, change the game”) launches Thursday, Aug 20 — the day after Runners ends (Aug 19). The “Gaming Legends” collab roster stays leak-only.' },
    ],
    why:
      'The Aug 15 event is the last big rare-hunt (Grim & Zero Point) before the season closes — worth surfacing with the corrected ET time, since the original tip’s times were JST (Aug 16). And S4’s date is now official (Aug 20), so the “Aug 19–20” hedge could be tightened.',
  },
  {
    date: 'August 6, 2026',
    title: 'Fact-check pass: Season 4 “Override” details + Design-a-Sprite winners',
    summary:
      'Verified the recent additions against open sources and firmed up the next-season facts: Chapter 7 Season 4 is officially “Override” (begins Aug 19–20) with the Sprite Garden around Aug 20, and the Design-a-Sprite contest winners are now known.',
    changes: [
      { tag: 'Changed', text: 'Confirmed the “Sprites are staying forever” reveal is genuinely official (Insider Gaming / Epic Communities) and added specifics: the Sprite Garden launches with Chapter 7 Season 4 “Override” (~Aug 20), your Season 3 Sprites carry over (staying on your Collection page and in the Garden), and — corroborated by HYPEX — the S4 generation brings new powers, QoL updates and new ways to find Sprites, S4 Sprites auto-add to the Garden, and older generations may return later.' },
      { tag: 'Changed', text: 'Next-season entry firmed up: S4 is officially titled “Override,” beginning Aug 19–20 (the earlier Sept 4 date is superseded). The “Gaming Legends” collab roster stays leak-only.' },
      { tag: 'Changed', text: 'Design-a-Sprite contest: replaced the stale “winners still to come” note with the revealed winners and each one’s designed ability — Pond (evolving frog: speed/jump + less fall damage), Bullet (bonus ammo), Honey (beehive counter-attack), Dumpster Dive (raccoon: loot from dumpsters), X-Ray (reveals nearby players). Arriving in a mid-season S4 “Override” update (they’ll join the roster once in-game).' },
      { tag: 'Added', text: 'Cross-checked the released-variant count against sources — 117 for Season 3 (Gem set + Cube Zero Point) matches the tracker.' },
    ],
    why:
      'A source pass caught two soft/stale spots — the next-season date (now Aug 19–20, not Sept 4) and the contest winners — and confirmed the bigger official claims hold up.',
  },
  {
    date: 'August 6, 2026',
    title: 'Official: Sprites are staying forever (+ Gem Hours times)',
    summary:
      'Epic confirmed Sprites are permanent — every past and future generation stays in your collection, across seasons and even after Battle Royale — which retracts the earlier “Season 3 Sprites won’t carry over” rumour. Also locked in tomorrow’s Gem Hours times and kept the refreshed Gaming Legends leak.',
    changes: [
      { tag: 'Added', text: 'A pinned news entry for Epic’s official “Sprites are staying forever” reveal — all generations always yours, a new generation each season, past generations never removed, plus teased Sprite Garden (showcase your collection on a private island) and friend-garden visits.' },
      { tag: 'Fixed', text: 'Retracted the earlier “Season 3 Sprite collection won’t carry into Season 4” note (a leak, now contradicted by Epic): the season-end entry, the Gaming Legends entry and the Guide no longer claim a carry-over reset or an Aug 19 collection deadline. Quack Zero Point stays listed as a free 55-mastery reward.' },
      { tag: 'Changed', text: 'Gem Hours (Sat, Aug 8) now has confirmed times — two rounds, 2–4 PM & 9–11 PM ET — plus its bonuses (Self-Revive for all, full Mythic loot pool, Mythic Goldfish). Added a Gem Hours announcement banner for the day.' },
      { tag: 'Changed', text: 'Kept the refreshed “Gaming Legends” (Ch 7 S4) leak — datamined roster (Sonic & Eggman, Mega Man, Persona’s Joker, Pac-Man, Tetris, Crash, Kingdom Hearts), ShiinaBR/HYPEX sourcing, Wonkeeland Pac-Man easter egg, unsettled date (Aug 19–20 vs Sept 4).' },
    ],
    why:
      'An official announcement outranks a leak — the “won’t carry over” claim was wrong, so it had to come out of every player-facing spot, not just be softened. Confirming Sprites are permanent is reassuring news worth leading with.',
  },
  {
    date: 'August 6, 2026',
    title: 'Fixed: couldn’t un-mark a Sprite flagged “for trade”',
    summary:
      'Tapping “not owned” on a Sprite that was marked for-trade did nothing — the “for-trade implies owned” rule snapped it straight back to owned, so the toggle looked stuck (easy to hit on a Gem duplicate). Un-marking now clears the for-trade flag first, so it actually un-owns.',
    changes: [
      { tag: 'Fixed', text: 'A Sprite marked “for trade” could not be returned to not-owned: the invariant that keeps for-trade Sprites owned re-bumped it every time, so the Owned toggle appeared glitched. Un-owning (or setting level 0) now clears for-trade first; marking a Sprite for-trade still implies owned, exactly as before.' },
    ],
    why:
      'For-trade means “I have a spare,” so it implied ownership — but that made un-owning impossible once the flag was set, including when it came in from an imported backup or cloud sync where there’s no visible toggle to clear it. An explicit un-own should win.',
  },
  {
    date: 'August 6, 2026',
    title: 'Gem Sprites are live — full 9-Sprite Gem set marked obtainable',
    summary:
      'New Sprite Day (Aug 6) dropped the Gem line. Flipped all nine Gem Sprites to obtainable, un-vaulted Gem Aura & Gem Grim, and updated the Gem finish to its live −30% fall-damage bonus.',
    changes: [
      { tag: 'Added', text: 'Marked the full Gem set obtainable: Gem Water, Earth, Duck, Punk, Demon and Zero Point flip to released, joining the already-out Gem Llama — nine Gem Sprites in all. The released-variant count moves 110 → 116.' },
      { tag: 'Changed', text: 'Un-vaulted Gem Aura and Gem Grim — both return with the Gem line, so their “Vaulted” badges clear and they’re back in the Chest-luck picker.' },
      { tag: 'Changed', text: 'The Gem finish is no longer “datamined/disabled”: its bonus now reads the confirmed “take 30% less fall damage (stacks with the base ability),” and Gem is eligible in Chest-luck again (Gem Sprites drop from Sprite Chests).' },
      { tag: 'Changed', text: 'News + announcement bar updated to the LIVE, Epic-confirmed Gem drop (source: Epic’s official Fortnite Communities post), and the old “Gem Grim vaulted” note now records its Aug 6 return.' },
      { tag: 'Fixed', text: 'Separately, an accuracy audit caught Cube Zero Point still flagged “Soon” — it’s actually been obtainable since v41.30 (Jul 30) from Vault / keycard Sprite Chests at a sub-0.01% rate. Marked it Available (now in the Chest-luck picker) and rewrote the Zero Point-finishes note; Holofoil Zero Point stays the only Zero Point finish not yet switched on. Released-variant count 110 → 117.' },
    ],
    why:
      'The Gem line was the week’s headline New Sprite Day and went live at the 9 AM ET reset — confirmed by Epic’s Communities post and the in-game reveal. Leaving nine Sprites flagged unreleased/vaulted on drop day is exactly the staleness this tracker exists to avoid.',
  },
  {
    date: 'August 5, 2026',
    title: 'Ironmouse extraction bug — confirmed by Epic, then fixed',
    summary:
      'Fortnite Status confirmed the Ironmouse extraction issue (Sprite not granted on extract, missing from Collection, no Sprite Dust, plus empty Sprite Chests) and hotfixed it on Aug 5. Upgraded our earlier “unverified” note to the confirmed, now-resolved issue.',
    changes: [
      { tag: 'Fixed', text: 'The known-issue entry now reflects reality: Epic (Fortnite Status) acknowledged that extracting Ironmouse wasn’t granting the Sprite (missing from Collection, no Dust) and that some Sprite Chests were empty, then hotfixed it on Aug 5 and re-enabled Ironmouse in the loot pool. The entry carries a green “Resolved” badge and cites the official Fortnite Status post.' },
      { tag: 'Changed', text: 'Reverted the cautious “some players report it isn’t extracting” wording on the Ironmouse Sprite detail and its return entry to note the bug was confirmed and hotfixed, so nothing stays stuck on a now-resolved problem.' },
    ],
    why:
      '@FortniteStatus confirmed exactly what was reported and shipped a fix, so the honest state moved from “unverified” to “Epic-confirmed, resolved.” Leaving a fixed bug flagged as an open mystery would mislead as much as ignoring it did.',
  },
  {
    date: 'August 4, 2026',
    title: 'Flagged a reported Ironmouse extraction issue (unconfirmed)',
    summary:
      'Players are reporting the Ironmouse Sprite isn’t extracting since its Aug 4 return. We couldn’t find an official Epic acknowledgement, so it’s surfaced as a monitored, unverified known issue and Ironmouse’s copy now carries the caveat.',
    changes: [
      { tag: 'Added', text: 'A known-issue (bug) news entry — “Ironmouse Sprite not extracting since its return” — clearly marked Tentative / unofficial (source: community reports). It notes a likely timing factor: the return went live Aug 4 at 6 PM PT / 9 PM ET with boosted rates only until Aug 5, 3 AM ET, and it’s very rare after that.' },
      { tag: 'Changed', text: 'Softened Ironmouse’s “available now” wording (both the sprite detail and the return news entry) to point at the reported extraction issue until it’s confirmed or resolved.' },
    ],
    why:
      'We couldn’t verify the glitch in any reachable source (X and Epic’s help pages block our fetches), but it’s worth surfacing rather than leaving “available now” unqualified — flagged as unverified and monitored so it’s honest without over-claiming an Epic-confirmed bug. Ironmouse stays listed as released (owners keep it; it isn’t re-vaulted).',
  },
  {
    date: 'August 4, 2026',
    title: 'Quack finish details filled in — it’s a Mastery reward (+50% XP share)',
    summary:
      'The Quack finish still read “Bonus not yet revealed” and was offered in the Chest-luck calculator — but Quack Sprites are Sprite Mastery rewards, not chest pulls. Filled in the real bonus and stopped quoting chest odds for them.',
    changes: [
      { tag: 'Changed', text: 'Quack’s perk is now shown: it shares 50% of the XP it earns with every other Sprite in your match (levels your collection faster). Dropped the “rumored / Bonus not yet revealed” placeholder — Quack has shipped for Water, Earth, Fire and Zero Point.' },
      { tag: 'Fixed', text: 'Removed Quack from the Chest-luck finish picker (in-app and on every per-Sprite page). Quack Sprites are earned via Sprite Mastery milestones — not from Sprite Chests, Locators or bosses — so quoting chest odds for them was misleading.' },
      { tag: 'Added', text: 'A Guide note with the Mastery thresholds: master 35 Sprites for Quack Water, 40 for Quack Earth, 45 for Quack Fire, and 55 for Quack Zero Point.' },
    ],
    why:
      'Quack landed in the roster before its bonus/unlock were known, so it carried placeholder copy and inherited the generic chest-odds treatment. Now that it’s confirmed as a Mastery-only reward with a known XP-share perk, the tracker should state exactly what it does and how you actually get it — and never imply you can chest-farm it.',
  },
  {
    date: 'August 4, 2026',
    title: 'Weekly Sprite schedule confirmed (Gem drop + Gem Hours no longer “tentative”)',
    summary:
      'Epic’s official weekly Sprite schedule (the Fortnite “Runners” graphic) confirmed this week’s events, so the news feed no longer guesses at them: the Gem New Sprite Day (Thu Aug 6) and Gem Hours (Sat Aug 8) are confirmed, Peely Hours are pinned to the right days, and Mastery Mondays is now represented.',
    changes: [
      { tag: 'Added', text: 'A schedule-overview news entry for the week (Mastery Mondays → Peely Hours → New Sprite Day → Gem Hours), sourced to Epic’s official weekly graphic — this also adds Mastery Mondays, which the feed was missing.' },
      { tag: 'Changed', text: 'Dropped the “Tentative” badge from the Gem New Sprite Day (Aug 6) and Gem Hours (Aug 8) entries now that Epic has confirmed both dates; the detailed Gem mechanics/variant list stay flagged as leaked until Epic spells them out.' },
      { tag: 'Fixed', text: 'Peely Hours were listed as running “every day through Aug 5,” but the official schedule shows them on Tuesday Aug 4 & Wednesday Aug 5 (Monday was Mastery Mondays). Corrected the days/window and used the in-game name “Peely Hours.”' },
    ],
    why:
      'The feed’s job is to be the accurate, at-a-glance Sprite calendar. With an official schedule in hand, leaving confirmed events marked “tentative” (or Peely Hours on the wrong days) would undersell what players can rely on — and quietly omitting Mastery Mondays left the week incomplete.',
  },
  {
    date: 'August 4, 2026',
    title: 'Ironmouse Sprite is back — un-vaulted',
    summary:
      'Epic re-enabled the Ironmouse Sprite on Aug 4 (timed to Ironmouse’s VTuber debut anniversary) after it was pulled for launching earlier than intended post-v41.30. Un-vaulted it across the tracker and posted the return to the news feed.',
    changes: [
      { tag: 'Changed', text: 'Ironmouse is no longer flagged “Vaulted” — it’s obtainable again from Relic Chests. The badge clears everywhere it appears (roster cards, detail modal), the Guide moves it from Vaulted → Available, and its finish is eligible in the Chest-luck picker again.' },
      { tag: 'Changed', text: 'Ironmouse’s ability blurb now reflects the return — accidental early release → brief vault → re-enabled Aug 4; early collectors are restored automatically at the level they last had it.' },
      { tag: 'Added', text: 'A news entry announcing the Aug 4 return (pinned while live), and updated the original “vaulted” entry so it notes Ironmouse is back while Gem Grim stays vaulted.' },
    ],
    why:
      'The Sprite was only ever pulled because it went live earlier than intended — the return was reported by HYPEX and tied to Ironmouse’s debut anniversary. A player checking whether they can finally grab it should see “Available,” not a stale “Vaulted” lock.',
  },
  {
    date: 'August 4, 2026',
    title: 'SEO sprite pages now match the app’s gold/violet theme',
    summary:
      'The prerendered /sprite/<slug> pages were still painted in the old cool navy + cyan palette, so after the app’s warm gold + violet refresh they looked like a different site — and clashed with the new Mombie logo. Repainted the static pages to the app’s current palette.',
    changes: [
      { tag: 'Fixed', text: 'Synced the static SEO pages’ CSS to the app’s theme tokens — warm background (#0d0b12), gold brand (#ffc93c) and violet accent (#b45cff), plus matching text/muted/panel/border — replacing the stale cyan (#36c5ff) + cool-navy values. The brand glows (page background, CTA glow, support card) and body-copy text were warmed to match; rarity colours and the per-finish tile gradients were left alone since they already match the app’s SpriteArt.' },
    ],
    why:
      'The app moved to a warm gold/violet palette, but the prerendered pages hardcode their own CSS, so they drifted out of sync and read as off-brand — especially next to the new logo. A Google visitor’s first impression should feel like the same product as the app.',
  },
  {
    date: 'August 4, 2026',
    title: 'A cuter Mombie logo — and sprite pages now hand off into the app',
    summary:
      'Redrew the Mombie mark so it reads as a cuter, more human character — framing hair, big glossy puppy-dog eyes, a softer smile — on the same Sprite body as the John Wick sprite. And each SEO sprite page’s “Track this” button now opens the app with that sprite’s card already up, instead of the generic home grid.',
    changes: [
      { tag: 'Changed', text: 'Redrew the Mombie logomark: real hair framing the face (soft bangs + side locks), bigger glossy puppy-dog eyes in a softer plum tone, rosier cheeks and a small open smile — the old flat mouth was reading as a moustache. Rolled across the app header, the static SEO pages, the favicon/PWA icon and the OG share image (regenerated with the new face). Still pure SVG, so it stays crisp everywhere.' },
      { tag: 'Changed', text: 'On the prerendered /sprite/<slug> SEO pages, the primary “Track the … in your collection” CTA now deep-links to /?sprite=<id> — which opens the app with that sprite’s detail modal already up — instead of dropping you on the home grid to find it again.' },
    ],
    why:
      'The mark felt a little generic and, up close, slightly uncanny (tiny pupils floating in big whites). Framing hair + big kawaii eyes make it read as the maker’s own cute character while staying in the Sprite family. The CTA is a small conversion fix: a visitor who landed on one sprite’s SEO page continues straight to that sprite in the app. The released→dedicated-page and related→page links were deliberately left alone — those are correct for SEO (verified: all 25 pages + sitemap + related links resolve).',
  },
  {
    date: 'August 2, 2026',
    title: 'Curated the Aug 6 Gem Sprites drop + Gem Hours',
    summary:
      'Got the feed ahead of the week: added a heads-up for this Thursday’s New Sprite Day — the long-staged Gem line finally releasing (Aug 6) — plus the Gem Hours Power Hour the following Saturday.',
    changes: [
      { tag: 'Added', text: 'News entry + announcement bar for the Aug 6 Gem Sprites New Sprite Day: the remaining 8 Gem variants complete a 9-Sprite set (Gem Llama dropped early Jul 30), each adding +30% fall-damage reduction on top of its base perk; Gem Water/Earth roam their biomes while Gem Punk/Grim/Zero Point are chest finds. Flagged Tentative (leaked date/details, not yet Epic-confirmed).' },
      { tag: 'Added', text: 'News entry for Gem Hours (Sat Aug 8) — the weekend Power Hour boosting the freshly released Gem Sprites.' },
    ],
    why:
      'These are dated a few days out but well-corroborated across trackers, and Gem is the variant the app already flags “Soon” — so surfacing the release window with a Tentative badge helps collectors plan without overstating certainty. Deliberately did NOT add the “Web Shooter” event some aggregators list the same week: it’s premised on the Spider-Man Sprite we already removed as a phantom.',
  },
  {
    date: 'August 2, 2026',
    title: 'Peeky Peely Hours added — plus a note on the staged Zero Point finishes',
    summary:
      'Curated the live “Peeky Peely Hours” event (running daily through Aug 5) into the News feed and the announcement bar, and added a News entry explaining why Cube & Holofoil Zero Point show as “Soon” — they’re in the v41.30 files but not yet obtainable.',
    changes: [
      { tag: 'Added', text: 'Peeky Peely Hours event in the News feed and a live announcement bar: every day through Aug 5, two windows daily (4–5 PM ET and 11 PM–12 AM ET) in Battle Royale & Zero Build boost Peeky Peely Sprite (and variant) spawns. The bar auto-shows during the event window and hides after.' },
      { tag: 'Added', text: 'A News entry clarifying that Cube Zero Point and Holofoil Zero Point exist in the v41.30 files but aren’t obtainable yet — so it’s clear why the tracker flags them “Soon” rather than missing.' },
    ],
    why:
      'These are curated because the live in-game feed only carries what Epic is actively promoting in its news tiles, and neither of these was in it — Peeky Peely Hours is a timed community event and the extra Zero Point finishes are staged in the files. Hand-adding them (with tight event dates so the event self-expires) keeps the feed accurate without waiting on the auto feed.',
  },
  {
    date: 'August 2, 2026',
    title: 'Live in-game news, fixed — now pulled through the API key',
    summary:
      'The auto “In-game now” news tiles (how limited-time in-game events like Sprite “Hours” show up on their own) had quietly gone blank. The browser was calling fortnite-api.com’s news endpoint unauthenticated, which now gets rate-limited/rejected — so nothing came back. It’s now pulled through our own server with the API key, and live events surface again.',
    changes: [
      { tag: 'Fixed', text: 'Live “In-game now” tiles are back — they’d silently fallen empty because the unauthenticated news call to fortnite-api.com was being rate-limited/rejected, so limited-time in-game events (e.g. a Sprite “Hours” drop) never appeared in the feed.' },
      { tag: 'Security', text: 'Moved the news fetch server-side. The Fortnite API key now stays on the server (the same FORTNITE_API_KEY the stats proxy already uses) instead of the browser calling the third-party API directly — which also sidesteps third-party CORS.' },
      { tag: 'Added', text: 'A cached serverless proxy (api/news.js) that returns the current live build + the official BR news tiles in one call, and degrades to an empty-but-safe shape so the curated feed never breaks.' },
    ],
    why:
      'The live feed is the thing that makes limited-time events appear on their own without hand-curating every one. It broke because the news endpoint started requiring auth — and the fix had to respect the same rule as player stats: the key never ships to the client. Routing through our own /api/news both restores the feed and keeps the key server-only.',
  },
  {
    date: 'August 2, 2026',
    title: 'Say hi to Mombie — the logo is now the maker’s mascot',
    summary:
      'The Sprite logomark got a personality: it’s now “Mombie” — the app’s own kawaii Sprite with a messy top-bun and bow, clutching a steaming coffee (“like a zombie, but with kids”). Same body shape and warm gold→violet gradient, just unmistakably the maker — the character Creator Code MOMBIE is named for.',
    changes: [
      { tag: 'Changed', text: 'New “Mombie” logomark across the app header, the static SEO pages, the favicon, the PWA icon and the social-share (OG) image — the app’s own Sprite body given a messy bun + bow and a steaming coffee mug. Still pure SVG, so it stays crisp everywhere and reads down to 16px (the favicon re-crops to fit the taller silhouette).' },
      { tag: 'Changed', text: 'Regenerated the OG share card so links shared to Discord/Twitter preview the Mombie mark — the wordmark, warm palette and “Creator Code MOMBIE” pill are unchanged.' },
    ],
    why:
      'The logo was a generic (if on-brand) Sprite. Giving it the maker’s own “Mombie” persona — the coffee-clutching zombie-mom the Creator Code is named for — makes the mark ownable and personal without leaving the Sprite family or the warm palette. It’s drawn as an original vector in the app’s own style (not traced from any outside artwork), so it belongs natively beside the other Sprites.',
  },
  {
    date: 'August 2, 2026',
    title: 'New logo — actually shaped like a Sprite',
    summary:
      'Reworked the logomark into the app’s own Sprite silhouette — the domed capsule body with two little feet and a big kawaii face — in the warm gold→violet gradient. So the logo is literally one of the Sprites you’re tracking, not a generic rounded-square icon.',
    changes: [
      { tag: 'Changed', text: 'New logomark across the app header, the static SEO pages, the favicon, the PWA icon and the social-share (OG) image — the actual Sprite body shape (matched to the in-app sprite art), with feet and a kawaii face, in the gold→violet gradient. The favicon crops in tight so it still reads down to 16px.' },
      { tag: 'Changed', text: 'Recolored the last cool-palette holdouts to match: the pre-load boot screen (was flashing blue), the browser theme-color and the PWA manifest background/theme colors.' },
      { tag: 'Fixed', text: 'Regenerated the OG share image — it still showed the old blue mark; links shared to Discord/Twitter now preview the new warm sprite and look.' },
    ],
    why:
      'After the collectible-card redesign, the old cyan sprite logo was the last thing still wearing the generic community-tracker palette — and it’s the first thing people see in the tab, on shares and on the home screen. Keeping the sprite everyone already knows but warming it to the new gradient ties the identity together without throwing away recognition.',
  },
  {
    date: 'August 1, 2026',
    title: 'A collectible-card redesign — and a roster reconciled to Fortnite.GG',
    summary:
      'The tracker now looks like a binder of trading cards instead of a checklist, and the Sprite roster was corrected against Fortnite.GG’s official list and the datamined asset IDs — so it’s exactly the 25 real Sprites / 118 variants, no phantoms.',
    changes: [
      { tag: 'Changed', text: 'Every Sprite is framed like a collectible card: a rarity-tinted foil edge (Rare/Epic/Legendary/Mythic), a nameplate, a holographic sheen that sweeps on hover, and a gentle 3D tilt. Owned cards glow in their rarity colour; “Have” and “Soon” badges sit on the art. The card still does everything it did (Have / ★ Mastered / level dots).' },
      { tag: 'Changed', text: 'Reskinned the whole app off the cool navy/cyan palette that every community tracker shares, onto a warm “card-binder” look (warm charcoal + gold) that lets each finish’s own colour pop. Animations respect prefers-reduced-motion.' },
      { tag: 'Changed', text: 'Unreleased variants now show by default (with a “Soon” badge) instead of being hidden — so upcoming finishes like Cube / Holofoil / Gem Zero Point are visible without digging into filters.' },
      { tag: 'Fixed', text: 'Removed three Sprites that don’t exist in the game: Drifter, Ice, and the Spider-Man Sprite. “Drifter” was a phantom born from a misread codename — ESD_DrifterSprite is actually Aura’s internal asset id. None appear on Fortnite.GG (even with “Show unreleased” on) or in the datamined ESD_/EID_ id list.' },
      { tag: 'Fixed', text: 'Trimmed speculative finishes that were never in the game to match Fortnite.GG exactly: e.g. no Cube Water, no Holofoil Earth, no Gem/Cube/Quack King or Seven or Air, and Quack only exists for Water/Earth/Fire/Zero Point. Cube Zero Point stays — it’s real (unreleased). Roster is now 25 characters / 118 variants (110 released).' },
      { tag: 'Fixed', text: 'Scrubbed the leftover Spider-Man Sprite references from the News feed and the Aug 1 announcement bar — the “Web-Shooter Power Hour” was premised on a Sprite that doesn’t exist.' },
      { tag: 'Fixed', text: 'Cards now stretch to equal height within a row, so “Soon”/unreleased/vaulted cards (which have no level dots) fill their cell instead of leaving a gap under the frame.' },
      { tag: 'Fixed', text: 'Removed a duplicate “Sprite database” link from the footer — the Sprites section is already in the footer’s section nav.' },
      { tag: 'Changed', text: 'Shortened the footer: the long attribution/credits block (© Epic notices, AI-art disclosure, data sources) now lives in a collapsed “Credits, sources & disclaimers” disclosure, so the footer is compact but everything is one tap away.' },
      { tag: 'Fixed', text: 'Modals (About, etc.) were off-center on mobile: the nav’s hidden pill-measurement row leaked horizontal scroll width, widening the mobile layout viewport so centered overlays drifted to the side. It’s now clipped to zero size, so every modal centers correctly on phones.' },
    ],
    why:
      'Two goals landed together. First, the tracker looked near-identical to other community trackers; leaning into the “these are collectible finishes” idea (foil, holo tilt, a binder aesthetic) makes it unmistakably ours without changing how fast it is to use. Second, the roster had drifted onto a theoretical “every Sprite gets every finish” matrix, plus a few leaked Sprites that never shipped. Fortnite.GG’s published list and the datamined asset IDs are the authoritative sources, so the roster is reconciled to them exactly — accuracy is the whole point of a tracker.',
  },
  {
    date: 'August 1, 2026',
    title: 'Slimmer header tagline + a banner for today’s Power Hour',
    summary:
      'Trimmed the line under the wordmark down to the essentials, and added a live announcement banner for the Aug 1 Web-Shooter Power Hour.',
    changes: [
      { tag: 'Changed', text: 'The header tagline (in-app and on the static SEO pages) is now just the released-variant count and the current version — “110 released variants · v41.30 (Jul 30, 2026).” The old copy repeated launch/vaulting news the announcement banner already carries (and had gone stale, still headlining the now-vaulted Ironmouse).' },
      { tag: 'Added', text: 'A time-boxed announcement banner for the Web-Shooter Power Hour (Spider-Man: Brand New Day) on Aug 1 — it auto-shows that day and steps aside afterwards.' },
    ],
    why:
      'The tagline and the banner were saying overlapping things, and the tagline kept going stale as the roster changed. Splitting the jobs — tagline = evergreen “what version are we on,” banner = today’s live event — keeps both accurate with less upkeep.',
  },
  {
    date: 'July 31, 2026',
    title: 'News now has its own SEO page (/news)',
    summary:
      'Added a crawlable /news page — the curated Fortnite news feed, prerendered and styled like /sprites, with client-side tag filters and search.',
    changes: [
      { tag: 'Added', text: 'A static /news page (build-time prerender) that mirrors the in-app News feed: every curated item ordered live-now → upcoming → history, as real HTML with per-source attribution, tag chips (Sprites / Update / Event / Upcoming / Known Issue) and a search box — all filtering client-side. It shares the app’s header, footer and sidebar (Upcoming & leaked, Support).' },
      { tag: 'Changed', text: 'The News nav link on the static SEO pages now points at /news (instead of deep-linking into the app), and /news is in the sitemap. The prerender nav marks the current section active per page (Sprites vs News).' },
    ],
    why:
      'People search for “Fortnite sprite news / patch notes / event times,” and the in-app feed rendered client-side — invisible to crawlers. The news data was already static, so prerendering it is low-effort, high-return SEO. Stats/Leaderboard stay app-only (personalized/volatile), and Item Shop is held back until a live rebuild can keep a static snapshot honest.',
  },
  {
    date: 'July 31, 2026',
    title: 'Cosmetics is a full tab now (not a pop-up)',
    summary:
      'The Cosmetics browser moved out of a modal and into a proper tab — laid out like the Item Shop, with name search, rarity/type filters and a wishlist-only toggle.',
    changes: [
      { tag: 'Changed', text: 'Cosmetics is now a primary nav tab (next to Item Shop) instead of a pop-up. Same content — the newest Fortnite cosmetics with the local ♥ Want wishlist — but as a full page with the Item Shop’s search + rarity/type filters and a “♥ Wishlist” filter. Old /?cosmetics=1 links still work (they open the tab).' },
    ],
    why:
      'A modal was a cramped home for a browsable, filterable grid — it fought the Item Shop it sits beside. Making Cosmetics a tab gives it the same room and controls, and keeps the two “what’s in Fortnite right now” views consistent.',
  },
  {
    date: 'July 31, 2026',
    title: 'Chest luck skips vaulted finishes',
    summary:
      'The Chest-luck calculator no longer offers vaulted finishes (like Grim’s or Aura’s Gem) — you can’t pull them right now, so quoting odds for them was misleading.',
    changes: [
      { tag: 'Fixed', text: 'Vaulted variant finishes are excluded from the finish picker in the Chest-luck calculator (in-app and on every per-Sprite page) until they’re obtainable again. Released, non-vaulted finishes are unaffected.' },
    ],
    why:
      'The calculator answers “how many chests to pull this finish.” For a vaulted finish the honest answer is “you can’t right now,” so listing it with an odds estimate implied it was farmable when it isn’t.',
  },
  {
    date: 'July 31, 2026',
    title: 'Gem Aura vaulted again',
    summary:
      'Gem Aura — the variant from the v41.30 quest — was vaulted again. Players who unlocked it keep it, but it’s no longer obtainable.',
    changes: [
      { tag: 'Changed', text: 'Gem Aura now wears a “Vaulted” badge and isn’t counted as currently obtainable. It stays in the roster (owners keep it, so the released-variant count is unchanged), matching how Grim Reaper’s vaulted Gem is handled.' },
      { tag: 'Changed', text: 'The v41.30 quests news entry now notes that Gem Aura has since been vaulted, so it no longer reads as still-available.' },
    ],
    why:
      'Gem Aura launched through its v41.30 quest and then Epic pulled it again. “Vaulted” (not “unreleased”) is the accurate state here — unlike Gem King, this one actually went live, so anyone who earned it keeps it while it stops being obtainable for everyone else.',
  },
  {
    date: 'July 31, 2026',
    title: 'Roster fix: Gem King is unreleased (release pulled)',
    summary:
      'Marked the Gem King variant as unreleased. It exists in the game files but its public release was pulled, so it’s no longer counted as obtainable.',
    changes: [
      { tag: 'Fixed', text: 'Gem King now shows as an unreleased special variant (not collectible). It stays on King’s variant line as “coming soon” rather than being marked available, and it no longer appears as a selectable finish in the Chest-luck calculator.' },
      { tag: 'Changed', text: 'The released-variant count drops 111 → 110 everywhere it’s shown (header tagline, /sprites), and the v41.30 New Sprite Day announcement + news entry were corrected to match.' },
    ],
    why:
      'Data miners found Gem King alongside the other v41.30 Gem variants, but Fortnite.GG still lists it as unreleased and its public release was pulled from the in-game news feed. Counting it as obtainable overstated the roster and would let players “calculate odds” for a finish nobody can actually pull — so it’s flagged unreleased until Epic ships it for real.',
  },
  {
    date: 'July 31, 2026',
    title: 'Guide + Sprites are now one page',
    summary:
      'Merged the old Guide tab and the Sprites page into a single \u201CSprites\u201D destination \u2014 the searchable, sortable \u201Chow to get every Sprite\u201D board with the reference sidebar (how Sprites work, upcoming/leaked, chest luck, support) beside it.',
    changes: [
      { tag: 'Added', text: 'A search box on the Sprites board \u2014 type a name to filter the list instantly, on top of the existing Easiest / Rarest / Cheapest Dust / A\u2013Z sorts and Available / Upcoming / Vaulted filters.' },
      { tag: 'Changed', text: 'The Sprites nav entry now opens the combined board-plus-sidebar layout in-app, and the static /sprites SEO page was rebuilt to match it (its main column is the same how-to-get table, with sort/filter/search running client-side).' },
      { tag: 'Removed', text: 'The separate \u201C\uD83E\uDDED Guide\u201D nav entry \u2014 its content lives on the Sprites page now. Old ?view=guide links redirect there.' },
    ],
    why:
      'The Guide tab and the Sprites page listed the same Sprites twice in two different layouts. Folding them together removes the duplication: one place to browse, filter and plan a grind, keeping the Guide\u2019s scannable ranked table and the Sprites page\u2019s reference sidebar. The in-app view and the static SEO page share one content source so they can\u2019t drift.',
  },
  {
    date: 'July 31, 2026',
    title: 'New \u201CGuide\u201D tab: how to get every Sprite',
    summary:
      'A ranked, filterable guide to landing every Sprite \u2014 drop rate, average chests, re-summon Dust and where to find each one.',
    changes: [
      { tag: 'Added', text: 'A Guide tab that lists every Sprite ranked by how easy it is to get (default), or by Rarity, cheapest Dust or A\u2013Z. Each row shows rarity, tier, drop rate + average Sprite Chests, Dust cost, obtainable/upcoming/vaulted status and how to farm it. Filter by Available / Upcoming / Vaulted, and tap through to any Sprite\u2019s page.' },
      { tag: 'Added', text: 'A Mastery Monday callout that highlights the weekly 2\u00d7 Sprite Dust & XP window (and lights up when today is Monday).' },
    ],
    why:
      'Players kept asking \u201Cwhat\u2019s easiest / how do I get this one\u201D \u2014 the data was spread across individual Sprite pages. This pulls it into one scannable, sortable board (inspired by fortnite.gg\u2019s cosmetics guides) so you can plan a grind at a glance.',
  },
  {
    date: 'July 31, 2026',
    title: 'Striker\u2019s real finishes added (the \u201CSoccer\u201D icons)',
    summary:
      'Identified the archive\u2019s unlabelled \u201CSoccer\u201D Sprite as Striker and dropped in its official Gummy, Galaxy and Holofoil art.',
    changes: [
      { tag: 'Added', text: 'Official art for Striker\u2019s Gummy, Galaxy and Holofoil finishes (Epic\u2019s files were codenamed \u201CSoccer\u201D \u2014 the soccer-ball-headed Sprite, not the Vini Jr. collab). No Gem finish exists for it yet.' },
    ],
    why:
      'The \u201CSoccer\u201D codename matched Striker\u2019s ball-head silhouette, not Vini Jr. (a human-headed player), so its finishes belong to Striker.',
  },
  {
    date: 'July 31, 2026',
    title: 'Chest luck can now estimate odds for a specific finish',
    summary:
      'Pick a finish (Gold, Gummy, Galaxy\u2026) in the Chest-luck calculator and it estimates how many chests it takes to pull that exact variant \u2014 not just the base Sprite.',
    changes: [
      { tag: 'Added', text: 'A Finish dropdown on the Chest-luck calculator (in-app and on every per-Sprite page). Choosing a special finish multiplies the base (Normal) drop rate by that finish\u2019s rarity factor and recomputes the effective rate, avg chests and 50/90/99% targets, plus the \u201Copen N \u2192 chance of at least one\u201D line.' },
      { tag: 'Added', text: 'A clear \u201Cestimate only\u201D flag whenever a special finish is selected, since Epic doesn\u2019t publish finish odds.' },
    ],
    why:
      'Special finishes are much rarer than the base Sprite, and people wanted per-finish numbers. Epic doesn\u2019t publish finish-roll odds, so the factors live in one clearly-labelled place (FINISH_ODDS_FACTOR in themes.js) as rough, tunable estimates \u2014 the UI marks them as approximate rather than implying measured precision.',
  },
  {
    date: 'July 31, 2026',
    title: 'Sprite pages now spell out what each variant does',
    summary:
      'Every finish on a Sprite\u2019s page now shows its bonus perk and whether it\u2019s obtainable, not just its name.',
    changes: [
      { tag: 'Added', text: 'Each variant card on a per-Sprite page now lists the finish\u2019s bonus perk (e.g. Gummy = +20% Sprite Dust on extraction, Galaxy = +30% ammo when looting, Holofoil = +5% squad chance to find rare Sprites), colour-tinted to the finish, alongside its Available / Coming soon / Vaulted status.' },
    ],
    why:
      'The pages listed finishes by name only. Every finish keeps the Sprite\u2019s base ability but adds its own perk \u2014 surfacing that (data the app already had in themes.js) turns the variant grid into a real reference for what each one is worth chasing.',
  },
  {
    date: 'July 31, 2026',
    title: 'Roster corrections: no Peely Gem or Llama Holofoil; Spider-Man still unreleased',
    summary:
      'Trimmed two finishes that don\u2019t actually exist and stopped showing Spider-Man as live, so the roster matches the game (111).',
    changes: [
      { tag: 'Fixed', text: 'Removed the Peely Gem and Lootin\u2019 Llama Holofoil variants \u2014 neither exists in-game.' },
      { tag: 'Fixed', text: 'Spider-Man no longer shows as released: cleared its July 30 release date (it hadn\u2019t actually dropped), so it reads as an unreleased/rumored Sprite again.' },
    ],
    why:
      'With Epic\u2019s official icon set in hand it\u2019s clear those two finishes were never real, and Spider-Man missed its expected window \u2014 the count is back to the confirmed 111 released Sprites.',
  },
  {
    date: 'July 31, 2026',
    title: 'Aura\u2019s Gem art added',
    summary:
      'Filled the last confirmed Gem gap with Epic\u2019s official Aura Gem art.',
    changes: [
      { tag: 'Added', text: 'Real art for Aura\u2019s Gem finish (aura_gem) \u2014 the hooded, glowing-eyed Aura in crystal \u2014 replacing the vector fallback.' },
    ],
    why:
      'aura_gem was the one confirmed Gem variant still on the built-in fallback; with the official image in hand it now matches the game.',
  },
  {
    date: 'July 31, 2026',
    title: 'Official Epic art across the roster (78 Sprite icons)',
    summary:
      'Swapped in Epic\u2019s official in-game Sprite icons for 78 variants from a full asset archive \u2014 replacing the built-in stand-ins almost everywhere and filling several gaps, including the Ironmouse Sprite.',
    changes: [
      { tag: 'Added', text: 'Real art for the Ironmouse Sprite (ironmouse), plus Peely\u2019s Galaxy & Holofoil finishes \u2014 all previously on the vector fallback.' },
      { tag: 'Changed', text: 'Replaced 72 variant images with Epic\u2019s official icons across Water, Earth, Fire, Zero Point, Grim, King, Duck, Demon, Punk, Ghost, Air, Boss, Fishy, Seven, Peely, Llama, Batman and Dream \u2014 the finishes (Gold, Gummy, Galaxy, Gem, Holofoil, Cube, Quack) now match the game exactly.' },
    ],
    why:
      'The maker supplied a full archive of Epic\u2019s official Sprite icons (their real filenames map cleanly to our type + finish). Genuine assets are the source of truth, so they supersede every generated stand-in. A few Drifter finishes and one unlabelled \u201CSoccer\u201D Sprite from the archive are staged but held \u2014 Drifter isn\u2019t live yet, and the Soccer Sprite needs identifying before it\u2019s filed.',
  },
  {
    date: 'July 31, 2026',
    title: 'Real Epic art for a whole batch of variants (Quack, Gem & finishes)',
    summary:
      'Dropped in official in-game art for a big set of variants supplied by the maker, and corrected what the “Quack” finish actually is.',
    changes: [
      { tag: 'Added', text: 'Official art for the Quack finish (Water, Earth, Fire, Zero Point), the Gem finish (King, Water, Grim), and Peely’s Gold/Gummy plus Lootin’ Llama’s Gold/Gummy/Galaxy/Gem.' },
      { tag: 'Added', text: 'A Gem variant for King — its real art surfaced, so it now counts in the roster alongside King’s other finishes.' },
      { tag: 'Changed', text: 'The “Quack” finish is a crystalline treatment, not a duck — removed the placeholder duck-bill the fallback art was drawing and let the real art speak for itself.' },
    ],
    why:
      'With real images in hand for these finishes, the built-in vector stand-ins are replaced by the genuine look. The duck-bill was a wrong guess at what “Quack” meant; the actual Quack art is a purple-crystal finish, so the stand-in was corrected to match.',
  },
  {
    date: 'July 31, 2026',
    title: 'Real Epic art for Peely & Lootin\u2019 Llama',
    summary:
      'Dropped in the official in-game art for the two newest base Sprites, replacing the built-in stand-in glyphs.',
    changes: [
      { tag: 'Added', text: 'Official 512\u00d7512 transparent art for Peeky Peely and Lootin\u2019 Llama in public/sprites/, so both now show their real in-game look across the grid, detail popup and sprite pages instead of the vector fallback.' },
    ],
    why:
      'The stand-in glyphs were only ever a placeholder until real art was in hand \u2014 with the official images supplied, they drop straight in over the top with no code change (the fallback still covers any variant whose art isn\u2019t added yet).',
  },
  {
    date: 'July 31, 2026',
    title: 'Better built-in art: Peely, Llama, Ironmouse + a real duck bill for Quack',
    summary:
      'The three newest character Sprites were falling back to an identical generic blob, and the Quack variant was just a recoloured body. Both now render with recognisable features so you can tell them apart at a glance.',
    changes: [
      { tag: 'Fixed', text: 'Peeky Peely (banana-yellow with a stem cap + soft ridges), Lootin’ Llama (piñata-blue with upright ears + a bright snout) and Ironmouse (pink with little demon horns + a heart) now each have a distinct built-in vector treatment instead of the default blue blob.' },
      { tag: 'Fixed', text: 'The Quack variant (Water, Earth, Fire, Zero Point) now draws an orange duck bill in place of the smile, so a recoloured body actually reads as a duck instead of a plain yellow blob with a gloss spot.' },
    ],
    why:
      'Real in-game art for the newest Sprites isn’t available from any source the build can reach (no Sprite image API; the wiki, fortnite.gg and the community mirrors either block automated fetches or predate the July 30 drop). Rather than leave look-alike placeholders, they get on-theme original glyphs — consistent with how Batman, Spider-Man and Grim are drawn. These are stylised icons, never an AI likeness of a real performer; the moment official art is in public/sprites/ it drops straight in over the top.',
  },
  {
    date: 'July 30, 2026',
    title: 'A more visual News feed',
    summary:
      'The News tab now leads each item with imagery — the relevant Sprite’s art or a category tile — plus a live-event badge and colour-coded accents.',
    changes: [
      { tag: 'Changed', text: 'News cards now show a thumbnail: the linked Sprite’s art where it fits, otherwise a tag-coloured tile with the category glyph. Added a coloured accent bar per category, a pulsing “LIVE” badge on events running right now, and a subtle hover lift.' },
      { tag: 'Added', text: 'News entries can carry an `image` URL or a `sprites: [ids]` link, so an item pulls in real Sprite art (e.g. the New Sprite Day post shows the Zero Point Sprite).' },
    ],
    why:
      'The feed was a wall of text. Leading each card with an image — mostly reusing Sprite art the app already has — makes it scannable and lively without external video embeds (which would add weight and cross-origin requests).',
  },
  {
    date: 'July 30, 2026',
    title: 'Flagged the vaulted Sprites (Ironmouse & Gem Grim)',
    summary:
      'Epic pulled the Ironmouse Sprite and the Gem Grim variant the same day they launched — the tracker now flags them “Vaulted” instead of showing them as freely collectible.',
    changes: [
      { tag: 'Added', text: 'A “Vaulted” state + badge for a Sprite (or a specific variant) that Epic launched then pulled. Ironmouse and Grim’s Gem variant now show a red Vaulted badge across the grid, the detail popup and the sprite pages.' },
      { tag: 'Changed', text: 'Ironmouse’s “where to find” now notes Relic Chests and the vaulting; added a news entry for it.' },
    ],
    why:
      'HYPEX reported both were vaulted within hours of the v41.30 launch. Owners keep what they extracted, so the Sprites stay visible in the tracker — but clearly labelled as currently unavailable rather than collectible.',
  },
  {
    date: 'July 30, 2026',
    title: 'v41.30 corrected to the real 20-Sprite drop (Ironmouse added, abilities fixed)',
    summary:
      'Reconciled the roster with the confirmed v41.30 list of 20 new Sprites — added the Ironmouse collab, fixed the Peely/Llama ability mix-up, and trimmed the variants that were pre-launch speculation, so the count matches the game’s 111.',
    changes: [
      { tag: 'Added', text: 'The Ironmouse Sprite (Mythic VTuber collab) — regenerates health while granting Cloak and low gravity when you drop low (60 → 100 HP by level).' },
      { tag: 'Fixed', text: 'Peeky Peely and Lootin’ Llama had their abilities swapped: Peely is the ping that reveals nearby rare-Sprite carriers (40 → 80m), Llama is the ammo-box weapon-upgrade chance (5% → 20%). Also corrected John Wick (reveal on knock/elim, mark 3 → 5s) and added per-level scaling to all.' },
      { tag: 'Fixed', text: 'Trimmed the variants to the ones that actually shipped: full Gold/Gummy/Galaxy/Gem/Holofoil for Peely & Llama, Grim’s Gem + Holofoil, and Quack for Water/Earth/Fire/Zero Point. Removed the speculative wide Gem/Holofoil waves that didn’t drop — the roster count now lines up with the game’s 111.' },
    ],
    why:
      'Pre-launch leaks over-promised (a broad Gem wave, roster-wide Holofoils) and had Peely/Llama’s powers reversed. The post-launch “20 new Sprites → 111 total” breakdown is the authoritative source, so the tracker now mirrors exactly what’s live rather than the leaks.',
  },
  {
    date: 'July 30, 2026',
    title: 'v41.30 follow-ups: correct Sprite names + graceful art fallback',
    summary:
      'Fixed the two new Sprites’ names to their in-game ones and made sprite pages fall back to a glyph when a Sprite’s art image hasn’t been added yet.',
    changes: [
      { tag: 'Changed', text: 'The two new Sprites are now named Peeky Peely and Lootin’ Llama (their official in-game names) — both confirmed Legendary. Loot Llama actually drops fairly often despite the tier.' },
      { tag: 'Fixed', text: 'On the sprite pages, a Sprite whose art hasn’t been added yet now shows its glyph on the themed tile (matching the app) instead of a blank avatar — so the newest Sprites don’t look broken while their images are pending.' },
    ],
    why:
      'Community sources settled on “Peeky Peely” / “Lootin’ Llama,” so the tracker should match. And the static sprite pages hid missing images entirely (blank), unlike the app which draws a procedural glyph — the fallback closes that gap until official art is dropped into public/sprites/.',
  },
  {
    date: 'July 30, 2026',
    title: 'New Sprite Day is LIVE — v41.30: Peely, Loot Llama, Quack Zero Point + the Gem wave',
    summary:
      'The v41.30 New Sprite Day drop is in the tracker: two new Sprites, the exclusive Quack Zero Point, a seven-strong Gem variant wave, and the John Wick / Spider-Man collabs — plus the Springfield Reloaded and Web-Shooter Power Hour events.',
    changes: [
      { tag: 'Added', text: 'Two new base Sprites — Peely (chance to upgrade weapons from ammo boxes) and Loot Llama (pings nearby rare Sprites).' },
      { tag: 'Added', text: 'The Gem wave: Gem variants for Water, Earth, Duck, Demon, Aura and Zero Point, plus the exclusive Quack Zero Point (Zero Point is the only Sprite with the Quack variant).' },
      { tag: 'Added', text: 'The v41.30 quest variants (Cube Punk, Galaxy Demon, Holofoil Seven, Gem Aura) and the John Wick Sprite (Mythic, exclusive to Springfield Reloaded) are all trackable; Spider-Man is live via the Brand New Day collab.' },
      { tag: 'Changed', text: 'News + announcement flipped from “leaked” to “live”, and added the Springfield Reloaded event (Simpsons map on Reload through Aug 3, the John Wick “The Confidential” POI, 50-player lobbies) and the Aug 1 Web-Shooter Power Hour. Header tagline now reads “accurate to the Jul 30 New Sprite Day (v41.30).”' },
    ],
    why:
      'New Sprite Day is the last major Chapter 7 Season 3 drop, so getting the roster, variants and events in on day one keeps the tracker trustworthy. Rarities and drop rates for the brand-new Sprites are community estimates until Epic publishes official figures, and a couple of the newest Sprites may show a placeholder until their art is added — flagged rather than guessed.',
  },
  {
    date: 'July 29, 2026',
    title: 'A more visual Player Stats empty state',
    summary:
      'Before you search, the Player Stats tab now shows tap-to-try example players and a preview of the metrics you’ll get — instead of a single line of text.',
    changes: [
      { tag: 'Added', text: 'A “tap a pro” row (Ninja, Bugha, SypherPK, Clix) on the empty Stats tab — one tap prefills and runs the lookup so you can see the feature immediately.' },
      { tag: 'Added', text: 'A ghosted “What you’ll see” preview grid (Wins, Win rate, K/D, Kills, Matches, Top 10, Top 25, Hours) so the tab isn’t empty before a search.' },
    ],
    why:
      'The Stats tab was a single sentence until you searched, which read as unfinished. Showing what a lookup returns — and letting people try one in a tap — makes the feature discoverable and the page feel alive from the first visit.',
  },
  {
    date: 'July 29, 2026',
    title: 'Sprite popup links to the full Sprite page',
    summary:
      'Opening a released Sprite’s detail popup now offers a link straight to its full page (drop rate, Dust, chest odds & FAQ).',
    changes: [
      { tag: 'Added', text: 'The Sprite detail modal now has a “View the full … page” link to /sprite/<name> for released Sprites — a shareable, deep-linkable page with the full write-up. Hidden for unreleased Sprites (no page yet).' },
    ],
    why:
      'The modal is great for quick tracking, but the static Sprite pages have more (chest-odds table, FAQ, JSON-LD) and are shareable. Linking them connects the two and helps SEO via internal links.',
  },
  {
    date: 'July 29, 2026',
    title: 'Live Chest-luck calculator on the Sprites pages',
    summary:
      'The interactive Chest luck calculator now lives in the sidebar on the Sprites page and on every per-sprite page — the same tool as in the app, pre-set to whichever Sprite you’re viewing.',
    changes: [
      { tag: 'Added', text: 'A working Chest luck calculator (pick a Sprite → chests for a 50/90/99% chance, plus a live “open N chests → chance of at least one”) in the Sprites-page sidebar and on each per-sprite page. On a Sprite’s own page it defaults to that Sprite. Same geometric math as the in-app calculator, running as a small self-contained script.' },
      { tag: 'Changed', text: 'Per-sprite pages are now two-column (content + sidebar) like the collection view, with the Chest-luck and Support cards alongside.' },
      { tag: 'Fixed', text: 'The ⋯ More button on the sprite pages now shows the same dropdown caret (▾) as the in-app nav.' },
    ],
    why:
      'The static per-sprite pages already listed static chest odds, but people want to run their own numbers without leaving for the app. Cloning the calculator as a tiny vanilla-JS widget keeps the pages static and fast while giving them the app’s interactivity, and defaulting it to the current Sprite makes it useful the moment the page loads.',
  },
  {
    date: 'July 29, 2026',
    title: 'Sprites-page polish: nav sizing, readable CTA, clickable leaks',
    summary:
      'A round of fixes on the Sprites page — tighter nav, a readable Start-tracking button, and the Upcoming & leaked Sprites now open their detail card like on the collection page.',
    changes: [
      { tag: 'Fixed', text: 'The Sprites-page nav pills were too tall and the ⋯ More button didn’t match them; both are now the app’s compact pill height and line up.' },
      { tag: 'Fixed', text: 'The “Start tracking your collection” button had near-unreadable dark text on the darker end of the gradient — it now sits on the brand colour so it reads clearly.' },
      { tag: 'Added', text: 'Sprites in the Upcoming & leaked card are now clickable — they open the same detail modal the collection page uses (via /?sprite=…), so a deep link lands straight on that Sprite instead of the welcome pop-up.' },
      { tag: 'Fixed', text: 'John Wick’s and Spider-Man’s “where to find” notes are corrected — John Wick is leaked as a Simpsons Reload exclusive (Reload Portable Extractor), not a standard chest drop.' },
    ],
    why:
      'These were the rough edges left after moving the Sprites page onto the app’s layout: the nav inherited the wrong line-height, the CTA’s dark text fell on the purple end of the gradient in the narrow sidebar, and the leaked Sprites weren’t clickable. Wiring them to the existing detail modal (and skipping the welcome pop-up on a deep link) makes the leaked entries behave exactly like the collection page.',
  },
  {
    date: 'July 29, 2026',
    title: 'Fixed the display font everywhere + gave the Sprites page a sidebar',
    summary:
      'The wordmark and headings were quietly falling back to a serif font in the app; that’s fixed, so the app and the sprite pages finally use the same Luckiest Guy display font. The Sprites page also gets the ⋯ More menu and a proper right sidebar.',
    changes: [
      { tag: 'Fixed', text: 'The display font (wordmark + headings) was set to “DM Serif Display” in the Tailwind config, which was never loaded — so the app fell back to Georgia serif while the sprite pages showed Luckiest Guy. Pointed it back at Luckiest Guy so everything matches.' },
      { tag: 'Added', text: 'The sprite pages’ nav now has the same ⋯ More menu as the app (About · Changelog · Backup · Report a bug · Buy me a coffee).' },
      { tag: 'Changed', text: 'The Sprites page is now a two-column layout like the app: the sprite grid on the left, and a right sidebar with How Sprites Work (collapsible), a Start-tracking CTA, an Upcoming & leaked list, and a Support-the-maker card.' },
      { tag: 'Changed', text: 'Dropped the page breadcrumb and the big “All Fortnite Sprites” heading + blurb so the Sprites page matches the app’s section pages (which don’t have page titles). Per-sprite pages keep their name heading; their breadcrumb is gone too.' },
    ],
    why:
      'The recurring “the pages don’t match” came down to a real bug: a stale Tailwind display-font override that was never loaded, so the app rendered a serif while the SEO pages rendered the intended Luckiest Guy. Fixing it at the source lines up every wordmark and heading. Moving the Sprites page to the app’s two-column shell (grid + sidebar) and dropping the SEO-style title/breadcrumb makes it read like a native section of the app rather than a separate landing page.',
  },
  {
    date: 'July 29, 2026',
    title: 'Sprite pages now share the app’s full header & footer',
    summary:
      'The static sprite pages now carry the same header (wordmark + tagline + CTA) and the same full footer (sections, utility links, Creator Code and the attribution notes) as the app, so the top and bottom of every page match.',
    changes: [
      { tag: 'Changed', text: 'Sprite-page header now includes the app’s tagline under the wordmark (“N released variants · accurate to…”) and the same top-right CTA, not just the logo.' },
      { tag: 'Changed', text: 'Sprite-page footer rebuilt to mirror the app’s: the sections row, the utility/support row (Cosmetics · About · Changelog · Backup · Report a bug · Buy me a coffee · Sprite database · Creator Code MOMBIE), the #EpicPartner line and the full image/roster/data attribution notes.' },
      { tag: 'Added', text: 'The footer’s utility links deep-link into the app (/?about=1, /?changelog=1, /?backup=1, /?bug=1, /?cosmetics=1), so they open the matching modal the same way the in-app footer does.' },
    ],
    why:
      'The sprite pages had already adopted the app’s colors and body styling, but the header was just a logo and the footer was a one-line disclaimer — so the chrome still read as a different site. Sharing the exact header and footer (and making the footer’s links actually work via deep-links) makes the SEO pages feel like the same product top to bottom, and carries the full attribution onto every indexed page.',
  },
  {
    date: 'July 29, 2026',
    title: 'Collection page cleanup: one stats hub, guide moved to the Sprites page',
    summary:
      'The Collection sidebar is consolidated so your stats live in a single Breakdown card, the sidebar is reordered, and the “How Sprites work” guide now lives on the Sprites page instead of a pop-up.',
    changes: [
      { tag: 'Changed', text: 'The Breakdown card is now the one stats hub: Collection % and Mastery % sit side by side, and the Dust-to-complete detail (missing count + per-rarity split) is folded in. The separate Collection/Mastery card and the standalone “Dust to complete” card are gone.' },
      { tag: 'Changed', text: 'Reordered the Collection sidebar — Share & export now sits directly under the “Import from a screenshot” card, with the Breakdown card right below it.' },
      { tag: 'Changed', text: 'The “How Sprites work” guide moved out of a modal and onto the Sprites page (/sprites#how-sprites-work); it’s no longer a nav item. The in-app “How Sprites work” links now jump to that section.' },
      { tag: 'Changed', text: 'A shared Trainer Card page shows the same consolidated Breakdown and no longer shows a Share & export button (that only made sense on your own tracker).' },
    ],
    why:
      'The Collection sidebar had three overlapping stat cards plus a beginner-guide modal. Folding the numbers into one Breakdown card and moving the guide to a real, linkable page (better for sharing and SEO, and a single source of truth that can’t drift from the app) removes the duplication and makes the page scan faster.',
  },
  {
    date: 'July 29, 2026',
    title: 'Sprite pages: identical header logo & nav to the app',
    summary:
      'The wordmark on the static sprite pages is now the exact size it is in the app, and the section nav lists the same items in the same order — so the header no longer subtly “resets” when you land on a sprite page.',
    changes: [
      { tag: 'Changed', text: 'The “FN Sprite Tracker” wordmark and logomark on the sprite pages now use the app’s exact type sizes (30px → 36px display, 32px → 36px mark) and responsive step, instead of a smaller fixed 22px wordmark.' },
      { tag: 'Changed', text: 'The sprite-page section nav now mirrors the app’s order — Collection · Leaderboard · Stats · News · Item Shop · Sprites · Cosmetics — and adds the missing Cosmetics link.' },
      { tag: 'Added', text: 'Cosmetics is now deep-linkable (/?cosmetics=1), so the Cosmetics nav item on a sprite page opens the same Cosmetics modal the in-app button does.' },
    ],
    why:
      'The logo, palette and page styling were already unified, but the header wordmark was rendered noticeably smaller on the SEO pages and the nav put Sprites in a different slot and dropped Cosmetics entirely — small inconsistencies that made the header feel like a different site for a beat. Matching the app’s exact type sizes and nav order (and giving Cosmetics a real link) closes that last gap.',
  },
  {
    date: 'July 28, 2026',
    title: 'Sprite pages now match the app, seam for seam',
    summary:
      'The static sprite pages share the app’s exact content width, background, palette, cards and type — so moving between the app and a sprite page feels like one continuous site.',
    changes: [
      { tag: 'Changed', text: 'Rebuilt the sprite pages on the app’s own design tokens: the same 1152px content width, the same layered gradient background, identical panel/card styling, and the Inter-body / Luckiest-Guy-display split.' },
      { tag: 'Changed', text: 'Section headers now use the app’s Inter-extrabold treatment (the display font is reserved for the wordmark and the page title), matching the app’s hierarchy instead of setting every heading in the display face.' },
      { tag: 'Fixed', text: 'Corrected the narrower page width and a few off-by-a-shade colors (borders, body text) that made the sprite pages read as a separate site.' },
    ],
    why:
      'The logo and nav were already unified, but the pages still felt like a different site: the container was narrower, the background and a couple of colors were slightly off, and every heading used the display font. Matching the app’s tokens exactly removes those seams so the SEO pages read as a native part of the product.',
  },
  {
    date: 'July 28, 2026',
    title: 'Per-sprite share cards + a New Sprite Day heads-up',
    summary:
      'Links to a specific sprite now unfurl with that sprite’s own card, and the news feed is refreshed for the July 30 New Sprite Day drop.',
    changes: [
      { tag: 'Added', text: 'Every /sprite/… page now generates its own social preview image (rarity, drop rate, Dust, chests-for-50%), so sharing a sprite link on Discord/Twitter/iMessage shows that sprite’s card instead of the generic banner.' },
      { tag: 'Added', text: 'An “Upcoming” news entry + announcement bar for New Sprite Day (v41.30, Jul 30): the leaked Peely, Loot Llama & Quack Zero Point Sprites and the Spider-Man collab — all clearly flagged as leaks.' },
      { tag: 'Changed', text: 'Softened the Spider-Man Sprite’s placeholder rarity — its tier, ability and drop rate are datamined, not confirmed by Epic.' },
      { tag: 'Fixed', text: 'Removed a stale “v41.20 — Sprite Pod styles (upcoming)” news item that still showed as upcoming after that patch had already shipped.' },
    ],
    why:
      'Per-sprite cards make shared links far more clickable and reinforce the brand on the exact page someone is sharing. The events refresh keeps the feed honest ahead of the season’s last major patch while labeling everything unconfirmed, so we’re never presenting leaks as fact. We deliberately left the “accurate to Jul 23” collection marker unchanged until the new Sprites are actually live.',
  },
  {
    date: 'July 27, 2026',
    title: 'A proper logo + one navigation everywhere',
    summary:
      'FN Sprite Tracker now has a little Sprite logomark, and the sprite pages share the app’s exact wordmark, colors and navigation — so the whole site finally looks like one product.',
    changes: [
      { tag: 'Added', text: 'A Sprite logomark (a rounded, kawaii Sprite in the brand gradient) now sits beside the name in the app header, on the sprite pages, and in the browser tab (favicon).' },
      { tag: 'Added', text: 'A 🧩 Sprites tab in the app’s main navigation (→ the sprite database), so it’s a real section, not just a footer link.' },
      { tag: 'Changed', text: 'The sprite pages now use the same wordmark font, color palette and section nav (Collection · Sprites · Leaderboard · Stats · News · Item Shop) as the app. Fully responsive.' },
    ],
    why:
      'The name was rendering in two different fonts between the app and the new sprite pages, and the navigation didn’t match — so the pages felt like a separate site. A single self-contained SVG mark (no web-font dependency) plus one shared nav ties everything together and reinforces the brand wherever people land.',
  },
  {
    date: 'July 26, 2026',
    title: 'Sprite pages: real artwork + consistent navigation',
    summary:
      'The per-sprite pages now show the actual sprite art and share the same section nav as the app, top and bottom — so the whole site feels like one product on any screen size.',
    changes: [
      { tag: 'Changed', text: 'Per-sprite and /sprites pages now use the real sprite artwork (hero image + every variant) instead of placeholder icons.' },
      { tag: 'Changed', text: 'Those pages carry the same section navigation as the app (Collection · Sprites · Leaderboard · Stats · News · Item Shop) in a responsive header and footer, so you can move between the sprite pages and the tracker seamlessly. Fully mobile-responsive.' },
    ],
    why:
      'A visitor who lands on a sprite page from search should immediately feel they’re in the real app and be able to get anywhere — and see the actual sprite, not a stand-in. Reusing the collection’s artwork and the app’s nav ties the static pages and the SPA into one consistent experience.',
  },
  {
    date: 'July 26, 2026',
    title: 'A page for every sprite (better search discovery)',
    summary:
      'Every released sprite now has its own shareable page with drop rate, Dust cost, chest odds, ability, variants and an FAQ — so people can find the tracker by searching for a specific sprite.',
    changes: [
      { tag: 'Added', text: 'Per-sprite pages at /sprite/<name> (e.g. /sprite/grim-reaper) plus an all-sprites index at /sprites — real, fast-loading pages with drop rate, re-summon Dust, “how many chests it takes,” ability, variants and a FAQ.' },
      { tag: 'Added', text: 'A “🗂️ Sprite database” link in the footer, an updated sitemap, and structured data (FAQ) so search engines can build rich results.' },
    ],
    why:
      'There are a lot of sprite trackers competing for the same searches. These pages are generated at build time from the same data the app already uses (so they’re always accurate and cost nothing to serve) and give Google real content to rank for “<sprite> drop rate / how to get / dust cost” — the searches that actually bring in new players.',
  },
  {
    date: 'July 26, 2026',
    title: 'Show your Battle Royale stats on your Trainer Card (opt-in)',
    summary:
      'A new toggle lets you surface your live BR stats on your shared profile — off by default, and behind a real privacy boundary.',
    changes: [
      { tag: 'Added', text: 'Profile → “Show my stats on my shared profile.” When on, your shared (?u=…) Trainer Card shows a Battle Royale strip: Wins, Win rate, K/D and Kills, pulled live (needs your Epic name saved + match history public).' },
      { tag: 'Security', text: 'Off by default. The shared-profile read now goes through a security-definer function that returns your Epic name ONLY when you’ve opted in — and anonymous direct read access to the Epic columns was revoked at the database level, so nobody can pull your Epic name from a share link unless you turn stats on.' },
    ],
    why:
      'It finishes the “connect once” story and makes the Trainer Card a genuine flex — but stats are personal, so it’s strictly opt-in. Auditing the database turned up that the Epic name was technically readable via the public API even though the app never showed it; this change closes that for anonymous access and makes the opt-in an actual boundary, not just a UI choice.',
  },
  {
    date: 'July 26, 2026',
    title: 'Chest luck calculator',
    summary:
      'A new sidebar tool that turns drop rates into real expectations: how many Sprite Chests it takes to land a given Sprite.',
    changes: [
      { tag: 'Added', text: 'A 🎲 Chest luck card — pick any Sprite to see its base drop rate, the average number of chests to find one, and the chests needed for a 50% / 90% / 99% chance, plus a live “open N chests → chance of at least one.”' },
    ],
    why:
      'The drop rates were just numbers on a card. Framing them as “~11 chests on average” or “707k chests for a coin-flip at a Grim Reaper” makes the rarity tangible. It uses the standard geometric model (each chest an independent draw at the base rate) and is clearly labelled as community-estimated.',
  },
  {
    date: 'July 26, 2026',
    title: '“Sprites I need” export now shows only what you’re missing',
    summary:
      'The “Sprites I need” image is now a clean want-list — just the released sprites you don’t own yet, nothing else.',
    changes: [
      { tag: 'Changed', text: 'The “Sprites I need” export is now a focused grid of only your missing released sprites (each with its variant + a “still needed” marker), instead of the full locker with owned cells dimmed and unreleased ones locked.' },
      { tag: 'Added', text: 'A “Nothing left to collect!” card when you own every released sprite, and a header count (“N to go”) that matches your missing total. Works signed-in or as a guest.' },
    ],
    why:
      'The old version drew the entire matrix and just dimmed what you owned, which buried the one thing the image is for: what you still need. Showing only the missing-released sprites makes it an actual checklist you can screenshot and hunt from.',
  },
  {
    date: 'July 26, 2026',
    title: 'Item Shop — tap any offer for full details',
    summary:
      'Shop cards are now clickable. Open one to see the big render, the full description, set/series/season, price breakdown, shop history, and every item bundled in the offer.',
    changes: [
      { tag: 'Added', text: 'A detail popup for Item Shop offers: hero art, description, Type / Series / Set / Introduced season, first-added date and how many times it’s been in the shop, plus a discount %.' },
      { tag: 'Added', text: 'An “In this offer” grid — bundles often include a pickaxe, glider, wrap etc. that the shop tile didn’t show; now you can see everything you’d get.' },
      { tag: 'Fixed', text: 'Long set names, item names and shop-history text in the detail popup now wrap and stay fully readable instead of being cut off.' },
    ],
    why:
      'Shop tiles only previewed the first item of an offer and had no detail. All the extra info was already in the data we fetch — it just needed a place to live, so a tap now opens the full picture (no new data source).',
  },
  {
    date: 'July 26, 2026',
    title: 'Shared links now unfurl with your Trainer Card',
    summary:
      'Paste your collection link into Discord, Twitter, iMessage and friends see a generated card with your name and stats — not a generic banner.',
    changes: [
      { tag: 'Added', text: 'A dynamic social preview image for shared links (?u=…): a 1200×630 “Trainer Card” with your gamertag, sprites collected, mastered count and a flair tag, rendered on the fly.' },
    ],
    why:
      'The Trainer Card only showed up once you opened the app. Preview images are what actually make a link worth clicking, so shared links now personalize their unfurl. It’s handled at the edge (a tiny renderer plus middleware that points crawlers at the image) and fails safe — if the preview can’t render, the link still works normally.',
  },
  {
    date: 'July 26, 2026',
    title: 'Sprite Dust re-summon costs lowered',
    summary:
      'Epic’s July 24 hotfix cut the Dust needed to re-summon special variants by about a third — the tracker’s Dust estimates now reflect it.',
    changes: [
      { tag: 'Changed', text: 'Variant (Gold/Gummy/Galaxy/Holofoil…) re-summon Dust: Rare 4000→2700, Epic 6000→4000, Legendary 10000→6700, Mythic 15000→10000. Base (Normal) costs are unchanged.' },
    ],
    why:
      'The Jul 24 hotfix advertised “up to 33% off” variant summon costs ahead of Shinier Hours. Only the Rare (→2700) and Mythic (→10000) endpoints were spelled out by the community, so Epic/Legendary use the same ~33% cut to keep the table consistent — these are still community estimates, as before.',
  },
  {
    date: 'July 26, 2026',
    title: 'Trainer Cards — show off your collection',
    summary:
      'Your shared link (?u=…) now opens a proper player profile: an avatar, headline stats, earned badges, and a showcase of your favorite sprites.',
    changes: [
      { tag: 'Added', text: 'A ⭐ Showcase picker in your Profile — feature up to 6 owned sprites on your public Trainer Card. The first one becomes your avatar.' },
      { tag: 'Added', text: 'Earned badges, computed from your progress: Completionist / Elite Collector, Shiny Hunter / Perfectionist, Mythic Owner, rarity-set completion and Variant Hunter. They appear on your Trainer Card and next to your name on the leaderboard.' },
      { tag: 'Changed', text: 'The shared collection view now leads with the Trainer Card (avatar, gamertag, owned %, mastered count) instead of a plain “viewing X’s collection” line.' },
      { tag: 'Security', text: 'Showcase sprite ids are public display data; the shared-link query still selects only public fields (no Epic username or private data exposed).' },
    ],
    why:
      'The share link already existed but landed on a bare grid. Turning it into an identity card — favorites, badges, stats — gives people a reason to share it and a reason to click each other’s. Badges are derived on the fly (no new storage) so they’re always in sync with your real progress.',
  },
  {
    date: 'July 24, 2026',
    title: 'Connect your Epic account — Stats load automatically',
    summary:
      'Save your Epic name to your profile once and the Stats tab pulls up your Battle Royale stats every time — no more retyping.',
    changes: [
      { tag: 'Added', text: 'A 🎮 Epic account field in your Profile (display name + platform). Once it’s saved, the 📊 Stats tab auto-loads your stats whenever you open it.' },
      { tag: 'Added', text: 'A “★ This is me — save to profile” shortcut on any stats result, so you can connect your account right from the Stats tab. Your saved account shows a “Your account” badge.' },
      { tag: 'Fixed', text: 'Marked the Aura & Fire Sprite “shield damage doesn’t register” bug resolved — Epic fixed it in v41.20 (along with the drop-to-extract-turns-into-Water-Sprite bug).' },
      { tag: 'Security', text: 'Your saved Epic name is never exposed through public share links (shared collection views only read the display fields). Stats still require your match history to be public on Epic.' },
    ],
    why:
      'Looking up your own stats meant retyping your name every visit. “Connect once, always there” is the obvious win — and true Epic OAuth account-linking isn’t available to third-party apps, so saving the display name is the practical way to do it.',
  },
  {
    date: 'July 24, 2026',
    title: 'Shiny Hours (Jul 25) details filled in',
    summary:
      'Fleshed out tomorrow’s Shiny Hours callout with the full details so you can plan around it.',
    changes: [
      { tag: 'Changed', text: 'Shiny Hours (Sat, Jul 25) now shows the exact windows (2–4 PM & 9–11 PM ET) and everything it does: boosted Gold/Gummy/Galaxy/Holofoil spawns, Batman/Pollo/Seven/Air made more common, 2× Sprites from regular chests, and Big Heads + a Self-Revive for everyone.' },
    ],
    why:
      'The event was already scheduled but only listed the shiny variants — adding the featured collab Mythics and the 2×-chest boost makes it actually useful for deciding when to grind.',
  },
  {
    date: 'July 24, 2026',
    title: 'News: next-season (“Gaming Legends”) leak added',
    summary:
      'Added a forward-looking News entry on the leaked next season and what it means for Sprite collectors.',
    changes: [
      { tag: 'Added', text: 'News: Chapter 7 Season 4 is leaked as “Gaming Legends” (~Sept 4) with rumored crossovers (Sonic, Mega Man, Persona 5, Kingdom Hearts, Crash). The encouraging bit for collectors — Mastery Mondays are on the calendar through mid-September, hinting Sprites carry into the new season. Clearly flagged leaked/unconfirmed.' },
    ],
    why:
      'People are already asking whether their collections survive the season rollover, so surfacing the (tentative) signal that Sprites continue is worth having in the feed — with a clear “unconfirmed” label so a leak never reads as fact.',
  },
  {
    date: 'July 24, 2026',
    title: 'Every sprite redrawn — consistent variant finishes across the board',
    summary:
      'A full art pass: every variant is now rendered so the same finish looks identical on every sprite — Gold is the same Gold everywhere, Gummy the same jelly, Holofoil the same iridescence — while each sprite stays clearly itself.',
    changes: [
      { tag: 'Changed', text: 'Regenerated all 100+ variant images through one consistent pipeline, so each finish (Gold, Gummy, Galaxy, Gem, Holofoil, Cube, Quack, Rift) is the same material on every sprite. Previously the variants were made from mixed sources and drifted sprite-to-sprite; now they match.' },
      { tag: 'Changed', text: 'Cleaned up every render: uniform glossy figurine style, crisp transparent cutouts, and a consistent size/framing (512×512) so the grid reads evenly.' },
      { tag: 'Fixed', text: 'The Air, Drifter and Ice sprites were vague, washed-out blobs (two even had a leftover background baked in) — redrawn as clean, well-defined figurines so they’re identifiable like the rest.' },
      { tag: 'Changed', text: 'The Share/Export locker image uses the same art, so exported cards get the new visuals automatically.' },
    ],
    why:
      'The variant finish should be a property of the finish, not of the individual sprite — a collection reads as a set only when Gold means the same thing everywhere. The old art came from several different sources over time, which is why it looked inconsistent; rebuilding it all through one pipeline fixes that at the root.',
  },
  {
    date: 'July 23, 2026',
    title: 'New Sprite Day is live — wave-1 Cube Sprites now collectible',
    summary:
      'The first wave of Cube Sprites went live this morning (New Sprite Day, 9 AM ET). The eight that dropped are now marked collectible; the rest of the Cube line follows on the coming New Sprite Days.',
    changes: [
      { tag: 'Added', text: 'Wave-1 Cube Sprites are now collectible: Batman, Boss, Dream, Earth, Fire, Fishstick, Grim Reaper & Punk — the Kevin-the-Cube variant that grants Overdrive (a speed boost) in the Storm. Cube Batman & Cube Boss come from NPC encounters; the rest from Sprite Chests. Released-variant count updated accordingly.' },
      { tag: 'Added', text: 'Cube variant art for all eight so they match the rest of the collection (purple Cube-energy body with the cyan grid) instead of falling back to the placeholder illustration.' },
      { tag: 'Fixed', text: 'The Air Sprite’s Normal, Gummy and Holofoil images looked washed-out and nearly identical to each other — redone so Normal reads more clearly, Gummy looks like a glossy jelly, and Holofoil has a proper iridescent sheen.' },
      { tag: 'Changed', text: 'The remaining Cube variants stay “upcoming” and will flip to collectible as each future New Sprite Day wave lands (the full Cube line is ~18). The top announcement and News entry now read as live.' },
      { tag: 'Fixed', text: 'Known issue noted: Gem Sprites were briefly obtainable early through the Sprite Hunt rift anomaly; Epic disabled those items and the anomaly, so Gem stays flagged unreleased here — nothing to do on your end.' },
    ],
    why:
      'Only the Sprites a source actually confirms live get marked collectible — we flip per-wave rather than pre-releasing the whole ~18 (the discipline the Holofoil launch taught us). Epic’s own thread was unreachable, so wave 1 is taken from press coverage; if any of the eight differ once fully confirmed, it’s a one-line correction.',
  },
  {
    date: 'July 22, 2026',
    title: 'New Sprite Day (Cube) prep + a couple of fixes',
    summary:
      'Got the app ready for Thursday’s New Sprite Day, confirmed the Cube Sprites’ details, and fixed the ⋯ More menu so it opens attached to its button.',
    changes: [
      { tag: 'Fixed', text: 'The ⋯ More menu now opens directly under its button. Yesterday’s fix over-corrected and the dropdown floated off to the far right, disconnected from the button — it’s now anchored to the button again.' },
      { tag: 'Changed', text: 'Tidied the top nav: the ❔ Guide button moved out of the primary navigation. It now lives in the ⋯ More menu and the footer, plus a small “New to Sprites?” card appears above “Next to chase” once you’re signed in — so the guide is a gentle nudge rather than a permanent tab.' },
      { tag: 'Changed', text: 'New Sprite Day (Cube) callout is accurate and confirmed: Thursday, Jul 23 at 9 AM ET, the Cube Sprite variant debuts — a Kevin-the-Cube style that grants Overdrive (a speed boost) in the Storm. It rolls out in weekly waves like Holofoil (first wave ~6–8, full ~18 over the coming New Sprite Days), NOT all at once — so we haven’t pre-marked them all as collectible. The heads-up now shows a day early, and the Cube power is filled in.' },
      { tag: 'Changed', text: 'Each Cube variant stays “upcoming” until its wave actually goes live — we’ll flip them to collectible as they land, exactly like Holofoil, rather than showing all ~18 the day only a handful exist.' },
      { tag: 'Added', text: 'News: the Jul 21 hotfix that buffs the Sprite Locator gizmo (now favors rare variants like Gold/Gummy/Galaxy over base, and Epic granted 3 free Locators to gizmo users). Re-confirmed the Spider-Man (~Jul 30, web-swinging) and Lucky Locator (~v41.30) leaks are still current.' },
    ],
    why:
      'The Cube rollout is the same wave pattern that tripped up the Holofoil launch, so the deliberate call is to keep the individual Cube variants un-collectible until each wave is confirmed live — accurate-but-incomplete beats showing 18 collectibles the day only ~6–8 exist. The event callouts carry the confirmed dates/power in the meantime.',
  },
  {
    date: 'July 21, 2026',
    title: 'New: Player Stats lookup — plus a leaner, more focused app',
    summary:
      'A new 📊 Stats tab looks up any player’s Battle Royale stats by Epic name. We also retired the Farming and Trade tabs, and fixed the ⋯ More menu that wasn’t opening.',
    changes: [
      { tag: 'Added', text: 'Player Stats tab — type an Epic display name (or a PlayStation/Xbox account) and see wins, win rate, K/D, kills, matches, top-10/25 finishes, hours played, and a solo/duo/squad breakdown. Their match history has to be public for stats to show.' },
      { tag: 'Security', text: 'Stats go through a small server-side proxy so the stats API key stays on the server and never ships to your browser — the same principle we hold for every key. The Item Shop and Cosmetics keep using the free, no-auth public endpoints directly.' },
      { tag: 'Fixed', text: 'The ⋯ More menu wasn’t opening — its dropdown was being clipped by the nav’s overflow. It now renders above the nav and shows every option again.' },
      { tag: 'Changed', text: 'Removed the 🗺️ Farming tab. The best chest hotspots move around every patch, so a static map wasn’t staying useful — a sprite’s “Where to find” hint still lives in its detail view.' },
      { tag: 'Changed', text: 'Removed the 🔁 Trade tab and the per-sprite ⇄/♥ trade markers. Cross-player trade matching wasn’t getting enough use to be worth the upkeep, and the tracker’s core job — knowing what you own and what’s left — stands on its own.' },
    ],
    why:
      'Two moves in one: add and subtract. Player stats is a high-traffic, Sprite-independent feature (the same future-proofing behind the Item Shop) and one competitors lean on heavily — done the safe way, with the key server-side. At the same time, Farming and Trade were the two weakest surfaces: farming data goes stale every patch, and trade never reached the critical mass that peer-to-peer matching needs to be useful. Cutting them keeps the app focused and faster to maintain rather than spread thin. (Your owned/mastered data is untouched — the underlying fields just sit dormant.)',
  },
  {
    date: 'July 20, 2026',
    title: 'Nav that adapts to your screen + a full tooltip pass',
    summary:
      'The top navigation now flexes to fit any width — fitting as many sections inline as your screen allows and tucking the rest into “⋯ More” — and just about every button in the app now explains itself on hover.',
    changes: [
      { tag: 'Changed', text: 'The section nav is now a “priority-plus” bar: it measures the available width and shows as many tabs inline as fit, moving the overflow into the ⋯ More menu. On a wide desktop everything sits inline; on a phone only a few tabs show and the rest live under More — no fixed breakpoints, it just adapts.' },
      { tag: 'Changed', text: 'Cosmetics (beta) is now a first-class tab rather than living permanently inside More. More is purely an overflow bucket now — it only holds what doesn’t fit, plus the utility links (Guide-style extras).' },
      { tag: 'Added', text: 'Hover tooltips across the app: every button and action now has a title/label that explains what it does — the nav tabs, toolbar controls, share/export, trade toggles, modal actions, and more.' },
    ],
    why:
      'The old nav could crowd or wrap on smaller screens, and promoting Cosmetics to a real tab (instead of burying it in More) matches the plan to lean the app toward the wider game. Measuring width instead of hard-coding breakpoints keeps it correct at every size and as we add more tabs. The tooltip sweep is an accessibility + discoverability win — icon-only buttons in particular were doing a lot of unlabelled work.',
  },
  {
    date: 'July 19, 2026',
    title: 'New: Item Shop tab (with filters) + a Cosmetics preview',
    summary:
      'A new 🛒 Item Shop tab shows today’s live Fortnite shop with filters, and a small Cosmetics preview experiments with a wider cosmetic wishlist — the first features that aren’t tied to Sprites.',
    changes: [
      { tag: 'Added', text: 'Item Shop tab — today’s rotating shop grouped by section, with item art, rarity, and V-Bucks prices (original price struck through when discounted). Filters like the competitor sites: search by name, filter by rarity or item type, and sort by price. Pulls live from the free public fortnite-api.com, with loading/refresh/error states.' },
      { tag: 'Changed', text: 'Named it clearly the “Item Shop” (Fortnite’s in-game store where cosmetics are sold for V-Bucks) with a note that it’s a read-only view — so nobody mistakes it for a store built into this app.' },
      { tag: 'Added', text: 'Cosmetics (beta) — a proof-of-concept under the ⋯ More menu that browses the newest Fortnite cosmetics with a local-only “♥ Want” wishlist, to try out the idea of tracking cosmetics alongside Sprites. Deliberately doesn’t touch your account yet; a full version would sync like your sprite collection.' },
      { tag: 'Changed', text: 'Added hover tooltips to more of the most-used buttons (the sprite card’s Have/Mastered toggles and modal close buttons).' },
    ],
    why:
      'Sprites aren’t confirmed to continue into Chapter 8 (late Nov), so leaning the app toward the wider game — the Item Shop and cosmetics are high-traffic and completely independent of Sprites — is deliberate future-proofing, and adds daily-return value now. The cosmetics piece is a POC on purpose: real cosmetic collections need account/profile work, so we prove the idea before committing. Sprite data stays our own curated set; these public APIs cover the rest of the game.',
  },
  {
    date: 'July 19, 2026',
    title: 'Toolbar tidy-up + Share button moved onto the stats card',
    summary:
      'A few layout fixes around the collection controls, and the Share & Export button now lives on the progress card where it belongs.',
    changes: [
      { tag: 'Changed', text: '“More filters” now sits right after the Sort dropdown, and the grid/list view toggle moved to the end of the bar.' },
      { tag: 'Changed', text: 'The “Share & export” button moved inside the Collection/Mastery stats card (top-right), instead of floating in its own row underneath.' },
      { tag: 'Changed', text: '“Clear filters” now sits right next to the “Showing X of Y” count instead of being pushed off to the far right.' },
      { tag: 'Fixed', text: 'Switching to the list view no longer lights up “Clear filters” — view and sort are layout preferences, not filters, so they no longer count as an active filter (and clearing filters keeps your chosen view/sort).' },
    ],
    why:
      'Small friction points: the view toggle sat between two filter controls, the share button was orphaned in its own row, and the list-view/“Clear filters” confusion made it look like a filter was applied when it wasn’t. Treating view/sort as preferences (not filters) fixes the last one cleanly.',
  },
  {
    date: 'July 19, 2026',
    title: 'Fix: app wouldn’t load for near-complete collections',
    summary:
      'If the only Sprites you were missing had no published drop rate (the collab Mythics — Air, Batman, Seven, Pollo, Vini Jr.), the app crashed to a blank screen on load. Fixed.',
    changes: [
      { tag: 'Fixed', text: 'The “Next to chase” panel ranked missing Sprites by drop rate and could end up reducing an empty list (when every missing Sprite lacked a rate) — throwing “Reduce of empty array with no initial value” and taking the whole page down. It now handles that case: it still shows your rarest missing Sprite, just without a drop-rate line, and skips the “easiest to grab” pick when there’s nothing to rank.' },
    ],
    why:
      'The crash only hit players whose remaining misses were all no-drop-rate collabs — i.e. people close to 100%, which includes most logged-in regulars — so a full collection was effectively locking people out. (The error boundary shipped alongside is what turned the blank screen into a readable error and made this quick to pin down.)',
  },
  {
    date: 'July 19, 2026',
    title: 'No more blank screen — crash recovery & load watchdog',
    summary:
      'If the app ever hits an error or a stale cached file, it now shows a recovery screen (with a “Clear cache & reload” button) instead of a blank page.',
    changes: [
      { tag: 'Added', text: 'An app-wide error boundary: any unexpected error now renders a recovery screen showing what went wrong, with Reload and “Clear cache & reload” buttons — your saved progress is untouched.' },
      { tag: 'Added', text: 'A boot watchdog: if the page hasn’t finished loading in ~8s (usually a stale cached build after an update), it reveals the same recovery panel instead of a blank screen, even before the app itself starts.' },
    ],
    why:
      'A single render error used to blank the whole page with no way out. Catching it — and covering the “never even loaded” case with a pre-app watchdog — means a bad state is always recoverable in one tap, and the on-screen error text makes real bugs far easier to pin down and report.',
  },
  {
    date: 'July 19, 2026',
    title: 'Next week’s events added — Mastery Monday, Cube New Sprite Day & Shiny Hours',
    summary:
      'Epic posted next week’s Sprite calendar, so the tracker now has it: three dated events that surface automatically on the day, and the Cube variant is upgraded from “leaked” to officially confirmed.',
    changes: [
      { tag: 'Added', text: 'Mastery Monday (Mon, Jul 20) — boosted spawns, 2× Sprite Dust, 2× Sprite XP & extra Portable Extractors.' },
      { tag: 'Added', text: 'New Sprite Day (Thu, Jul 23) — the Cube Sprite variant (Kevin the Cube–styled, 18 total) starts rolling out a handful at a time, like Holofoil did.' },
      { tag: 'Added', text: 'Shiny Hours (Sat, Jul 25) — boosted Gold/Gummy/Galaxy/Holofoil spawns.' },
      { tag: 'Changed', text: 'Cube is no longer labelled leaked/tentative — Epic’s official events calendar confirms it for the Jul 23 New Sprite Day. (It stays an upcoming form in the roster until it actually drops, since it rolls out in waves.)' },
    ],
    why:
      'Straight from Epic’s official “next week” post, so these are confirmed, not rumours. Each is date-gated to its day — the banner and News feed switch to the right event automatically, then fall back — so the tracker stays current with the in-game calendar without manual flipping.',
  },
  {
    date: 'July 17, 2026',
    title: 'Fix: blank/broken page after an update (service worker)',
    summary:
      'Some returning players could hit a blank or half-loaded page after we shipped updates. The offline cache was serving a stale page that pointed at files a newer build had already replaced.',
    changes: [
      { tag: 'Fixed', text: 'The service worker now fetches the page itself network-first (falling back to cache only when offline), so it always references the current app files. Previously it served the cached page first, which — after a few quick updates — could point at script files that no longer existed, breaking the load with an “Unexpected token ‘<’” error.' },
      { tag: 'Fixed', text: 'It also refuses to cache or return an HTML fallback in place of a missing script/style, and the cache version was bumped so any bad cached state is cleared automatically on the next visit.' },
    ],
    why:
      'Cache-first on the HTML document is fast but fragile across frequent deploys: the page and its hashed asset files can drift out of sync. Network-first for the document (and cache-first only for the immutable, content-hashed assets) keeps offline support while guaranteeing a good load after every update. If you’re still stuck, one hard refresh clears it.',
  },
  {
    date: 'July 17, 2026',
    title: 'Friendlier filters — key ones inline on desktop',
    summary:
      'On desktop the collection filters no longer all hide behind one button: a trimmer search sits next to the most-used filters, with the rest in a “More filters” menu. Small screens keep the single Filters menu.',
    changes: [
      { tag: 'Changed', text: 'Desktop toolbar: the search box is narrower, with Ownership, Rarity and Sort surfaced inline next to it. Grouping, the variant chips and the Hide-mastered/Show-unreleased toggles live in a “More filters” overflow menu.' },
      { tag: 'Changed', text: 'Small screens are unchanged in spirit — search + view toggle + a single Filters button that holds everything, since inline controls would crowd a narrow screen.' },
    ],
    why:
      'Collapsing every filter behind one button was great for decluttering, but on a wide screen it hid the one-tap filters people reach for most (owned/missing, rarity) behind an extra click. Surfacing a few key ones inline — while keeping the long tail (variant chips, grouping) in the menu — is the best of both, and the mobile menu still keeps the grid front-and-center where space is tight.',
  },
  {
    date: 'July 17, 2026',
    title: 'Holofoil accuracy fix + event callout brought up to date',
    summary:
      'Holofoil isn’t on the whole roster yet — it’s rolling out in waves — so the tracker now only marks the ones that are actually live. Also corrected the DC event banner, which was ending early and showing a stale launch-day line.',
    changes: [
      { tag: 'Fixed', text: 'Holofoil is only live for Water, Fire, Ghost, King & Striker (Jul 9) and Air, Seven & Batman (Jul 16). Earth, Duck, Dream, Demon, Punk, Zero Point, Fishy, Aura, Boss & Grim don’t have their Holofoil yet, so those are no longer shown as collectible (they were wrongly flagged live by a blanket date-gate). Released-variant count drops from 93 to the accurate 83.' },
      { tag: 'Fixed', text: 'The top event banner said “Boosted New Sprite Day spawns” (a Jul 16 launch-only thing). Reworded it, and scoped it to headline for launch week — the ongoing DC “Hot Bat Summer” event (which runs all season, to ~Aug 20) now lives in the News feed, pinned through the season.' },
      { tag: 'Fixed', text: 'The Jul 9 Holofoil news/announcement no longer claims “15 Sprites” — it now describes the wave rollout.' },
    ],
    why:
      'A tracker lives or dies on “does what it says match the game,” and marking Duck/Dream Holofoil (and eight others) as collectible when they aren’t is exactly the kind of thing that erodes trust. Holofoil turned out NOT to be a one-date roster-wide drop, so it’s now set per-sprite; the date-gate mechanism stays for forms that really do land all at once.',
  },
  {
    date: 'July 17, 2026',
    title: 'Scannable link on the export image',
    summary:
      'The shareable collection image now carries a QR code and the site URL, so anyone who sees it can get straight to the app (and to your collection if you’re logged in).',
    changes: [
      { tag: 'Added', text: 'The export card footer now shows a QR code (“Scan to track yours”) plus the readable site URL alongside the Creator Code. The QR encodes your public share link when you’re logged in, or the app’s home when you’re a guest.' },
    ],
    why:
      'A collection image posted to Discord/Reddit is a great advert, but only if people can act on it — a scannable QR and a visible URL turn every shared image into a one-tap way back into the app.',
  },
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
