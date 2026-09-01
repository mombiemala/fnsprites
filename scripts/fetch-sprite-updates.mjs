// Auto-draft helper for Sprite / codes / events updates.
//
// Runs in CI (see .github/workflows/sprite-updates-agent.yml) on a schedule. It
// pulls a few PUBLIC, reliable sources, surfaces anything that looks like a new
// Sprite, Lobby Hack code, or Sprite event, and writes docs/sprite-updates-draft.md.
// The workflow then opens (or refreshes) a PR with that file so a human can review
// and fold anything real into src/data/{codes,sprites,news}.js.
//
// Deliberately a *research aid*, not a scraper that edits the live site: it curates
// candidates from official/aggregator sources, never auto-publishes, and its output
// is deterministic (no wall-clock timestamps) so the PR only changes when the
// underlying facts do. No API key, no auth — just public endpoints.

import { writeFile, mkdir } from 'node:fs/promises'

const OUT = 'docs/sprite-updates-draft.md'

// Lines worth surfacing to the curator — sprites, codes and events.
const KEYWORDS =
  /(sprite|cheat code|cheat master|cheatmaster|lobby hack|admin panel|power hour|new sprite day|cheat code day|update day|sprite dust|gizmo|gilded|golden|mastery monday|override)/i

const SOURCES = {
  apiAes: 'https://fortnite-api.com/v2/aes',
  apiNews: 'https://fortnite-api.com/v2/news/br?language=en',
  apiNewCosmetics: 'https://fortnite-api.com/v2/cosmetics/new',
  patchNotes: 'https://www.fortnite.com/news',
  epicCommunities: 'https://communities.epicgames.com',
  fortniteGG: 'https://fortnite.gg/lobby-hacks',
}

async function getJson(url, ms = 15000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'fnsprites-updates-bot' } })
    if (!res.ok) return { error: `HTTP ${res.status}` }
    return { data: await res.json() }
  } catch (e) {
    return { error: String(e?.message || e) }
  } finally {
    clearTimeout(t)
  }
}

async function getText(url, ms = 15000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'fnsprites-updates-bot' } })
    if (!res.ok) return { error: `HTTP ${res.status}` }
    return { data: await res.text() }
  } catch (e) {
    return { error: String(e?.message || e) }
  } finally {
    clearTimeout(t)
  }
}

// Crude HTML → text, then keep de-duplicated lines that match KEYWORDS.
function extractLines(html, cap = 25) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&amp;/g, '&').replace(/&#39;/g, '’').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
  const seen = new Set()
  const out = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (line.length < 12 || line.length > 240) continue
    if (!KEYWORDS.test(line)) continue
    const key = line.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(line)
    if (out.length >= cap) break
  }
  return out
}

function section(title, body) {
  return `## ${title}\n\n${body}\n`
}

async function main() {
  const parts = []

  // 1) Live build (very reliable JSON) — a fresh build number often means new content.
  const aes = await getJson(SOURCES.apiAes)
  const build = aes.data?.data?.build || aes.data?.data?.version
  parts.push(
    section(
      'Live build',
      build ? `- Fortnite is live on **${build}** _(fortnite-api.com)_` : `- ⚠️ Could not read build (${aes.error || 'no data'}).`,
    ),
  )

  // 2) New cosmetics — scan freshly-added items for anything Sprite-related.
  const cosmetics = await getJson(SOURCES.apiNewCosmetics)
  const items = cosmetics.data?.data?.items || cosmetics.data?.data?.br || []
  const cosmeticHits = (Array.isArray(items) ? items : [])
    .map((c) => `${c.name || ''}${c.type?.displayValue ? ` (${c.type.displayValue})` : ''}${c.description ? ` — ${c.description}` : ''}`.trim())
    .filter((s) => KEYWORDS.test(s))
    .slice(0, 15)
  parts.push(
    section(
      'Newly-added cosmetics mentioning Sprites',
      cosmetics.error
        ? `- ⚠️ Could not read new cosmetics (${cosmetics.error}).`
        : cosmeticHits.length
          ? cosmeticHits.map((s) => `- ${s}`).join('\n')
          : '- _(nothing Sprite-related in the latest cosmetics batch)_',
    ),
  )

  // 3) In-game news (MOTD) — often carries event / new-Sprite announcements.
  const news = await getJson(SOURCES.apiNews)
  const motds = news.data?.data?.motds || news.data?.data?.messages || []
  const newsHits = motds
    .map((m) => `${m.title || m.tabTitle || ''} — ${m.body || ''}`.trim())
    .filter((s) => KEYWORDS.test(s))
    .slice(0, 12)
  parts.push(
    section(
      'In-game news mentioning Sprites / codes / events',
      news.error
        ? `- ⚠️ Could not read in-game news (${news.error}).`
        : newsHits.length
          ? newsHits.map((s) => `- ${s}`).join('\n')
          : '- _(nothing matched right now)_',
    ),
  )

  // 4) Best-effort HTML text extraction from patch notes / aggregators. These are
  //    often JS-rendered, so a thin result means "open the page and check manually".
  for (const [label, url] of [
    ['Fortnite patch notes', SOURCES.patchNotes],
    ['fortnite.gg lobby hacks', SOURCES.fortniteGG],
  ]) {
    const page = await getText(url)
    const lines = page.data ? extractLines(page.data) : []
    parts.push(
      section(
        `${label} — candidate lines`,
        page.error
          ? `- ⚠️ Could not fetch ${label} (${page.error}). Check it manually: ${url}`
          : lines.length
            ? lines.map((s) => `- ${s}`).join('\n') + `\n\n_Extraction is crude — open the page to confirm:_ ${url}`
            : `- _(no lines extracted — likely JS-rendered; check manually)_ ${url}`,
      ),
    )
  }

  const header =
    `# Sprite / codes / events — updates draft\n\n` +
    `> Auto-generated by \`.github/workflows/sprite-updates-agent.yml\` from public\n` +
    `> sources (fortnite-api.com, fortnite.com/news, fortnite.gg). **Not a source of\n` +
    `> truth** — review each candidate, confirm it, then fold anything real into the\n` +
    `> data files. This scans machine-readable feeds; Epic's Instagram-only reveals\n` +
    `> still need a human. (The commit date is when this ran.)\n\n` +
    `## Curator checklist\n\n` +
    `- [ ] New Lobby Hack code? Add to \`src/data/codes.js\` (status 'working' only if\n` +
    `      Epic/an outlet confirms it, else 'rumored'; never guess a reward)\n` +
    `- [ ] New / released Sprite? Add or flip in \`src/data/sprites.js\`\n` +
    `      (unreleased = \`released:false, rumored:true\`; only flip live on a confirmed drop)\n` +
    `- [ ] New event / leak? Add to \`src/data/news.js\` (start/end window for live events;\n` +
    `      set official/tentative per the source)\n` +
    `- [ ] Update the changelog (\`src/data/changelog.js\` + \`CHANGELOG.md\`) for notable changes\n\n` +
    `## Sources\n\n` +
    Object.values(SOURCES).map((u) => `- ${u}`).join('\n') +
    `\n\n---\n\n`

  await mkdir('docs', { recursive: true })
  await writeFile(OUT, header + parts.join('\n'), 'utf8')
  console.log(`Wrote ${OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
