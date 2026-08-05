// "How Sprites work" — the single source of truth for the explainer that appears
// in the Sprites-page sidebar (both the in-app view via HowSpritesWork.jsx and
// the static /sprites page via scripts/prerender.mjs). Keeping it here means the
// two surfaces never drift. `**bold**` spans are rendered by each consumer.
export const SPRITE_GUIDE = [
  { h: '✨ Getting Sprites', body: [
    'Sprites mostly come from **Sprite Chests** around the island (a few also spawn mid-match). Rarer ones — Zero Point, Grim Reaper, Burnt Peanut — have very low drop rates, which is why trading duplicates is popular.',
    '**Any chest can drop any Sprite** — rarity sets the odds, not the location. Chests glow blue with a pink crystal; turn on **Visualized Sounds** to spot them. Busiest farm is **Sinister Strip** (4 chests); Wonkeeland, Calamari Canyon, Heatwave Harbor & Shaken Sanctuary have 3 each.',
  ] },
  { h: '⚠️ Extract it, or you lose it', body: [
    'A Sprite **isn’t yours until you Extract it.** If you’re eliminated before extracting, it’s gone. Extract at an **Extraction Site** or with a **Portable Extractor** (a Mastery reward). Only extracted Sprites count toward your collection.',
  ] },
  { h: '⬆️ Leveling (1 → 5)', body: [
    'A Sprite gets stronger as it levels, up to **Lv 5**. You earn level points by:',
    '• Opening containers — **≈75 pts**\n• Eliminations — **≈200 pts**\n• Extracting a duplicate Sprite — **≈200 pts**',
    '**Mastery Mondays** (every Monday, 9 AM ET, 24h) grant **2× Sprite XP & Dust** — the fastest time to level. A common tactic: land quiet, get one to Lv 3 in game one, finish to Lv 5 in game two.',
  ] },
  { h: '⭐ Mastery', body: [
    'Reaching Lv 5 **isn’t enough on its own** — you must **Extract a Sprite while it’s at Lv 5** to Master it. Each Mastery unlocks rewards in the Sprites menu: **Portable Extractors, Sprite Dust, XP and cosmetics.**',
    'The **Quack finishes are Mastery milestone rewards** — you can’t pull them from chests. Master **35** Sprites for Quack Water, **40** for Quack Earth, **45** for Quack Fire, and **55** for **Quack Zero Point**. Each one shares **50%** of the XP it earns with every other Sprite in your match, so it fast-tracks the rest of your collection.',
    'In this tracker, marking a variant **★ Mastered** = you’ve extracted it at Lv 5.',
  ] },
  { h: '🎨 Variants & forms', body: [
    'Each Sprite comes in variant finishes — Normal, Gold, Gummy, Galaxy, and newer Gem / Holofoil / Cube / Quack — each stacking a small **bonus** on top of the Sprite’s ability. Re-summoning a variant you’ve traded away costs **Sprite Dust**.',
  ] },
  { h: '🔁 Trading', body: [
    'There’s **no official trade menu** — trades happen in-game by dropping a Sprite for another player to pick up and **co-extract**. Rule of thumb: **don’t drop first**, use quiet/bot lobbies, and stick to **vouched** partners.',
  ] },
]
