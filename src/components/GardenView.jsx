import { useMemo } from 'react'
import SpriteArt from './SpriteArt'
import { THEME_MAP } from '../data/themes'
import { GENERATIONS } from '../data/sprites'

// PROTOTYPE — an in-app "Sprite Garden": a showcase of the Sprites you own,
// grouped by generation. Mirrors the Sprite Garden coming to Fortnite in
// Chapter 7 Season 4 "Override" (your collection lives on an island; new
// generations get added alongside the old). Read-only, showcase-only.
const RARITY_RANK = { Mythic: 0, Legendary: 1, Epic: 2, Rare: 3 }

export default function GardenView({ set, tracking, onOpen, canShare, onShare, ownerName }) {
  const owned = useMemo(() => {
    return set.items
      .filter((s) => !s.unreleased && tracking[s.id]?.owned)
      .sort(
        (a, b) =>
          (RARITY_RANK[a.rarity] ?? 9) - (RARITY_RANK[b.rarity] ?? 9) ||
          a.typeName.localeCompare(b.typeName) ||
          a.themeId.localeCompare(b.themeId),
      )
  }, [set.items, tracking])

  const total = set.released
  const mastered = owned.filter((s) => tracking[s.id]?.mastered).length

  return (
    <div className="garden">
      <div className="garden-head">
        <div className="min-w-0">
          <h2 className="font-display text-xl text-white">🌱 {ownerName ? `${ownerName}’s` : 'Your'} Sprite Garden</h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            <b className="text-white">{owned.length}</b> of {total} planted
            {mastered > 0 && <> · <b className="text-amber-300">{mastered}</b> mastered ★</>} · {ownerName ? 'a shared Sprite Garden' : 'a beta first look at your collection as a garden'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {canShare && (
            <button type="button" onClick={onShare} className="garden-share" title="Copy a link to your Sprite Garden — friends can visit it">
              🔗 Share
            </button>
          )}
          <span className="garden-pill">Beta</span>
        </div>
      </div>

      {owned.length === 0 ? (
        <div className="garden-empty">
          <div className="text-4xl">🪴</div>
          <p className="mt-2 text-sm text-[var(--text)]">{ownerName ? `${ownerName}’s garden is empty.` : 'Your garden is empty.'}</p>
          {!ownerName && (
            <p className="mt-1 text-xs text-[var(--muted)]">
              Switch to <b>Grid</b> and tap “Have it?” on the Sprites you own — they’ll be planted here.
            </p>
          )}
        </div>
      ) : (
        GENERATIONS.filter((g) => g.released).map((g) => {
          const list = owned.filter((s) => (s.gen || GENERATIONS[0].id) === g.id)
          if (!list.length) return null
          return (
            <section key={g.id} className="garden-gen">
              <div className="garden-gen-head">
                <span className="garden-gen-title">{g.name} · {g.sub}</span>
                <span className="garden-gen-count">{list.length} planted</span>
              </div>
              <div className="garden-plot">
                {list.map((s) => {
                  const theme = THEME_MAP[s.themeId]
                  const isMastered = !!tracking[s.id]?.mastered
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onOpen?.(s)}
                      className={`garden-sprite ${isMastered ? 'is-mastered' : ''}`}
                      title={`${s.typeName} · ${theme?.name}${isMastered ? ' · Mastered' : ''} — details`}
                    >
                      <span className={`garden-art sprite-art ${theme?.className || 'theme-normal'}`}>
                        <SpriteArt sprite={s} />
                      </span>
                      {isMastered && <span className="garden-star" aria-hidden="true">★</span>}
                      <span className="garden-name">{s.typeName}</span>
                      <span className="garden-finish">{theme?.name}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })
      )}

      {/* Upcoming generations — Sprites stay forever, so future gens file in here */}
      {GENERATIONS.filter((g) => !g.released).map((g) => (
        <section key={g.id} className="garden-gen garden-gen--soon">
          <div className="garden-gen-head">
            <span className="garden-gen-title">{g.name} · {g.sub}</span>
            <span className="garden-gen-count">{g.when || 'Soon'}</span>
          </div>
          <p className="garden-soon-note">
            A whole new generation of Sprites lands with “{g.sub}.” They’ll grow here automatically alongside
            your existing collection — Sprites stay forever. 🌸
          </p>
        </section>
      ))}
    </div>
  )
}
