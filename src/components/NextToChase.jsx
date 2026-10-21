import { useMemo } from 'react'
import { ALL_SPRITES, CURRENT_GEN, SPRITE_BY_ID } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import { liveSpriteEvent } from '../data/events'
import { LOBBY_CODES } from '../data/codes'
import SpriteArt from './SpriteArt'

// Drop rate is stored as a display string like "8.73%"; parse to a number so we
// can rank. Lower = rarer.
const rate = (s) => parseFloat(s.dropRate)

// An action-oriented "what should I do right now" plan, built from the player's
// own collection crossed with live data. It leads with time-sensitive / zero-cost
// moves — a Power Hours that's boosting a finish you're missing, free Cheat Master
// unlocks whose codes are live, free Dust codes — then falls back to the evergreen
// rarity picks (rarest miss, set you're closest to, easiest grab).
export default function NextToChase({ tracking, onOpen, onFarmFinish, onGo }) {
  const { actions, picks, done } = useMemo(() => {
    // Only current-season Sprites are worth "chasing" — archived past-gen Sprites
    // live in the Sprite Garden but can't be obtained in Battle Royale now.
    const released = ALL_SPRITES.filter((s) => !s.unreleased && s.gen === CURRENT_GEN)
    const missing = released.filter((s) => !tracking[s.id]?.owned)
    if (!missing.length) return { actions: [], picks: [], done: true }

    const actions = []

    // 1) A finish-boosting event that's live RIGHT NOW → farm the finishes you're
    //    still missing while they're rate-boosted.
    const ev = liveSpriteEvent(new Date())
    const boostTheme = ev?.boostedThemes?.[0]
    if (boostTheme && onFarmFinish) {
      const n = missing.filter((s) => s.themeId === boostTheme).length
      if (n > 0) {
        const fin = THEME_MAP[boostTheme]?.name || boostTheme
        actions.push({
          key: 'event',
          live: true,
          icon: ev.emoji || '🎯',
          title: `${ev.name} is live`,
          note: `${n} missing ${fin} finish${n === 1 ? '' : 'es'} — boosted right now`,
          cta: `Farm ${fin} →`,
          onClick: () => onFarmFinish(boostTheme),
        })
      }
    }

    // 2) Free Cheat Master unlocks you haven't claimed — these are code-locked (not
    //    summoned), so a live code is a zero-effort grab. Match working sprite codes
    //    to their Cheat Master variant and keep the ones you don't own yet.
    const cmMissing = LOBBY_CODES.filter((c) => {
      if (c.status !== 'working' || !c.spriteId || c.category !== 'sprites') return false
      const v = SPRITE_BY_ID[`${c.spriteId}_cheatmaster`]
      return v && v.released && !tracking[`${c.spriteId}_cheatmaster`]?.owned
    })
    if (cmMissing.length && onGo) {
      const names = cmMissing
        .slice(0, 3)
        .map((c) => SPRITE_BY_ID[`${c.spriteId}_cheatmaster`]?.typeName)
        .filter(Boolean)
      const more = cmMissing.length - names.length
      actions.push({
        key: 'cheatcodes',
        icon: '🔓',
        title: `${cmMissing.length} free Cheat Master unlock${cmMissing.length === 1 ? '' : 's'}`,
        note: `${names.join(', ')}${more > 0 ? ` +${more} more` : ''} — codes are live`,
        cta: 'Get codes →',
        onClick: () => onGo('codes'),
      })
    }

    // 3) Free Dust codes → re-summon a variant you traded away. Only surface it when
    //    there's still room (keep the card tight) and codes are actually live.
    const dustCodes = LOBBY_CODES.filter((c) => c.status === 'working' && c.category === 'dust')
    if (dustCodes.length && onGo && actions.length < 2) {
      actions.push({
        key: 'dustcodes',
        icon: '🔷',
        title: `${dustCodes.length} Dust code${dustCodes.length === 1 ? '' : 's'} live`,
        note: 'Free Sprite Dust — re-summon a variant you’re missing',
        cta: 'Get codes →',
        onClick: () => onGo('codes'),
      })
    }

    // ---- Evergreen rarity picks (the original heuristics) ----
    const rated = missing.filter((s) => !Number.isNaN(rate(s)))
    const pickBy = (arr, better) => (arr.length ? arr.reduce((a, b) => (better(b, a) ? b : a)) : null)
    const rarest = pickBy(rated, (b, a) => rate(b) < rate(a)) || missing[0]
    const easiestPool = rated.filter((s) => s.typeId !== rarest.typeId)
    const easiest = pickBy(easiestPool.length ? easiestPool : rated, (b, a) => rate(b) > rate(a))

    const byType = {}
    for (const s of released) {
      const t = (byType[s.typeId] ||= { typeName: s.typeName, total: 0, owned: 0, missing: [] })
      t.total++
      if (tracking[s.id]?.owned) t.owned++
      else t.missing.push(s)
    }
    const closest = Object.values(byType)
      .filter((t) => t.owned > 0 && t.owned < t.total)
      .sort((a, b) => a.total - a.owned - (b.total - b.owned))[0]

    const picks = [
      { key: 'rarest', tag: 'Rarest missing', sprite: rarest, note: rarest.dropRate ? `${rarest.rarity} · ${rarest.dropRate} drop` : rarest.rarity },
    ]
    if (closest && closest.missing[0].id !== rarest.id) {
      picks.push({
        key: 'set',
        tag: 'Finish a set',
        sprite: closest.missing[0],
        note: `${closest.typeName}: ${closest.total - closest.owned} variant${closest.total - closest.owned === 1 ? '' : 's'} to go`,
      })
    }
    if (easiest && easiest.id !== rarest.id && !picks.some((r) => r.sprite.id === easiest.id)) {
      picks.push({ key: 'easiest', tag: 'Easiest to grab', sprite: easiest, note: `Most common · ${easiest.dropRate} drop` })
    }

    // Keep the card tight: the more live actions we're showing, the fewer evergreen
    // picks we stack under them.
    const trimmed = actions.length >= 2 ? picks.slice(0, 1) : actions.length === 1 ? picks.slice(0, 2) : picks
    return { actions, picks: trimmed, done: false }
  }, [tracking, onFarmFinish, onGo])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="font-display text-lg text-white">🎯 Next to chase</h3>
      {done ? (
        <p className="mt-2 text-sm text-[var(--muted)]">You’ve caught every Sprite obtainable this season! 🎉</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {actions.map((a) => (
            <button
              key={a.key}
              onClick={a.onClick}
              title={a.title}
              className={`flex items-center gap-3 rounded-xl p-2.5 text-left ring-1 transition-colors ${
                a.live
                  ? 'bg-fuchsia-500/15 ring-fuchsia-400/30 hover:bg-fuchsia-500/25'
                  : 'bg-[var(--brand)]/10 ring-[var(--brand)]/25 hover:bg-[var(--brand)]/20'
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-black/20 text-xl">{a.icon}</span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[10px] font-bold uppercase tracking-wide ${a.live ? 'text-fuchsia-300' : 'text-[var(--brand)]'}`}>
                  {a.live ? 'Live now' : 'Do now'}
                </span>
                <span className="block truncate text-sm font-bold text-white">{a.title}</span>
                <span className="block truncate text-[11px] text-[var(--muted)]">{a.note}</span>
              </span>
              <span className={`shrink-0 whitespace-nowrap text-[11px] font-bold ${a.live ? 'text-fuchsia-300' : 'text-[var(--brand)]'}`}>
                {a.cta}
              </span>
            </button>
          ))}
          {picks.map(({ key, tag, sprite, note }) => {
            const theme = THEME_MAP[sprite.themeId]
            return (
              <button
                key={key}
                onClick={() => onOpen(sprite.typeId)}
                className="flex items-center gap-3 rounded-xl bg-[var(--bg-2)] p-2 text-left transition-colors hover:bg-[var(--panel-2)]"
                title={`Open ${sprite.typeName} · ${theme?.name}`}
              >
                <div className={`sprite-art h-10 w-10 shrink-0 ${theme?.className || 'theme-normal'}`} style={{ borderRadius: '0.55rem' }}>
                  <SpriteArt sprite={sprite} />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-[var(--brand)]">{tag}</span>
                  <span className="block truncate text-sm font-bold text-white">
                    {sprite.typeName} <span className="font-medium text-[var(--muted)]">· {theme?.name}</span>
                  </span>
                  <span className="block truncate text-[11px] text-[var(--muted)]">{note}</span>
                </span>
                <span className="shrink-0 text-[var(--muted)]">→</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
