// Roster cross-check (advisory only — never edits data).
//
// Diffs our hand-curated roster (src/data/sprites.js) against Sprite-related file
// changes in the public Fortnite datamine repo, and writes docs/roster-diff.md
// listing datamined Sprite name tokens we don't recognise (candidates we might be
// missing). It's a RESEARCH AID, not a source of truth: datamined asset names don't
// map cleanly to our human taxonomy, so expect false positives — a human reviews
// the diff and folds anything real into src/data/sprites.js by hand.
//
// Deliberately NOT wired into `npm run build`: run it with `npm run verify-roster`
// (or in CI). It degrades gracefully — if the datamine source is unreachable (e.g.
// this sandbox's egress proxy, or a GitHub hiccup) it writes/says "skipped" and
// exits 0, so it can never break a build or deploy.

import { writeFile, mkdir } from 'node:fs/promises'
import { SPRITE_TYPES } from '../src/data/sprites.js'
import { THEME_ORDER } from '../src/data/themes.js'

const OUT = 'docs/roster-diff.md'
const DATAMINE_REPO = 'Fortnite-Datamining/Fortnite-Datamining'
const COMMITS_URL = `https://api.github.com/repos/${DATAMINE_REPO}/commits?per_page=15`
// Files in the datamine repo that look Sprite/finish-related.
const SPRITE_FILE_RE = /(creature|sprite|cheatmaster|hacker|loothacker|winner[a-z]?)/i
const GH_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''

// Known roster tokens to match datamined names against.
const KNOWN_TYPES = new Set(SPRITE_TYPES.map((t) => t.id.toLowerCase()))
const KNOWN_TYPE_NAMES = new Set(SPRITE_TYPES.map((t) => t.name.toLowerCase().replace(/[^a-z0-9]/g, '')))
const KNOWN_FINISHES = new Set(THEME_ORDER.map((id) => id.toLowerCase()))
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')

async function getJson(url, ms = 15000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  const headers = { 'user-agent': 'fnsprites-roster-check' }
  if (GH_TOKEN && url.startsWith('https://api.github.com/')) headers.authorization = `Bearer ${GH_TOKEN}`
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers })
    if (!res.ok) return { error: `HTTP ${res.status}` }
    return { data: await res.json() }
  } catch (e) {
    return { error: String(e?.message || e) }
  } finally {
    clearTimeout(t)
  }
}

// Pull a candidate {name, finish} from a datamined filename like
// ".../Creature_Sprite_Sonic_Cheatmaster.uasset" — heuristic, best-effort.
function parseSpriteFile(path) {
  const base = path.split('/').pop().replace(/\.[a-z0-9]+$/i, '')
  const m = base.match(/(?:creature|sprite)[_-]([a-z0-9]+)(?:[_-]([a-z0-9]+))?/i)
  if (!m) return null
  return { raw: base, name: norm(m[1]), finish: m[2] ? norm(m[2]) : null }
}

async function main() {
  const commits = await getJson(COMMITS_URL)
  if (commits.error || !Array.isArray(commits.data)) {
    const msg = `roster cross-check skipped — datamine source unreachable (${commits.error || 'unexpected response'}).`
    console.log(msg)
    await mkdir('docs', { recursive: true })
    await writeFile(OUT, `# Roster cross-check\n\n> ${msg}\n> (This is expected in no-egress environments; runs fine in CI / on a networked machine.)\n`, 'utf8')
    return
  }

  // Collect Sprite-related changed files across the newest few commits.
  const files = new Set()
  for (const c of commits.data.slice(0, 6)) {
    if (!c.sha) continue
    const detail = await getJson(`https://api.github.com/repos/${DATAMINE_REPO}/commits/${c.sha}`)
    for (const f of detail.data?.files || []) {
      if (f.filename && SPRITE_FILE_RE.test(f.filename)) files.add(f.filename)
    }
  }

  const unknown = new Map() // token -> sample raw filename
  const recognized = new Set()
  for (const path of files) {
    const p = parseSpriteFile(path)
    if (!p) continue
    const known = KNOWN_TYPES.has(p.name) || KNOWN_TYPE_NAMES.has(p.name)
    const finishKnown = !p.finish || KNOWN_FINISHES.has(p.finish)
    if (known && finishKnown) recognized.add(p.name + (p.finish ? `_${p.finish}` : ''))
    else unknown.set(p.name + (p.finish ? `_${p.finish}` : ''), p.raw)
  }

  const lines = []
  lines.push('# Roster cross-check (advisory)')
  lines.push('')
  lines.push(`> Heuristic diff of Sprite-related file changes in \`${DATAMINE_REPO}\` (newest commits) against`)
  lines.push('> `src/data/sprites.js`. **Candidates for a human, not auto-edits** — datamined names are fuzzy, so')
  lines.push('> expect false positives (unreleased finishes we correctly withhold, renamed assets, non-Sprite creatures).')
  lines.push('')
  lines.push(`- Sprite-related files scanned: **${files.size}**`)
  lines.push(`- Recognised tokens (already in our roster): **${recognized.size}**`)
  lines.push(`- Unrecognised tokens (review these): **${unknown.size}**`)
  lines.push('')
  if (unknown.size) {
    lines.push('## ⚠️ Unrecognised Sprite tokens — check these against the roster')
    lines.push('')
    for (const [tok, raw] of unknown) lines.push(`- \`${tok}\` — from \`${raw}\``)
    lines.push('')
    lines.push('_If any is a real new Sprite/finish, add it to `src/data/sprites.js` (unreleased ⇒ `released:false, rumored:true`; flip live only on a confirmed drop). If it\'s a non-Sprite creature or an unreleased finish we\'re intentionally withholding, ignore it._')
  } else {
    lines.push('## ✅ No unrecognised Sprite tokens')
    lines.push('')
    lines.push('Every Sprite-related datamined file in the scanned commits maps to a Sprite/finish already in our roster.')
  }
  lines.push('')
  if (files.size) {
    lines.push('<details><summary>Raw Sprite-related files scanned</summary>\n')
    for (const f of files) lines.push(`- \`${f}\``)
    lines.push('\n</details>')
  }
  lines.push('')

  await mkdir('docs', { recursive: true })
  await writeFile(OUT, lines.join('\n'), 'utf8')
  console.log(`roster cross-check: ${files.size} files scanned, ${unknown.size} unrecognised → ${OUT}`)
}

main().catch((e) => {
  // Never fail a pipeline over an advisory.
  console.log('roster cross-check skipped —', String(e?.message || e))
  process.exit(0)
})
