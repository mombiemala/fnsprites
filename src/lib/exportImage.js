import { ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import { CREATOR_CODE } from './supabase'

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// Renders a shareable PNG mosaic of real sprite thumbnails (async — loads the
// sprite images first). `mode` = 'collection' (whole set; owned bright, missing
// dimmed) or 'missing' (only the released sprites you don't own yet).
export async function generateCollectionImage({ gamertag, tracking, mode = 'collection' }) {
  const released = ALL_SPRITES.filter((s) => s.released)
  const ownedTotal = released.filter((s) => tracking[s.id]?.owned).length
  const masteredTotal = released.filter((s) => tracking[s.id]?.mastered).length
  const total = released.length

  const items =
    mode === 'missing' ? released.filter((s) => !tracking[s.id]?.owned) : released

  const W = 1200
  const pad = 64
  const cols = 12
  const cell = Math.floor((W - pad * 2) / cols)
  const gridTop = 230
  const rows = Math.max(1, Math.ceil(items.length / cols))
  const H = gridTop + rows * cell + 80

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0c0f1a')
  bg.addColorStop(1, '#161b2e')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Header
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 52px Inter, sans-serif'
  const title = mode === 'missing'
    ? gamertag ? `${gamertag} — Missing Sprites` : 'Missing Sprites'
    : gamertag ? `${gamertag}'s Sprites` : 'My Sprite Collection'
  ctx.fillText(title, pad, 86)

  ctx.font = '600 26px Inter, sans-serif'
  if (mode === 'missing') {
    ctx.fillStyle = '#f472b6'
    ctx.fillText(`${items.length} still needed of ${total}`, pad, 134)
  } else {
    ctx.fillStyle = '#36c5ff'
    ctx.fillText(`Collection ${ownedTotal}/${total} · ${Math.round((ownedTotal / total) * 100)}%`, pad, 134)
    ctx.fillStyle = '#ffd23f'
    ctx.fillText(`Mastery ${masteredTotal}/${total} · ${Math.round((masteredTotal / total) * 100)}%`, pad + 420, 134)
  }

  // Progress bar (collection only)
  if (mode !== 'missing') {
    const barY = 162
    const barW = W - pad * 2
    ctx.fillStyle = '#222a45'
    roundRect(ctx, pad, barY, barW, 14, 7)
    ctx.fill()
    const grad = ctx.createLinearGradient(pad, 0, pad + barW, 0)
    grad.addColorStop(0, '#36c5ff')
    grad.addColorStop(1, '#7b61ff')
    ctx.fillStyle = grad
    roundRect(ctx, pad, barY, Math.max(8, (ownedTotal / total) * barW), 14, 7)
    ctx.fill()
  }

  // Preload thumbnails
  const imgs = await Promise.all(items.map((s) => loadImage(s.image)))

  items.forEach((s, i) => {
    const x = pad + (i % cols) * cell
    const y = gridTop + Math.floor(i / cols) * cell
    const isOwned = !!tracking[s.id]?.owned
    const isMastered = !!tracking[s.id]?.mastered
    const dim = mode === 'collection' && !isOwned

    // cell backdrop
    ctx.save()
    roundRect(ctx, x + 3, y + 3, cell - 6, cell - 6, 10)
    ctx.fillStyle = '#161b2e'
    ctx.fill()
    ctx.restore()

    const img = imgs[i]
    if (img) {
      ctx.save()
      if (dim) ctx.filter = 'grayscale(1) brightness(0.5)'
      ctx.globalAlpha = dim ? 0.55 : 1
      ctx.drawImage(img, x + 6, y + 6, cell - 12, cell - 12)
      ctx.restore()
    }
    // mastery ring
    if (isMastered) {
      ctx.save()
      roundRect(ctx, x + 4, y + 4, cell - 8, cell - 8, 9)
      ctx.lineWidth = 3
      ctx.strokeStyle = '#ffd23f'
      ctx.stroke()
      ctx.restore()
    }
    // rarity dot
    ctx.beginPath()
    ctx.arc(x + cell - 13, y + 14, 4, 0, Math.PI * 2)
    ctx.fillStyle = RARITY_COLORS[s.rarity] || '#888'
    ctx.fill()
  })

  // Footer — creator code
  ctx.fillStyle = '#95a0c4'
  ctx.font = '600 24px Inter, sans-serif'
  ctx.fillText('fn sprite tracker', pad, H - 28)
  ctx.fillStyle = '#36c5ff'
  ctx.font = '700 24px Inter, sans-serif'
  const code = `Support Creator Code: ${CREATOR_CODE.toUpperCase()}`
  ctx.fillText(code, W - pad - ctx.measureText(code).width, H - 28)

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
