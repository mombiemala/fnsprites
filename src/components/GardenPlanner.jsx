import { useEffect, useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { ALL_SPRITES, SPRITE_BY_ID } from '../data/sprites'
import { generateGardenBlueprint, downloadDataUrl } from '../lib/exportImage'
import SpriteArt from './SpriteArt'

const PLAN_KEY = 'fnsprites.gardenPlan'
const COLS_KEY = 'fnsprites.gardenPlanCols'
const MAX = 24
const RANK = { Mythic: 0, Legendary: 1, Epic: 2, Rare: 3 }

// Garden layout planner — pick which of your owned Sprites to feature and in what
// order, preview the arrangement, and export a numbered "blueprint" to recreate
// it in your in-game Sprite Garden. Entirely client-side; the plan persists
// locally so it survives reloads.
export default function GardenPlanner() {
  const { profile, tracking } = useAuth()
  const { toast } = useToast()

  const owned = ALL_SPRITES
    .filter((s) => tracking?.[s.id]?.owned)
    .sort((a, b) => (RANK[a.rarity] ?? 9) - (RANK[b.rarity] ?? 9) || a.typeName.localeCompare(b.typeName))

  const [plan, setPlan] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PLAN_KEY)) || []
      return saved.filter((id) => SPRITE_BY_ID[id])
    } catch { return [] }
  })
  const [cols, setCols] = useState(() => {
    try { return Math.min(6, Math.max(2, Number(localStorage.getItem(COLS_KEY)) || 4)) } catch { return 4 }
  })
  const [busy, setBusy] = useState(false)

  useEffect(() => { try { localStorage.setItem(PLAN_KEY, JSON.stringify(plan)) } catch { /* ignore */ } }, [plan])
  useEffect(() => { try { localStorage.setItem(COLS_KEY, String(cols)) } catch { /* ignore */ } }, [cols])

  const toggle = (id) => {
    setPlan((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id)
      if (cur.length >= MAX) { toast(`A plan holds up to ${MAX} Sprites`, 'error'); return cur }
      return [...cur, id]
    })
  }
  const move = (i, dir) => setPlan((cur) => {
    const j = i + dir
    if (j < 0 || j >= cur.length) return cur
    const next = cur.slice(); [next[i], next[j]] = [next[j], next[i]]; return next
  })

  const planned = plan.map((id) => SPRITE_BY_ID[id]).filter(Boolean)

  const download = async () => {
    if (!planned.length) return
    setBusy(true)
    try {
      const dataUrl = await generateGardenBlueprint({ gamertag: profile?.gamertag, items: planned, cols })
      downloadDataUrl(dataUrl, 'fn-garden-blueprint.png')
      toast('Garden blueprint downloaded 📐')
    } catch {
      toast('Couldn’t export the blueprint', 'error')
    } finally { setBusy(false) }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-6">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-white">📐 Garden Layout Planner</h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">Plan which Sprites to feature and in what order, then export a numbered blueprint to copy in‑game.</p>
        </div>
        <a href="/sprite-garden" title="How the Sprite Garden works" className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)] hover:text-white">Garden guide ↗</a>
      </div>

      {owned.length === 0 ? (
        <div className="mt-4 rounded-xl bg-[var(--bg-2)] p-8 text-center">
          <p className="text-3xl">🪴</p>
          <p className="mt-2 font-display text-lg text-white">No owned Sprites yet</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Mark some Sprites as owned in your Collection, then plan your garden here.</p>
        </div>
      ) : (
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {/* Picker */}
          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Your Sprites — tap to add ({plan.length}/{MAX})</h3>
            <div className="grid max-h-80 grid-cols-5 gap-1.5 overflow-y-auto rounded-xl bg-[var(--bg-2)] p-2 sm:grid-cols-6">
              {owned.map((s) => {
                const idx = plan.indexOf(s.id)
                const picked = idx >= 0
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggle(s.id)}
                    title={`${s.typeName}${s.themeId !== 'normal' ? ` · ${s.themeId}` : ''}${picked ? ' — in plan' : ''}`}
                    aria-pressed={picked}
                    className={`relative grid aspect-square place-items-center overflow-hidden rounded-lg border ${picked ? 'border-[var(--brand)] ring-1 ring-[var(--brand)]' : 'border-transparent hover:border-[var(--border)]'}`}
                  >
                    <SpriteArt sprite={s} className="h-full w-full" />
                    {picked && <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-bl-lg bg-[var(--brand)] text-[9px] font-extrabold text-black">{idx + 1}</span>}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Plan + preview */}
          <section>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Your plan</h3>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
                Columns
                <select value={cols} onChange={(e) => setCols(Number(e.target.value))} className="rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-1.5 py-0.5 text-xs text-white outline-none">
                  {[2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </div>

            {planned.length === 0 ? (
              <p className="rounded-xl bg-[var(--bg-2)] px-3 py-6 text-center text-sm text-[var(--muted)]">Pick Sprites on the left to start your layout.</p>
            ) : (
              <>
                <div className="grid gap-1.5 rounded-xl bg-[var(--bg-2)] p-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                  {planned.map((s, i) => (
                    <div key={s.id} className="group relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel)]">
                      <SpriteArt sprite={s} className="h-full w-full" />
                      <span className="absolute left-0 top-0 grid h-4 w-4 place-items-center rounded-br-lg bg-[var(--brand)] text-[9px] font-extrabold text-black">{i + 1}</span>
                      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/50 p-0.5 opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                        <button onClick={() => move(i, -1)} title="Move earlier" className="text-[10px] text-white hover:text-[var(--brand)]">◀</button>
                        <button onClick={() => toggle(s.id)} title="Remove" className="text-[10px] text-white hover:text-rose-300">✕</button>
                        <button onClick={() => move(i, 1)} title="Move later" className="text-[10px] text-white hover:text-[var(--brand)]">▶</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={download} disabled={busy} className="rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-1.5 text-xs font-extrabold text-black disabled:opacity-60">
                    {busy ? 'Exporting…' : '📐 Download blueprint'}
                  </button>
                  <button onClick={() => setPlan([])} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-white">Clear</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      <p className="mt-4 text-[10px] leading-relaxed text-[var(--muted)]">The blueprint is a numbered reference you can recreate in your in‑game Sprite Garden — the game’s layout is free-form, so treat it as a plan, not an import. Saved on this device.</p>
    </div>
  )
}
