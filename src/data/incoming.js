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
    detail: 'Leakers HYPEX & ShiinaBR peg Chapter 8 for ~Dec 5, 2026 — a new chapter means a whole new generation of Sprites to collect (plus reported collabs like Cyberpunk: Edgerunners). Your Override & Runners Sprites stay in your Collection and Sprite Garden. Date is from leaks, not an Epic post, so treat it as an estimate — we’ll add the new roster the moment it’s datamined/official.',
    dropsOn: '2026-12-05',
    confirmedDate: false,
    source: 'HYPEX · ShiinaBR (leak)',
    sourceUrl: 'https://accountshark.net/blog/fortnite-update-schedule-2026-fortnitemares-chapter-8',
    typeIds: [],
    spriteIds: [],
  },
  {
    id: 'new-sprite-day-birthday-2026-09-26',
    emoji: '🎂',
    title: 'New Sprite Day — Birthday Sprite',
    detail: 'The last piece of the v42.20 wave: the Birthday Sprite (Rare, for Fortnite’s 9th Birthday) is reported for Sat Sep 26 in all five finishes. The Bounty Hunter finish and the Morgana Sprite already went live Sep 24. Date is from Vice/dataminers, not an official Epic post — we’ll flip Birthday live the moment it’s obtainable.',
    dropsOn: '2026-09-26',
    confirmedDate: false,
    source: 'Vice (v42.20 rollout)',
    sourceUrl: 'https://www.vice.com/en/article/all-new-fortnite-sprites-available-after-september-24-update-complete-list/',
    typeIds: ['birthday'],
    spriteIds: ['birthday_bountyhunter'],
  },
  {
    id: 'fortnitemares-2026',
    emoji: '🎃',
    title: 'Fortnitemares 2026 — “The Game Is Cursed”',
    detail: 'CONFIRMED by Epic (teaser): the Halloween event lands Thu Oct 1 with update v42.30 and runs through Oct 31, under the slogan “The Game Is Cursed.” Reported collabs: Five Nights at Freddy’s, Black Clover and Chucky. Leaked skins: Bunnybone, Osric the Uninvited, and Gold Punk (redeemable via Fortnite gift cards Oct 2–31). Also expected: the return of Horde Rush, a new haunted Reload map, Halloween map changes (Battlewoods → a spooky POI, purple water, a new Dash Medallion) and spooky items (Ghostface’s knife, Witch Broom, Chainsaw, Slap Candy Corn + more). Likely home for the datamined Vampire Sprite. The Oct 1 date is Epic-confirmed; specific skins/collabs/map changes are still leaks until they go live — we’ll flip any new Sprites live as they’re confirmed.',
    dropsOn: '2026-10-01',
    confirmedDate: true,
    source: 'Epic (teaser) · Vice · Beebom',
    sourceUrl: 'https://www.vice.com/en/article/fortnitemares-2026-release-date-confirmed/',
    typeIds: ['vampire'],
    spriteIds: [],
  },
  {
    id: 'loot-hack-refresh',
    emoji: '🎯',
    title: 'Next Loot Hack rotation',
    detail: 'A fresh set of Loot Hack weapons to buy with Sprite Dust rotates into the pool. The v42.20 rotation (Rocket Ram, Reaper Sniper, Mammoth & Hyperburst Pistols, Deadeye DMR, Flowberry Fizz) went live Sep 17 — next refresh expected ~Sep 24.',
    dropsOn: '2026-09-24',
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
