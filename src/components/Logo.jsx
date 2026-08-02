// Self-contained sprite logomark — a little Sprite (rounded body, antenna,
// kawaii face) in the warm brand gradient (gold → violet). Pure SVG so it
// renders pixel-identical in the app header, the static sprite pages (mirrored
// in scripts/prerender.mjs), the favicon (public/favicon.svg) and OG cards — no
// web-font dependency. Pair it with the `font-display` (Luckiest Guy)
// "FN Sprite Tracker" wordmark.
export function SpriteMark({ className = '', title }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title || 'FN Sprite Tracker'} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flm-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc93c" />
          <stop offset="1" stopColor="#b45cff" />
        </linearGradient>
      </defs>
      {/* Sprite silhouette — the app's own kawaii body shape (domed capsule with
          two little feet), matched to SpriteArt.jsx's BODY path. */}
      <ellipse cx="38" cy="91" rx="8" ry="5.5" fill="url(#flm-edge)" />
      <ellipse cx="62" cy="91" rx="8" ry="5.5" fill="url(#flm-edge)" />
      <path d="M50 10 C31 10 21 21 21 42 L21 63 C21 82 34 92 50 92 C66 92 79 82 79 63 L79 42 C79 21 69 10 50 10 Z" fill="url(#flm-edge)" />
      {/* Kawaii face */}
      <ellipse cx="39" cy="49" rx="6.6" ry="8.6" fill="#fff" />
      <ellipse cx="61" cy="49" rx="6.6" ry="8.6" fill="#fff" />
      <circle cx="40.2" cy="50.5" r="3.4" fill="#241533" />
      <circle cx="62.2" cy="50.5" r="3.4" fill="#241533" />
      <circle cx="38.2" cy="47.4" r="1.5" fill="#fff" />
      <circle cx="60.2" cy="47.4" r="1.5" fill="#fff" />
      <path d="M41 64 Q50 73 59 64" stroke="#241533" strokeWidth="4.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
