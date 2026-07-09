import { useEscClose } from '../lib/useEscClose'

// A plain-language guide to the Sprite systems players are most confused by —
// extraction, leveling and mastery — plus how trading works. All community-
// sourced (Epic doesn't publish exact numbers); values are estimates.
const SECTIONS = [
  {
    h: '✨ Getting Sprites',
    body: [
      'Sprites mostly come from **Sprite Chests** around the island (a few also spawn mid-match). Rarer ones — Zero Point, Grim Reaper, Burnt Peanut — have very low drop rates, which is why trading duplicates is popular.',
      '**Any chest can drop any Sprite** — rarity sets the odds, not the location. Chests glow blue with a pink crystal; turn on **Visualized Sounds** to spot them. Busiest farm is **Sinister Strip** (4 chests); Wonkeeland, Calamari Canyon, Heatwave Harbor & Shaken Sanctuary have 3 each.',
    ],
  },
  {
    h: '⚠️ Extract it, or you lose it',
    body: [
      'A Sprite **isn’t yours until you Extract it.** If you’re eliminated before extracting, it’s gone. Extract at an **Extraction Site** or with a **Portable Extractor** (a Mastery reward). Only extracted Sprites count toward your collection.',
    ],
  },
  {
    h: '⬆️ Leveling (1 → 5)',
    body: [
      'A Sprite gets stronger as it levels, up to **Lv 5**. You earn level points by:',
      '• Opening containers — **≈75 pts**\n• Eliminations — **≈200 pts**\n• Extracting a duplicate Sprite — **≈200 pts**',
      '**Mastery Mondays** (every Monday, 9 AM ET, 24h) grant **2× Sprite XP & Dust** — the fastest time to level. A common tactic: land quiet, get one to Lv 3 in game one, finish to Lv 5 in game two.',
    ],
  },
  {
    h: '⭐ Mastery',
    body: [
      'Reaching Lv 5 **isn’t enough on its own** — you must **Extract a Sprite while it’s at Lv 5** to Master it. Each Mastery unlocks rewards in the Sprites menu: **Portable Extractors, Sprite Dust, XP and cosmetics.**',
      'In this tracker, marking a variant **★ Mastered** = you’ve extracted it at Lv 5.',
    ],
  },
  {
    h: '🎨 Variants & forms',
    body: [
      'Each Sprite comes in variant finishes — Normal, Gold, Gummy, Galaxy, and newer Gem / Holofoil / Cube / Quack — each stacking a small **bonus** on top of the Sprite’s ability. Re-summoning a variant you’ve traded away costs **Sprite Dust**.',
    ],
  },
  {
    h: '🔁 Trading',
    body: [
      'There’s **no official trade menu** — trades happen in-game by dropping a Sprite for another player to pick up and **co-extract**. Use the **Trade Board** here to find partners, and see its safety notes before you trade. Rule of thumb: **don’t drop first**, use quiet/bot lobbies, and stick to **vouched** partners.',
    ],
  },
]

// Render **bold** and \n line breaks in the short body strings.
function RichText({ text }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <span key={i} className="block">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <b key={j} className="text-white">{part.slice(2, -2)}</b>
              : <span key={j}>{part}</span>
          )}
        </span>
      ))}
    </>
  )
}

export default function HowItWorksModal({ onClose }) {
  useEscClose(onClose)
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How Sprites work"
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl [scrollbar-gutter:stable]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">How Sprites work</h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          A quick guide to extraction, leveling, mastery &amp; trading — the parts people get caught out by.
        </p>
        <div className="space-y-3">
          {SECTIONS.map((s) => (
            <section key={s.h} className="rounded-xl bg-[var(--bg-2)] p-3">
              <h3 className="mb-1 font-bold text-[var(--brand)]">{s.h}</h3>
              <div className="space-y-1.5 text-sm leading-relaxed text-[var(--text)]/90">
                {s.body.map((t, i) => <p key={i}><RichText text={t} /></p>)}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-[var(--muted)]">
          Community-sourced — Epic doesn’t publish exact point/drop values, so treat numbers as estimates. Not affiliated with Epic Games.
        </p>
      </div>
    </div>
  )
}
