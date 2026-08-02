// Auto-pulled Fortnite news. Calls OUR serverless proxy (/api/news), never
// fortnite-api.com directly — the API key lives only on the server (see
// api/news.js), and routing through our own origin avoids third-party CORS.
// Returns [] on any failure so the curated feed is always a safe base. Two
// automated signals come back from the proxy:
//   1. The current live build → an auto "vXX.XX is live" update item.
//   2. Official in-game BR news tiles (MOTDs) → event/update items.
export async function fetchLiveNews() {
  const out = []

  let data
  try {
    const r = await fetch('/api/news')
    if (!r.ok) return out
    const body = await r.json().catch(() => null)
    data = body?.data
  } catch {
    return out // offline / network — curated feed stands alone
  }
  if (!data) return out

  // 1) Current build/version — self-populates on every patch.
  const build = data.build
  if (build) {
    out.push({
      ts: `live-version-${build}`,
      when: 'Live now',
      tag: 'update',
      title: `Fortnite is live on v${build}`,
      body: `The game is currently running build v${build} — see the official patch notes for the full breakdown.`,
      link: 'https://www.fortnite.com/news',
      _key: `v${build}`,
    })
  }

  // 2) Official in-game BR news tiles.
  for (const m of (data.motds || []).slice(0, 6)) {
    const title = m.title || 'In-game news'
    if (!title) continue
    out.push({
      ts: `live-${m.id || title}`,
      when: 'In-game now',
      tag: /update|patch|hotfix|v\d+\.\d+/i.test(title) ? 'update' : 'event',
      title,
      body: m.body || '',
      image: m.image || undefined,
      link: 'https://www.fortnite.com/news',
      _key: title.toLowerCase().replace(/\s+/g, ' ').trim(),
    })
  }

  return out
}
