// Cute, modern sprite art that mirrors the real collectibles: a chunky rounded
// kawaii body, per-type features for identifiability (beak, horns, crown, fins…),
// and — crucially — the per-VARIANT treatment applied to the sprite itself
// (Gold = metallic, Gummy = glossy jelly, Galaxy = starfield, Gem = crystal,
// Holofoil = iridescent, Cube = purple grid, Quack = duck-gold).
//
// A real image (public/sprites/<id>.png|webp) overrides the vector art.

import { useState } from 'react'

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
  seven: { c: ['#dfe4ff', '#8a97ff', '#5b6bff'], feat: '#ffffff' },
  air: { c: ['#f2fbff', '#c4e8ff', '#87c3ec'], feat: '#ffffff' },
  batman: { c: ['#4a5878', '#28324e', '#0d1220'], feat: '#f6c945' },
  peely: { c: ['#fff2b0', '#ffd23f', '#c98a1a'], feat: '#7a5220' },
  llama: { c: ['#bfe9ff', '#3ea0e0', '#1f5f9a'], feat: '#ff5db0' },
  ironmouse: { c: ['#ffd0e6', '#ff5d8f', '#b01050'], feat: '#a8102e' },
  // Chapter 7 Season 4 "Override" — leaked/upcoming. Original stylised looks
  // (colour + a simple motif that "reads as" the character), never a copy of the
  // real IP art or an AI likeness — same approach as Peely/Batman/Ironmouse.
  sonic: { c: ['#8fd3ff', '#2a6cf0', '#123a9e'], feat: '#ffffff' },
  tails: { c: ['#ffd9a0', '#ff9a3c', '#c85e12'], feat: '#fff2df' },
  jazz: { c: ['#bff0c0', '#43c463', '#1f7a3a'], feat: '#ffffff' },
  klombo: { c: ['#ffc7ea', '#c86bd0', '#7a2e8a'], feat: '#ffe14d' },
  bushranger: { c: ['#cfeaa0', '#7ab54a', '#3f6f28'], feat: '#8a5a2a' },
  killswitch: { c: ['#8a94a8', '#3a4358', '#171c2a'], feat: '#ff3b3b' },
  victorycrown: { c: ['#ffe9a8', '#ffcf4d', '#cf9a20'], feat: '#ff5566' },
  adventurer: { c: ['#e8cfa0', '#c8974a', '#7a5220'], feat: '#3aa0ff' },
  pond: { c: ['#bdf0c0', '#5ac86a', '#2b7a3a'], feat: '#ffffff' },
  onigiri: { c: ['#ffffff', '#eef1f6', '#c2c8d4'], feat: '#2a2f3a' },
  honey: { c: ['#ffe6a0', '#f5b81f', '#b8801c'], feat: '#7a5220' },
  dumpster: { c: ['#cfd6e0', '#8b93a7', '#4a5265'], feat: '#1a2138' },
  xray: { c: ['#d0faff', '#46d0e0', '#1f8fae'], feat: '#ffffff' },
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
    case 'seven':
      // Stylized "7" agent emblem on a subtle chest plate.
      return <><rect x="37" y="45" width="26" height="26" rx="7" fill="#ffffff" opacity="0.12" /><text x="50" y="67" textAnchor="middle" fontSize="27" fontWeight="900" fill={fc} opacity="0.95" fontFamily="Inter, sans-serif">7</text><path d="M43 58 h11" stroke={fc} strokeWidth="2.6" strokeLinecap="round" opacity="0.95" /></>
    case 'air':
      return <g fill="none" stroke={fc} strokeWidth="3.2" strokeLinecap="round" opacity="0.92"><path d="M32 43 h19 a5 5 0 1 0-5-5" /><path d="M30 55 h25 a5.5 5.5 0 1 1-5.5 5.5" /><path d="M34 67 h13 a4 4 0 1 0-4-4" /></g>
    case 'batman':
      // Cowl over the upper face (with pointed ears + white eye-slits) and a
      // gold bat chest emblem — reads as Batman while keeping the kawaii mouth.
      return <g>
        <path d="M34 16 L38 2 L45 18 Z" fill={INK} stroke="rgba(0,0,0,.35)" strokeWidth="1" strokeLinejoin="round" />
        <path d="M66 16 L62 2 L55 18 Z" fill={INK} stroke="rgba(0,0,0,.35)" strokeWidth="1" strokeLinejoin="round" />
        <path d="M23 40 C23 20 34 12 50 12 C66 12 77 20 77 40 L77 45 C69 44 62 44 58 47 L53 54 L50 47 L47 54 L42 47 C38 44 31 44 23 45 Z" fill={INK} />
        <path d="M35 45 L45 43 L44 50 L36 49 Z" fill="#e6ecff" />
        <path d="M65 45 L55 43 L56 50 L64 49 Z" fill="#e6ecff" />
        <ellipse cx="50" cy="73" rx="10" ry="5.5" fill={fc} />
        <path d="M50 70 C48.5 68.5 46 69 45 71 C44 69.5 42 70 42.5 72 L45 72 L46.5 74.5 L50 72 L53.5 74.5 L55 72 L57.5 72 C58 70 56 69.5 55 71 C54 69 51.5 68.5 50 70 Z" fill={INK} />
      </g>
    case 'peely':
      // Peely the banana: a little brown stem cap up top + two soft banana ridges
      // curving down the body — reads as a banana without copying Epic's art.
      return <g>
        <path d="M44 13 C42 5 47 1 53 1 C57 1 59 5 57 9 C55 6 52 6 51 9 C50 11 51 12 51 13 Z" fill="#5a3a16" stroke="rgba(0,0,0,.25)" strokeWidth="1" strokeLinejoin="round" />
        <g stroke={fc} strokeWidth="1.6" opacity="0.3" fill="none" strokeLinecap="round">
          <path d="M37 30 Q34 55 41 79" />
          <path d="M63 30 Q66 55 59 79" />
        </g>
      </g>
    case 'llama':
      // Loot-llama piñata: two upright ears (treatment-matched) + a bright snout.
      return <g>
        <path d="M32 20 L28 3 L41 15 Z" fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M68 20 L72 3 L59 15 Z" fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="50" cy="72" rx="8" ry="5.5" fill={fc} />
        <path d="M50 68 v6 M46 72 h8" stroke="#fff" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
      </g>
    case 'ironmouse':
      // Demon-queen motif: two little curved horns + a heart mark. Original
      // stylised iconography — never an AI likeness of the real performer.
      return <g>
        <path d="M34 16 C29 8 30 3 33 2 C34 7 37 11 41 14 Z" fill={fc} stroke="rgba(0,0,0,.25)" strokeWidth="1" strokeLinejoin="round" />
        <path d="M66 16 C71 8 70 3 67 2 C66 7 63 11 59 14 Z" fill={fc} stroke="rgba(0,0,0,.25)" strokeWidth="1" strokeLinejoin="round" />
        <path d="M50 76 c-3-4-9-3-9 2 0 4 6 7 9 10 3-3 9-6 9-10 0-5-6-6-9-2 Z" fill={fc} opacity="0.85" />
      </g>
    case 'dream':
      return <><path d="M58 30 a11 11 0 1 0 0.5 21 9 9 0 1 1-0.5-21 Z" fill="#fff" opacity="0.85" /><path d="M40 28 l1.5 4 4 1.5 -4 1.5 L40 41 l-1.5-4 -4-1.5 4-1.5 Z" fill="#fff" opacity="0.8" /></>

    // ---- Season 4 "Override" leaked Sprites — stylised motifs, not IP copies ----
    case 'sonic':
      // Swept-back "hedgehog" quills + a red sneaker hint.
      return <><g fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.4" strokeLinejoin="round"><path d="M58 18 L86 6 L64 30 Z" /><path d="M60 30 L90 26 L66 44 Z" /><path d="M40 15 L26 4 L48 16 Z" /></g><ellipse cx="42" cy="87" rx="9" ry="3.6" fill="#e63b2e" /></>
    case 'tails':
      // Two curly tails + fox ears.
      return <><g fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.3" strokeLinejoin="round"><path d="M72 58 q20 2 22 -10 q-6 12 -18 4 Z" /><path d="M74 66 q18 8 16 -6 q-4 10 -14 0 Z" /></g><path d="M34 17 L30 3 L43 15 Z" {...st} /><path d="M66 17 L70 3 L57 15 Z" {...st} /></>
    case 'jazz':
      // Tall jackrabbit ears.
      return <g fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.4" strokeLinejoin="round"><path d="M40 16 C36 2 41 -4 45 -2 C44 6 44 12 46 16 Z" /><path d="M60 16 C64 2 59 -4 55 -2 C56 6 56 12 54 16 Z" /></g>
    case 'klombo':
      // Chunky head spikes + big friendly nostrils.
      return <><g fill={fc} stroke="rgba(0,0,0,.25)" strokeWidth="1.2" strokeLinejoin="round"><path d="M38 14 l5-9 5 9 Z" /><path d="M52 14 l5-9 5 9 Z" /></g><g fill={INK} opacity="0.55"><ellipse cx="44" cy="46" rx="2.4" ry="3.2" /><ellipse cx="56" cy="46" rx="2.4" ry="3.2" /></g></>
    case 'bushranger':
      // A little leaf sprout.
      return <g fill={fc} stroke="rgba(0,0,0,.2)" strokeWidth="1" strokeLinejoin="round"><path d="M50 16 C50 6 42 2 36 4 C40 12 44 15 50 16 Z" /><path d="M50 16 C50 6 58 2 64 4 C60 12 56 15 50 16 Z" /></g>
    case 'killswitch':
      // A power / kill-switch emblem.
      return <g fill="none" stroke={fc} strokeWidth="3" strokeLinecap="round"><circle cx="50" cy="52" r="10" opacity="0.9" /><path d="M50 42 v9" /></g>
    case 'victorycrown':
      // The Victory Crown — a bold royale crown with a gem.
      return <><path d="M30 22 L34 6 L42 16 L50 2 L58 16 L66 6 L70 22 Z" {...st} /><circle cx="50" cy="12" r="2.4" fill="#ff5566" /><rect x="30" y="22" width="40" height="4" rx="2" fill={fc} /></>
    case 'adventurer':
      // An explorer's hat brim.
      return <g fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.4" strokeLinejoin="round"><ellipse cx="50" cy="24" rx="30" ry="6" /><path d="M38 24 C38 12 62 12 62 24 Z" /></g>
    case 'pond':
      // Frog eye-bumps on top (egg → tadpole → frog).
      return <g><circle cx="40" cy="20" r="8" fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.5" /><circle cx="60" cy="20" r="8" fill={bodyFill} stroke="rgba(0,0,0,.25)" strokeWidth="1.5" /><circle cx="40" cy="20" r="3.4" fill={INK} /><circle cx="60" cy="20" r="3.4" fill={INK} /></g>
    case 'onigiri':
      // Rice ball: a dark nori (seaweed) band wrapping the base + a little
      // salmon-pink umeboshi dot. Reads as onigiri while keeping the kawaii face.
      return <><path d="M26 72 q24 9 48 0 l0 4 q-4 12 -24 12 q-20 0 -24 -12 Z" fill={fc} /><ellipse cx="50" cy="30" rx="3.4" ry="3" fill="#ff8080" opacity="0.85" /></>
    case 'honey':
      // A honeycomb cluster.
      return <g fill="none" stroke={fc} strokeWidth="2" opacity="0.6"><path d="M46 40 l6 0 3 5 -3 5 -6 0 -3-5 Z" /><path d="M55 45 l6 0 3 5 -3 5 -6 0 -3-5 Z" /><path d="M46 50 l6 0 3 5 -3 5 -6 0 -3-5 Z" /></g>
    case 'dumpster':
      // Raccoon eye-mask band + rounded ears.
      return <><path d="M32 20 L30 8 L42 16 Z" {...st} /><path d="M68 20 L70 8 L58 16 Z" {...st} /><path d="M31 52 q19 -7 38 0 l0 6 q-19 -6 -38 0 Z" fill={INK} opacity="0.55" /></>
    case 'xray':
      // Ribcage scan lines.
      return <g stroke={fc} strokeWidth="2" opacity="0.7" fill="none" strokeLinecap="round"><path d="M50 40 v26" /><path d="M40 46 h20 M38 54 h24 M40 62 h20" /></g>

    default:
      return null
  }
}

export default function SpriteArt({ sprite, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (sprite.image && !imgFailed) {
    return (
      <img
        src={sprite.image}
        alt={sprite.typeName}
        loading="lazy"
        onError={() => setImgFailed(true)}
        className={`h-[94%] w-[94%] object-contain ${className}`}
      />
    )
  }
  const type = TYPES[sprite.typeId] || { c: ['#aab4ff', '#5b6bff', '#2b3147'], feat: '#fff' }
  const uid = sprite.id.replace(/[^a-z0-9]/gi, '')
  const gid = `g-${uid}`, cid = `c-${uid}`, hgid = `h-${uid}`
  const tr = treatment(sprite.themeId, type, gid, hgid)
  const isBoss = sprite.typeId === 'boss'
  const maskFace = sprite.typeId === 'batman'
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

      {/* Boss wears sunglasses & Batman wears a cowl (drawn in Features) instead
          of the default eyes; Batman keeps the kawaii mouth + blush. */}
      {!isBoss && (
        <>
          {!maskFace && <Eyes glow={glow} />}
          <Blush />
          <Smile />
        </>
      )}
    </svg>
  )
}
