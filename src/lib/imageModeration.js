// Lightweight, dependency-free pre-upload checks for Garden screenshots.
//
// This is the "auto-filter" layer: fast client-side guards plus a crude
// skin-tone heuristic that rejects images that look like photos rather than game
// screenshots. It is intentionally conservative (high threshold) to avoid
// blocking legit garden shots — the real safety net is report → auto-hide (3
// reports) + owner/maker delete on the server. It is NOT a substitute for a
// trained NSFW model; it just catches the obvious non-screenshot case cheaply.

const MAX_BYTES = 6 * 1024 * 1024 // 6 MB
const OK_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MIN_DIM = 240 // reject tiny/junk uploads
// Fraction of skin-ish pixels above which we treat the image as "likely a photo,
// not a Fortnite screenshot." Kept high so colourful garden shots pass.
const SKIN_REJECT_RATIO = 0.62

// Standard RGB skin-tone rule (Kovac et al.) — cheap and good enough as a signal.
function isSkin(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return (
    r > 95 && g > 40 && b > 20 &&
    max - min > 15 &&
    Math.abs(r - g) > 15 &&
    r > g && r > b
  )
}

// Returns { ok: true } or { ok: false, reason }.
export async function moderateImage(file) {
  if (!file) return { ok: false, reason: 'No image selected.' }
  if (!OK_TYPES.includes(file.type)) {
    return { ok: false, reason: 'Please upload a PNG, JPG or WebP image.' }
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, reason: 'Image is over 6 MB — please use a smaller screenshot.' }
  }

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    // If we can't decode it, don't hard-fail the whole flow — let it through and
    // rely on the report backstop (some browsers reject createImageBitmap).
    return { ok: true }
  }

  if (bitmap.width < MIN_DIM || bitmap.height < MIN_DIM) {
    bitmap.close?.()
    return { ok: false, reason: 'Image is too small — use a full-size screenshot.' }
  }

  // Downscale to a small sampling canvas and measure the skin-tone ratio.
  try {
    const S = 96
    const canvas = document.createElement('canvas')
    canvas.width = S; canvas.height = S
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(bitmap, 0, 0, S, S)
    const { data } = ctx.getImageData(0, 0, S, S)
    let skin = 0, total = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue // skip transparent
      total++
      if (isSkin(data[i], data[i + 1], data[i + 2])) skin++
    }
    bitmap.close?.()
    if (total > 0 && skin / total > SKIN_REJECT_RATIO) {
      return {
        ok: false,
        reason: 'This looks like it may not be a Sprite Garden screenshot. Please share an in-game garden shot.',
      }
    }
  } catch {
    // Canvas/readback failed (e.g. privacy mode) — allow, backstopped by reports.
    return { ok: true }
  }

  return { ok: true }
}
