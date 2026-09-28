# Chest / loot marker extraction — CUE4Parse spike

**Status: proof-of-concept / cost-sizing spike. Not wired into the app.**

Goal: find out what it actually takes to build fortnite.gg-style *toggleable
loot layers* (chests, ammo boxes, vehicles) on our `/map`, and how much upkeep
it is per patch — **before** we commit to it. POIs are the easy tier and come
free from `fortnite-api.com`; this spike is only about the hard tier that has
no public API.

TL;DR after building it: **the code is small; the upkeep is the cost.** Two
things need a human every patch (AES key) and every map change (coordinate
calibration + actor class names). See "Upkeep cost" below.

---

## What's here

| File | Runs where | What it is |
|------|-----------|------------|
| `Program.cs` | a machine with .NET 8 + Fortnite installed | The extractor. Mounts the game paks, scans the BR map's World Partition packages, pulls placed chest/ammo/vehicle actor coordinates, normalizes them, writes `loot-markers.json`. |
| `MapTransform` (in `Program.cs`) | — | World-units → normalized 0..1 image coords. **The per-map calibration point.** |
| `ChestExtract.csproj` | — | .NET 8 console project referencing CUE4Parse. |
| `sample-output.json` | — | A representative `loot-markers.json` so you can see the exact shape the map UI would consume (hand-authored — this spike was written in a container with no game files). |
| `validate.mjs` | **anywhere with Node (runs here)** | Validates the JSON shape, asserts every coord is in 0..1, and prints an ASCII density map so you can *see* the markers land. Proves the consumption side end-to-end without game files. |

---

## Why it can't just run in CI / this container

CUE4Parse reads the game's **encrypted UE5 `.pak`/`.utoc`/`.ucas` archives**.
That means the pipeline needs, on the machine that runs it:

1. **The actual game files** (~40+ GB) — a Fortnite install, or the files pulled
   from Epic's manifest. Not something you download in a serverless build.
2. **The current AES decryption key** — Epic **rotates it every patch**. You get
   it from `https://fortnite-api.com/v2/aes` (or any dataminer feed) within
   minutes of a patch.
3. **.NET 8 SDK** + the CUE4Parse library.

So the realistic operating model is: **a scheduled job on a box that has the
game** (a home PC, or a cloud VM that pulls the manifest), which runs this on
each patch and publishes `loot-markers.json` to where the site can fetch it
(e.g. commit to the repo, or push to blob/CDN). The site then just loads that
JSON — no game files anywhere near production.

---

## How to run it (on a machine with Fortnite + .NET 8)

```bash
# 1. Get CUE4Parse as a submodule (most reliable way to reference it)
cd tools/chest-extract
git submodule add https://github.com/FabianFG/CUE4Parse ../CUE4Parse
# (the .csproj ProjectReference already points at ../CUE4Parse/CUE4Parse/CUE4Parse.csproj)

# 2. Grab today's AES key
curl -s https://fortnite-api.com/v2/aes    # copy the "mainKey"

# 3. Run
dotnet run -- \
  --paks "C:/Program Files/Epic Games/Fortnite/FortniteGame/Content/Paks" \
  --aes  "0x<mainKey-from-step-2>" \
  --ue   GAME_UE5_6 \
  --out  loot-markers.json

# 4. Sanity-check the output (works anywhere, no game needed)
node validate.mjs loot-markers.json
```

`--ue` is the UE version enum CUE4Parse parses with; bump it when Epic bumps
the engine (e.g. `GAME_UE5_6`, `GAME_UE5_7`...).

---

## Upkeep cost (the actual answer to "how much babysitting?")

Ranked by how often it bites:

1. **AES key — every patch (~weekly).** One-line change / config fetch. Fully
   automatable if the job pulls it from `fortnite-api.com/v2/aes` itself. **Low.**
2. **Coordinate calibration — every time the map changes (new season, big map
   event).** The world→image transform (`MapTransform.WorldBounds`) must match
   the current minimap. If it drifts, every marker is off. **This is the real
   maintenance tax** — it's silent (no error, just wrong pins) and needs a human
   eyeball to confirm. **Medium, and easy to forget.**
3. **Actor class names — occasionally.** Epic renames/reworks chest & spawner
   blueprints. When they do, the `TargetClasses` filter silently returns fewer
   markers until updated. Catch it with a count sanity-check (validator warns if
   chest count drops off a cliff). **Low–medium.**
4. **UE engine version — every few months.** Bump `--ue` when parsing breaks
   after an engine upgrade, and update the CUE4Parse submodule. **Low.**
5. **CUE4Parse API churn.** It's an actively-moving library; a submodule bump
   can require small code tweaks. **Low, but non-zero.**

**Verdict for us:** the extraction is ~200 lines and cheap to *write*. The
ongoing cost is a **scheduled job on a machine that owns the game**, plus a
recurring **per-map coordinate re-calibration** that has to be verified by a
human or it drifts silently. That's the opposite of our "verified + low-
maintenance, API-driven" principle. Recommendation stands: ship POI toggles
(free, auto-updating) and only take on loot layers if we're willing to own that
scheduled job — otherwise a small hand-curated hotspot layer, clearly dated, is
the honest middle ground.

---

## Notes on version-sensitive spots (marked `CONFIG:` in Program.cs)

- `MapTransform.WorldBounds` — calibrate per map.
- `TargetClasses` — the blueprint class-name fragments we treat as chests / ammo
  / vehicles. Verify after big updates.
- `MapContentRoots` — the package-path prefixes we scan for the *current* BR
  island (World Partition scatters actors across many generated cell packages).
