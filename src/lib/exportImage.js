import { ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import { CREATOR_CODE } from './supabase'

// Renders a shareable collection mosaic to a PNG data URL using <canvas>.
// `mode` = 'collection' (owned highlighted) or 'missing' (missing highlighted).
export function generateCollectionImage({ gamertag, tracking, mode = 'collection' }) {
  const W = 1200
  const pad = 64
  const cols = 16
  const cell = Math.floor((W - pad * 2) / cols)
  const rows = Math.ceil(ALL_SPRITES.length / cols)
  const gridTop = 250
  const H = gridTop + rows * cell + 90

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0c0f1a')
  bg.addColorStop(1, '#161b2e')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  const owned = ALL_SPRITES.filter((s) => tracking[s.id]?.owned).length
  const mastered = ALL_SPRITES.filter((s) => tracking[s.id]?.mastered).length
  const total = ALL_SPRITES.length

  // Header
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 52px Inter, sans-serif'
  ctx.fillText(gamertag ? `${gamertag}'s Sprites` : 'My Sprite Collection', pad, 92)

  ctx.font = '600 26px Inter, sans-serif'
  ctx.fillStyle = '#36c5ff'
  ctx.fillText(`Collection ${owned}/${total} · ${Math.round((owned / total) * 100)}%`, pad, 140)
  ctx.fillStyle = '#ffd23f'
  ctx.fillText(`Mastery ${mastered}/${total} · ${Math.round((mastered / total) * 100)}%`, pad + 420, 140)

  // Progress bar
  const barY = 168
  const barW = W - pad * 2
  ctx.fillStyle = '#222a45'
  roundRect(ctx, pad, barY, barW, 16, 8)
  ctx.fill()
  const grad = ctx.createLinearGradient(pad, 0, pad + barW, 0)
  grad.addColorStop(0, '#36c5ff')
  grad.addColorStop(1, '#7b61ff')
  ctx.fillStyle = grad
  roundRect(ctx, pad, barY, Math.max(8, (owned / total) * barW), 16, 8)
  ctx.fill()

  // Grid of every variant
  ALL_SPRITES.forEach((s, i) => {
    const x = pad + (i % cols) * cell
    const y = gridTop + Math.floor(i / cols) * cell
    const theme = THEME_MAP[s.themeId]
    const isOwned = !!tracking[s.id]?.owned
    const isMastered = !!tracking[s.id]?.mastered
    const highlight = mode === 'missing' ? !isOwned && s.released : isOwned

    ctx.save()
    roundRect(ctx, x + 3, y + 3, cell - 6, cell - 6, 8)
    if (highlight) {
      ctx.fillStyle = theme?.accent || '#888'
    } else {
      ctx.fillStyle = '#1a2036'
    }
    ctx.fill()
    if (isMastered) {
      ctx.lineWidth = 3
      ctx.strokeStyle = '#ffd23f'
      ctx.stroke()
    }
    // rarity dot
    ctx.beginPath()
    ctx.arc(x + cell - 12, y + 12, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = RARITY_COLORS[s.rarity] || '#888'
    ctx.fill()
    ctx.restore()
  })

  // Footer — creator code
  ctx.fillStyle = '#95a0c4'
  ctx.font = '600 24px Inter, sans-serif'
  ctx.fillText('fn sprite tracker', pad, H - 32)
  ctx.fillStyle = '#36c5ff'
  ctx.font = '700 24px Inter, sans-serif'
  const code = `Support Creator Code: ${CREATOR_CODE.toUpperCase()}`
  ctx.fillText(code, W - pad - ctx.measureText(code).width, H - 32)

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
