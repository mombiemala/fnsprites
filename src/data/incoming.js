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
    emoji: '🔮',
    title: 'Season flip — bridge mini-season',
    detail: 'Season 4 “Override” wraps up around Nov 1 (the Battle Pass end date). Per a widely-reported leaked 2026 schedule it’s followed by a short bridge mini-season before Chapter 8. New seasons bring a fresh generation of Sprites to Battle Royale — we’ll flip them live here the moment they drop.',
    dropsOn: '2026-11-01',
    confirmedDate: false,
    source: 'Epic (Battle Pass end date) · leaked 2026 schedule (Vice)',
    sourceUrl: 'https://www.vice.com/en/article/fortnite-update-schedule-2026-fortnitemares-chapter-8-dates/',
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
    id: 'fortnitemares-wave2',
    emoji: '🎃',
    title: 'Fortnitemares wave 2 — Honey & Obsession Sprites',
    detail: 'Fortnitemares 2026 is live (v42.30, Oct 1) with four Sprites already out — Vampire, Spooky Dash, The Deer and Dumpster Dive. Two more are expected mid-event, around Oct 15: the Honey Sprite (a Design-a-Sprite winner — spawns a swarm when you’re hit) and the Obsession Sprite. Dates/details aren’t fully confirmed yet; we’ll flip them live the day they drop.',
    dropsOn: '2026-10-15',
    confirmedDate: false,
    source: 'Vice · The Click',
    sourceUrl: 'https://www.vice.com/en/article/all-42-new-fortnite-sprites-october-1-update/',
    typeIds: [],
    spriteIds: ['honey'],
  },
  {
    id: 'loot-hack-refresh',
    emoji: '🎯',
    title: 'Next Loot Hack rotation',
    detail: 'A fresh set of Loot Hack weapons to buy with Sprite Dust rotates into the pool. The v42.30 Fortnitemares rotation (Infantry Rifle, LMG, Pumpkin Launcher, Last Call, Slap Candy Corn) landed Oct 1 — the next weekly refresh is expected around Oct 8 (the in-game timer is authoritative).',
    dropsOn: '2026-10-08',
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
