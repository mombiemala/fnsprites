// Screenshot importer — read sprite names off a locker screenshot with
// in-browser OCR (Tesseract.js, lazy-loaded) and fuzzy-match them to our roster.
// The image never leaves the device: recognition runs client-side in a worker.
import { SPRITE_TYPES } from '../data/sprites'

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')

// Levenshtein distance → similarity ratio in [0,1].
function lev(a, b) {
  const m = a.length, n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    let cur = [i]
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
    }
    prev = cur
  }
  return prev[n]
}
function ratio(a, b) {
  const max = Math.max(a.length, b.length)
  return max ? 1 - lev(a, b) / max : 1
}

// Precompute match targets: each released type's full normalized name plus its
// distinctive words (len ≥ 4, so short words must match exactly and don't
// produce false positives).
const TARGETS = SPRITE_TYPES.filter((t) => t.released).map((t) => ({
  id: t.id,
  name: t.name,
  full: norm(t.name),
  words: t.name.split(/\s+/).map(norm).filter((w) => w.length >= 4),
}))

// Map noisy OCR text → sprite type ids, best score first.
// Threshold 0.84 means 4-letter names need an exact hit; longer names tolerate a typo.
export function matchSpriteTypesFromText(text, threshold = 0.84) {
  const toks = (text || '').split(/[^A-Za-z0-9]+/).map(norm).filter((w) => w.length >= 2)
  const grams = []
  for (let n = 1; n <= 3; n++) {
    for (let i = 0; i + n <= toks.length; i++) grams.push(toks.slice(i, i + n).join(''))
  }
  const results = []
  for (const t of TARGETS) {
    let best = 0
    for (const g of grams) {
      const r = ratio(g, t.full)
      if (r > best) best = r
    }
    for (const w of t.words) {
      for (const tok of toks) {
        const r = ratio(tok, w)
        if (r > best) best = r
      }
    }
    if (best >= threshold) results.push({ id: t.id, score: Number(best.toFixed(2)) })
  }
  return results.sort((a, b) => b.score - a.score)
}

// Run OCR on an image File/Blob, then match. onProgress(0..1) fires while
// recognizing. Tesseract.js is imported lazily so it never touches the main bundle.
export async function readSpriteTypesFromImage(file, onProgress) {
  const { createWorker } = await import('tesseract.js')
  // Self-hosted worker/core/lang assets (public/tesseract) so recognition has no
  // third-party CDN dependency — works offline and behind strict networks.
  const base = import.meta.env.BASE_URL
  const worker = await createWorker('eng', 1, {
    workerPath: `${base}tesseract/worker.min.js`,
    corePath: `${base}tesseract/core`,
    langPath: `${base}tesseract/lang`,
    logger: (m) => {
      if (m.status === 'recognizing text' && typeof onProgress === 'function') onProgress(m.progress)
    },
  })
  try {
    const { data } = await worker.recognize(file)
    return { text: data.text || '', matches: matchSpriteTypesFromText(data.text || '') }
  } finally {
    await worker.terminate()
  }
}
