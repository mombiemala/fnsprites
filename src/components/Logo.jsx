// Self-contained sprite logomark — a little Sprite (rounded body, antenna,
// kawaii face) in the brand gradient. Pure SVG so it renders pixel-identical in
// the app header, the static sprite pages (mirrored in scripts/prerender.mjs),
// the favicon, and OG cards — no web-font dependency. Pair it with the
// `font-display` (Luckiest Guy) "FN Sprite Tracker" wordmark.
export function SpriteMark({ className = '', title }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title || 'FN Sprite Tracker'} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="smg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#36c5ff" />
          <stop offset="1" stopColor="#7b61ff" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="84" height="84" rx="26" fill="url(#smg)" />
      <circle cx="50" cy="15" r="5" fill="#eafcff" />
      <rect x="48" y="15" width="4" height="10" fill="#eafcff" />
      <circle cx="38" cy="50" r="9" fill="#0c1330" />
      <circle cx="41" cy="47" r="3" fill="#fff" />
      <circle cx="66" cy="50" r="9" fill="#0c1330" />
      <circle cx="69" cy="47" r="3" fill="#fff" />
      <path d="M40 68 Q52 78 64 68" stroke="#0c1330" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
