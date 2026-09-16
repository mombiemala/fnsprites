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
    perk: 'v42.20 drops — the 42-Sprite wave begins + a fresh Loot Hack rotation',
    startsUtc: '2026-09-17T13:00:00Z', // ~9 AM ET, Thu Sep 17
    endsUtc: '2026-09-17T23:59:00Z',
    confirmed: false, // expected from the in-game Loot Hack timer + weekly cadence
    source: 'in-game Loot Hack timer · v42.20 datamine (Vice/FireMonkey)',
    sourceUrl: '/loot-hacks',
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
