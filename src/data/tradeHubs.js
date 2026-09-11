// Sprite trading — the community "drop & extract" method (Fortnite has no
// official trade UI) plus the community "Sprite Swap" islands people meet on to
// do it safely. Sourced from Epic's own support + community trackers; island
// codes are community-run (verify in-game — creators can unpublish).

export const TRADE_STEPS = [
  'Both of you need a SPARE Sprite — Fortnite makes you have another Sprite available before you can drop the one you’re trading, so bring at least two.',
  'Drop into the same match or a Sprite-swap island together, and meet somewhere quiet and safe.',
  'Each player drops the agreed Sprite, then picks up the other person’s.',
  'Head to an Extraction Site, interact with the terminal, and run the extraction to completion — a Sprite only becomes permanent once it’s extracted.',
  'Both players extract. Once the timer finishes, the traded Sprite is bound to your account and usable in future matches.',
]

export const TRADE_SAFETY = [
  'Only an EXTRACTED Sprite is yours — don’t log off or leave before the extraction finishes.',
  'Epic can’t recover or investigate lost Sprites, so be wary of “drop yours first” pressure and any deal that feels off.',
  'Trade with people you can talk to (a prox-chat island helps) and check a trader’s reputation where you can.',
]

// Community Sprite-Swap islands — safe hubs (usually 16-player, with chat +
// collection viewing) to meet and run the drop-&-extract. NOT ours; codes are
// community-run and can change — always confirm in-game.
export const SPRITE_SWAP_ISLANDS = [
  { name: 'Sprite Swap Hub', code: '8359-5244-2189', creator: 'tiblack114', note: 'Voice/text chat + view everyone’s collection while you deal.', sourceUrl: 'https://fchq.io/map/8359-5244-2189/sprite-swap-hub' },
  { name: 'Trade Sprite — Swap the Sprites', code: '0398-8248-8803', creator: 'tonystudios', note: 'Chat to negotiate; find players with the Sprites you need.', sourceUrl: 'https://fortnite.gg/island/0398-8248-8803' },
  { name: 'The Sprite Trading Centre', code: '0565-8763-5227', creator: 'h7c', note: 'Proximity voice chat trading hub.', sourceUrl: 'https://fortnite.gg/island/0565-8763-5227' },
  { name: 'Sprite Swap', code: '4607-6018-0968', creator: 'teamtuk', note: 'Straightforward 16-player swap hub.', sourceUrl: 'https://fortnite.gg/island/4607-6018-0968' },
]

// How to enter a code in-game (reused in the guide + app).
export const ISLAND_HOWTO = 'In Fortnite, open Discover → the search/□ code button, enter the island code, and launch.'
