// Retro 80's pixel-art sprites, generated as crisp SVG pixel grids.
// Each sprite gets a procedurally-built rounded body (shaded), a dark pixel
// outline, pixel eyes, and a small per-type accent motif — plus a CRT scanline
// overlay for the arcade vibe. If a real image exists for the sprite, that
// PNG/WebP is used instead (the official/AI-art slot).

const GRID = 16

// [primary, light, shadow] per sprite type.
const COLORS = {
  water: ['#3aa0ff', '#9bd2ff', '#1d63c8'],
  earth: ['#7cbf57', '#bfe89a', '#4a7a32'],
  fire: ['#ff7a2f', '#ffd23f', '#d12f12'],
  duck: ['#ffd23f', '#fff0a8', '#e0962a'],
  ghost: ['#cfdcff', '#ffffff', '#9aa6e6'],
  dream: ['#b07bff', '#e0c4ff', '#6f3fd6'],
  demon: ['#ff5566', '#ff9aa6', '#b01030'],
  punk: ['#ff5db0', '#ffb0dc', '#a01d7a'],
  king: ['#ffcf4d', '#fff0b0', '#cf9a20'],
  zeropoint: ['#46d8ff', '#bff2ff', '#5b6bff'],
  peanut: ['#c98a4a', '#e8c08a', '#6f4521'],
  striker: ['#ffe14d', '#fff7b0', '#e0a81f'],
  fishy: ['#46d0e0', '#aef0f7', '#1f8fae'],
  aura: ['#6effc0', '#c4ffe6', '#2bb585'],
  boss: ['#c2c9da', '#eef1f7', '#6b7488'],
  grim: ['#444c66', '#6a7290', '#14182a'],
  wick: ['#3a4258', '#5a627a', '#12151f'],
  drifter: ['#e0bd8a', '#f5e0bd', '#a06b3c'],
  ice: ['#a6e8ff', '#e0f7ff', '#5fbfe0'],
  seven: ['#aab4ff', '#dfe4ff', '#6f7ad6'],
}

const OUTLINE = '#0b0e18'
const EYE_W = '#ffffff'
const EYE_K = '#0b0e18'

// Per-type accent pixels drawn on top: [x, y, color].
const Y = '#ffe14d', O = '#ff7a2f', G = '#ffcf4d', W = '#ffffff'
const ACCENTS = {
  fire: [[7, 0, Y], [8, 1, Y], [7, 1, O], [8, 2, O], [6, 2, O]],
  water: [[5, 5, W], [6, 5, W], [5, 6, W]],
  demon: [[2, 2, '#b01030'], [3, 3, '#ff5566'], [13, 2, '#b01030'], [12, 3, '#ff5566']],
  king: [[4, 2, G], [6, 1, G], [8, 1, G], [10, 1, G], [11, 2, G], [5, 3, G], [7, 3, G], [9, 3, G]],
  boss: [[5, 2, G], [7, 1, G], [9, 2, G], [6, 3, G], [8, 3, G]],
  punk: [[7, 0, '#ff2e88'], [8, 0, '#ff2e88'], [7, 1, '#ff2e88'], [8, 1, '#ff2e88'], [6, 2, '#ff2e88'], [9, 2, '#ff2e88']],
  aura: [[5, 1, '#6effc0'], [6, 1, '#6effc0'], [7, 0, '#6effc0'], [8, 0, '#6effc0'], [9, 1, '#6effc0'], [10, 1, '#6effc0']],
  grim: [[4, 2, OUTLINE], [5, 1, OUTLINE], [10, 1, OUTLINE], [11, 2, OUTLINE]],
  wick: [[4, 2, OUTLINE], [11, 2, OUTLINE], [6, 1, OUTLINE], [9, 1, OUTLINE]],
  duck: [[12, 8, O], [13, 8, O], [13, 9, O]],
  fishy: [[1, 8, '#1f8fae'], [0, 7, '#46d0e0'], [0, 9, '#46d0e0']],
  ice: [[7, 1, W], [8, 0, W], [6, 2, '#a6e8ff'], [9, 2, '#a6e8ff']],
  striker: [[8, 1, Y], [7, 3, Y], [9, 4, Y], [8, 5, O]],
  seven: [[6, 5, W], [7, 5, W], [8, 5, W], [8, 6, W], [7, 7, W], [7, 8, W]],
  zeropoint: [[3, 4, W], [12, 11, W], [12, 4, W]],
}

function buildPixels(typeId) {
  const [base, light, shadow] = COLORS[typeId] || ['#5b6bff', '#9aa6ff', '#2b3147']
  const cx = 7.5, cy = 9, rx = 5.7, ry = 5.9
  const body = {} // "x,y" -> color
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const dx = (x - cx) / rx
      const dy = (y - cy) / ry
      if (dx * dx + dy * dy <= 1) {
        let c = base
        if (y <= cy - 3) c = light
        else if (y >= cy + 3) c = shadow
        body[`${x},${y}`] = c
      }
    }
  }
  const pixels = []
  // outline: empty cells touching a body cell
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (body[`${x},${y}`]) continue
      if (body[`${x - 1},${y}`] || body[`${x + 1},${y}`] || body[`${x},${y - 1}`] || body[`${x},${y + 1}`]) {
        pixels.push([x, y, OUTLINE])
      }
    }
  }
  // body
  for (const k in body) {
    const [x, y] = k.split(',').map(Number)
    pixels.push([x, y, body[k]])
  }
  // accent
  for (const a of ACCENTS[typeId] || []) pixels.push(a)
  // eyes
  pixels.push([5, 8, EYE_W], [6, 8, EYE_W], [9, 8, EYE_W], [10, 8, EYE_W])
  pixels.push([6, 9, EYE_K], [10, 9, EYE_K])
  return pixels
}

export default function SpriteArt({ sprite, className = '' }) {
  if (sprite.image) {
    return <img src={sprite.image} alt={sprite.typeName} loading="lazy" className={`h-full w-full object-contain ${className}`} />
  }
  const pixels = buildPixels(sprite.typeId)
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-[86%] w-[86%] ${className}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={sprite.typeName}
      style={{ imageRendering: 'pixelated' }}
    >
      <defs>
        <pattern id="scan16" width="1" height="0.5" patternUnits="userSpaceOnUse">
          <rect width="1" height="0.25" fill="#000" opacity="0.18" />
        </pattern>
      </defs>
      {pixels.map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width="1.02" height="1.02" fill={c} />
      ))}
      {/* CRT scanlines */}
      <rect x="0" y="0" width="16" height="16" fill="url(#scan16)" />
    </svg>
  )
}
