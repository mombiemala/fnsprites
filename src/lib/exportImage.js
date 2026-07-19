import QRCode from 'qrcode'
import { SPRITE_TYPES, ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import { CREATOR_CODE } from './supabase'

// Whether a given `<type>_<variant>` is actually live — sourced from the built
// sprite list so it respects date-gated forms (e.g. Holofoil auto-releases via
// FORM_RELEASE without flipping the raw `variants` flag). Without this the export
// would draw a lock on every Holofoil cell even though it's collectible.
const RELEASED_BY_ID = Object.fromEntries(ALL_SPRITES.map((s) => [s.id, s.released]))

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// The main variant columns — Normal/Gold/Gummy/Galaxy plus Holofoil (live since
// Jul 9). Gem / Rift stay off the card until they release. Any sprite lacking a
// column (e.g. Peanut = Normal-only) renders that cell as a dashed N/A.
const COLS = [
  { id: 'normal', label: 'NORMAL', accent: '#aeb6cc' },
  { id: 'gold', label: 'GOLD', accent: '#f6c945' },
  { id: 'gummy', label: 'GUMMY', accent: '#ff5d8f' },
  { id: 'galaxy', label: 'GALAXY', accent: '#9a7bff' },
  { id: 'holofoil', label: 'HOLOFOIL', accent: '#7fe3ff' },
]

// Per-variant gradient background (same palette as the in-app cards) so the
// backdrop is identical for every sprite in a column.
function variantBg(ctx, theme, x, y, w, h, dim) {
  let g
  if (theme === 'gold') {
    g = ctx.createLinearGradient(x, y, x, y + h)
    g.addColorStop(0, '#ffe27a'); g.addColorStop(0.5, '#f6b73c'); g.addColorStop(1, '#b8801c')
  } else if (theme === 'gummy') {
    g = ctx.createRadialGradient(x + w * 0.38, y + h * 0.3, w * 0.08, x + w * 0.5, y + h * 0.55, w * 0.85)
    g.addColorStop(0, '#ffd1e0'); g.addColorStop(0.4, '#ff5d8f'); g.addColorStop(1, '#c81d5a')
  } else if (theme === 'galaxy') {
    g = ctx.createLinearGradient(x, y, x, y + h)
    g.addColorStop(0, '#3b1d77'); g.addColorStop(0.6, '#1b1140'); g.addColorStop(1, '#0a0820')
  } else if (theme === 'holofoil') {
    // Iridescent foil sweep — cyan → magenta → gold across the diagonal.
    g = ctx.createLinearGradient(x, y, x + w, y + h)
    g.addColorStop(0, '#8ef0ff'); g.addColorStop(0.4, '#c77dff'); g.addColorStop(0.7, '#ff8ac2'); g.addColorStop(1, '#ffd86b')
  } else {
    g = ctx.createLinearGradient(x, y, x, y + h)
    g.addColorStop(0, '#4b5470'); g.addColorStop(1, '#2b3147')
  }
  ctx.save()
  roundRect(ctx, x, y, w, h, 14)
  ctx.fillStyle = g
  ctx.globalAlpha = dim ? 0.28 : 1
  ctx.fill()
  ctx.restore()
}

// Background themes for the export card. Kept dark so the white text/stat layer
// stays legible; each is a two-stop vertical gradient.
export const CARD_THEMES = {
  midnight: { label: 'Midnight', bg: ['#141a30', '#0a0f1e'] },
  galaxy: { label: 'Galaxy', bg: ['#241546', '#0a0820'] },
  ember: { label: 'Ember', bg: ['#2a1710', '#120a08'] },
  slate: { label: 'Slate', bg: ['#222839', '#0c0f18'] },
  forest: { label: 'Forest', bg: ['#12291f', '#08120d'] },
}

function drawCheck(ctx, cx, cy, r) {
  ctx.save()
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = '#22c55e'; ctx.fill()
  ctx.strokeStyle = '#0a0f0a'; ctx.lineWidth = 1.5; ctx.stroke()
  ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - r * 0.42, cy + r * 0.02)
  ctx.lineTo(cx - r * 0.08, cy + r * 0.36)
  ctx.lineTo(cx + r * 0.46, cy - r * 0.34)
  ctx.stroke()
  ctx.restore()
}

function drawLock(ctx, cx, cy, s) {
  ctx.save()
  ctx.strokeStyle = '#aab4d4'; ctx.fillStyle = '#aab4d4'; ctx.lineWidth = s * 0.14; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.arc(cx, cy - s * 0.12, s * 0.26, Math.PI, 0); ctx.stroke()
  roundRect(ctx, cx - s * 0.4, cy - s * 0.02, s * 0.8, s * 0.56, s * 0.12); ctx.fill()
  ctx.restore()
}

// Sprite Locker–style matrix: rows = sprite types, columns = the four variants,
// every cell on a consistent per-variant gradient. `mode` = 'collection' (owned
// bright + ✓, missing dimmed) or 'missing' (the ones you still need highlighted).
export async function generateCollectionImage({ gamertag, tracking, mode = 'collection', theme = 'midnight', shareUrl }) {
  const missing = mode === 'missing'
  const url = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://fnsprites.vercel.app/')
  const rows = SPRITE_TYPES.filter((t) => t.released)

  // Build the grid + counts, and collect images to preload.
  let ownedTotal = 0
  let releasedTotal = 0
  const toLoad = []
  const grid = rows.map((t) =>
    COLS.map((c) => {
      const id = `${t.id}_${c.id}`
      const exists = c.id in t.variants
      const released = exists && RELEASED_BY_ID[id] === true
      const owned = released && !!tracking[id]?.owned
      if (released) { releasedTotal++; if (owned) ownedTotal++ }
      const image = released ? `${import.meta.env.BASE_URL}sprites/${id}.png` : null
      if (image) toLoad.push(image)
      return { exists, released, owned, image }
    })
  )
  const pct = releasedTotal ? Math.round((ownedTotal / releasedTotal) * 100) : 0

  // Layout
  const pad = 44
  const labelW = 176
  const cell = 122
  const gap = 12
  const rowH = cell + gap
  const gridX0 = pad + labelW
  const W = gridX0 + COLS.length * cell + (COLS.length - 1) * gap + pad
  const gridTop = 250
  const H = gridTop + rows.length * rowH + 150 // extra room for the QR + link footer

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'alphabetic'

  // Background (per chosen theme)
  const themeBg = (CARD_THEMES[theme] || CARD_THEMES.midnight).bg
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, themeBg[0]); bg.addColorStop(1, themeBg[1])
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Header
  ctx.fillStyle = '#7f8ab0'
  ctx.font = '700 18px Inter, sans-serif'
  ctx.fillText('FN SPRITE TRACKER', pad, 52)
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 46px Inter, sans-serif'
  ctx.fillText(missing ? 'SPRITES I NEED' : 'MY SPRITE LOCKER', pad, 100)
  ctx.fillStyle = '#95a0c4'
  ctx.font = '600 20px Inter, sans-serif'
  ctx.fillText(gamertag ? `${gamertag} · every sprite & variant` : 'Every Fortnite sprite & variant', pad, 130)

  // Progress
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 26px Inter, sans-serif'
  const stat = `${ownedTotal} / ${releasedTotal} · ${pct}%`
  ctx.fillText(stat, W - pad - ctx.measureText(stat).width, 100)
  const barY = 158
  const barW = W - pad * 2
  ctx.fillStyle = '#212a48'
  roundRect(ctx, pad, barY, barW, 14, 7); ctx.fill()
  const pg = ctx.createLinearGradient(pad, 0, pad + barW, 0)
  pg.addColorStop(0, '#36c5ff'); pg.addColorStop(1, '#9a7bff')
  ctx.fillStyle = pg
  roundRect(ctx, pad, barY, Math.max(8, (ownedTotal / Math.max(1, releasedTotal)) * barW), 14, 7); ctx.fill()

  // Column headers (variant pills)
  COLS.forEach((c, j) => {
    const x = gridX0 + j * (cell + gap)
    ctx.fillStyle = `${c.accent}22`
    roundRect(ctx, x, gridTop - 40, cell, 26, 8); ctx.fill()
    ctx.fillStyle = c.accent
    ctx.font = '800 15px Inter, sans-serif'
    const tw = ctx.measureText(c.label).width
    ctx.fillText(c.label, x + (cell - tw) / 2, gridTop - 22)
  })

  // Preload sprite images
  const loaded = {}
  await Promise.all([...new Set(toLoad)].map(async (src) => { loaded[src] = await loadImage(src) }))

  // Rows
  rows.forEach((t, i) => {
    const y = gridTop + i * rowH
    // Row label: rarity dot + type name + owned count
    const rowReleased = grid[i].filter((c) => c.released).length
    const rowOwned = grid[i].filter((c) => c.owned).length
    ctx.beginPath(); ctx.arc(pad + 7, y + cell / 2 - 6, 6, 0, Math.PI * 2)
    ctx.fillStyle = RARITY_COLORS[t.rarity] || '#888'; ctx.fill()
    ctx.fillStyle = '#eef1f8'
    ctx.font = '700 20px Inter, sans-serif'
    ctx.fillText(t.name, pad + 24, y + cell / 2 - 1)
    ctx.fillStyle = rowOwned === rowReleased ? '#34d399' : '#7f8ab0'
    ctx.font = '700 14px Inter, sans-serif'
    ctx.fillText(`${rowOwned}/${rowReleased}`, pad + 24, y + cell / 2 + 22)

    COLS.forEach((c, j) => {
      const x = gridX0 + j * (cell + gap)
      const g = grid[i][j]

      if (!g.exists) {
        // N/A — dashed empty cell
        ctx.save()
        ctx.strokeStyle = '#2a3352'; ctx.lineWidth = 2; ctx.setLineDash([6, 6])
        roundRect(ctx, x, y, cell, cell, 14); ctx.stroke()
        ctx.restore()
        return
      }

      const bright = missing ? (g.released && !g.owned) : g.owned
      variantBg(ctx, c.id, x, y, cell, cell, !bright)

      if (!g.released) {
        drawLock(ctx, x + cell / 2, y + cell / 2, cell * 0.34)
        return
      }

      const img = loaded[g.image]
      if (img) {
        ctx.save()
        roundRect(ctx, x, y, cell, cell, 14); ctx.clip()
        if (!bright) { ctx.filter = 'grayscale(1) brightness(0.7)'; ctx.globalAlpha = 0.5 }
        const s = cell - 20
        ctx.drawImage(img, x + 10, y + 10, s, s)
        ctx.restore()
      }

      if (g.owned) drawCheck(ctx, x + cell - 18, y + 18, missing ? 11 : 15)
      else if (missing) {
        // "still needed" marker
        ctx.beginPath(); ctx.arc(x + cell - 18, y + 18, 9, 0, Math.PI * 2)
        ctx.strokeStyle = '#ff5d8f'; ctx.lineWidth = 3; ctx.stroke()
      }
    })
  })

  // Footer — a scannable QR (encodes the share link) on the right, and the app
  // name + readable URL + creator code on the left, so anyone who sees the image
  // can get straight back to the app.
  let host = 'fnsprites.vercel.app'
  try { host = new URL(url).host } catch { /* keep default */ }

  let qrImg = null
  try {
    const qrData = await QRCode.toDataURL(url, { margin: 1, width: 240, color: { dark: '#0a0f1eff', light: '#ffffffff' } })
    qrImg = await loadImage(qrData)
  } catch { /* QR is a nicety — skip if it fails */ }

  if (qrImg) {
    const qs = 96
    const qx = W - pad - qs
    const qy = H - qs - 30
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, qx - 7, qy - 7, qs + 14, qs + 14, 12); ctx.fill()
    ctx.drawImage(qrImg, qx, qy, qs, qs)
    ctx.fillStyle = '#95a0c4'
    ctx.font = '700 14px Inter, sans-serif'
    const lbl = 'Scan to track yours'
    ctx.fillText(lbl, qx + qs - ctx.measureText(lbl).width, qy - 16)
  }

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 24px Inter, sans-serif'
  ctx.fillText('FN Sprite Tracker', pad, H - 78)
  ctx.fillStyle = '#36c5ff'
  ctx.font = '700 21px Inter, sans-serif'
  ctx.fillText(host, pad, H - 50)
  ctx.fillStyle = '#7f8ab0'
  ctx.font = '700 19px Inter, sans-serif'
  ctx.fillText(`Creator Code: ${CREATOR_CODE.toUpperCase()}`, pad, H - 24)

  return canvas.toDataURL('image/png')
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// A trade card: "For trade" column + "Looking for" column, with the gamertag
// and creator code. `haves`/`wants` are arrays of {label, accent}.
export function generateTradeImage({ gamertag, haves, wants }) {
  const W = 1000
  const pad = 50
  const colW = (W - pad * 3) / 2
  const rowH = 40
  const rows = Math.max(haves.length, wants.length, 1)
  const H = 200 + rows * rowH + 70

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0c0f1a')
  bg.addColorStop(1, '#161b2e')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = '#fff'
  ctx.font = '700 44px Inter, sans-serif'
  ctx.fillText(gamertag ? `${gamertag} — Trades` : 'Sprite Trades', pad, 78)

  const drawCol = (x, title, color, items) => {
    ctx.fillStyle = color
    ctx.font = '700 24px Inter, sans-serif'
    ctx.fillText(title, x, 138)
    ctx.font = '600 22px Inter, sans-serif'
    if (!items.length) {
      ctx.fillStyle = '#95a0c4'
      ctx.fillText('—', x, 138 + rowH)
    }
    items.forEach((it, i) => {
      const y = 138 + (i + 1) * rowH
      ctx.fillStyle = it.accent || '#888'
      roundRect(ctx, x, y - 18, 12, 12, 3)
      ctx.fill()
      ctx.fillStyle = '#eaf0ff'
      ctx.fillText(it.label, x + 22, y - 6)
    })
  }
  drawCol(pad, '⇄ FOR TRADE', '#34d399', haves)
  drawCol(pad * 2 + colW, '♥ LOOKING FOR', '#f472b6', wants)

  ctx.fillStyle = '#36c5ff'
  ctx.font = '700 22px Inter, sans-serif'
  const code = `Creator Code: ${CREATOR_CODE.toUpperCase()}`
  ctx.fillText(code, pad, H - 26)
  ctx.fillStyle = '#95a0c4'
  ctx.font = '600 20px Inter, sans-serif'
  ctx.fillText('fn sprite tracker', W - pad - ctx.measureText('fn sprite tracker').width, H - 26)

  return canvas.toDataURL('image/png')
}

export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}
