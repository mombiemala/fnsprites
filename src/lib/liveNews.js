// Auto-pulled Fortnite news. Runs in the browser against the public
// fortnite-api.com endpoints; returns [] on any failure so the curated feed is
// always a safe base. Two automated signals:
//   1. The current live build → an auto "vXX.XX is live" update item.
//   2. Official in-game BR news tiles (MOTDs) → event/update items.
const API = 'https://fortnite-api.com'

export async function fetchLiveNews() {
  const out = []

  // 1) Current build/version — self-populates on every patch.
  try {
    const r = await fetch(`${API}/v1/aes`)
    if (r.ok) {
      const d = await r.json()
      const build = d?.data?.build || ''
      const m = build.match(/Release-(\d+\.\d+)/)
      if (m) {
        out.push({
          ts: `live-version-${m[1]}`,
          when: 'Live now',
          tag: 'update',
          title: `Fortnite is live on v${m[1]}`,
          body: `The game is currently running build v${m[1]} — see the official patch notes for the full breakdown.`,
          link: 'https://www.fortnite.com/news',
          _key: `v${m[1]}`,
        })
      }
    }
  } catch { /* offline / CORS — ignore */ }

  // 2) Official in-game BR news tiles.
  try {
    const r = await fetch(`${API}/v2/news/br?language=en`)
    if (r.ok) {
      const d = await r.json()
      const motds = d?.data?.motds || d?.data?.messages || []
      for (const m of motds.slice(0, 6)) {
        const title = m.title || m.tabTitle || 'In-game news'
        out.push({
          ts: `live-${m.id || title}`,
          when: 'In-game now',
          tag: /update|patch|hotfix|v\d+\.\d+/i.test(title) ? 'update' : 'event',
          title,
          body: m.body || '',
          image: m.image,
          link: 'https://www.fortnite.com/news',
          _key: title.toLowerCase().replace(/\s+/g, ' ').trim(),
        })
      }
    }
  } catch { /* offline / CORS — ignore */ }

  return out
}
