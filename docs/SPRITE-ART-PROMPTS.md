# Generating real-style Sprite art (Gemini)

How to make the upcoming Sprites match the real 3D-render PNGs instead of the
procedural vector fallback.

## How the images load (no code needed)

`SpriteArt.jsx` renders `<img src="/sprites/<typeId>_<themeId>.png">` and only
falls back to the generated SVG if that file 404s. So **just drop a PNG into
`public/sprites/` with the right name and it replaces the vector art automatically.**

- **Format:** PNG, **320×320**, RGBA with a **transparent background** (matches
  every existing sprite). Generating at 512²/1024² and downscaling to 320² is fine.
- **Framing:** single character, front-facing, centred, same scale as the others
  (body fills ~80% of the frame), a soft contact shadow is OK, no text/watermark.

## Target style (match the existing renders)

> A cute chibi "companion" creature — a plump, rounded, slightly glossy body with
> big friendly eyes, soft studio lighting and gentle rim light, smooth 3D-rendered
> (Pixar/mobile-game collectible) look, vibrant but clean, centred on a fully
> transparent background. Consistent scale and head-to-body ratio.

Pull one existing file (e.g. `ghost_normal.png`, `seven_normal.png`) into Gemini
as a **style reference** so new art matches lighting/finish.

## Base prompts (the `normal` render)

- **Air** — `air_normal.png`
  > "…a breezy AIR sprite: a soft sky-blue and white cloud-like companion, wisps
  > of swirling wind curling around it, wispy cloud tufts, cheerful expression,
  > light and airy."
- **Seven** — already has `seven_normal.png` (skip; use it as the base for its
  variants).

## Variant reskins (image-to-image from the `normal` render)

Feed the sprite's `normal` PNG back in and reskin the material only — keep the
same pose/shape. Recipes mirror the in-app variant treatments:

| Variant | File suffix | Reskin |
|---|---|---|
| Gold | `_gold` | polished metallic gold plating, warm highlights |
| Gummy | `_gummy` | glossy translucent jelly/gummy candy, wet sheen |
| Galaxy | `_galaxy` | deep-space starfield, purple/blue nebula, tiny stars |
| Gem | `_gem` | faceted crystal/gemstone, teal, sharp reflections |
| Holofoil | `_holofoil` | iridescent rainbow foil sheen, prismatic |
| Cube | `_cube` | purple Zero-Point energy, faint glowing grid lines |
| Quack | `_quack` | glossy duck-gold, playful |

## Filename checklist

**Air** (8): `air_normal`, `air_gold`, `air_gummy`, `air_galaxy`, `air_gem`,
`air_holofoil`, `air_cube`, `air_quack`

**Seven** (7 — `seven_normal` already exists): `seven_gold`, `seven_gummy`,
`seven_galaxy`, `seven_gem`, `seven_holofoil`, `seven_cube`, `seven_quack`

**Suggested first pass:** just `air_normal.png` (+ one variant, e.g.
`air_gold.png`) to confirm the style matches before batching the rest.

## Batman — recommend holding on AI generation ⚠️

Batman is a **third-party (DC / Warner) copyrighted character**. The app's other
images are *official* sprite renders used for identification; AI-generating a new
Batman image is creating a derivative work, which is a different (riskier) IP
posture. Recommendation: keep the vector cowl version for now, and if you want a
real image later, use the **official** in-game render once it releases (dropped in
as `batman_<variant>.png`, same as any other identification image).

## Optional: let the script generate them

If you'd rather not hand-generate each file, set `GEMINI_API_KEY` in the
environment and tell me which image model you have access to (e.g. Imagen 3 /
`gemini-2.x` image gen). I'll write a `scripts/generate-sprites.mjs` that batches
the list above and writes the PNGs — provided the API is reachable from the build
environment (some outbound hosts are proxy-restricted here; we'd test first).
