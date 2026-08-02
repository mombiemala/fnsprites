// Self-contained logomark — a holographic collectible card with a kawaii Sprite
// face and a foil sparkle, in the warm brand gradient (gold → violet). Pure SVG
// so it renders pixel-identical in the app header, the static sprite pages
// (mirrored in scripts/prerender.mjs), the favicon (public/favicon.svg) and OG
// cards — no web-font dependency. Pair it with the `font-display` (Luckiest Guy)
// "FN Sprite Tracker" wordmark.
export function SpriteMark({ className = '', title }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title || 'FN Sprite Tracker'} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flm-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc93c" />
          <stop offset="1" stopColor="#b45cff" />
        </linearGradient>
        <linearGradient id="flm-foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Tilted collectible card: gradient foil edge + dark inner panel with a sheen */}
      <g transform="rotate(-8 50 50)">
        <rect x="24" y="12" width="52" height="76" rx="13" fill="url(#flm-edge)" />
        <rect x="29" y="17" width="42" height="66" rx="8.5" fill="#191420" />
        <rect x="29" y="17" width="42" height="66" rx="8.5" fill="url(#flm-foil)" />
        {/* Kawaii sprite face */}
        <circle cx="43.5" cy="45" r="5.6" fill="#ffc93c" />
        <circle cx="45.2" cy="43.3" r="1.9" fill="#241533" />
        <circle cx="58.5" cy="45" r="5.6" fill="#ffc93c" />
        <circle cx="60.2" cy="43.3" r="1.9" fill="#241533" />
        <path d="M44 57 Q51 64 58 57" stroke="#ffc93c" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
      {/* Foil sparkle */}
      <path d="M74 16 l2.8 6.6 6.6 2.8 -6.6 2.8 -2.8 6.6 -2.8-6.6 -6.6-2.8 6.6-2.8 z" fill="#fff4e0" />
    </svg>
  )
}
