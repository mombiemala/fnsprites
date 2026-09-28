// Validate a loot-markers.json produced by the extractor (or the sample).
// Runs anywhere with Node — no game files needed. Proves the consumption side:
// the shape is what the map UI expects, every coordinate is on-image (0..1), and
// the markers actually land where you'd expect (ASCII density map).
//
//   node validate.mjs [path]     (defaults to sample-output.json)
//
// Exit code 0 = valid, 1 = invalid. Prints a warning (still exit 0) when a layer
// looks suspiciously empty — the "did a class name change?" early-warning.

import { readFileSync } from 'node:fs'

const path = process.argv[2] ?? 'sample-output.json'

// Expected-ish counts for a full BR island; a real run well under these usually
// means TargetClasses / MapContentRoots / the AES key need a look.
const SANITY_FLOOR = { chests: 200, ammos: 80, vehicles: 20 }

let doc
try {
  doc = JSON.parse(readFileSync(path, 'utf8'))
} catch (e) {
  fail(`could not read/parse ${path}: ${e.message}`)
}

const errors = []
const warnings = []

// --- shape ---
if (!doc.layers || typeof doc.layers !== 'object') errors.push('missing "layers" object')
if (!doc.counts || typeof doc.counts !== 'object') errors.push('missing "counts" object')
if (!doc.map?.worldBounds) warnings.push('missing map.worldBounds (needed to recalibrate coords per map)')

const layers = doc.layers ?? {}
let total = 0
for (const [name, arr] of Object.entries(layers)) {
  if (!Array.isArray(arr)) { errors.push(`layer "${name}" is not an array`); continue }
  total += arr.length

  // counts must match
  if (doc.counts?.[name] !== undefined && doc.counts[name] !== arr.length)
    errors.push(`counts.${name} (${doc.counts[name]}) != layers.${name}.length (${arr.length})`)

  // every marker on-image
  arr.forEach((m, i) => {
    if (typeof m.x !== 'number' || typeof m.y !== 'number')
      errors.push(`${name}[${i}] x/y not numbers`)
    else if (m.x < 0 || m.x > 1 || m.y < 0 || m.y > 1)
      errors.push(`${name}[${i}] off-image: (${m.x}, ${m.y}) — coord transform likely miscalibrated`)
  })

  // sanity floor (warning, not error — this is how a silent class-name rename shows up)
  const floor = SANITY_FLOOR[name]
  if (floor !== undefined && arr.length < floor)
    warnings.push(`layer "${name}" has ${arr.length} (< expected ~${floor}); check TargetClasses / AES key if this is a real run`)
}

if (total === 0) errors.push('zero markers total — nothing was extracted')

// --- report ---
console.log(`\nloot-markers: ${path}`)
console.log(`generated:    ${doc.generatedAt ?? '(none)'}`)
console.log(`layers:       ${Object.entries(layers).map(([k, v]) => `${k}=${v.length}`).join('  ') || '(none)'}\n`)

if (total > 0) printDensityMap(layers)

for (const w of warnings) console.log(`  ! warn:  ${w}`)
if (errors.length) {
  for (const e of errors) console.log(`  x error: ${e}`)
  console.log(`\nINVALID (${errors.length} error${errors.length === 1 ? '' : 's'})\n`)
  process.exit(1)
}
console.log(`\nVALID — ${total} markers, all on-image.${warnings.length ? ` (${warnings.length} warning)` : ''}\n`)
process.exit(0)

// --- helpers ---
function printDensityMap(layers) {
  const W = 48, H = 24
  const grid = Array.from({ length: H }, () => Array(W).fill(' '))
  // draw densest-last so sparse layers stay visible: vehicles < ammos < chests
  const order = ['vehicles', 'ammos', 'chests']
  const glyph = { chests: '#', ammos: '.', vehicles: 'V' }
  for (const name of order) {
    for (const m of layers[name] ?? []) {
      const gx = Math.min(W - 1, Math.floor(m.x * W))
      const gy = Math.min(H - 1, Math.floor(m.y * H))
      grid[gy][gx] = glyph[name] ?? '*'
    }
  }
  const bar = '+' + '-'.repeat(W) + '+'
  console.log('  ' + bar)
  for (const row of grid) console.log('  |' + row.join('') + '|')
  console.log('  ' + bar)
  console.log(`  legend: # chest   . ammo   V vehicle   (origin top-left)\n`)
}

function fail(msg) {
  console.error(`validate: ${msg}`)
  process.exit(1)
}
