// Vercel serverless function — a thin, server-side proxy for Fortnite player
// stats via fortnite-api.com.
//
// WHY THIS EXISTS: the stats endpoint requires an API key. That key must NEVER
// ship in the client bundle (it would be public and abusable), so the browser
// calls THIS function, and the function adds the key from a server-only env var
// (FORTNITE_API_KEY) before forwarding to fortnite-api.com. The key is set in
// the Vercel project's Environment Variables — not in the repo.
//
// Client contract:  GET /api/stats?name=<epic name>&accountType=<epic|psn|xbl>
// Returns the upstream JSON `data` on success, or { error } with a helpful
// message on failure.

const UPSTREAM = 'https://fortnite-api.com/v2/stats/br/v2'
const VALID_ACCOUNT_TYPES = new Set(['epic', 'psn', 'xbl'])

export default async function handler(req, res) {
  // Cache identical lookups at the edge for a few minutes — stats don't change
  // mid-match, and it protects our upstream rate limit from refresh-spammers.
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const key = process.env.FORTNITE_API_KEY
  if (!key) {
    // Misconfiguration, not the user's fault — say so clearly so it's obvious in
    // prod that the env var is missing.
    res.status(503).json({ error: 'Stats are temporarily unavailable (server not configured).' })
    return
  }

  const { name, accountType = 'epic' } = req.query || {}
  const displayName = typeof name === 'string' ? name.trim() : ''
  if (!displayName) {
    res.status(400).json({ error: 'Enter an Epic display name to look up.' })
    return
  }
  const type = VALID_ACCOUNT_TYPES.has(accountType) ? accountType : 'epic'

  const url = `${UPSTREAM}?name=${encodeURIComponent(displayName)}&accountType=${type}&image=none`

  try {
    const upstream = await fetch(url, { headers: { Authorization: key } })
    const body = await upstream.json().catch(() => null)

    if (upstream.ok && body?.data) {
      res.status(200).json({ data: body.data })
      return
    }

    // Map the common upstream failures to friendly messages.
    const status = upstream.status
    if (status === 404) {
      res.status(404).json({ error: `No account found for “${displayName}”. Check the spelling and platform.` })
    } else if (status === 403) {
      res.status(403).json({ error: `“${displayName}” has their match history set to private, so stats can’t be shown.` })
    } else if (status === 401) {
      res.status(502).json({ error: 'Stats source rejected our request (key issue). This is on us — try again later.' })
    } else {
      res.status(502).json({ error: body?.error || 'Could not reach the stats source. Try again in a bit.' })
    }
  } catch {
    res.status(502).json({ error: 'Could not reach the stats source. Try again in a bit.' })
  }
}
