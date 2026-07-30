import { useState, useEffect, useRef } from 'react'
import { fetchPlayerStats, summarizeStats } from '../lib/statsApi'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'

const selectCls =
  'rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]'

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString() : n)
const pct = (n) => `${(Math.round(n * 10) / 10).toFixed(1)}%`

// Well-known players to seed the empty state — one tap prefills + runs the lookup
// so the tab is useful before you've typed anything.
const EXAMPLES = [
  { name: 'Ninja', type: 'epic', emoji: '🥷' },
  { name: 'Bugha', type: 'epic', emoji: '🏆' },
  { name: 'SypherPK', type: 'epic', emoji: '🎯' },
  { name: 'Clix', type: 'epic', emoji: '⚡' },
]
// The metrics a lookup fills in — shown ghosted before a search as a preview.
const PREVIEW_TILES = ['Wins', 'Win rate', 'K/D', 'Kills', 'Matches', 'Top 10', 'Top 25', 'Hours played']

function Tile({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3" title={hint || label}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-display text-2xl leading-none text-white">{value}</p>
    </div>
  )
}

export default function StatsTab() {
  const { user, profile, updateProfile } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [accountType, setAccountType] = useState('epic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [lookedUp, setLookedUp] = useState(null) // { name, accountType } of the last successful lookup
  const autoRan = useRef(false)

  const runWith = async (q, type) => {
    q = q.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPlayerStats(q, type)
      setStats(summarizeStats(data))
      setLookedUp({ name: q, accountType: type })
    } catch (err) {
      setStats(null)
      setLookedUp(null)
      setError(err.message || 'Could not load stats.')
    } finally {
      setLoading(false)
    }
  }

  const run = (e) => {
    e?.preventDefault()
    if (!loading) runWith(name, accountType)
  }

  // Auto-load the signed-in user's saved Epic account once it's available.
  useEffect(() => {
    if (autoRan.current || !profile?.epic_username) return
    autoRan.current = true
    setName(profile.epic_username)
    setAccountType(profile.epic_platform || 'epic')
    runWith(profile.epic_username, profile.epic_platform || 'epic')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.epic_username])

  const saveMine = async () => {
    if (!lookedUp) return
    const res = await updateProfile({ epic_username: lookedUp.name, epic_platform: lookedUp.accountType })
    toast(res?.error ? res.error : 'Saved to your profile — it’ll auto-load next time', res?.error ? 'error' : undefined)
  }

  const isMine = user && lookedUp && profile?.epic_username &&
    lookedUp.name.toLowerCase() === profile.epic_username.toLowerCase() &&
    lookedUp.accountType === (profile.epic_platform || 'epic')
  const canSaveMine = user && lookedUp && !isMine

  const o = stats?.overall

  return (
    <section aria-label="Player stats">
      <header className="mb-4">
        <h2 className="font-display text-2xl text-white">📊 Player Stats</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Look up any Fortnite player’s Battle Royale stats by their Epic display name.
          Match history has to be <span className="font-semibold text-white">public</span> on
          their account (Epic → Settings → Account &amp; Privacy) for stats to show.
        </p>
      </header>

      <form onSubmit={run} className="mb-5 flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Epic display name…"
          aria-label="Epic display name"
          title="Type the player’s exact Epic display name"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)] sm:flex-none sm:w-64"
        />
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          aria-label="Platform / account type"
          title="Which account the display name belongs to"
          className={selectCls}
        >
          <option value="epic">Epic</option>
          <option value="psn">PlayStation</option>
          <option value="xbl">Xbox</option>
        </select>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          title="Look up this player’s stats"
          className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2 text-sm font-extrabold text-black disabled:opacity-50"
        >
          {loading ? 'Looking up…' : 'Look up'}
        </button>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">
          {error}
        </div>
      )}

      {!error && !stats && !loading && (
        <div className="space-y-4">
          {/* Try an example — one tap runs a real lookup */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
            <p className="text-sm text-[var(--muted)]">Not sure where to start? Tap a pro to see it in action:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => { setName(ex.name); setAccountType(ex.type); runWith(ex.name, ex.type) }}
                  title={`Look up ${ex.name}'s stats`}
                  className="rounded-full bg-[var(--panel-2)] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[var(--border)]"
                >
                  {ex.emoji} {ex.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ghosted preview of the metrics a lookup fills in */}
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">What you’ll see</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
              {PREVIEW_TILES.map((t) => (
                <div key={t} className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--panel)]/40 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">{t}</p>
                  <p className="mt-1 font-display text-2xl leading-none text-[var(--muted)]/40">—</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-[var(--muted)]">
            Or enter any Epic display name above.{' '}
            {user
              ? 'Tip: save your Epic account in your Profile and it’ll load here automatically.'
              : 'Log in and save your Epic account to have it auto-load every time.'}
          </p>
        </div>
      )}

      {stats && !error && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-xl text-white">
              {stats.account?.name || name}
              {isMine && <span className="ml-2 rounded-full bg-[var(--brand)]/15 px-2 py-0.5 align-middle text-[10px] font-bold uppercase text-[var(--brand)]">Your account</span>}
              {stats.battlePassLevel > 0 && (
                <span className="ml-2 align-middle text-sm font-bold text-[var(--muted)]">
                  Battle Pass Lv {stats.battlePassLevel}
                </span>
              )}
            </h3>
            {canSaveMine && (
              <button
                onClick={saveMine}
                title="Save this as your Epic account so the Stats tab auto-loads it next time"
                className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]"
              >
                ★ This is me — save to profile
              </button>
            )}
          </div>

          {/* Overall headline tiles */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Tile label="Wins" value={fmt(o.wins)} hint="Total Victory Royales (all modes)" />
            <Tile label="Win rate" value={pct(o.winRate)} hint="Wins ÷ matches" />
            <Tile label="K/D" value={o.kd.toFixed(2)} hint="Kills ÷ deaths" />
            <Tile label="Kills" value={fmt(o.kills)} hint="Total eliminations" />
            <Tile label="Matches" value={fmt(o.matches)} hint="Total matches played" />
            <Tile label="Top 10" value={fmt(o.top10)} hint="Times finished in the top 10" />
            <Tile label="Top 25" value={fmt(o.top25)} hint="Times finished in the top 25" />
            <Tile label="Hours played" value={fmt(Math.round(o.minutesPlayed / 60))} hint="Total time in matches" />
          </div>

          {/* Per-mode breakdown */}
          {stats.modes.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    <th className="px-4 py-2 font-bold">Mode</th>
                    <th className="px-4 py-2 font-bold">Matches</th>
                    <th className="px-4 py-2 font-bold">Wins</th>
                    <th className="px-4 py-2 font-bold">Win %</th>
                    <th className="px-4 py-2 font-bold">K/D</th>
                    <th className="px-4 py-2 font-bold">Kills</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.modes.map((m) => (
                    <tr key={m.label} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-2 font-bold text-white">{m.label}</td>
                      <td className="px-4 py-2 text-[var(--muted)]">{fmt(m.matches)}</td>
                      <td className="px-4 py-2 text-[var(--muted)]">{fmt(m.wins)}</td>
                      <td className="px-4 py-2 text-[var(--muted)]">{pct(m.winRate)}</td>
                      <td className="px-4 py-2 text-[var(--muted)]">{m.kd.toFixed(2)}</td>
                      <td className="px-4 py-2 text-[var(--muted)]">{fmt(m.kills)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-[11px] text-[var(--muted)]">
            Lifetime Battle Royale stats via the public fortnite-api.com. Some modes may be hidden
            if the player hasn’t played them.
          </p>
        </div>
      )}
    </section>
  )
}
