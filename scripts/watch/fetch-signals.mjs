// FN watch — change-detection digest.
//
// Fetches a few machine-readable signals, diffs them against watch/last-seen.json
// and our own data, folds in the roster parity audit, and writes watch/digest.md.
//
// FLAG-ONLY: this never edits src/data/*. It only writes watch/. The daily watch
// routine reads the digest first and still verifies every change by hand (our
// 2-source / in-game rule). Designed to run in GitHub Actions, where the open
// internet is reachable (vice.com, theclick.gg etc. that the Claude session's
// proxy blocks). Every fetch is best-effort — a dead source never crashes the run.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { LOOT_HACK_META } from '../../src/data/lootHacks.js'
import { LOBBY_CODES } from '../../src/data/codes.js'
import { runAudit, formatAudit } from '../audit-roster.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const WATCH = resolve(HERE, '../../watch')
const LAST_SEEN = resolve(WATCH, 'last-seen.json')
const DIGEST = resolve(WATCH, 'digest.md')

// Reliable-ish RSS feeds. Add/remove freely — a feed that 404s is just noted.
const RSS = [
  ['fortnitenews', 'https://fortnitenews.com/feed/'],
  ['The Click', 'https://www.theclick.gg/rss/'],
  ['Beebom · Fortnite', 'https://beebom.com/tag/fortnite/feed/'],
]
const KEYWORDS = /\b(sprite|new sprite day|power hour|mastery monday|loot hack|admin panel|lobby hack|cheat code|bounty hunter|trick[- ]?or[- ]?treat|quack|override|chapter 8|mini[- ]?season)\b/i

async function getJSON(url, ms = 12000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'fnsprites-watch/1.0' } })
    return r.ok ? await r.json() : null
  } catch { return null } finally { clearTimeout(t) }
}
async function getText(url, ms = 12000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'fnsprites-watch/1.0' } })
    return r.ok ? await r.text() : null
  } catch { return null } finally { clearTimeout(t) }
}

function parseRssItems(xml) {
  const items = []
  for (const b of xml.split(/<item[ >]/i).slice(1)) {
    const title = (b.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/is) || [])[1]
    const link = (b.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/is) || [])[1]
    if (title) items.push({ title: title.replace(/&amp;/g, '&').trim(), link: (link || '').trim() })
  }
  return items
}

async function main() {
  const lastSeen = (() => { try { return JSON.parse(readFileSync(LAST_SEEN, 'utf8')) } catch { return {} } })()
  const seen = new Set(lastSeen.seenLinks || [])
  const nextSeen = new Set()
  const now = new Date().toISOString()
  const signals = []

  // 1 — live build / patch version
  const aes = await getJSON('https://fortnite-api.com/v2/aes')
  const build = aes?.data?.build || aes?.data?.version || null
  let patch = null
  if (build) { const m = String(build).match(/(\d+\.\d+)/); patch = m ? m[1] : null }
  if (patch) {
    const ours = String(LOOT_HACK_META.patch || '').replace(/^v/i, '')
    if (patch !== ours) signals.push(`⚠️ **Live build v${patch}** ≠ our Loot Hacks patch **${LOOT_HACK_META.patch}** — a patch likely landed. Check Loot Hacks rotation + New Sprite Day.`)
    if (lastSeen.patch && patch !== lastSeen.patch) signals.push(`⚠️ **Patch changed since last run: ${lastSeen.patch} → ${patch}** — expect a rotation / drop.`)
  } else {
    signals.push('ℹ️ Could not read the live build version from fortnite-api.com.')
  }

  // 2 — in-game BR news
  const news = await getJSON('https://fortnite-api.com/v2/news/br')
  for (const m of (news?.data?.motds || [])) {
    const text = `${m.title || ''} — ${m.body || ''}`
    if (!KEYWORDS.test(text)) continue
    const id = 'motd:' + String(m.id || m.title || text).slice(0, 80)
    nextSeen.add(id)
    if (!seen.has(id)) signals.push(`📰 BR news: *${(m.title || '').trim()}* — ${(m.body || '').trim().slice(0, 160)}`)
  }

  // 3 — outlet RSS
  for (const [name, url] of RSS) {
    const xml = await getText(url)
    if (!xml) { signals.push(`ℹ️ Couldn't reach ${name} (${url}).`); continue }
    for (const it of parseRssItems(xml).slice(0, 15)) {
      if (!KEYWORDS.test(it.title)) continue
      const key = it.link || it.title
      nextSeen.add(key)
      if (!seen.has(key)) signals.push(`🔗 ${name}: [${it.title}](${it.link})`)
    }
  }

  // 4 — roster parity / consistency
  let audit = ''
  try { audit = formatAudit(runAudit()) } catch (e) { audit = `audit failed: ${e.message}` }

  // digest
  const codeCount = LOBBY_CODES.filter((c) => c.code).length
  const changeLines = signals.length ? signals.map((s) => `- ${s}`) : ['✅ No new change signals since last run.']
  const md = [
    '# FN watch digest',
    '',
    `_Generated ${now}. **Flag-only** — candidates to review, not confirmed changes. Verify every one against our 2-source / in-game rule before editing data._`,
    '',
    `**Live build:** ${patch ? 'v' + patch : 'unknown'} · **our Loot Hacks patch:** ${LOOT_HACK_META.patch} · **tracked codes:** ${codeCount}`,
    '',
    '## Change signals',
    ...changeLines,
    '',
    '## Roster parity / consistency',
    '```',
    audit,
    '```',
    '',
  ].join('\n')
  writeFileSync(DIGEST, md)

  writeFileSync(LAST_SEEN, JSON.stringify({
    patch: patch || lastSeen.patch || null,
    updated: now,
    seenLinks: [...nextSeen].slice(0, 400),
  }, null, 2) + '\n')

  console.log(`wrote digest: ${signals.length} signal line(s), build=${patch || 'unknown'}`)
}

main()
