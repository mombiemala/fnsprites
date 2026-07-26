import { useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { useEscClose } from '../lib/useEscClose'
import { supabase } from '../lib/supabase'

export default function ProfileModal({ onClose }) {
  useEscClose(onClose)
  const { user, profile, updateProfile, signOut } = useAuth()
  const { toast } = useToast()

  const [gamertag, setGamertag] = useState(profile?.gamertag || '')
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true)
  const [epicName, setEpicName] = useState(profile?.epic_username || '')
  const [epicPlatform, setEpicPlatform] = useState(profile?.epic_platform || 'epic')
  const [savingProfile, setSavingProfile] = useState(false)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const providers = user?.app_metadata?.providers || (user?.app_metadata?.provider ? [user.app_metadata.provider] : [])

  const saveProfile = async () => {
    setSavingProfile(true)
    const res = await updateProfile({
      gamertag: gamertag.trim() || null,
      is_public: isPublic,
      epic_username: epicName.trim() || null,
      epic_platform: epicPlatform,
    })
    setSavingProfile(false)
    toast(res.error ? res.error : 'Profile saved', res.error ? 'error' : undefined)
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
          <div className="mt-2 flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Public — appears on the leaderboard &amp; shareable link
            </label>
            <button onClick={saveProfile} disabled={savingProfile} title="Save your gamertag & visibility" className="shrink-0 rounded-lg bg-[var(--brand)] px-3 py-1.5 text-xs font-extrabold text-black disabled:opacity-60">
              {savingProfile ? 'Saving…' : 'Save'}
            </button>
          </div>
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
            Connect it once and the <b className="text-white">📊 Stats</b> tab auto‑loads your Battle Royale stats. Your match history must be <b className="text-white">public</b> (Epic → Settings → Account &amp; Privacy). Saved with the button above.
          </p>
        </div>

        <p className="mt-4 rounded-lg bg-[var(--bg-2)] px-3 py-2 text-[11px] text-[var(--muted)]">
          Your collection is tracked manually — Fortnite doesn’t provide a way for apps to read your owned sprites.
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
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
      </div>
    </div>
  )
}
