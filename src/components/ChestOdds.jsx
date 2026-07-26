import { useState } from 'react'
import { SPRITE_TYPES, RARITY_COLORS, RARITY_ORDER } from '../data/sprites'
import Tooltip from './Tooltip'

// Parse a base drop-rate string like "8.73%" or "0.00034%" → probability (0..1).
function parseRate(s) {
  if (!s) return null
  const n = parseFloat(String(s).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n / 100 : null
}

// Types with a known base (Normal) drop rate, grouped by rarity for the picker.
const RATED = SPRITE_TYPES
  .map((t) => ({ ...t, p: parseRate(t.dropRate) }))
  .filter((t) => t.p)
const GROUPS = RARITY_ORDER
  .map((r) => ({ rarity: r, items: RATED.filter((t) => t.rarity === r) }))
  .filter((g) => g.items.length)

// Chests for a given confidence: n = ln(1-conf) / ln(1-p).
const chestsFor = (p, conf) => Math.ceil(Math.log(1 - conf) / Math.log(1 - p))
// Chance of ≥1 in n chests.
const atLeastOne = (p, n) => 1 - Math.pow(1 - p, n)

const fmt = (n) => Math.round(n).toLocaleString()
const fmtPct = (x) => {
  const v = x * 100
  if (v >= 99.95) return '>99.9%'
  if (v < 0.1) return `${v.toPrecision(2)}%`
  return `${v.toFixed(1)}%`
}

// "Chest luck" calculator — from the base drop rate, how many Sprite Chests it
// takes to land a given Sprite (expected + 50/90/99% confidence), plus a
// live "open N chests → chance of at least one". Uses the geometric model:
// each chest is an independent draw at the base rate.
export default function ChestOdds() {
  const [typeId, setTypeId] = useState(RATED[0]?.id)
  const type = RATED.find((t) => t.id === typeId) || RATED[0]
  const p = type?.p

  // Re-seed the chest input to the ~50% mark whenever the Sprite changes
  // (adjust-state-during-render pattern — no effect needed).
  const [seeded, setSeeded] = useState(null)
  const [chests, setChests] = useState('')
  if (type && typeId !== seeded) {
    setSeeded(typeId)
    setChests(String(chestsFor(p, 0.5)))
  }

  if (!type) return null
  const n = Math.max(0, Math.floor(Number(chests) || 0))
  const expected = 1 / p

  const rows = [
    ['Coin-flip (50%)', chestsFor(p, 0.5)],
    ['Likely (90%)', chestsFor(p, 0.9)],
    ['Almost sure (99%)', chestsFor(p, 0.99)],
  ]

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="mb-3 flex items-center gap-1.5 font-display text-lg text-white">
        🎲 Chest luck
        <Tooltip content="Odds of pulling a Sprite from a Sprite Chest, treating each chest as an independent draw at the base (Normal) drop rate. Community-estimated rates — special variants are far rarer.">
          <span className="grid h-4 w-4 cursor-help place-items-center rounded-full bg-[var(--panel-2)] text-[10px] text-[var(--muted)]" aria-label="How this is calculated">ⓘ</span>
        </Tooltip>
      </h3>

      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Sprite</label>
      <select
        value={typeId}
        onChange={(e) => setTypeId(e.target.value)}
        title="Pick a Sprite to see its chest odds"
        className="mb-3 w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
      >
        {GROUPS.map((g) => (
          <optgroup key={g.rarity} label={g.rarity}>
            {g.items.map((t) => (
              <option key={t.id} value={t.id}>{t.icon} {t.name} — {t.dropRate}</option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="mb-3 flex items-center justify-between rounded-xl bg-[var(--bg-2)] px-3 py-2">
        <span className="flex items-center gap-2 text-sm text-white">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: RARITY_COLORS[type.rarity] || '#888' }} />
          Drop rate <b>{type.dropRate}</b>
        </span>
        <span className="text-right text-sm text-[var(--muted)]">~<b className="text-white">{fmt(expected)}</b> chests avg</span>
      </div>

      <div className="space-y-1">
        {rows.map(([label, c]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">{label}</span>
            <span className="font-semibold text-white">{fmt(c)} chests</span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Open</span>
          <input
            type="number"
            min="0"
            value={chests}
            onChange={(e) => setChests(e.target.value)}
            title="How many chests you plan to open"
            className="w-24 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-2 py-1 text-sm text-white outline-none focus:border-[var(--brand)]"
          />
          <span className="text-sm text-[var(--muted)]">chests →</span>
        </div>
        <p className="mt-2 text-sm text-white">
          <b className="text-[var(--brand)]">{fmtPct(atLeastOne(p, n))}</b> chance of at least one <b>{type.name}</b>
        </p>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-[var(--muted)]">
        Base (Normal-form) rates, community-estimated — Epic doesn’t publish official odds. Gold/Gummy/Galaxy and other variants are much rarer than the base rate shown.
      </p>
    </div>
  )
}
