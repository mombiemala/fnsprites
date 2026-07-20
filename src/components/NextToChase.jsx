import { useMemo } from 'react'
import { ALL_SPRITES } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import SpriteArt from './SpriteArt'

// Drop rate is stored as a display string like "8.73%"; parse to a number so we
// can rank. Lower = rarer.
const rate = (s) => parseFloat(s.dropRate)

// A small, opinionated "what should I go get next" guide, built entirely from the
// player's own collection: the rarest thing they're missing, the sprite type
// they're closest to completing, and the most common (easiest to run into) miss.
export default function NextToChase({ tracking, onOpen }) {
  const picks = useMemo(() => {
    const released = ALL_SPRITES.filter((s) => !s.unreleased)
    const missing = released.filter((s) => !tracking[s.id]?.owned)
    if (!missing.length) return null

    // Only sprites with a known drop rate can be ranked by rarity. Some (the
    // collab Mythics — Air/Batman/Seven/Pollo/Vini) have no published rate, so
    // `rated` can be empty even when `missing` isn't. Never reduce an empty array
    // without a seed — pickBy returns null instead of throwing.
    const rated = missing.filter((s) => !Number.isNaN(rate(s)))
    const pickBy = (arr, better) => (arr.length ? arr.reduce((a, b) => (better(b, a) ? b : a)) : null)
    const rarest = pickBy(rated, (b, a) => rate(b) < rate(a)) || missing[0]
    const easiestPool = rated.filter((s) => s.typeId !== rarest.typeId)
    const easiest = pickBy(easiestPool.length ? easiestPool : rated, (b, a) => rate(b) > rate(a))

    // Sprite type closest to having every variant owned (started but unfinished).
    const byType = {}
    for (const s of released) {
      const t = (byType[s.typeId] ||= { typeName: s.typeName, total: 0, owned: 0, missing: [] })
      t.total++
      if (tracking[s.id]?.owned) t.owned++
      else t.missing.push(s)
    }
    const closest = Object.values(byType)
      .filter((t) => t.owned > 0 && t.owned < t.total)
      .sort((a, b) => a.total - a.owned - (b.total - b.owned))[0]

    const rows = [
      { key: 'rarest', tag: 'Rarest missing', sprite: rarest, note: rarest.dropRate ? `${rarest.rarity} · ${rarest.dropRate} drop` : rarest.rarity },
    ]
    if (closest && closest.missing[0].id !== rarest.id) {
      rows.push({
        key: 'set',
        tag: 'Finish a set',
        sprite: closest.missing[0],
        note: `${closest.typeName}: ${closest.total - closest.owned} variant${closest.total - closest.owned === 1 ? '' : 's'} to go`,
      })
    }
    if (easiest && easiest.id !== rarest.id && !rows.some((r) => r.sprite.id === easiest.id)) {
      rows.push({ key: 'easiest', tag: 'Easiest to grab', sprite: easiest, note: `Most common · ${easiest.dropRate} drop` })
    }
    return rows
  }, [tracking])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="font-display text-lg text-white">🎯 Next to chase</h3>
      {!picks ? (
        <p className="mt-2 text-sm text-[var(--muted)]">You’ve caught them all — full collection! 🎉</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {picks.map(({ key, tag, sprite, note }) => {
            const theme = THEME_MAP[sprite.themeId]
            return (
              <button
                key={key}
                onClick={() => onOpen(sprite.typeId)}
                className="flex items-center gap-3 rounded-xl bg-[var(--bg-2)] p-2 text-left transition-colors hover:bg-[var(--panel-2)]"
                title={`Open ${sprite.typeName} · ${theme?.name}`}
              >
                <div className={`sprite-art h-10 w-10 shrink-0 ${theme?.className || 'theme-normal'}`} style={{ borderRadius: '0.55rem' }}>
                  <SpriteArt sprite={sprite} />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-[var(--brand)]">{tag}</span>
                  <span className="block truncate text-sm font-bold text-white">
                    {sprite.typeName} <span className="font-medium text-[var(--muted)]">· {theme?.name}</span>
                  </span>
                  <span className="block truncate text-[11px] text-[var(--muted)]">{note}</span>
                </span>
                <span className="shrink-0 text-[var(--muted)]">→</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
