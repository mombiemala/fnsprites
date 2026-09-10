import Tooltip from './Tooltip'
import { deriveBadges } from '../lib/badges'
import { SPRITE_BY_ID } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import SpriteArt from './SpriteArt'

// A player's avatar = their first showcase Sprite, as a circular finish-tinted
// disc. Falls back to a generic mark if they haven't picked a showcase yet.
export function PlayerAvatar({ id, size = 44, ring }) {
  const s = id ? SPRITE_BY_ID[id] : null
  const theme = s ? THEME_MAP[s.themeId] : null
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden sprite-art ${theme?.className || 'theme-normal'}`}
      style={{ width: size, height: size, borderRadius: '50%', boxShadow: ring ? `0 0 0 3px ${ring}` : undefined }}
    >
      {s ? <SpriteArt sprite={s} /> : <span style={{ fontSize: size * 0.5 }}>🧩</span>}
    </span>
  )
}

export function PlayerBadges({ owned, mastered, max = 3 }) {
  return deriveBadges({ owned, mastered }).slice(0, max).map((b) => (
    <Tooltip key={b.id} content={`${b.label} — ${b.desc}`}>
      <span className="shrink-0 cursor-help text-sm" aria-label={b.label}>{b.icon}</span>
    </Tooltip>
  ))
}
