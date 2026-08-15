import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { ALL_SPRITES, RARITY_COLORS } from '../data/sprites'
import { THEME_MAP } from '../data/themes'
import { LINKS } from '../lib/supabase'
import SpriteArt from './SpriteArt'

// Fast id → sprite lookup for turning the RPC's sprite_id arrays into real names.
const SPRITE_BY_ID = new Map(ALL_SPRITES.map((s) => [s.id, s]))

function SpriteChip({ id }) {
  const s = SPRITE_BY_ID.get(id)
  if (!s) return <span className="rounded-md bg-[var(--panel-2)] px-2 py-1 text-[11px] text-[var(--muted)]">{id}</span>
  const theme = THEME_MAP[s.themeId]
  const label = s.themeId === 'normal' ? s.typeName : `${s.typeName} · ${theme?.name || s.themeId}`
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--panel-2)] py-1 pl-1 pr-2 text-[11px] font-semibold text-white">
      <span className={`sprite-art h-5 w-5 shrink-0 ${theme?.className || 'theme-normal'}`} style={{ borderRadius: '0.35rem' }}>
        <SpriteArt sprite={s} />
      </span>
      <span className="truncate" style={{ color: RARITY_COLORS[s.rarity] }}>{label}</span>
    </span>
  )
}

// A single trade partner: what they can give you, what you'd give them, and how
// to reach them (Discord handle → DM, or their gamertag).
function MatchCard({ match, onCopyDiscord }) {
  const theyGive = match.they_give || []
  const iGive = match.i_give || []
  const twoWay = theyGive.length > 0 && iGive.length > 0
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg text-white">{match.gamertag || 'Anonymous trainer'}</h3>
          {twoWay && (
            <span title="You each have something the other wants" className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-300">
              ↔ Two-way match
            </span>
          )}
        </div>
        {match.discord ? (
          <button
            type="button"
            onClick={() => onCopyDiscord(match.discord)}
            title="Copy their Discord handle — DM them to set up the trade"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#5865F2] px-3 py-1.5 text-xs font-extrabold text-white transition-opacity hover:opacity-90"
          >
            <span aria-hidden="true">📋</span> {match.discord}
          </button>
        ) : (
          <span className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)]" title="They haven't shared a Discord handle — find them by gamertag in trade servers">
            No Discord shared
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[var(--bg-2)] p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            They can give you ({theyGive.length})
          </p>
          {theyGive.length ? (
            <div className="flex flex-wrap gap-1.5">{theyGive.map((id) => <SpriteChip key={id} id={id} />)}</div>
          ) : (
            <p className="text-[11px] text-[var(--muted)]">Nothing on your wishlist — mark more sprites 🎯 Want.</p>
          )}
        </div>
        <div className="rounded-xl bg-[var(--bg-2)] p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-sky-300">
            You can give them ({iGive.length})
          </p>
          {iGive.length ? (
            <div className="flex flex-wrap gap-1.5">{iGive.map((id) => <SpriteChip key={id} id={id} />)}</div>
          ) : (
            <p className="text-[11px] text-[var(--muted)]">Nothing of yours they want yet — list more spares 🔁 For trade.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TradeTab() {
  const { user, profile, tracking, findTradeMatches } = useAuth()
  const { toast } = useToast()
  const [matches, setMatches] = useState(null) // null = loading / not loaded yet
  const [refreshTick, setRefreshTick] = useState(0)

  // How many spares / wants the user has flagged — drives the guidance.
  const { spares, wants } = useMemo(() => {
    let spares = 0
    let wants = 0
    for (const v of Object.values(tracking || {})) {
      if (v?.forTrade) spares++
      if (v?.wanted) wants++
    }
    return { spares, wants }
  }, [tracking])

  // Fetch matches whenever the user changes or a manual refresh is requested.
  // State is only set inside the async callback (after await) / event handlers,
  // never synchronously in the effect body.
  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      const res = await findTradeMatches()
      if (!cancelled) setMatches(res)
    })()
    return () => { cancelled = true }
  }, [user, findTradeMatches, refreshTick])

  // Reset to the loading state and re-trigger the effect.
  const load = () => {
    setMatches(null)
    setRefreshTick((t) => t + 1)
  }

  const copyDiscord = (handle) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(handle).then(
        () => toast(`Copied ${handle} — DM them on Discord to trade`),
        () => toast('Couldn’t copy — long-press to copy the handle', 'error'),
      )
    } else {
      toast('Copy not supported here — note the handle manually')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl text-white">🔁 Trade matches</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Fortnite has no in-game trading, so it’s player-to-player. Mark your spare duplicates{' '}
          <span className="font-bold text-sky-300">🔁 For trade</span> and the ones you’re chasing{' '}
          <span className="font-bold text-fuchsia-300">🎯 Want</span> (on any sprite), and we’ll match you with
          players whose spares line up with your wishlist — and vice-versa.
        </p>
      </div>

      {/* Discord server nudge — only appears once a community server exists. */}
      {LINKS.discordInvite && (
        <a
          href={LINKS.discordInvite}
          target="_blank"
          rel="noreferrer"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-[#5865F2]/50 bg-[#5865F2]/10 p-3 transition-colors hover:bg-[#5865F2]/15"
        >
          <span className="text-2xl">💬</span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-white">Coordinate in our Discord</span>
            <span className="block text-[11px] text-[var(--muted)]">Find partners, arrange bot-lobby swaps, and trade safely.</span>
          </span>
        </a>
      )}

      {!user ? (
        <div className="rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 p-5 text-center">
          <div className="text-3xl">🔁</div>
          <p className="mt-2 text-sm text-white">Log in to find trade matches.</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Trading matches your collection against other players in the cloud — mark your spares and wants, then log
            in to see who lines up.
          </p>
        </div>
      ) : (
        <>
          {/* Setup checklist so the user knows why they may see nothing yet. */}
          {(profile && profile.is_public === false) || !profile?.discord || spares === 0 || wants === 0 ? (
            <ul className="mb-4 space-y-1.5 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 text-xs">
              <li className={spares > 0 ? 'text-emerald-300' : 'text-[var(--muted)]'}>
                {spares > 0 ? '✓' : '○'} List your spare duplicates — open a sprite and tap <b className="text-white">🔁 For trade</b>{spares > 0 && <span className="text-[var(--muted)]"> ({spares} listed)</span>}
              </li>
              <li className={wants > 0 ? 'text-emerald-300' : 'text-[var(--muted)]'}>
                {wants > 0 ? '✓' : '○'} Add the sprites you’re after — tap <b className="text-white">🎯 Want</b>{wants > 0 && <span className="text-[var(--muted)]"> ({wants} wanted)</span>}
              </li>
              <li className={profile?.is_public !== false ? 'text-emerald-300' : 'text-amber-300'}>
                {profile?.is_public !== false ? '✓' : '!'} Keep your profile <b className="text-white">public</b> so others can match with you (Profile → “Public”)
              </li>
              <li className={profile?.discord ? 'text-emerald-300' : 'text-[var(--muted)]'}>
                {profile?.discord ? '✓' : '○'} Add your <b className="text-white">Discord handle</b> in Profile so matches can DM you
              </li>
            </ul>
          ) : null}

          {matches === null ? (
            <div className="grid place-items-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-10 text-sm text-[var(--muted)]">
              Finding matches…
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-8 text-center">
              <div className="text-3xl">🌱</div>
              <p className="mt-2 text-sm text-white">No matches yet.</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                As soon as another player’s spares line up with your wishlist (or vice-versa), they’ll appear here.
                The more sprites you flag 🔁 and 🎯, the more matches you’ll get.
              </p>
              <button onClick={load} className="mt-3 rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">
                ↻ Refresh
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-[var(--muted)]">
                  <b className="text-white">{matches.length}</b> {matches.length === 1 ? 'player' : 'players'} to trade with
                </p>
                <button onClick={load} title="Refresh matches" className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">
                  ↻ Refresh
                </button>
              </div>
              <div className="space-y-3">
                {matches.map((m) => (
                  <MatchCard key={m.partner_id} match={m} onCopyDiscord={copyDiscord} />
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-[var(--bg-2)] px-3 py-2 text-[11px] leading-relaxed text-[var(--muted)]">
                <b className="text-white">Trade safely:</b> arrange swaps in a private/bot lobby, each carry a spare, drop &amp;
                extract together. FN Sprite Tracker only matches collections — it doesn’t handle the in-game trade.
              </p>
            </>
          )}
        </>
      )}
    </div>
  )
}
