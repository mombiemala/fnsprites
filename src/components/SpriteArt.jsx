// Generated SVG art for each sprite "type" — a cohesive collectible-companion
// look (a rounded creature body + eyes) differentiated by color and a small
// per-type accent. If a real image has been added for the sprite, that PNG/WebP
// is rendered instead (the AI/official-art slot).

const COLORS = {
  water: ['#7cc4ff', '#1d6fd6'],
  earth: ['#9bcf6f', '#4d7a32'],
  fire: ['#ffb24a', '#e0341f'],
  duck: ['#ffe06b', '#f2a93b'],
  ghost: ['#e6ecff', '#9aa6e6'],
  dream: ['#c79bff', '#6f3fd6'],
  demon: ['#ff7080', '#c01d3a'],
  punk: ['#ff7ec4', '#a01d7a'],
  king: ['#ffe06b', '#d39b20'],
  zeropoint: ['#7af1ff', '#5b6bff'],
  peanut: ['#caa06a', '#6f4521'],
  striker: ['#ffe14d', '#f0a81f'],
  fishy: ['#76e3ef', '#1f8fae'],
  aura: ['#b6ffd9', '#46c98a'],
  boss: ['#c8cedb', '#69728a'],
  grim: ['#4a5270', '#171b2c'],
  wick: ['#3a4258', '#12151f'],
  drifter: ['#e2c39a', '#a06b3c'],
  ice: ['#c8f3ff', '#5fbfe0'],
  seven: ['#cdd5ff', '#6f7ad6'],
}

// Per-type extra SVG drawn on top of the base body.
function Accent({ id, dark }) {
  const stroke = dark ? '#0c0f1a' : '#1b2036'
  switch (id) {
    case 'fire':
      return (
        <path d="M50 8c6 6 9 10 9 16a9 9 0 0 1-18 0c0-4 4-9 9-16z" fill="#ffd23f" stroke={stroke} strokeWidth="2" />
      )
    case 'water':
      return <path d="M50 10c5 7 8 11 8 16a8 8 0 0 1-16 0c0-5 3-9 8-16z" fill="#cdeaff" opacity="0.9" />
    case 'demon':
      return (
        <g fill="#c01d3a" stroke={stroke} strokeWidth="2">
          <path d="M30 28c-4-8-9-11-12-12 2 6 3 12 8 16z" />
          <path d="M70 28c4-8 9-11 12-12-2 6-3 12-8 16z" />
        </g>
      )
    case 'king':
    case 'boss':
      return (
        <path d="M30 24l8 8 12-12 12 12 8-8v10H30z" fill="#ffd23f" stroke={stroke} strokeWidth="2" />
      )
    case 'punk':
      return (
        <g fill="#ff2e88" stroke={stroke} strokeWidth="2">
          <path d="M44 22l-3-14 8 10z" />
          <path d="M52 20l4-15 3 14z" />
          <path d="M60 24l8-11 0 12z" />
        </g>
      )
    case 'aura':
      return <ellipse cx="50" cy="16" rx="20" ry="6" fill="none" stroke="#6effc0" strokeWidth="3" opacity="0.9" />
    case 'grim':
    case 'wick':
      return <path d="M28 40c0-16 10-26 22-26s22 10 22 26c-8-6-14-8-22-8s-14 2-22 8z" fill={stroke} opacity="0.55" />
    case 'duck':
      return <path d="M64 56c10 0 16 4 16 8s-7 6-16 5z" fill="#ff9d2e" stroke={stroke} strokeWidth="2" />
    case 'fishy':
      return <path d="M16 54c-8-6-10-2-10 6s2 12 10 6z" fill="#1f8fae" stroke={stroke} strokeWidth="2" />
    case 'zeropoint':
      return (
        <g fill="#bfefff">
          <circle cx="20" cy="34" r="3" />
          <circle cx="82" cy="44" r="3" />
          <circle cx="74" cy="20" r="2.5" />
        </g>
      )
    case 'seven':
      return <text x="50" y="58" textAnchor="middle" fontSize="34" fontWeight="900" fill="#fff" opacity="0.9">7</text>
    case 'striker':
      return <path d="M54 18l-14 22h10l-6 18 20-26H52z" fill="#fff36b" stroke={stroke} strokeWidth="1.5" />
    default:
      return null
  }
}

export default function SpriteArt({ sprite, className = '' }) {
  if (sprite.image) {
    return (
      <img
        src={sprite.image}
        alt={sprite.typeName}
        loading="lazy"
        className={`h-full w-full object-contain ${className}`}
      />
    )
  }

  const [c1, c2] = COLORS[sprite.typeId] || ['#5b6bff', '#2b3147']
  const gid = `g-${sprite.id}`
  const dark = ['grim', 'wick'].includes(sprite.typeId)
  const eye = dark ? '#ff5d6c' : '#1b2036'

  return (
    <svg viewBox="0 0 100 100" className={`h-[78%] w-[78%] ${className}`} role="img" aria-label={sprite.typeName}>
      <defs>
        <radialGradient id={gid} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      {/* Body */}
      <path
        d="M50 22c18 0 30 14 30 32 0 14-9 24-30 24S20 68 20 54c0-18 12-32 30-32z"
        fill={`url(#${gid})`}
        stroke="rgba(0,0,0,.35)"
        strokeWidth="2"
      />
      <Accent id={sprite.typeId} dark={dark} />
      {/* Eyes */}
      <g>
        <ellipse cx="40" cy="52" rx="6.5" ry="8" fill="#fff" />
        <ellipse cx="60" cy="52" rx="6.5" ry="8" fill="#fff" />
        <circle cx="41" cy="54" r="3.2" fill={eye} />
        <circle cx="61" cy="54" r="3.2" fill={eye} />
      </g>
      {/* Cheek shine */}
      <ellipse cx="33" cy="64" rx="4" ry="2.5" fill="#fff" opacity="0.25" />
      <ellipse cx="67" cy="64" rx="4" ry="2.5" fill="#fff" opacity="0.25" />
    </svg>
  )
}
