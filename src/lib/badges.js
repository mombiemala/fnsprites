import { ALL_SPRITES, RELEASED_COUNT, RARITY_ORDER } from '../data/sprites'

// Badges are DERIVED from progress — there is NO badge storage. Given a
// collection's owned/mastered counts (and, when available, the full tracking
// map for rarity-aware badges), return the badges it has earned, richest-first.
//
// Two call sites:
//  - Leaderboard rows have only { owned, mastered } → count-only badges.
//  - The Trainer Card / shared profile has the full tracking map → adds the
//    rarity-aware badges (owns a Mythic, completed a rarity, variant hunter).
//
// Each badge: { id, icon, label, desc }. Consumers slice to taste.

const rarityReleased = {}
for (const r of RARITY_ORDER) {
  rarityReleased[r] = ALL_SPRITES.filter((s) => s.rarity === r && !s.unreleased)
}
// Non-"normal" forms a player can own — powers the "variant hunter" badge.
const releasedVariants = ALL_SPRITES.filter((s) => !s.unreleased && s.themeId !== 'normal')

export function deriveBadges({ owned = 0, mastered = 0, tracking = null } = {}) {
  const total = RELEASED_COUNT || 0
  const pct = total ? owned / total : 0
  const out = []

  // --- Completion (pick the single highest tier that applies) ---
  if (total > 0 && owned >= total) {
    out.push({ id: 'completionist', icon: '👑', label: 'Completionist', desc: 'Owns every released sprite.' })
  } else if (pct >= 0.75) {
    out.push({ id: 'elite', icon: '💎', label: 'Elite Collector', desc: '75%+ of the roster collected.' })
  } else if (pct >= 0.5) {
    out.push({ id: 'halfway', icon: '⚡', label: 'Halfway There', desc: 'Half the roster collected.' })
  } else if (owned >= 1) {
    out.push({ id: 'collector', icon: '🎒', label: 'Collector', desc: 'On the board and collecting.' })
  }

  // --- Mastery (pick the single highest tier) ---
  if (owned >= 10 && mastered >= owned) {
    out.push({ id: 'perfectionist', icon: '✨', label: 'Perfectionist', desc: 'Every owned sprite mastered.' })
  } else if (mastered >= 25) {
    out.push({ id: 'shiny-hunter', icon: '⭐', label: 'Shiny Hunter', desc: '25+ sprites mastered.' })
  } else if (mastered >= 10) {
    out.push({ id: 'master-training', icon: '🌟', label: 'Master in Training', desc: '10+ sprites mastered.' })
  }

  // --- Rarity-aware (needs the full tracking map) ---
  if (tracking) {
    const ownsReleased = (s) => tracking[s.id]?.owned
    if (rarityReleased.Mythic?.some(ownsReleased)) {
      out.push({ id: 'mythic', icon: '🔮', label: 'Mythic Owner', desc: 'Landed a Mythic sprite.' })
    }
    // Completed the hardest FULLY-released rarity tier they've finished (one badge).
    for (const r of ['Legendary', 'Epic']) {
      const set = rarityReleased[r]
      if (set?.length && set.every(ownsReleased)) {
        out.push({ id: `set-${r.toLowerCase()}`, icon: r === 'Legendary' ? '🟠' : '🟣', label: `${r} Set`, desc: `Owns every released ${r} sprite.` })
        break
      }
    }
    // Variant hunter — a healthy chunk of non-normal forms.
    const variantsOwned = releasedVariants.filter(ownsReleased).length
    if (variantsOwned >= 20) {
      out.push({ id: 'variant-hunter', icon: '🌈', label: 'Variant Hunter', desc: `${variantsOwned} special variants owned.` })
    }
  }

  return out
}
