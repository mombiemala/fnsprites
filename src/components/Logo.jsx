// Self-contained "mombie" sprite logomark — the maker's persona: the app's own
// kawaii Sprite (domed body, same shape as the John Wick sprite) given framing
// hair with soft bangs, big glossy puppy-dog eyes, a messy top-bun + bow and a
// steaming coffee ("like a zombie, but with kids"), in the warm brand gradient
// (gold → violet). Pure SVG so it renders pixel-identical in the app header, the
// static sprite pages (mirrored in scripts/prerender.mjs), the favicon
// (public/favicon.svg) and OG cards — no web-font dependency. Pair it with the
// `font-display` (Luckiest Guy) "FN Sprite Tracker" wordmark.
export function SpriteMark({ className = '', title }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title || 'FN Sprite Tracker'} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flm-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc93c" />
          <stop offset="1" stopColor="#b45cff" />
        </linearGradient>
      </defs>
      {/* Messy top-bun (sits behind the head) */}
      <path d="M36 30 C36 20 44 14 50 14 C56 14 64 20 64 30 Z" fill="#7c5a4c" />
      <circle cx="50" cy="15" r="10" fill="#7c5a4c" />
      <path d="M43 10 C46 6 54 6 57 10 M41 16 C44 11 50 10 52 14 M48 8 C52 9 55 12 56 16 M44 20 C47 15 53 15 57 19" stroke="#5f4436" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Sprite body — the app's own kawaii capsule (same shape as the John Wick
          sprite), matched to SpriteArt.jsx's BODY path. */}
      <path d="M50 30 C31 30 22 40 22 56 L22 66 C22 84 34 92 50 92 C66 92 78 84 78 66 L78 56 C78 40 69 30 50 30 Z" fill="url(#flm-edge)" />
      <ellipse cx="38" cy="91" rx="8" ry="5.5" fill="url(#flm-edge)" />
      <ellipse cx="62" cy="91" rx="8" ry="5.5" fill="url(#flm-edge)" />
      {/* Steaming coffee, held in a little arm ("but with kids") */}
      <path d="M23 66 C19 64 15 65 13 68" stroke="url(#flm-edge)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="6" y="60" width="15" height="13" rx="3" fill="#fff7ec" stroke="#241533" strokeWidth="1.8" />
      <ellipse cx="13.5" cy="61" rx="6.5" ry="2" fill="#5a3a22" />
      <path d="M21 63 q5 0 5 4 q0 4 -5 4" stroke="#241533" strokeWidth="1.8" fill="none" />
      <ellipse cx="13.5" cy="74" rx="10" ry="2.2" fill="#fff7ec" stroke="#241533" strokeWidth="1.4" />
      <path d="M10 57 q3 -3 0 -6 q-3 -3 0 -6 M17 57 q3 -3 0 -6 q-3 -3 0 -6" stroke="#cdbfe0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Hair — side locks framing the face, over the body sides */}
      <path d="M24 50 C21 60 23 69 28 74 C25 66 25 57 28 50 Z" fill="#7c5a4c" />
      <path d="M76 50 C79 60 77 69 72 74 C75 66 75 57 72 50 Z" fill="#7c5a4c" />
      {/* Hair cap + soft bangs across the forehead — reads more human */}
      <path d="M24 55 C22 37 32 26 50 26 C68 26 78 37 76 55 C71 46 64 43 60 45 C57 47 56 50 52 49 C50 48.5 49 46 46 45 C40 43 31 46 24 55 Z" fill="#7c5a4c" />
      <path d="M33 44 C37 40 42 39 46 42 M54 42 C58 39 63 40 67 44 M48 41 C50 40 52 40 53 42" stroke="#5f4436" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".7" />
      {/* Bow at the base of the bun */}
      <path d="M50 26 L41 21 L41 31 Z" fill="#b45cff" />
      <path d="M50 26 L59 21 L59 31 Z" fill="#b45cff" />
      <circle cx="50" cy="26" r="2.6" fill="#8a3fd4" />
      {/* Cute kawaii face — soft lashes, big glossy puppy-dog eyes, rosy cheeks,
          and a small open smile (a flat bar here reads as a moustache) */}
      <path d="M34.5 54 Q41 51 47 54 M53 54 Q59 51 65.5 54" stroke="#3a2740" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".5" />
      <ellipse cx="41" cy="58" rx="7" ry="7.9" fill="#fff" />
      <ellipse cx="59" cy="58" rx="7" ry="7.9" fill="#fff" />
      <circle cx="41.4" cy="59" r="4.7" fill="#3a2740" />
      <circle cx="59.4" cy="59" r="4.7" fill="#3a2740" />
      <circle cx="39.6" cy="56.6" r="2.1" fill="#fff" />
      <circle cx="57.6" cy="56.6" r="2.1" fill="#fff" />
      <circle cx="43.4" cy="61" r="1.1" fill="#fff" opacity=".85" />
      <circle cx="61.4" cy="61" r="1.1" fill="#fff" opacity=".85" />
      <ellipse cx="30" cy="66" rx="4.8" ry="3" fill="#ff8a7a" opacity=".6" />
      <ellipse cx="70" cy="66" rx="4.8" ry="3" fill="#ff8a7a" opacity=".6" />
      <path d="M46 71 C47.5 74.8 52.5 74.8 54 71 C52 73 48 73 46 71 Z" fill="#3a2740" />
      <path d="M49 72.3 Q50 73.8 51 72.3 Z" fill="#ff9d8a" />
    </svg>
  )
}
