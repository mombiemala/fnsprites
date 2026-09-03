// "How Sprites work" — the single source of truth for the explainer that appears
// in the Sprites-page sidebar (both the in-app view via HowSpritesWork.jsx and
// the static /sprites page via scripts/prerender.mjs). Keeping it here means the
// two surfaces never drift. `**bold**` spans are rendered by each consumer.
export const SPRITE_GUIDE = [
  { h: '✨ Getting Sprites (Season 4: Override)', body: [
    'This season is **Chapter 7 Season 4 “Override.”** Its Sprites come from **in-world Cheat Codes** you activate around the map and **Hack the Lobby codes** you enter from the lobby — and many still drop from **Sprite Chests** too. Entering a Sprite’s **Hack the Lobby code** unlocks its **Cheat Master** finish.',
    '**Any chest can drop any Sprite** — rarity sets the odds, not the location. Chests glow blue with a pink crystal; turn on **Visualized Sounds** to spot them. Busiest farm is **Sinister Strip** (4 chests); Wonkeeland, Calamari Canyon, Heatwave Harbor & Shaken Sanctuary have 3 each.',
    'Older **Season 3 “Runners”** Sprites (Zero Point, Grim Reaper, Burnt Peanut and friends) came from Sprite Chests too, but they’re now archived in your **Sprite Garden** — Override is the generation you collect and use in Battle Royale this season. Rarer Sprites have very low drop rates, which is why trading duplicates stays popular.',
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
    'The **Quack finishes are Mastery milestone rewards** — you can’t pull them from chests. Master **35** Sprites for Quack Water, **40** for Quack Earth, **45** for Quack Fire, and **55** for **Quack Zero Point** (a **free** reward via the mastery track). Each one shares **50%** of the XP it earns with every other Sprite in your match, so it fast-tracks the rest of your collection.',
    'In this tracker, marking a variant **★ Mastered** = you’ve extracted it at Lv 5.',
  ] },
  { h: '🎨 Variants & forms', body: [
    'Each Sprite comes in variant finishes — **Normal, Gold, Gummy, Galaxy, Gem, Holofoil, Cube** and **Quack** — each stacking a small **bonus** on top of the Sprite’s ability. Re-summoning a variant you’ve traded away costs **Sprite Dust**.',
    'Season 4 “Override” adds two finishes of its own: **Cheat Master** (the green code finish — unlocked with a Hack the Lobby code, not summoned) and **Loot Hacker** (the blue circuit finish — datamined and not released yet).',
  ] },
  { h: '🔁 Trading', body: [
    'There’s **no official trade menu** — trades happen in-game by dropping a Sprite for another player to pick up and **co-extract**. Rule of thumb: **don’t drop first**, use quiet/bot lobbies, and stick to **vouched** partners.',
  ] },
]
