import { useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'

export default function ShareBar({ onExport, exporting }) {
  const { user, profile, updateProfile } = useAuth()
  const { toast } = useToast()
  const [gamertag, setGamertag] = useState(profile?.gamertag || '')
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  // Re-seed the form fields when the loaded profile changes (React's
  // recommended "adjust state during render" pattern — avoids an effect).
  const [seededId, setSeededId] = useState(null)
  if (profile && profile.id !== seededId) {
    setSeededId(profile.id)
    setGamertag(profile.gamertag || '')
    setIsPublic(profile.is_public ?? true)
  }

  if (!user) return null

  const shareUrl = `${window.location.origin}${window.location.pathname}?u=${user.id}`

  const save = async () => {
    const res = await updateProfile({ gamertag: gamertag.trim() || null, is_public: isPublic })
    if (!res.error) {
      setSaved(true)
      toast('Profile saved')
      setTimeout(() => setSaved(false), 1500)
    } else {
      toast(res.error, 'error')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast('Share link copied!')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast('Could not copy link', 'error')
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="mb-3 font-display text-lg text-white">Share &amp; export</h3>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Gamertag
          </span>
          <input
            value={gamertag}
            onChange={(e) => setGamertag(e.target.value)}
            placeholder="Your Fortnite name"
            maxLength={32}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
        </label>
        <label className="flex items-center gap-2 pb-2 text-xs font-semibold text-[var(--muted)]">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Public link
        </label>
        <button
          onClick={save}
          className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-extrabold text-black"
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          readOnly
          value={shareUrl}
          className="flex-1 truncate rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs text-[var(--muted)] outline-none"
        />
        <button
          onClick={copy}
          className="rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]"
        >
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
      </div>
      {!isPublic && (
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          Your link is currently private — enable “Public link” and save so others can view it.
        </p>
      )}

      {onExport && (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="mb-2 text-xs font-semibold text-[var(--muted)]">Download a shareable PNG:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onExport('collection')}
              disabled={exporting}
              title="Owned sprites in full colour, missing ones dimmed"
              className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60"
            >
              {exporting ? 'Rendering…' : '⬇️ Collection image'}
            </button>
            <button
              onClick={() => onExport('missing')}
              disabled={exporting}
              title="Just the sprites you still need — handy for trades"
              className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60"
            >
              {exporting ? 'Rendering…' : '⬇️ Missing-sprites image'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
