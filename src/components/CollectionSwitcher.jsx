import { COLLECTIONS } from '../data/collections'

// Switches which collection ("set") the app is showing. It renders nothing while
// only one set exists, so it's safe to keep mounted now and lights up the day a
// second collectible is added to COLLECTIONS.
export default function CollectionSwitcher({ value, onChange }) {
  if (COLLECTIONS.length < 2) return null
  return (
    <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Collection">
      {COLLECTIONS.map((c) => {
        const active = c.id === value
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c.id)}
            title={`Switch to the ${c.label} collection`}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
              active ? 'bg-[var(--brand)] text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
            }`}
          >
            {c.icon} {c.label}
          </button>
        )
      })}
    </div>
  )
}
