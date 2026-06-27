// Current Fortnite map (loaded live from a public API at runtime) + overlay
// marker layers. Marker coords are percentages (0–100) over the square map
// image. These are COMMUNITY-SOURCED and approximate — POIs and especially
// sprite-chest/fishing-pond spots shift each update, so treat as a quick
// reference and use the full interactive map (fortnite.gg/map) for precision.
export const MAP_IMAGE = 'https://fortnite-api.com/images/map.png'
export const MAP_LINK = 'https://fortnite.gg/map'

export const LAYERS = [
  {
    id: 'pois',
    label: 'POIs',
    color: '#ffffff',
    markers: [
      { x: 34, y: 28, label: 'Cluster Coast' },
      { x: 52, y: 50, label: 'The Zero Point' },
      { x: 68, y: 64, label: 'Heatwave Harbor' },
    ],
  },
  {
    id: 'chests',
    label: 'Sprite Chests',
    color: '#36c5ff',
    note: 'Sprite Chests are the main source of rare sprites (incl. Grim Reaper).',
    markers: [
      { x: 50, y: 48, label: 'Zero Point — central spawns (approx)' },
      { x: 36, y: 30, label: 'Cluster Coast — coastal chests (approx)' },
    ],
  },
  {
    id: 'ponds',
    label: 'Gold Fishing Ponds',
    color: '#f6c945',
    note: 'Gold ponds have a higher chance of rare fishing rewards.',
    markers: [{ x: 66, y: 66, label: 'Heatwave Harbor — harbor pond (approx)' }],
  },
  {
    id: 'paths',
    label: 'Runner Paths',
    color: '#a855f7',
    note: 'Fast loops for sprite hunting between chest clusters.',
    markers: [],
  },
]
