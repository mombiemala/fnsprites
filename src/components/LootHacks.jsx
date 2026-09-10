import { LOOT_HACK_ROTATION, LOOT_HACK_META } from '../data/lootHacks'

// Days until the next Loot Hack rotation (the in-game timer is authoritative;
// this is a best-effort heads-up from our tracked refresh date).
function daysUntil(dateStr) {
  const now = new Date()
  const target = new Date(dateStr + 'T13:00:00Z') // rotations land ~9 AM ET
  return Math.ceil((target - now) / 86400000)
}

// Sidebar card: the current Loot Hack rotation (weapons you buy with Sprite Dust
// to bias your own chest loot) + a countdown to the next refresh. Links to the
// full /loot-hacks guide.
export default function LootHacks() {
  const left = daysUntil(LOOT_HACK_META.nextRefresh)
  const refresh =
    left > 1 ? `Refreshes in ~${left} days` : left === 1 ? 'Refreshes ~tomorrow' : left === 0 ? 'Refreshes today' : 'Refresh due — check in game'

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-lg text-white">🎯 Loot Hacks</h3>
        <span className="rounded-full bg-[var(--bg-2)] px-2 py-0.5 text-[10px] font-bold text-[var(--muted)]">{LOOT_HACK_META.patch}</span>
      </div>
      <p className="mb-3 text-xs text-[var(--muted)]">
        Spend <span className="font-bold text-[var(--brand)]">Sprite Dust</span> to add these to your chest loot pool. {refresh}.
      </p>
      <ul className="space-y-1.5">
        {LOOT_HACK_ROTATION.map((it) => (
          <li key={it.name} className="flex items-center gap-2 rounded-lg bg-[var(--bg-2)] px-2.5 py-1.5">
            <span className="text-sm">🔫</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-white">{it.name}</span>
              <span className="block truncate text-[11px] text-[var(--muted)]">{it.role}</span>
            </span>
          </li>
        ))}
      </ul>
      <a
        href="/loot-hacks"
        className="mt-3 block rounded-lg bg-[var(--bg-2)] px-3 py-2 text-center text-xs font-bold text-[var(--brand)] hover:bg-[var(--border)]"
      >
        How Loot Hacks &amp; Dust work →
      </a>
    </div>
  )
}
