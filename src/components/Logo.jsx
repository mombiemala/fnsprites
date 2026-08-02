// Self-contained "mombie" sprite logomark — the maker's persona: the app's own
// kawaii Sprite (domed body, kawaii face) given a messy top-bun + bow and a
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
      <path d="M34 34 C31 30 31 25 34 22 M66 34 C69 30 69 25 66 22" stroke="#7c5a4c" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Sprite silhouette — the app's own kawaii body shape (domed capsule with
          two little feet), matched to SpriteArt.jsx's BODY path. */}
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
      {/* Bow at the base of the bun */}
      <path d="M50 26 L41 21 L41 31 Z" fill="#b45cff" />
      <path d="M50 26 L59 21 L59 31 Z" fill="#b45cff" />
      <circle cx="50" cy="26" r="2.6" fill="#8a3fd4" />
      {/* Kawaii face — tired-but-happy (a little under-eye) */}
      <ellipse cx="40" cy="52" rx="6.6" ry="8.6" fill="#fff" />
      <ellipse cx="60" cy="52" rx="6.6" ry="8.6" fill="#fff" />
      <circle cx="41" cy="53.5" r="3.4" fill="#241533" />
      <circle cx="61" cy="53.5" r="3.4" fill="#241533" />
      <circle cx="39" cy="50.4" r="1.5" fill="#fff" />
      <circle cx="59" cy="50.4" r="1.5" fill="#fff" />
      <path d="M35 61 Q40 63 45 61 M55 61 Q60 63 65 61" stroke="#8a6a55" strokeWidth="1.2" fill="none" opacity=".5" />
      <ellipse cx="30" cy="63" rx="4.3" ry="2.6" fill="#ff8a7a" opacity=".5" />
      <ellipse cx="70" cy="63" rx="4.3" ry="2.6" fill="#ff8a7a" opacity=".5" />
      <path d="M42 67 Q50 74 58 67" stroke="#241533" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}
