import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ALL_SPRITES, CURRENT_GEN } from '../data/sprites'
import { THEME_MAP, THEME_ORDER } from '../data/themes'
import { useEscClose } from '../lib/useEscClose'

// A print-optimised, ink-friendly checklist of every released Sprite and the
// finishes it comes in, with the player's owned/mastered progress baked in.
// Opens as an overlay with a Print button; the print stylesheet (index.css,
// `.print-sheet` / `.no-print`) hides the rest of the app so only this prints,
// on white. Matches the one thing static checklist sites offer that we didn't.
export default function PrintableChecklist({ tracking = {}, onClose }) {
  useEscClose(onClose, true)

  // Mark the body while open so the print stylesheet can hide #root entirely
  // (the sheet is portalled straight onto <body>, so printing it leaves no
  // blank trailing pages from the hidden-but-still-laid-out app behind it).
  useEffect(() => {
    document.body.classList.add('has-print-sheet')
    return () => document.body.classList.remove('has-print-sheet')
  }, [])

  const { groups, ownedCount, masteredCount, total } = useMemo(() => {
    const released = ALL_SPRITES.filter((s) => s.released)
    const byType = new Map()
    for (const s of released) {
      if (!byType.has(s.typeId)) {
        byType.set(s.typeId, { typeId: s.typeId, name: s.typeName, gen: s.gen, finishes: [] })
      }
      byType.get(s.typeId).finishes.push(s)
    }
    const types = [...byType.values()]
    for (const t of types) {
      t.finishes.sort((a, b) => THEME_ORDER.indexOf(a.themeId) - THEME_ORDER.indexOf(b.themeId))
    }
    // Current season first, then older generations (newest-ish last).
    const gens = [...new Set(types.map((t) => t.gen))].sort((a, b) =>
      a === CURRENT_GEN ? -1 : b === CURRENT_GEN ? 1 : a < b ? 1 : -1,
    )
    const label = (gen) =>
      gen === CURRENT_GEN ? 'Season 4 “Override” (current)' : gen === 'c7s3' ? 'Season 3 “Runners” (archived)' : gen
    const groups = gens.map((gen) => ({ gen, label: label(gen), types: types.filter((t) => t.gen === gen) }))
    const ownedCount = released.filter((s) => tracking[s.id]?.owned).length
    const masteredCount = released.filter((s) => tracking[s.id]?.mastered).length
    return { groups, ownedCount, masteredCount, total: released.length }
  }, [tracking])

  return createPortal(
    <div className="print-overlay fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Printable collection checklist"
        className="print-sheet mx-auto my-4 w-full max-w-3xl rounded-lg bg-white p-6 text-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="no-print mb-4 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">In the print dialog, pick “Save as PDF” to keep a copy.</p>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="rounded-lg bg-black px-4 py-2 text-sm font-bold text-white">
              🖨 Print
            </button>
            <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700">
              Close
            </button>
          </div>
        </div>

        <header className="mb-4 border-b border-gray-300 pb-3">
          <h1 className="text-xl font-extrabold">FN Sprite Tracker — Collection Checklist</h1>
          <p className="mt-0.5 text-sm text-gray-600">
            {ownedCount} / {total} variants owned · {masteredCount} mastered · ✓ owned · ★ mastered · ☐ still to get ·
            fnsprites.app
          </p>
        </header>

        {groups.map((g) => (
          <section key={g.gen} className="checklist-gen mb-5">
            <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-gray-700">{g.label}</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {g.types.map((t) => (
                <div key={t.typeId} className="checklist-row flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-gray-100 py-1">
                  <span className="shrink-0 text-sm font-bold">{t.name}</span>
                  <span className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px]">
                    {t.finishes.map((f) => {
                      const tr = tracking[f.id] || {}
                      const mark = tr.mastered ? '★' : tr.owned ? '✓' : '☐'
                      const short = THEME_MAP[f.themeId]?.short || f.themeId
                      return (
                        <span
                          key={f.id}
                          className="whitespace-nowrap"
                          style={{ color: tr.owned || tr.mastered ? '#111827' : '#9ca3af' }}
                        >
                          {mark}&nbsp;{short}
                        </span>
                      )
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <p className="mt-4 text-[10px] leading-relaxed text-gray-400">
          Finishes: N Normal · G Gold · Gy Gummy · Gx Galaxy · Ge Gem · H Holofoil · Cu Cube · Qk Quack · Ch Cheat Master ·
          LH Loot Hacker · BH Bounty Hunter · ToT Trick-or-Treat. Fan-made; not affiliated with Epic Games.
        </p>
      </div>
    </div>,
    document.body,
  )
}
