// Illustrative "what a good post looks like" examples for the Trade board.
// These are NOT real trades and NOT real players — they render only when the
// live board is empty, under a clearly-labelled "Examples" heading, and carry an
// Example badge with no contact/vouch/delete actions. The moment a real post
// exists, the examples disappear. The point is to show newcomers the format (so
// an empty board doesn't read as a dead feature) without ever faking activity.
//
// sprite ids are `${typeId}_${themeId}` — keep them to released sprites so the
// chips resolve to a real name/colour.
export const EXAMPLE_TRADES = [
  {
    id: 'example-1',
    example: true,
    contact: 'Example post',
    wants: ['zeropoint_normal'],
    offers: ['king_gold', 'dream_holofoil'],
    methods: ['index'],
    note: 'Chasing the Zero Point! Happy to index a couple of Legendaries back in a bot lobby.',
  },
  {
    id: 'example-2',
    example: true,
    contact: 'Example post',
    wants: ['grim_normal', 'batman_normal'],
    offers: ['boss_gold', 'fire_galaxy'],
    methods: ['full', 'index'],
    note: 'Open to a full trade or a two-game index — timezone EU evenings.',
  },
  {
    id: 'example-3',
    example: true,
    contact: 'Example post',
    wants: ['water_gummy'],
    offers: ['earth_gold'],
    methods: ['index'],
    note: 'New to trading — happy to go slow, one item at a time.',
  },
]
