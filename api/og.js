// Vercel EDGE function — renders a per-player "Trainer Card" as a 1200x630 PNG
// for social unfurls (Open Graph / Twitter). middleware.js points the og:image
// of a shared link (`/?u=<id>`) at `/api/og?u=<id>` so Discord/Twitter/etc. show
// this card instead of the generic banner.
//
// Always returns an image — on any lookup/render error it falls back to the
// generic branded card, so a bad id can never 500 a crawler.
import { ImageResponse } from '@vercel/og'
import { SPRITE_TYPES, dustCost } from '../src/data/sprites.js'

export const config = { runtime: 'edge' }

// ---- per-sprite card helpers (mirrors scripts/prerender.mjs) ----
const RARITY_TINT = { Rare: '#3da9fc', Epic: '#a855f7', Legendary: '#f59e0b', Mythic: '#ef4444' }
const fmt = (n) => Math.round(n).toLocaleString('en-US')
const parseRate = (s) => {
  if (!s) return null
  const n = parseFloat(String(s).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n / 100 : null
}
const chestsFor = (p, conf) => Math.ceil(Math.log(1 - conf) / Math.log(1 - p))
const slug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

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

// A per-sprite social card: rarity pill, big sprite name, and its key stats
// (drop rate, Dust, chests-for-50%). Text-only by design — satori can't rasterize
// the emoji icon or fetch art reliably, and a crawler must never get a 500.
function spriteCard(type) {
  const tint = RARITY_TINT[type.rarity] || '#7f8ab0'
  const p = parseRate(type.dropRate)
  const dustN = dustCost(type.rarity, 'normal')
  const chips = []
  chips.push(type.dropRate ? [type.dropRate, 'Drop / chest'] : [type.released ? '—' : 'Leaked', type.released ? 'Drop rate' : 'Not yet released'])
  if (dustN != null) chips.push([fmt(dustN), 'Dust (Normal)'])
  if (p) chips.push([`~${fmt(chestsFor(p, 0.5))}`, 'Chests · 50%'])

  return el('div', {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: '64px', fontFamily: 'sans-serif',
    color: '#e8ecf8', background: 'linear-gradient(135deg,#0c0f1a 0%,#161a2e 55%,#1b2447 100%)',
  }, [
    el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, [
      el('div', { display: 'flex', fontSize: 34, fontWeight: 800, letterSpacing: '-0.5px' }, [
        el('span', { color: '#36c5ff' }, 'FN '),
        el('span', { color: '#9aa4bf' }, 'Sprite Tracker'),
      ]),
      el('div', { display: 'flex', fontSize: 28, fontWeight: 800, color: '#0c0f1a', background: tint, padding: '10px 28px', borderRadius: 999 }, type.rarity),
    ]),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', fontSize: 40, color: '#9aa4bf' }, `Fortnite Sprite${type.released ? '' : ' · leaked'}`),
      el('div', { display: 'flex', fontSize: 108, fontWeight: 800, color: '#ffffff', lineHeight: 1.02, marginTop: 4 }, type.name),
    ]),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', gap: '18px', marginBottom: 26 }, chips.map(([v, k]) =>
        el('div', {
          display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)', borderRadius: 18, padding: '16px 28px',
        }, [
          el('div', { display: 'flex', fontSize: 44, fontWeight: 800, color: '#ffffff' }, String(v)),
          el('div', { display: 'flex', fontSize: 22, color: '#9aa4bf', marginTop: 4 }, k),
        ]))),
      el('div', { display: 'flex', fontSize: 26, color: '#9aa4bf' }, `Drop rate, Dust & chest odds → fnsprites.vercel.app/sprite/${slug(type.name)}`),
    ]),
  ])
}

export default async function handler(req) {
  // Per-sprite card for the prerendered /sprite/<slug> pages. A missing/bad id
  // falls through to the player/generic card below — never a 500.
  try {
    const sprite = new URL(req.url).searchParams.get('sprite')
    if (sprite) {
      const type = SPRITE_TYPES.find((t) => t.id === sprite)
      if (type) {
        return new ImageResponse(spriteCard(type), {
          width: 1200, height: 630,
          headers: { 'cache-control': 'public, max-age=600, s-maxage=86400, stale-while-revalidate=604800' },
        })
      }
    }
  } catch {
    // fall through
  }

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
