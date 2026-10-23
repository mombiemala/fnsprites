// "You heard it here first" — confirmed-and-dated things that are COMING but not
// live yet. This is the early heads-up feed: it powers the Heads Up spotlight and
// a "Coming <date>" badge on any Sprite it names in the checklist.
//
// Rules (keep the feed trustworthy):
//  - Only add items that are CONFIRMED with a source + a date. Pure rumors stay
//    in News/roster as "Rumored" — they do NOT belong here.
//  - `confirmedDate:false` marks a solid item whose *exact date* is still an
//    estimate (shown as "~"). The item itself is still confirmed-coming.
//  - `typeIds` / `spriteIds` (optional) tie an item to Sprites in the roster so
//    they get a "Coming <date>" badge. Only UNRELEASED Sprites show the badge —
//    once a Sprite is released the badge naturally stops (and the item should be
//    removed here and the Sprite flipped released).
//
// The daily rotation watch and the Season 5 leak-watch keep this current.

export const INCOMING = [
  {
    id: 'season-5',
    emoji: '🏴‍☠️',
    title: 'Season flip — bridge mini-season (One Piece?)',
    detail: 'Season 4 “Override” wraps up around Nov 1 (the Battle Pass end date), when update v43.00 kicks off the next cycle — per Epic’s dev forums (v42.50, ~Oct 29, is the final Season 4 patch). Leakers widely report a short bridge mini-season next — rumored to be a One Piece crossover (datamined from a Rocket League update), a ~4–5 week cycle with its own Battle Pass, before Chapter 8. Not Epic-confirmed. New seasons bring a fresh generation of Sprites to Battle Royale — we’ll flip them live here the moment they drop.',
    dropsOn: '2026-11-01',
    confirmedDate: false,
    source: 'Epic (Battle Pass end date) · One Piece mini-season leak (SamLeakss / games.gg / Insider Gaming)',
    sourceUrl: 'https://games.gg/news/one-piece-fortnite-crossover-leaked/',
    typeIds: [],
    spriteIds: [],
  },
  {
    id: 'chapter-8',
    emoji: '🚀',
    title: 'Chapter 8 — a brand-new Sprite generation',
    detail: 'Chapter 8 (v44.00) is now pegged for ~Nov 28, 2026 — per Epic’s public Trello roadmap (reported by Vice & esports.gg), a firmer date than the earlier ~Dec 5 leak, though roadmap dates can still shift. A new chapter means a whole new generation of Sprites to collect (plus reported collabs like Cyberpunk: Edgerunners). Your Override & Runners Sprites stay in your Collection and Sprite Garden. We’ll add the new roster the moment it’s leaked/official.',
    dropsOn: '2026-11-28',
    confirmedDate: false,
    source: 'Epic Trello roadmap (v44.00) · Vice · esports.gg',
    sourceUrl: 'https://www.vice.com/en/article/fortnite-update-schedule-2026-fortnitemares-chapter-8-dates/',
    typeIds: [],
    spriteIds: [],
  },
  {
    id: 'loot-hack-refresh',
    emoji: '🎯',
    title: 'Next Loot Hack rotation',
    detail: 'A fresh set of Loot Hack weapons to buy with Sprite Dust rotates into the pool. The v42.40 rotation (Thorne’s Vampiric Blade, Finger Guns, Gatekeeper Shotgun, Hunting Rifle, Slap Splash) is current — the next weekly refresh is expected around Oct 22 (the in-game timer is authoritative).',
    dropsOn: '2026-10-22',
    confirmedDate: false,
    source: 'in-game Loot Hack timer',
    sourceUrl: '/loot-hacks',
    typeIds: [],
    spriteIds: [],
  },
]

// Whole days until a date (can go negative once past). Rotations/flips land in
// the morning ET, so anchor at ~13:00 UTC.
export function daysUntil(dateStr, now = new Date()) {
  return Math.ceil((new Date(dateStr + 'T13:00:00Z') - now) / 86400000)
}

// Active = confirmed-upcoming and not more than a day past its date, soonest first.
export function activeIncoming(now = new Date()) {
  return INCOMING.filter((e) => daysUntil(e.dropsOn, now) >= -1).sort((a, b) => daysUntil(a.dropsOn, now) - daysUntil(b.dropsOn, now))
}

// The incoming entry that names a given (unreleased) Sprite, for the Coming badge.
export function incomingForSprite(sprite) {
  if (!sprite?.unreleased) return null
  return (
    INCOMING.find((e) => e.spriteIds?.includes(sprite.id) || e.typeIds?.includes(sprite.typeId)) || null
  )
}
