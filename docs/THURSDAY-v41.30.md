# v41.30 New Sprite Day — Thursday, Jul 30, 2026 (prep checklist)

Live at **4 AM PT / 7 AM ET**; new Sprites appear after the weekly reset **~9 AM ET**.
Everything below is **datamined/leaked** until Epic's patch notes — confirm rarity,
drop rate, ability and art before flipping `released`.

## 0. What auto-happens vs what needs a deploy
- **Client date-gate**: any unreleased type with `releaseDate <= today` flips to
  "released" in the browser automatically (see `applyDateGate` in `sprites.js`).
  So **Spider-Man** and **John Wick** show up in the app on their own tomorrow.
- **Does NOT auto-happen**: the static SEO pages (`/sprites`, `/sprite/*`), the
  header tagline, `RELEASED_COUNT`, and any brand-new base Sprite or variant flip.
  Those need a **rebuild + deploy** (`git push fnsprites sprite-tracker:main`).

## 1. New base Sprites — add to `src/data/sprites.js`
Add art first: `public/sprites/<id>_normal.png` (512×512, transparent), plus any
variant PNGs. Then add the type objects (TODO = confirm from patch notes):

```js
{ id: 'peely', name: 'Peely', icon: '🍌', rarity: 'TODO', dropRate: 'TODO', released: false, rumored: true, releaseDate: '2026-07-30',
  ability: 'Chance to upgrade weapons you pull from ammo boxes.', // leaked
  variants: { normal: U, gold: U, gummy: U, galaxy: U, holofoil: U, gem: U, cube: U } },
{ id: 'llama', name: 'Loot Llama', icon: '🦙', rarity: 'TODO', dropRate: 'TODO', released: false, rumored: true, releaseDate: '2026-07-30',
  ability: 'Pings nearby rare Sprites on the map.', // leaked
  variants: { normal: U, gold: U, gummy: U, galaxy: U, holofoil: U, gem: U, cube: U } },
```
(`releaseDate` lets the date-gate reveal them tomorrow even before you rebuild —
but they'll show placeholder art until the PNGs are in and you redeploy.)

## 2. "Quack Zero Point" = the Quack variant of the EXISTING Zero Point
Not a new base Sprite. In the `zeropoint` entry, flip `quack: U → R` (and add its
`zeropoint_quack.png`). Zero Point is leaked as the ONLY Sprite with the Quack
variant — keep `quack` off every other type.

## 3. Gem variant wave (the "10 new Sprites" = 3 above + 7 variants)
Flip `gem: U → R` on these (add a `gem` key + `<id>_gem.png` where missing):
- `water`, `earth`, `duck`, `demon`, `zeropoint` — flip `gem` to `R`.
- `aura` — **has no `gem` key yet**; add `gem: R` (this is the quest "Gem Aura").
- Quack Zero Point (`zeropoint.quack`) rounds out the 7 new variant forms.

## 4. Quest-earnable variants (Instagram leak, 10k Dust if already owned)
- **Cube Punk** (`punk.cube`) — already `R`. ✓
- **Galaxy Demon** (`demon.galaxy`) — already `R`. ✓
- **Holofoil Seven** (`seven.holofoil`) — already `R`. ✓
- **Gem Aura** (`aura.gem`) — the only new one; handled in §3.

## 5. Collabs (auto-release via date-gate, but need art + rebuild)
- **John Wick** (`wick`) — Mythic, Simpsons Reload exclusive. Needs `wick_normal.png`.
- **Spider-Man** (`spiderman`) — Legendary placeholder; confirm tier/ability + art.

## 6. Header marker / tagline
- `src/App.jsx` (~line 312): `accurate to the Jul 23, 2026 New Sprite Day (Cube variant, wave 1)`
  → update to **Jul 30 (v41.30)** and the new wave.
- `scripts/prerender.mjs` (the `.tagline` in `head()`): same string — keep in sync.

## 7. News / announcements
- `src/data/news.js`: retag the Jul 30 entries from `upcoming` → `sprites`/`update`,
  drop `tentative` once Epic confirms; move release-window entries as needed.
- `src/data/announcements.js`: flip the New Sprite Day bar to "live now".

## 8. Ship it
1. `npm run lint && npm run build` (both must pass)
2. Changelog: add a v41.30 entry to `src/data/changelog.js` + `CHANGELOG.md`.
3. Commit → `git push origin sprite-tracker`
4. **Deploy** → `git push fnsprites sprite-tracker:main` (Vercel auto-builds).

> `U` = unreleased, `R` = released (the shared flags at the top of `sprites.js`).
