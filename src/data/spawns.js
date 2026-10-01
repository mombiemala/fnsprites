// Where to farm specific Sprites — curated from community farming guides (Beebom,
// GameRant) for the Fortnitemares (v42.30) chest-droppable Sprites. Most Override
// Sprites are NOT tied to a POI (you get them from Cheat Codes / Sprite Chests
// anywhere), so this map only carries entries for Sprites with genuinely useful,
// sourced location intel — the page only shows a "Where to find it" block when an
// entry exists here, so we never invent a location.
//
// Shape per id: { chests, pois: [], extra }
//   chests  how it drops (e.g. "Pumpkin Chests & Cheat Codes")
//   pois    reported hotspot POIs (most-to-least reported)
//   extra   any special method (bosses, landmarks, rarity note)

export const SPRITE_SPAWNS = {
  vampire: {
    chests: 'Pumpkin Chests & Cheat Codes',
    pois: ['Golden Grove', 'Chopped Shop', 'Sunken Shores'],
    extra: 'Also drops from defeating the Five Nights at Freddy’s animatronics (Freddy, Bonnie, Chica, Foxy) at Freddy Fazbear’s Pizzeria.',
  },
  phasedash: { // Spooky Dash
    chests: 'Pumpkin Chests & Cheat Codes',
    pois: ['Nightmare Neighborhood', 'Wonkeeland', 'Cluster Coast'],
    extra: 'It’s a Mythic, so it’s rare — the Nightmare Neighborhood is the most-reported hotspot.',
  },
  dumpster: { // Dumpster Dive
    chests: 'Sprite Chests & Cheat Codes',
    pois: ['Wonkeeland', 'Heatwave Harbor'],
    extra: 'Check spots with dumpsters around these POIs.',
  },
  deer: { // The Deer
    chests: 'Pumpkin Chests & Cheat Codes',
    pois: [],
    extra: 'Found in Pumpkin Chests island-wide; as a Legendary, Epic-tier Cheat Codes give the best odds.',
  },
}

// A general farming tip that applies to all the Fortnitemares Sprites above.
export const SPAWN_GENERAL = 'The richest Pumpkin / rare chests are underground in the Vaults at Stone Sanctum and the Mega Maze landmark — clear those first.'
export const SPAWN_SOURCE = 'community farming guides (Beebom, GameRant)'

export const spawnFor = (id) => SPRITE_SPAWNS[id] || null
