import { useMemo } from 'react'
import { SPRITE_TYPES, ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import SpriteArt from './SpriteArt'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmtDate = (d) => { const [, m, day] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${day}` }
const daysAway = (d) => {
  const [y, m, day] = d.split('-').map(Number)
  const now = new Date()
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((Date.UTC(y, m - 1, day) - today) / 86400000)
}
const countdown = (d) => {
  if (!d) return 'Datamined · TBA'
  const n = daysAway(d)
  if (n > 1) return `in ${n} days`
  if (n === 1) return 'Tomorrow'
  if (n === 0) return 'Today'
  return 'Any day now'
}

// A highlight reel of what's coming: every unreleased/leaked sprite, soonest
// first, with its leaked release date. Turns the roster's rumored entries into a
// visible "what's next" feature. Everything here is unconfirmed by Epic.
export default function UpcomingSprites({ onOpen }) {
  const rows = useMemo(() => {
    return SPRITE_TYPES
      .filter((t) => !t.released)
      .map((t) => ({ t, sprite: ALL_SPRITES.find((s) => s.id === `${t.id}_normal`) }))
      .sort((a, b) => (a.t.releaseDate ? 0 : 1) - (b.t.releaseDate ? 0 : 1)
        || (a.t.releaseDate || '').localeCompare(b.t.releaseDate || ''))
  }, [])

  if (!rows.length) return null

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">🔮 Upcoming &amp; leaked</h3>
        <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-300">Rumored</span>
      </div>
      <p className="mt-1 text-[11px] text-[var(--muted)]">Datamined / leaked — dates &amp; details aren’t confirmed by Epic.</p>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map(({ t, sprite }) => (
          <button
            key={t.id}
            onClick={() => onOpen(t.id)}
            className="flex items-center gap-3 rounded-xl bg-[var(--bg-2)] p-2 text-left transition-colors hover:bg-[var(--panel-2)]"
            title={`Open ${t.name}`}
          >
            <div className="sprite-art h-10 w-10 shrink-0 theme-normal" style={{ borderRadius: '0.55rem' }}>
              {sprite && <SpriteArt sprite={sprite} />}
            </div>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-white">
                {t.name}{' '}
                <span className="text-[11px] font-semibold" style={{ color: RARITY_COLORS[t.rarity] }}>{t.rarity}</span>
              </span>
              <span className="block truncate text-[11px] text-[var(--muted)]">{t.ability}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-[11px] font-bold text-white">{t.releaseDate ? fmtDate(t.releaseDate) : 'TBA'}</span>
              <span className="block text-[10px] font-semibold text-amber-300">{countdown(t.releaseDate)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
