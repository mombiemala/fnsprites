// Curated "where to farm Sprites" reference. This replaced the old crowd-sourced
// community loot map — Sprite Chests are a KNOWN, fixed set of spawn points, so a
// small hand-kept hotspot list + links to the authoritative interactive maps is
// far more useful (and lower-maintenance) than asking players to hand-place
// markers. Chest counts per POI are stable within a season; recheck at each map
// change. Sources: GAMES.GG, Beebom, dotesports, AllThings.How (Ch7 S3).

export const CHEST_FACTS = [
  'Sprite Chests are ancient-looking chests with a **blue glow and a pink crystal** on top — easy to tell apart from normal chests.',
  'Each one drops a **guaranteed Sprite** plus a regular loot item.',
  'There are **dozens of potential Sprite Chest spawn points** island-wide, but only a **random subset is active each match** — so a spot may or may not have one on any given drop.',
  'Sprites are pure RNG from the Sprite you get — rarer Sprites (and the Grim Reaper) just come up less often. Location sets *how many chests*, not *which Sprite*.',
]

// Best POIs by how many Sprite Chest spawns they pack. Contested = popular drop.
export const HOTSPOTS = [
  { poi: 'Sinister Strip', chests: 4, note: 'Most chests in one spot — but everyone knows it, so expect a contested landing.' },
  { poi: 'Wonkeeland', chests: 3, note: 'Big POI, easy to loop the chests before rotating out.' },
  { poi: 'Calamari Canyon', chests: 3, note: 'Coastal — quieter than Sinister Strip most games.' },
  { poi: 'Heatwave Harbor', chests: 3, note: 'Central, good for pushing into a second POI after.' },
  { poi: 'Shaken Sanctuary', chests: 3, note: 'Off to the side — a calmer farm if the hot spots are packed.' },
]

export const FARMING_TIPS = [
  'Turn on **Visualized Sounds** — Sprite Chests have a distinct hum, and the setting draws it on-screen so you can spot one through a wall.',
  'Since only some spawns are live each match, **rotate between two nearby POIs** rather than expecting every chest to be there.',
  'Farm during **Mastery Mondays** and **Power Hours** for boosted spawns and 2× Sprite XP/Dust — see the News tab for the current schedule.',
  'New in v41.20: the **Bat Cave** under **Wonkeeland** (NE corner, drop in via the ascender) is a fresh spot to sweep — Wonkeeland is already one of the busier chest POIs.',
]

// The authoritative interactive maps — better than anything we could crowd-source.
export const MAP_LINKS = [
  { label: 'Sprite Chest map — Sprite Sanctuary', href: 'https://spritesanctuary.gg/sprite-chests.html', note: 'Every Sprite Chest spawn + an optimized collection route.' },
  { label: 'Full interactive map — Fortnite.GG', href: 'https://fortnite.gg/map', note: 'All chests, loot and POIs, updated each season.' },
]

export const FARMING_SOURCES = ['GAMES.GG', 'Beebom', 'dotesports', 'AllThings.How']
