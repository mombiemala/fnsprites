import { useEffect, useMemo, useState } from 'react'
import { SPRITE_TYPES, ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { readSpriteTypesFromImage } from '../lib/spriteOcr'
import { useEscClose } from '../lib/useEscClose'

const TYPE_MAP = Object.fromEntries(SPRITE_TYPES.map((t) => [t.id, t]))
const VARIANTS = (typeId) => ALL_SPRITES.filter((s) => s.typeId === typeId)

// Build a review row for a detected/added type. Defaults to selecting only the
// base (Normal) variant — the user checks any extra variants they actually have.
function makeRow(typeId, score = null) {
  const base = `${typeId}_normal`
  const hasBase = VARIANTS(typeId).some((v) => v.id === base)
  const first = VARIANTS(typeId)[0]?.id
  return { typeId, score, include: true, variants: new Set([hasBase ? base : first].filter(Boolean)) }
}

export default function ScreenshotImportModal({ onClose }) {
  useEscClose(onClose)
  const { bulkOwn } = useAuth()
  const { toast } = useToast()

  const [step, setStep] = useState('idle') // idle | reading | review
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(null)
  const [rows, setRows] = useState([])
  const [addQ, setAddQ] = useState('')

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const runOcr = async (file) => {
    if (!file || !file.type.startsWith('image/')) { toast('Please choose an image file', 'error'); return }
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setStep('reading'); setProgress(0); setRows([])
    try {
      const { matches } = await readSpriteTypesFromImage(file, setProgress)
      setRows(matches.map((m) => makeRow(m.id, m.score)))
      setStep('review')
      if (!matches.length) toast('No sprites recognized — try a clearer, tighter screenshot', 'error')
    } catch {
      toast('Could not read that image — try another screenshot', 'error')
      setStep('idle')
    }
  }

  const onDrop = (e) => { e.preventDefault(); runOcr(e.dataTransfer.files?.[0]) }

  const toggleInclude = (typeId) =>
    setRows((rs) => rs.map((r) => (r.typeId === typeId ? { ...r, include: !r.include } : r)))
  const toggleVariant = (typeId, vid) =>
    setRows((rs) => rs.map((r) => {
      if (r.typeId !== typeId) return r
      const variants = new Set(r.variants)
      if (variants.has(vid)) variants.delete(vid); else variants.add(vid)
      return { ...r, variants, include: variants.size > 0 ? true : r.include }
    }))

  const addResults = useMemo(() => {
    const q = addQ.trim().toLowerCase()
    if (!q) return []
    const have = new Set(rows.map((r) => r.typeId))
    return SPRITE_TYPES.filter((t) => t.released && !have.has(t.id) && t.name.toLowerCase().includes(q)).slice(0, 6)
  }, [addQ, rows])

  const addType = (typeId) => { setRows((rs) => [...rs, makeRow(typeId)]); setAddQ('') }

  const selectedIds = useMemo(
    () => rows.filter((r) => r.include).flatMap((r) => [...r.variants]),
    [rows]
  )

  const apply = () => {
    if (!selectedIds.length) { toast('Nothing selected to import', 'error'); return }
    bulkOwn(selectedIds, true)
    toast(`Marked ${selectedIds.length} sprite${selectedIds.length === 1 ? '' : 's'} owned 🎉`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Import sprites from a screenshot"
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-2xl [scrollbar-gutter:stable]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-white">📷 Import from a screenshot</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Snap your in-game sprite locker and we’ll pre-check what we recognize.{' '}
              <span className="font-semibold text-emerald-300">Runs in your browser — the image never leaves your device.</span>
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        {step === 'idle' && (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-2)] px-4 py-10 text-center hover:border-[var(--brand)]"
          >
            <span className="text-3xl">🖼️</span>
            <span className="text-sm font-bold text-white">Drop a screenshot or tap to choose</span>
            <span className="text-[11px] text-[var(--muted)]">PNG or JPG · a tight shot of the locker names reads best</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => runOcr(e.target.files?.[0])} />
          </label>
        )}

        {step === 'reading' && (
          <div className="mt-4 rounded-2xl bg-[var(--bg-2)] p-6 text-center">
            {preview && <img src={preview} alt="" className="mx-auto mb-4 max-h-40 rounded-lg opacity-80" />}
            <p className="text-sm font-bold text-white">Reading your screenshot…</p>
            <div className="mx-auto mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[var(--panel-2)]">
              <div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-[var(--muted)]">First run downloads the recognizer (~a few MB), then it’s cached.</p>
          </div>
        )}

        {step === 'review' && (
          <div className="mt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white">
                Recognized {rows.length} sprite{rows.length === 1 ? '' : 's'} — double-check before importing
              </h3>
              <button onClick={() => { setStep('idle'); setRows([]) }} className="text-[11px] font-bold text-[var(--brand)] hover:underline">
                ↻ Try another image
              </button>
            </div>

            <div className="space-y-2">
              {rows.map((r) => {
                const t = TYPE_MAP[r.typeId]
                const variants = VARIANTS(r.typeId)
                return (
                  <div key={r.typeId} className={`rounded-xl bg-[var(--bg-2)] p-3 ${r.include ? '' : 'opacity-50'}`}>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={r.include} onChange={() => toggleInclude(r.typeId)} aria-label={`Include ${t?.name}`} />
                      <span className="text-lg">{t?.icon}</span>
                      <span className="text-sm font-bold text-white">{t?.name}</span>
                      {t && (
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase" style={{ color: RARITY_COLORS[t.rarity], background: `${RARITY_COLORS[t.rarity]}22` }}>
                          {t.rarity}
                        </span>
                      )}
                      {r.score != null && <span className="text-[10px] text-[var(--muted)]">· {Math.round(r.score * 100)}% match</span>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 pl-6">
                      {variants.map((v) => {
                        const on = r.variants.has(v.id)
                        const theme = THEME_MAP[v.themeId]
                        return (
                          <button
                            key={v.id}
                            onClick={() => toggleVariant(r.typeId, v.id)}
                            title={theme?.name}
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors"
                            style={on
                              ? { background: theme?.accent, color: '#000' }
                              : { background: 'var(--panel-2)', color: 'var(--muted)' }}
                          >
                            {theme?.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Manual add for anything OCR missed */}
            <div className="relative mt-3">
              <input
                value={addQ}
                onChange={(e) => setAddQ(e.target.value)}
                placeholder="Missed one? Search to add a sprite…"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
              />
              {addResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel-2)] shadow-xl">
                  {addResults.map((t) => (
                    <button key={t.id} onClick={() => addType(t.id)} className="block w-full px-3 py-1.5 text-left text-xs text-white hover:bg-[var(--brand)]/20">
                      {t.icon} {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--muted)]">{selectedIds.length} variant{selectedIds.length === 1 ? '' : 's'} selected</span>
              <button
                onClick={apply}
                disabled={!selectedIds.length}
                className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-sm font-extrabold text-black disabled:opacity-60"
              >
                Mark {selectedIds.length} owned
              </button>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--muted)]">
              Beta — OCR isn’t perfect. It defaults to the <b className="text-white">Normal</b> variant; add Gold/Gummy/etc. per sprite if you have them. You can fine-tune levels later in each sprite’s detail.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
