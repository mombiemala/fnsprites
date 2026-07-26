import { useEffect, useState } from 'react'
import SpriteArt from './SpriteArt'
import Tooltip from './Tooltip'
import { SPRITE_BY_ID } from '../data/sprites'
import { deriveBadges } from '../lib/badges'
import { fetchPlayerStats, summarizeStats } from '../lib/statsApi'

// Live BR stats strip — only rendered when the player opted their stats public
// (the shared-profile RPC only returns epicUsername in that case). Fails quietly:
// a private match history or API hiccup simply shows nothing, never an error.
function StatsStrip({ epicUsername, epicPlatform }) {
  const [state, setState] = useState({ loading: true, data: null })
  useEffect(() => {
    let alive = true
    fetchPlayerStats(epicUsername, epicPlatform || 'epic')
      .then((d) => { if (alive) setState({ loading: false, data: summarizeStats(d) }) })
      .catch(() => { if (alive) setState({ loading: false, data: null }) })
    return () => { alive = false }
  }, [epicUsername, epicPlatform])

  if (state.loading) {
    return <div className="mt-4 h-16 animate-pulse rounded-xl bg-[var(--bg-2)]" />
  }
  if (!state.data) return null
  const o = state.data.overall
  const tiles = [
    ['Wins', o.wins.toLocaleString()],
    ['Win rate', `${Math.round(o.winRate * 100)}%`],
    ['K/D', o.kd.toFixed(2)],
    ['Kills', o.kills.toLocaleString()],
  ]
  return (
    <div className="mt-4">
      <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Battle Royale</div>
      <div className="grid grid-cols-4 gap-2">
        {tiles.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-2 py-2 text-center">
            <div className="font-display text-lg leading-none text-white">{v}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// The public "Trainer Card" — an identity header shown atop a shared (?u=)
// collection. Avatar + gamertag + a couple of headline stats, earned badges,
// and the player's hand-picked showcase sprites. All derived from public
// display data (gamertag + showcase ids) and their public progress.
export default function TrainerCard({ gamertag, owned = 0, total = 0, mastered = 0, tracking = null, showcaseIds = null, epicUsername = null, epicPlatform = null }) {
  const pct = total ? Math.round((owned / total) * 100) : 0
  const showcase = (showcaseIds || [])
    .map((id) => SPRITE_BY_ID[id])
    .filter((s) => s && !s.unreleased)
    .slice(0, 6)
  const avatar = showcase[0] || null
  const badges = deriveBadges({ owned, mastered, tracking })

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--brand)]/40 bg-gradient-to-br from-[var(--brand)]/12 to-[var(--panel)] p-4 sm:p-5">
      <div className="flex items-center gap-4">
        {/* Avatar — the first showcase sprite, or a generic badge */}
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-2)] sm:h-20 sm:w-20">
          {avatar ? (
            <SpriteArt sprite={avatar} className="h-full w-full" />
          ) : (
            <span className="text-3xl" aria-hidden="true">🧩</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h2 className="truncate font-display text-xl text-white sm:text-2xl">{gamertag || 'A player'}</h2>
            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Trainer Card</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-[var(--muted)]">
            <span><b className="text-white">{owned}</b>/{total} owned <span className="text-[var(--brand)]">({pct}%)</span></span>
            {mastered > 0 && <span><b className="text-white">{mastered}</b> mastered ⭐</span>}
          </div>

          {/* Earned badges */}
          {badges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {badges.map((b) => (
                <Tooltip key={b.id} content={b.desc}>
                  <span className="inline-flex cursor-help items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-2 py-0.5 text-[11px] font-bold text-white">
                    <span aria-hidden="true">{b.icon}</span>{b.label}
                  </span>
                </Tooltip>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live BR stats — only when the player opted in (epicUsername gated by RPC) */}
      {epicUsername && <StatsStrip epicUsername={epicUsername} epicPlatform={epicPlatform} />}

      {/* Showcase sprites */}
      {showcase.length > 0 && (
        <div className="mt-4">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Showcase</div>
          <div className="flex flex-wrap gap-2">
            {showcase.map((s) => (
              <Tooltip key={s.id} content={`${s.typeName}${s.themeId !== 'normal' ? ` · ${s.themeId}` : ''}`}>
                <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)]">
                  <SpriteArt sprite={s} className="h-full w-full" />
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
