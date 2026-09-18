// Confirmed / sourced Sprite events, each with a real UTC time window. This is the
// SOURCE OF TRUTH for the top card's "live now" badge and next-event countdown —
// we only assert an event when it's actually dated + sourced, rather than assuming
// every Monday / Saturday automatically has one. Past events fall off on their own.
//
// Times are stored in UTC. Fortnite announces event times in ET; from mid-March to
// early November that's EDT (UTC-4), so 9 AM ET = 13:00Z, 2 PM ET = 18:00Z, and
// 9 PM ET = 01:00Z the next day. `confirmed: false` marks an EXPECTED instance
// (from the in-game timer / documented weekly cadence, exact date not individually
// sourced) — the card shows it as "expected", never a hard "LIVE".
//
// To add one: drop in an entry with a real window + source. When Epic confirms a
// specific Mastery Monday / Power Hours / New Sprite Day, add it here (confirmed:
// true) and it lights up the countdown automatically.
//
// `boostedThemes`: OPTIONAL array of finish theme-ids a Power Hours event boosts.
// When set, the top card shows a one-tap "Farm my N missing <finish> Sprites"
// shortcut (filters the grid to exactly those) while the event is live or within
// ~2 days. Map the event to its finish, e.g.:
//   Gold Hours        → ['gold']
//   Cheat Master Hours→ ['cheatmaster']
//   Loot Hacker Hours → ['loothacker']  (Epic calls these "Hacker" Sprites)
//   Gummy / Galaxy / Gem / Holofoil Hours → ['gummy'] / ['galaxy'] / ['gem'] / ['holofoil']
// A general Power Hours that boosts several finishes can list more than one.
// Leave it off for events that don't boost a specific finish (Mastery Monday, etc.).

export const SPRITE_EVENTS = [
  {
    id: 'mastery-monday-2026-09-14',
    emoji: '⭐',
    name: 'Mastery Monday',
    perk: '2× Sprite Dust & XP · boosted Legendary/Mythic spawns',
    startsUtc: '2026-09-14T13:00:00Z', // 9 AM ET Mon Sep 14
    endsUtc: '2026-09-15T13:00:00Z', // runs 24h, to 9 AM ET Tue
    confirmed: true,
    source: 'Vice',
    sourceUrl: 'https://www.vice.com/en/article/fortnite-admin-panel-code-mastery-monday-september-14/',
  },
  {
    id: 'new-sprite-day-2026-09-17',
    emoji: '🆕',
    name: 'New Sprite Day & v42.20 update',
    perk: 'LIVE — Crash Bandicoot, Blinky & Pond dropped + a fresh Loot Hack rotation',
    startsUtc: '2026-09-17T10:00:00Z', // ~6 AM ET launch, Thu Sep 17
    endsUtc: '2026-09-17T23:59:00Z',
    confirmed: true, // v42.20 shipped Sep 17 — 3 Sprites live
    source: 'Epic (v42.20) · Vice',
    sourceUrl: '/?view=news',
  },
  {
    id: 'power-hours-kh-2026-09-19-r1',
    emoji: '🗝️',
    name: 'Kingdom Hearts Power Hours (Round 1)',
    perk: 'Loot Hacker (“Hacker”) Sprites boosted · everyone starts with the Kingdom Key & Sea Salt Ice Cream · 1-Up Tokens & Portable Extractors from Chests',
    startsUtc: '2026-09-19T18:00:00Z', // 2 PM ET Sat Sep 19
    endsUtc: '2026-09-19T20:00:00Z', // 4 PM ET
    confirmed: true,
    boostedThemes: ['loothacker'], // "Hacker" Sprite variants spawn more often
    source: 'Epic (Fortnite)',
    sourceUrl: '/?view=news',
  },
  {
    id: 'power-hours-kh-2026-09-19-r2',
    emoji: '🗝️',
    name: 'Kingdom Hearts Power Hours (Round 2)',
    perk: 'Loot Hacker (“Hacker”) Sprites boosted · everyone starts with the Kingdom Key & Sea Salt Ice Cream · 1-Up Tokens & Portable Extractors from Chests',
    startsUtc: '2026-09-20T01:00:00Z', // 9 PM ET Sat Sep 19 (= 1 AM UTC Sun)
    endsUtc: '2026-09-20T03:00:00Z', // 11 PM ET
    confirmed: true,
    boostedThemes: ['loothacker'], // "Hacker" Sprite variants spawn more often
    source: 'Epic (Fortnite)',
    sourceUrl: '/?view=news',
  },
  {
    id: 'new-sprite-day-2026-09-24',
    emoji: '🕵️',
    name: 'New Sprite Day — Bounty Hunter finish + Morgana & Birthday',
    perk: 'the rest of the v42.20 wave is expected to drop',
    startsUtc: '2026-09-24T13:00:00Z', // ~9 AM ET, Thu Sep 24
    endsUtc: '2026-09-24T23:59:00Z',
    confirmed: false, // reported date (Vice/dataminers), not an official Epic post
    source: 'Vice (v42.20 rollout)',
    sourceUrl: '/?view=news',
  },
]

// The event whose window contains `now` (live right now), or null.
export function liveSpriteEvent(now = new Date()) {
  return SPRITE_EVENTS.find((e) => now >= new Date(e.startsUtc) && now < new Date(e.endsUtc)) || null
}

// The soonest event that hasn't started yet, or null when nothing is scheduled.
export function nextSpriteEvent(now = new Date()) {
  return (
    SPRITE_EVENTS
      .filter((e) => new Date(e.startsUtc) > now)
      .sort((a, b) => new Date(a.startsUtc) - new Date(b.startsUtc))[0] || null
  )
}
