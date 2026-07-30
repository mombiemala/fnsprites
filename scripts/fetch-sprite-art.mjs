// Sprite-art fetch helper.
//
// Sourcing sprite images is a manual step (Epic's art, used for identification —
// see the README). This script takes URLs you've gathered (Fortnite Wiki, your
// own Gemini exports, official art you've background-removed) and does the rote
// part: download → normalize to a square transparent PNG → drop in public/sprites/
// with the correct <typeId>_<theme>.png name so the app + prerender pick it up.
//
// Usage:
//   node scripts/fetch-sprite-art.mjs --list-missing      # what still needs art
//   node scripts/fetch-sprite-art.mjs                      # fetch scripts/sprite-art-manifest.json
//   node scripts/fetch-sprite-art.mjs ironmouse_normal=https://… peely_normal=https://…
//   node scripts/fetch-sprite-art.mjs --trim              # trim uniform borders first
//   node scripts/fetch-sprite-art.mjs --size 320          # output square px (default 512)
//   node scripts/fetch-sprite-art.mjs --dry-run
//
// It does NOT remove backgrounds or invent art — give it clean (ideally already
// transparent) source images. Rebuild after (`npm run build`) to publish.

import { readFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import sharp from 'sharp'
import { SPRITE_TYPES } from '../src/data/sprites.js'
import { THEME_MAP } from '../src/data/themes.js'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dir, '..')
const OUT = resolve(ROOT, 'public/sprites')
const MANIFEST = resolve(__dir, 'sprite-art-manifest.json')

// Route through the agent proxy when present (this sandbox); a no-op elsewhere.
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy
if (proxy) {
  try {
    const { ProxyAgent, setGlobalDispatcher } = await import('undici')
    setGlobalDispatcher(new ProxyAgent(proxy))
  } catch { /* undici unavailable — fall back to direct fetch */ }
}

// Every valid <typeId>_<theme> key, and which ones are RELEASED (so we can flag
// released variants that are still missing an image file).
const validKeys = new Set()
const releasedKeys = new Set()
for (const t of SPRITE_TYPES) {
  for (const [theme, variantReleased] of Object.entries(t.variants)) {
    if (!THEME_MAP[theme]) continue
    const key = `${t.id}_${theme}`
    validKeys.add(key)
    if (t.released && variantReleased) releasedKeys.add(key)
  }
}

// ---- args ----
const args = process.argv.slice(2)
const flags = { trim: false, dryRun: false, size: 512, listMissing: false }
const inline = {}
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--trim') flags.trim = true
  else if (a === '--dry-run') flags.dryRun = true
  else if (a === '--list-missing') flags.listMissing = true
  else if (a === '--size') flags.size = parseInt(args[++i], 10) || 512
  else if (a.includes('=')) { const [k, ...v] = a.split('='); inline[k.trim()] = v.join('=').trim() }
  else console.warn(`(ignoring unknown arg: ${a})`)
}

mkdirSync(OUT, { recursive: true })
const onDisk = new Set(readdirSync(OUT).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)))

// ---- --list-missing: released variants with no PNG yet ----
if (flags.listMissing) {
  const missing = [...releasedKeys].filter((k) => !onDisk.has(k)).sort()
  if (!missing.length) { console.log('✓ Every released variant has an image. Nothing missing.'); process.exit(0) }
  console.log(`${missing.length} released variant(s) missing art (will use the glyph fallback until added):\n`)
  for (const k of missing) console.log('  ' + k)
  console.log('\nBuild a manifest with:')
  console.log('  ' + JSON.stringify(Object.fromEntries(missing.map((k) => [k, '']))))
  process.exit(0)
}

// ---- load manifest ----
let manifest = inline
if (!Object.keys(manifest).length) {
  if (existsSync(MANIFEST)) {
    try { manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) } catch (e) { console.error('Bad manifest JSON:', e.message); process.exit(1) }
  } else {
    console.log('No URLs given and no scripts/sprite-art-manifest.json. Try --list-missing.')
    process.exit(0)
  }
}
// Ignore comment/placeholder keys (start with // or _) and empty URLs.
const entries = Object.entries(manifest).filter(([k, v]) => v && !k.startsWith('//') && !k.startsWith('_'))
if (!entries.length) { console.log('Manifest has no URLs to fetch yet.'); process.exit(0) }

let ok = 0, fail = 0, warned = 0
for (const [key, url] of entries) {
  if (!validKeys.has(key)) { console.warn(`⚠  ${key}: not a known <typeId>_<theme> — saving anyway`); warned++ }
  if (flags.dryRun) { console.log(`(dry-run) ${key}.png <- ${url}`); continue }
  try {
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    let img = sharp(Buffer.from(await res.arrayBuffer()))
    if (flags.trim) img = img.trim()
    const png = await img
      .resize(flags.size, flags.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
    await writeFile(resolve(OUT, `${key}.png`), png)
    console.log(`✓ ${key}.png`)
    ok++
  } catch (e) {
    console.error(`✗ ${key}: ${e.message}`)
    fail++
  }
}
console.log(`\nDone: ${ok} saved, ${fail} failed${warned ? `, ${warned} unrecognized` : ''}.`)
if (ok && !flags.dryRun) console.log('Publish them with: npm run build && git push fnsprites sprite-tracker:main')
