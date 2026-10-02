import { useState } from 'react'
import NextToChase from './NextToChase'
import UpcomingSprites from './UpcomingSprites'
import SeasonCountdown from './SeasonCountdown'
import LootHacks from './LootHacks'

// Consolidates the four "what's next" sidebar cards (Next to chase, Upcoming,
// Season, Loot Hacks) into one tabbed block, so the sidebar leads with progress
// instead of a long stack. The tab strip sits above; the selected card renders
// its own chrome below — no card-in-card, and no change to the inner components.
const TABS = [
  ['chase', '🎯', 'Chase'],
  ['soon', '🔔', 'Upcoming'],
  ['season', '⏳', 'Season'],
  ['loot', '🧰', 'Loot'],
]

export default function WhatsNext({ tracking, onOpen }) {
  const [tab, setTab] = useState('chase')
  return (
    <div className="flex flex-col gap-2">
      <div role="tablist" aria-label="What's next" className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1">
        {TABS.map(([id, icon, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            title={label}
            className={`flex-1 rounded-lg px-1 py-1.5 text-[11px] font-bold transition-colors ${tab === id ? 'bg-[var(--brand)] text-black' : 'text-[var(--muted)] hover:text-white'}`}
          >
            <span aria-hidden="true">{icon}</span> {label}
          </button>
        ))}
      </div>
      {tab === 'chase' && (
        <NextToChase tracking={tracking} onOpen={onOpen} />
      )}
      {tab === 'soon' && <UpcomingSprites onOpen={onOpen} />}
      {tab === 'season' && <SeasonCountdown />}
      {tab === 'loot' && <LootHacks />}
    </div>
  )
}
