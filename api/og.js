// Vercel EDGE function — renders a per-player "Trainer Card" as a 1200x630 PNG
// for social unfurls (Open Graph / Twitter). middleware.js points the og:image
// of a shared link (`/?u=<id>`) at `/api/og?u=<id>` so Discord/Twitter/etc. show
// this card instead of the generic banner.
//
// Always returns an image — on any lookup/render error it falls back to the
// generic branded card, so a bad id can never 500 a crawler.
import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

// Public (anon) Supabase creds — same publishable key the client uses; reads are
// gated by Row Level Security. Only public display data is read here.
const SUPABASE_URL = 'https://cjfproobzmqafdojzzsy.supabase.co'
const ANON = 'sb_publishable_LrNHfVEfZPCyMQtei5Jeug_9QcQft1E'

// satori accepts plain { type, props:{ style, children } } nodes — no JSX needed.
const el = (type, style, children) => ({ type, props: { style, children } })

async function getPlayer(u) {
  const headers = { apikey: ANON, Authorization: `Bearer ${ANON}` }
  const [pRes, sRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(u)}&select=gamertag,is_public`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/sprite_progress?user_id=eq.${encodeURIComponent(u)}&select=owned,mastered`, { headers }),
  ])
  const prof = (await pRes.json())?.[0]
  // Respect privacy: no card for a missing or private-and-anonymous profile.
  if (!prof || (!prof.is_public && !prof.gamertag)) return null
  const rows = (await sRes.json()) || []
  let owned = 0, mastered = 0
  for (const r of rows) { if (r.owned) owned++; if (r.mastered) mastered++ }
  return { gamertag: prof.gamertag || 'A collector', owned, mastered }
}

// A one-line flair pill, derived from counts (kept simple; no emoji — satori
// doesn't rasterize emoji without a remote provider).
function tagline(p) {
  if (!p) return 'Collect · Compare · Complete'
  if (p.mastered >= 25) return 'Shiny Hunter'
  if (p.owned >= 50) return 'Elite Collector'
  if (p.owned > 0) return 'Collector'
  return 'New collector'
}

export default async function handler(req) {
  let player = null
  try {
    const u = new URL(req.url).searchParams.get('u')
    if (u) player = await getPlayer(u)
  } catch {
    player = null
  }

  const title = player ? player.gamertag : 'FN Sprite Tracker'
  const sub = player
    ? `${player.owned} sprites collected · ${player.mastered} mastered`
    : 'Track every Fortnite sprite & variant'

  const card = el('div', {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: '64px', fontFamily: 'sans-serif',
    color: '#e8ecf8', background: 'linear-gradient(135deg,#0c0f1a 0%,#161a2e 55%,#1b2447 100%)',
  }, [
    el('div', { display: 'flex', fontSize: 36, fontWeight: 800, letterSpacing: '-0.5px' }, [
      el('span', { color: '#36c5ff' }, 'FN '),
      el('span', { color: '#9aa4bf' }, 'Sprite Tracker'),
    ]),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', fontSize: player ? 82 : 64, fontWeight: 800, color: '#ffffff', lineHeight: 1.05 }, title),
      el('div', { display: 'flex', fontSize: 40, marginTop: 14, color: '#cdd5ee' }, sub),
      el('div', {
        display: 'flex', alignSelf: 'flex-start', marginTop: 28, fontSize: 30, fontWeight: 800,
        color: '#0c0f1a', background: 'linear-gradient(90deg,#36c5ff,#7b61ff)', padding: '12px 30px', borderRadius: 999,
      }, tagline(player)),
    ]),
    el('div', { display: 'flex', fontSize: 28, color: '#9aa4bf' },
      player ? 'See the full collection → fnsprites.vercel.app' : 'Collect, compare & complete → fnsprites.vercel.app'),
  ])

  return new ImageResponse(card, {
    width: 1200, height: 630,
    headers: { 'cache-control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400' },
  })
}
