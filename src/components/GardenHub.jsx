import { useState } from 'react'
import GardenGallery from './GardenGallery'
import GardenPlanner from './GardenPlanner'

// The in-app Sprite Garden hub: a community gallery of shared screenshots and a
// personal layout planner, behind a small segmented toggle.
export default function GardenHub({ onRequireLogin }) {
  const [mode, setMode] = useState('gallery')
  const tabs = [
    ['gallery', '🖼️ Gallery'],
    ['planner', '📐 Planner'],
  ]
  return (
    <div>
      <div className="mb-3 inline-flex rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${mode === id ? 'bg-[var(--brand)] text-black' : 'text-[var(--muted)] hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === 'gallery' ? <GardenGallery onRequireLogin={onRequireLogin} /> : <GardenPlanner />}
    </div>
  )
}
