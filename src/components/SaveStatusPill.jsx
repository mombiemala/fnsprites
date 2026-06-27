import { useState } from 'react'
import { useAuth } from '../context/authStore'

// A small floating save-status pill anchored to the bottom-center of the
// viewport. The header chip is easy to miss (and hidden on mobile) while the
// user is down in the sprite grid tapping cards, so this surfaces the same
// state right where their eyes are: a persistent "Saving…" / error, plus a
// self-fading "Saved" confirmation after each successful write.
//
// Visibility is derived during render (no setState-in-effect) and the
// post-save fade is handled purely in CSS via the `.animate-save-pop`
// keyframes, re-armed by bumping a key each time a save completes.
export default function SaveStatusPill() {
  const { user, cloudStatus, syncing } = useAuth()
  const saving = cloudStatus === 'saving' || syncing
  const error = cloudStatus === 'error'

  // Detect the saving → done transition during render (React's "adjust state
  // during render" pattern) and bump a token so the green confirmation pill
  // re-mounts and replays its CSS fade. Using state (not refs) keeps the
  // strict react-hooks lint happy.
  const [prevSaving, setPrevSaving] = useState(saving)
  const [token, setToken] = useState(0)
  if (prevSaving !== saving) {
    setPrevSaving(saving)
    if (prevSaving && !saving && !error) setToken((t) => t + 1)
  }

  if (!user) return null

  const base =
    'pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4'
  const pill =
    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-lg ring-1 ring-black/20 backdrop-blur'

  if (error) {
    return (
      <div className={base} aria-live="assertive">
        <span className={`${pill} bg-red-500/90 text-white`}>
          ⚠ Couldn’t save — will retry on your next change
        </span>
      </div>
    )
  }

  if (saving) {
    return (
      <div className={base} aria-live="polite">
        <span className={`${pill} bg-amber-400/90 text-black`}>↻ Saving…</span>
      </div>
    )
  }

  // No active save. Show the self-fading confirmation only after a real save
  // has happened (token > 0); keyed so each save replays the animation.
  if (token === 0) return null
  return (
    <div className={base} aria-live="polite">
      <span
        key={token}
        className={`${pill} animate-save-pop bg-emerald-500/90 text-white`}
      >
        ✓ Saved to cloud
      </span>
    </div>
  )
}
