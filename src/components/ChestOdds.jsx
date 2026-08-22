import { useState } from 'react'
import { SPRITE_TYPES, SPRITE_BY_ID, RARITY_COLORS, RARITY_ORDER } from '../data/sprites'
import { THEME_MAP, FINISH_ODDS_FACTOR } from '../data/themes'
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
  const [finish, setFinish] = useState('normal')
  const type = RATED.find((t) => t.id === typeId) || RATED[0]

  // Finishes this Sprite actually has AND that are currently obtainable (a
  // released, non-vaulted variant with a known odds factor). Vaulted finishes
  // (e.g. Grim's / Aura's Gem) are excluded — you can't pull them right now, so
  // quoting chest odds for them would be misleading. Normal is always first.
  const finishes = type
    ? Object.keys(type.variants).filter(
        (f) =>
          THEME_MAP[f] &&
          FINISH_ODDS_FACTOR[f] != null &&
          SPRITE_BY_ID[`${type.id}_${f}`]?.released &&
          !SPRITE_BY_ID[`${type.id}_${f}`]?.vaulted,
      )
    : []
  const activeFinish = finishes.includes(finish) ? finish : 'normal'
  const factor = FINISH_ODDS_FACTOR[activeFinish] ?? 1
  // Effective per-chest probability for the chosen finish: base (Normal) rate ×
  // the finish's rough odds factor.
  const p = type ? type.p * factor : null

  // Re-seed the chest input to the ~50% mark whenever the Sprite or finish
  // changes (adjust-state-during-render pattern — no effect needed).
  const seedKey = `${typeId}:${activeFinish}`
  const [seeded, setSeeded] = useState(null)
  const [chests, setChests] = useState('')
  if (type && seedKey !== seeded) {
    setSeeded(seedKey)
    setChests(String(chestsFor(p, 0.5)))
  }

  if (!type) return null
  const n = Math.max(0, Math.floor(Number(chests) || 0))
  const expected = 1 / p
  const isSpecial = activeFinish !== 'normal'
  const finishName = THEME_MAP[activeFinish]?.name || 'Normal'
  const effPct = p * 100
  const effRate = effPct < 0.1 ? `${effPct.toPrecision(2)}%` : `${effPct.toFixed(2)}%`

  const rows = [
    ['Coin-flip (50%)', chestsFor(p, 0.5)],
    ['Likely (90%)', chestsFor(p, 0.9)],
    ['Almost sure (99%)', chestsFor(p, 0.99)],
  ]

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="mb-1 flex items-center gap-1.5 font-display text-lg text-white">
        🎲 Chest luck <span className="text-xs font-bold text-[var(--muted)]">· Season 3</span>
        <Tooltip content="Odds of pulling a Sprite from a Sprite Chest, treating each chest as an independent draw. The base (Normal) rate is community-estimated; picking a special finish multiplies it by a rough finish-rarity estimate (Epic doesn't publish finish odds).">
          <span className="grid h-4 w-4 cursor-help place-items-center rounded-full bg-[var(--panel-2)] text-[10px] text-[var(--muted)]" aria-label="How this is calculated">ⓘ</span>
        </Tooltip>
      </h3>
      <p className="mb-3 text-[11px] leading-relaxed text-[var(--muted)]">
        Covers the Season 3 “Runners” Sprites, which come from <b className="text-white">Sprite Chests</b>. Season 4
        “Override” Sprites come from in-world Cheat Codes and <a href="/codes" className="font-bold text-[var(--brand)] hover:underline">Hack the Lobby codes</a> (and, since a recent update, Chests too) — no fixed odds published.
      </p>

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

      {finishes.length > 1 && (
        <>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Finish</label>
          <select
            value={activeFinish}
            onChange={(e) => setFinish(e.target.value)}
            title="Pick a finish to estimate the odds of pulling that specific variant"
            className="mb-3 w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
          >
            {finishes.map((f) => (
              <option key={f} value={f}>
                {THEME_MAP[f].name}{f === 'normal' ? ' (base rate)' : ` — ~${Math.round(1 / FINISH_ODDS_FACTOR[f])}× rarer`}
              </option>
            ))}
          </select>
        </>
      )}

      <div className="mb-3 flex items-center justify-between rounded-xl bg-[var(--bg-2)] px-3 py-2">
        <span className="flex items-center gap-2 text-sm text-white">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: RARITY_COLORS[type.rarity] || '#888' }} />
          {isSpecial ? <>{finishName} rate <b>≈{effRate}</b></> : <>Drop rate <b>{type.dropRate}</b></>}
        </span>
        <span className="text-right text-sm text-[var(--muted)]">~<b className="text-white">{fmt(expected)}</b> chests avg</span>
      </div>

      {isSpecial && (
        <p className="mb-3 -mt-1 rounded-lg bg-amber-400/10 px-2.5 py-1.5 text-[10px] leading-relaxed text-amber-200/90">
          ⚠︎ Estimate only — Epic doesn’t publish finish odds. This assumes the {finishName} finish is ~{Math.round(1 / factor)}× rarer than the base pull.
        </p>
      )}

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
          <b className="text-[var(--brand)]">{fmtPct(atLeastOne(p, n))}</b> chance of at least one <b>{isSpecial ? `${finishName} ${type.name}` : type.name}</b>
        </p>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-[var(--muted)]">
        Base (Normal-form) rates are community-estimated — Epic doesn’t publish official odds. Special-finish odds multiply that base by a rough finish-rarity estimate and are approximate, not measured.
      </p>
    </div>
  )
}
