import { useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { useEscClose } from '../lib/useEscClose'
import { supabase } from '../lib/supabase'
import { ALL_SPRITES } from '../data/sprites'
import SpriteArt from './SpriteArt'

const SHOWCASE_MAX = 6

export default function ProfileModal({ onClose }) {
  useEscClose(onClose)
  const { user, profile, updateProfile, signOut, tracking } = useAuth()
  const { toast } = useToast()

  const [gamertag, setGamertag] = useState(profile?.gamertag || '')
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true)
  const [epicName, setEpicName] = useState(profile?.epic_username || '')
  const [epicPlatform, setEpicPlatform] = useState(profile?.epic_platform || 'epic')
  const [statsPublic, setStatsPublic] = useState(profile?.stats_public ?? false)
  const [showcase, setShowcase] = useState(() => (profile?.showcase_sprite_ids || []).slice(0, SHOWCASE_MAX))
  const [savingProfile, setSavingProfile] = useState(false)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const providers = user?.app_metadata?.providers || (user?.app_metadata?.provider ? [user.app_metadata.provider] : [])

  // Showcase any Sprite you own — including the newest ones. (Previously this
  // gated on the "released" flag, which could hide a freshly-added Sprite you
  // actually own; ownership is the only thing that matters here.)
  const ownedSprites = ALL_SPRITES.filter((s) => tracking?.[s.id]?.owned)

  const toggleShowcase = (id) => {
    setShowcase((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id)
      if (cur.length >= SHOWCASE_MAX) {
        toast(`Showcase holds up to ${SHOWCASE_MAX} sprites`, 'error')
        return cur
      }
      return [...cur, id]
    })
  }

  // Have any edits been made since the last save? Compared against the live
  // `profile`, so it flips back to "saved" the moment updateProfile lands. Drives
  // the single, always-visible save bar so it's never ambiguous whether changes
  // are stored.
  const effStatsPublic = epicName.trim() ? statsPublic : false
  const savedShowcase = (profile?.showcase_sprite_ids || []).slice(0, SHOWCASE_MAX)
  const dirty =
    gamertag.trim() !== (profile?.gamertag || '') ||
    isPublic !== (profile?.is_public ?? true) ||
    epicName.trim() !== (profile?.epic_username || '') ||
    epicPlatform !== (profile?.epic_platform || 'epic') ||
    effStatsPublic !== (profile?.stats_public ?? false) ||
    JSON.stringify(showcase) !== JSON.stringify(savedShowcase)

  // Revert every field to what's currently saved.
  const discardChanges = () => {
    setGamertag(profile?.gamertag || '')
    setIsPublic(profile?.is_public ?? true)
    setEpicName(profile?.epic_username || '')
    setEpicPlatform(profile?.epic_platform || 'epic')
    setStatsPublic(profile?.stats_public ?? false)
    setShowcase(savedShowcase)
  }

  const saveProfile = async () => {
    setSavingProfile(true)
    const res = await updateProfile({
      gamertag: gamertag.trim() || null,
      is_public: isPublic,
      epic_username: epicName.trim() || null,
      epic_platform: epicPlatform,
      showcase_sprite_ids: showcase.length ? showcase : null,
      // Public stats only make sense with a saved Epic name; force off otherwise.
      stats_public: effStatsPublic,
    })
    setSavingProfile(false)
    toast(res.error ? res.error : 'Profile saved ✓', res.error ? 'error' : undefined)
  }

  // Delete personal data (progress, own maps, profile) then sign out. Community
  // markers you contributed stay as shared data.
  const deleteData = async () => {
    setBusy(true)
    try {
      await supabase.from('sprite_progress').delete().eq('user_id', user.id)
      await supabase.from('maps').delete().eq('owner_id', user.id)
      await supabase.from('profiles').delete().eq('id', user.id)
      try { localStorage.removeItem('fnsprites.tracking') } catch { /* ignore */ }
      toast('Your data was deleted. Signing you out…')
      await signOut()
      onClose()
    } catch {
      setBusy(false)
      toast('Something went wrong deleting your data', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">Profile</h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        {/* Account */}
        <div className="rounded-xl bg-[var(--bg-2)] p-3 text-sm">
          <p className="text-[var(--text)]/90">{user.email || 'Signed in'}</p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            Signed in with {providers.length ? providers.join(', ') : 'email'}
          </p>
        </div>

        {/* Gamertag + privacy */}
        <div className="mt-4">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Gamertag</label>
          <input
            value={gamertag}
            onChange={(e) => setGamertag(e.target.value)}
            placeholder="Your Fortnite name"
            maxLength={32}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
          <label className="mt-2 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Public — appears on the leaderboard &amp; shareable link
          </label>
        </div>

        {/* Epic account — powers the Stats tab auto-lookup */}
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            🎮 Epic account <span className="font-semibold normal-case text-[var(--muted)]/80">— for the Stats tab</span>
          </label>
          <div className="flex gap-2">
            <input
              value={epicName}
              onChange={(e) => setEpicName(e.target.value)}
              placeholder="Epic display name"
              maxLength={32}
              title="Your exact Epic display name — the Stats tab will auto-load your stats"
              className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
            />
            <select
              value={epicPlatform}
              onChange={(e) => setEpicPlatform(e.target.value)}
              title="Which account your display name belongs to"
              className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-2 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
            >
              <option value="epic">Epic</option>
              <option value="psn">PlayStation</option>
              <option value="xbl">Xbox</option>
            </select>
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--muted)]">
            Connect it once and the <b className="text-white">📊 Stats</b> tab auto‑loads your Battle Royale stats. Your match history must be <b className="text-white">public</b> (Epic → Settings → Account &amp; Privacy).
          </p>

          {/* Opt-in: surface stats on the public Trainer Card */}
          <label className={`mt-3 flex items-start gap-2 border-t border-[var(--border)] pt-3 text-xs ${epicName.trim() ? 'text-[var(--muted)]' : 'text-[var(--muted)]/50'}`}>
            <input
              type="checkbox"
              className="mt-0.5"
              checked={epicName.trim() ? statsPublic : false}
              disabled={!epicName.trim()}
              onChange={(e) => setStatsPublic(e.target.checked)}
            />
            <span>
              <b className="font-semibold text-white">Show my stats on my shared profile</b> — anyone with your share link will see your Battle Royale stats on your Trainer Card.
              {!epicName.trim() && <span className="block text-[var(--muted)]/70">Add your Epic name first.</span>}
            </span>
          </label>
        </div>

        {/* Showcase — featured sprites on your public Trainer Card (?u= share view) */}
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            ⭐ Showcase <span className="font-semibold normal-case text-[var(--muted)]/80">— featured on your shared profile ({showcase.length}/{SHOWCASE_MAX})</span>
          </label>
          <p className="mb-2 text-[11px] text-[var(--muted)]">
            Pick up to {SHOWCASE_MAX} favorites to feature at the top of your Trainer Card. The first becomes your avatar.
          </p>
          {ownedSprites.length === 0 ? (
            <p className="rounded-lg bg-[var(--panel)] px-3 py-2 text-[11px] text-[var(--muted)]">
              Mark some sprites as owned first — then you can showcase them here.
            </p>
          ) : (
            <div className="grid max-h-44 grid-cols-6 gap-1.5 overflow-y-auto rounded-lg bg-[var(--panel)] p-2 sm:grid-cols-7">
              {ownedSprites.map((s) => {
                const idx = showcase.indexOf(s.id)
                const picked = idx >= 0
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleShowcase(s.id)}
                    title={`${s.typeName}${s.themeId !== 'normal' ? ` · ${s.themeId}` : ''}${picked ? ' — in showcase' : ''}`}
                    aria-pressed={picked}
                    className={`relative grid aspect-square place-items-center overflow-hidden rounded-lg border ${picked ? 'border-[var(--brand)] ring-1 ring-[var(--brand)]' : 'border-transparent hover:border-[var(--border)]'}`}
                  >
                    <SpriteArt sprite={s} className="h-full w-full" />
                    {picked && (
                      <span className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-bl-lg bg-[var(--brand)] text-[9px] font-extrabold text-black">
                        {idx + 1}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-4 rounded-lg bg-[var(--bg-2)] px-3 py-2 text-[11px] text-[var(--muted)]">
          Your collection is tracked manually — Fortnite doesn’t provide a way for apps to read your owned sprites.
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between pt-4">
          <button onClick={async () => { await signOut(); onClose() }} title="Sign out of your account" className="rounded-xl bg-[var(--panel-2)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--border)]">
            Sign out
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--muted)]">Sure?</span>
              <button onClick={deleteData} disabled={busy} title="Permanently delete your profile & cloud collection — this can't be undone" className="rounded-xl bg-red-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">
                {busy ? 'Deleting…' : 'Delete everything'}
              </button>
              <button onClick={() => setConfirmDelete(false)} title="Cancel — keep my data" className="text-[11px] text-[var(--muted)] hover:text-white">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} title="Permanently delete your account data" className="text-[11px] font-bold text-red-300 hover:text-red-200">
              Delete my data
            </button>
          )}
        </div>

        {/* Save bar — always visible & sticky, so it's never ambiguous whether
            your edits are stored. Shows the live saved/unsaved state and only
            enables Save when something actually changed. */}
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--panel)]/95 px-6 py-3 backdrop-blur">
          {dirty ? (
            <span className="text-xs font-bold text-amber-300">● Unsaved changes</span>
          ) : (
            <span className="text-xs font-bold text-emerald-300">✓ All changes saved</span>
          )}
          <div className="flex items-center gap-2">
            {dirty && !savingProfile && (
              <button onClick={discardChanges} title="Discard your unsaved changes" className="rounded-lg px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-white">
                Discard
              </button>
            )}
            <button
              onClick={saveProfile}
              disabled={!dirty || savingProfile}
              title={dirty ? 'Save your profile changes' : 'Nothing to save'}
              className="rounded-lg bg-[var(--brand)] px-4 py-1.5 text-xs font-extrabold text-black disabled:opacity-50"
            >
              {savingProfile ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
