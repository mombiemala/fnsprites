// Client-side helper for the player-stats lookup. It calls OUR serverless proxy
// (/api/stats), never fortnite-api.com directly — the API key lives only on the
// server (see api/stats.js). Keeping the key off the client is the whole point.

// Fetch BR stats for an Epic display name. Returns { data } on success or throws
// an Error whose message is safe to show the user.
export async function fetchPlayerStats(name, accountType = 'epic') {
  const params = new URLSearchParams({ name: name.trim(), accountType })
  let res
  try {
    res = await fetch(`/api/stats?${params.toString()}`)
  } catch {
    throw new Error('Network error — check your connection and try again.')
  }
  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.data) {
    throw new Error(body?.error || 'Could not load stats. Try again in a bit.')
  }
  return body.data
}

// Pull the handful of headline numbers we render, defensively — the upstream
// omits fields for players who've never played a given mode.
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)

export function summarizeStats(data) {
  const all = data?.stats?.all || {}
  const overall = all.overall || {}
  const modes = [
    { key: 'solo', label: 'Solo' },
    { key: 'duo', label: 'Duo' },
    { key: 'squad', label: 'Squad' },
  ]
    .map((m) => ({ ...m, s: all[m.key] }))
    .filter((m) => m.s && num(m.s.matches) > 0)
    .map((m) => ({
      label: m.label,
      matches: num(m.s.matches),
      wins: num(m.s.wins),
      winRate: num(m.s.winRate),
      kd: num(m.s.kd),
      kills: num(m.s.kills),
    }))

  return {
    account: data?.account || {},
    battlePassLevel: num(data?.battlePass?.level),
    overall: {
      matches: num(overall.matches),
      wins: num(overall.wins),
      winRate: num(overall.winRate),
      kd: num(overall.kd),
      kills: num(overall.kills),
      top10: num(overall.top10),
      top25: num(overall.top25),
      minutesPlayed: num(overall.minutesPlayed),
      playersOutlived: num(overall.playersOutlived),
    },
    modes,
  }
}
