// Cute, modern sprite art that mirrors the real collectibles: a chunky rounded
// kawaii body, per-type features for identifiability (beak, horns, crown, fins…),
// and — crucially — the per-VARIANT treatment applied to the sprite itself
// (Gold = metallic, Gummy = glossy jelly, Galaxy = starfield, Gem = crystal,
// Holofoil = iridescent, Cube = purple grid, Quack = duck-gold).
//
// A real image (public/sprites/<id>.png|webp) overrides the vector art.

const INK = '#1a2138'

// Per-type NORMAL palette [light, base, shadow] + natural feature color.
const TYPES = {
  water: { c: ['#bfe4ff', '#3aa0ff', '#1b62c8'], feat: '#dff1ff' },
  earth: { c: ['#c8eaa0', '#79c150', '#4a7a32'], feat: '#5fae3f' },
  fire: { c: ['#ffd76b', '#ff7a2f', '#d62f12'], feat: '#ffd23f' },
  duck: { c: ['#fff0a8', '#ffd23f', '#e0962a'], feat: '#ff9d2e' },
  ghost: { c: ['#ffffff', '#dbe4ff', '#a6b2dd'], feat: '#aab6e6' },
  dream: { c: ['#e2c4ff', '#b07bff', '#6f3fd6'], feat: '#ffffff' },
  demon: { c: ['#ff9aa6', '#ff5566', '#b01030'], feat: '#a8102e' },
  punk: { c: ['#ffb0dc', '#ff5db0', '#a01d7a'], feat: '#ff2e88' },
  king: { c: ['#ffe9a8', '#ffcf4d', '#cf9a20'], feat: '#ffcf4d' },
  zeropoint: { c: ['#bff2ff', '#46c8ff', '#5b6bff'], feat: '#eafcff' },
  peanut: { c: ['#e8c690', '#c98a4a', '#6f4521'], feat: '#6f4521' },
  striker: { c: ['#fff7b0', '#ffe14d', '#e0a81f'], feat: '#fff7b0' },
  fishy: { c: ['#bdf2f7', '#46d0e0', '#1f8fae'], feat: '#1f8fae' },
  aura: { c: ['#d6ffee', '#6effc0', '#2bb585'], feat: '#6effc0' },
  boss: { c: ['#eef1f7', '#c2c9da', '#6b7488'], feat: INK },
  grim: { c: ['#5a6488', '#39405c', '#171c2e'], feat: '#46e0c0' },
  wick: { c: ['#5a627a', '#3a4258', '#14171f'], feat: '#c01030' },
  drifter: { c: ['#f2e0bd', '#e0bd8a', '#a06b3c'], feat: '#a06b3c' },
  ice: { c: ['#e6f9ff', '#a6e8ff', '#5fbfe0'], feat: '#ffffff' },
  seven: { c: ['#dfe4ff', '#8a97ff', '#5b6bff'], feat: '#ffffff' },
}

const BODY =
  'M50 12 C32 12 23 22 23 42 L23 62 C23 80 35 90 50 90 C65 90 77 80 77 62 L77 42 C77 22 68 12 50 12 Z'

// Treatment per variant. Returns gradient stops, a feature color, and an
// overlay (already clipped to the body) for material flair.
function treatment(themeId, type, gid, hgid) {
  const [l, b, s] = type.c
  switch (themeId) {
    case 'gold':
      return { stops: ['#fff3b0', '#f4c537', '#9a6a12'], feat: '#8a5e10', gloss: true,
        overlay: <path d="M26 18 L40 18 L72 88 L58 88 Z" fill="#fff" opacity="0.28" /> }
    case 'gummy':
      return { stops: [l, b, s], feat: s, gummy: true, gloss: true,
        overlay: <ellipse cx="42" cy="40" rx="16" ry="11" fill="#fff" opacity="0.4" /> }
    case 'galaxy':
      return { stops: ['#5a3fb0', '#281a5e', '#0b0820'], feat: '#9a86ff',
        overlay: <Stars /> }
    case 'gem':
      return { stops: ['#bdfff4', '#2ad8c4', '#0b6c8c'], feat: '#0b6c8c',
        overlay: <g opacity="0.5"><path d="M40 22 L58 30 L46 52 L34 40 Z" fill="#fff" /><path d="M60 50 L72 58 L60 78 L54 62 Z" fill="#fff" opacity="0.6" /></g> }
    case 'holofoil':
      return { stops: ['#ffe0f4', '#cdbcff', '#8ad8ff'], feat: '#b070ff',
        overlay: <rect x="0" y="0" width="100" height="100" fill={`url(#${hgid})`} opacity="0.55" /> }
    case 'cube':
      return { stops: ['#c98aff', '#8a2be2', '#3a0a6b'], feat: '#2a0a55',
        overlay: <g stroke="#fff" strokeWidth="1.2" opacity="0.22"><path d="M23 50 H77 M50 14 V90 M30 30 L70 70 M70 30 L30 70" /></g> }
    case 'quack':
      return { stops: ['#fff0a8', '#ffd23f', '#e0962a'], feat: '#e0962a',
        overlay: <ellipse cx="42" cy="40" rx="14" ry="9" fill="#fff" opacity="0.35" /> }
    default: // normal
      return { stops: [l, b, s], feat: type.feat, overlay: null }
  }
}

function Stars() {
  const pts = [[32, 32], [60, 28], [44, 50], [66, 58], [36, 66], [58, 74], [28, 50], [70, 40]]
  return (
    <g fill="#fff">
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} opacity={0.9} />
      ))}
      <ellipse cx="44" cy="46" rx="20" ry="14" fill="#7b61ff" opacity="0.25" />
    </g>
  )
}

function Eyes({ y = 54, gap = 12, r = 8, glow }) {
  const pupil = glow || INK
  return (
    <g>
      <ellipse cx={50 - gap} cy={y} rx={r} ry={r + 2} fill={glow ? '#0c1020' : '#fff'} />
      <ellipse cx={50 + gap} cy={y} rx={r} ry={r + 2} fill={glow ? '#0c1020' : '#fff'} />
      <circle cx={50 - gap + 1.5} cy={y + 1.5} r={r * 0.5} fill={pupil} />
      <circle cx={50 + gap + 1.5} cy={y + 1.5} r={r * 0.5} fill={pupil} />
      {!glow && <>
        <circle cx={50 - gap - 1.5} cy={y - 2.5} r="1.8" fill="#fff" />
        <circle cx={50 + gap - 1.5} cy={y - 2.5} r="1.8" fill="#fff" />
      </>}
    </g>
  )
}

function Blush({ y = 62 }) {
  return (
    <g fill="#ff8aa6" opacity="0.45">
      <ellipse cx="32" cy={y} rx="4.5" ry="3" />
      <ellipse cx="68" cy={y} rx="4.5" ry="3" />
    </g>
  )
}

function Smile({ y = 68, w = 6 }) {
  return <path d={`M${50 - w} ${y} q${w} ${w} ${w * 2} 0`} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
}

// Per-type features drawn on top. `fc` = feature color (treatment-aware),
// `gid` lets body-colored extensions (fins, tails) match the treatment.
function Features({ id, fc, gid }) {
  const bodyFill = `url(#${gid})`
  const st = { fill: fc, stroke: 'rgba(0,0,0,.25)', strokeWidth: 1.5, strokeLinejoin: 'round' }
  switch (id) {
    case 'fire':
      return <path d="M44 16 L48 4 L52 14 L56 6 L58 18 Z" {...st} />
    case 'water':
      return <path d="M50 30 c4 6 6 9 6 12 a6 6 0 0 1-12 0 c0-3 2-6 6-12 Z" fill={fc} opacity="0.8" />
    case 'earth':
      return <path d="M50 14 c-1-6 4-10 9-10 -1 6-4 9-9 10 Z" {...st} />
    case 'duck':
      return <><path d="M74 50 l13-3 v11 l-13-2 Z" {...st} /><path d="M44 16 q6-6 9 0" fill="none" stroke={fc} strokeWidth="3" strokeLinecap="round" /></>
    case 'demon':
      return <><path d="M30 24 L24 8 L40 20 Z" {...st} /><path d="M70 24 L76 8 L60 20 Z" {...st} /><path d="M44 70 h12 l-3 5 -3-4 -3 4 Z" fill="#fff" /></>
    case 'punk':
      return <path d="M42 16 L45 2 L48 16 M50 16 L53 0 L56 16 M58 17 L62 4 L64 17" {...st} fill="none" stroke={fc} strokeWidth="4" strokeLinecap="round" />
    case 'king':
      return <><path d="M32 22 L36 8 L44 16 L50 4 L56 16 L64 8 L68 22 Z" {...st} /><circle cx="50" cy="13" r="2" fill="#ff5566" /></>
    case 'boss':
      return <><rect x="33" y="48" width="34" height="10" rx="5" fill={INK} /><path d="M50 72 l-7-4 7-3 7 3 Z" fill={INK} /></>
    case 'wick':
      return <><path d="M50 60 l4 6 -3 14 h-2 l-3-14 Z" fill="#c01030" /><path d="M42 58 l8 4 8-4" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" /></>
    case 'grim':
      return <path d="M23 44 C23 22 34 12 50 12 C66 12 77 22 77 44 C70 36 62 33 50 33 C38 33 30 36 23 44 Z" fill="rgba(0,0,0,.45)" />
    case 'fishy':
      return <><path d="M23 54 L9 44 l4 10 -4 10 Z" fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.5" strokeLinejoin="round" /><path d="M50 14 q10-6 16-2 -6 2 -6 8 Z" fill={bodyFill} stroke="rgba(0,0,0,.2)" strokeWidth="1.2" /></>
    case 'aura':
      return <><ellipse cx="50" cy="14" rx="16" ry="4.5" fill="none" stroke={fc} strokeWidth="3" /><g fill="#fff" opacity="0.9"><path d="M22 36 l1.4 3.6 3.6 1.4 -3.6 1.4 L22 46 l-1.4-3.6 -3.6-1.4 3.6-1.4 Z" /><path d="M80 44 l1 2.6 2.6 1 -2.6 1 L80 52 l-1-2.6 -2.6-1 2.6-1 Z" /></g></>
    case 'zeropoint':
      return <path d="M50 30 L62 46 L50 62 L38 46 Z" fill="#fff" opacity="0.55" />
    case 'peanut':
      return <g stroke={fc} strokeWidth="1.6" opacity="0.5" fill="none"><path d="M40 40 h20 M41 50 h18 M42 60 h16" /></g>
    case 'striker':
      return <path d="M55 26 L40 52 h9 l-4 18 18-26 h-9 Z" {...st} />
    case 'ice':
      return <g stroke={fc} strokeWidth="3" strokeLinecap="round"><path d="M42 16 l4-8 M50 14 l0-9 M58 16 l-4-8" /></g>
    case 'seven':
      return <text x="50" y="64" textAnchor="middle" fontSize="30" fontWeight="900" fill={fc} opacity="0.9" fontFamily="Inter, sans-serif">7</text>
    case 'dream':
      return <><path d="M58 30 a11 11 0 1 0 0.5 21 9 9 0 1 1-0.5-21 Z" fill="#fff" opacity="0.85" /><path d="M40 28 l1.5 4 4 1.5 -4 1.5 L40 41 l-1.5-4 -4-1.5 4-1.5 Z" fill="#fff" opacity="0.8" /></>
    default:
      return null
  }
}

export default function SpriteArt({ sprite, className = '' }) {
  if (sprite.image) {
    return <img src={sprite.image} alt={sprite.typeName} loading="lazy" className={`h-full w-full object-contain ${className}`} />
  }
  const type = TYPES[sprite.typeId] || { c: ['#aab4ff', '#5b6bff', '#2b3147'], feat: '#fff' }
  const uid = sprite.id.replace(/[^a-z0-9]/gi, '')
  const gid = `g-${uid}`, cid = `c-${uid}`, hgid = `h-${uid}`
  const tr = treatment(sprite.themeId, type, gid, hgid)
  const isBoss = sprite.typeId === 'boss'
  const glow = sprite.typeId === 'grim' ? type.feat : sprite.themeId === 'galaxy' ? '#bdbcff' : null

  return (
    <svg viewBox="0 0 100 100" className={`h-[90%] w-[90%] ${className}`} role="img" aria-label={sprite.typeName}>
      <defs>
        <radialGradient id={gid} cx="38%" cy="30%" r="85%">
          <stop offset="0%" stopColor={tr.stops[0]} />
          <stop offset="52%" stopColor={tr.stops[1]} />
          <stop offset="100%" stopColor={tr.stops[2]} />
        </radialGradient>
        {sprite.themeId === 'holofoil' && (
          <linearGradient id={hgid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff5db0" />
            <stop offset="25%" stopColor="#ffd23f" />
            <stop offset="50%" stopColor="#46e0c0" />
            <stop offset="75%" stopColor="#46c8ff" />
            <stop offset="100%" stopColor="#b070ff" />
          </linearGradient>
        )}
        <clipPath id={cid}><path d={BODY} /></clipPath>
      </defs>

      <ellipse cx="50" cy="92" rx="22" ry="4.5" fill="#000" opacity="0.18" />

      {/* grim's hood sits behind the body */}
      {sprite.typeId === 'grim' && <Features id="grim" fc={tr.feat} gid={gid} />}

      <path d={BODY} fill={`url(#${gid})`} stroke="rgba(0,0,0,.3)" strokeWidth="2.2" strokeLinejoin="round" />
      <g clipPath={`url(#${cid})`}>{tr.overlay}</g>

      {sprite.typeId !== 'grim' && <Features id={sprite.typeId} fc={tr.feat} gid={gid} />}

      {/* Boss wears sunglasses (drawn in Features) instead of eyes */}
      {!isBoss && (
        <>
          <Eyes glow={glow} />
          <Blush />
          <Smile />
        </>
      )}
    </svg>
  )
}
