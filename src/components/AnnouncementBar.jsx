import { useState } from 'react'
import { ANNOUNCEMENTS } from '../data/announcements'

const KEY = 'fnsprites.dismissedNotes'

function loadDismissed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) || [])
  } catch {
    return new Set()
  }
}

// Active if today falls within the (optional) start–end window.
function isActive(a) {
  const today = new Date().toISOString().slice(0, 10)
  if (a.start && today < a.start) return false
  if (a.end && today > a.end) return false
  return true
}

const TONES = {
  info: 'from-[var(--brand)]/25 to-[var(--brand-2)]/20 border-[var(--brand)]/40',
  event: 'from-fuchsia-500/25 to-purple-500/20 border-fuchsia-400/40',
  alert: 'from-amber-500/25 to-red-500/20 border-amber-400/40',
}

// A single dismissible bar for the top-priority active announcement.
export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(loadDismissed)
  const note = ANNOUNCEMENTS.find((a) => isActive(a) && !dismissed.has(a.id))
  if (!note) return null

  const dismiss = () => {
    const next = new Set(dismissed)
    next.add(note.id)
    setDismissed(next)
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]))
    } catch {
      /* ignore quota / private-mode errors */
    }
  }

  return (
    <div className={`mb-4 flex items-center gap-3 rounded-2xl border bg-gradient-to-r px-4 py-3 ${TONES[note.tone] || TONES.info}`}>
      <span className="text-xl leading-none">{note.emoji}</span>
      <p className="flex-1 text-sm font-semibold text-white">
        {note.message}
        {note.link && (
          <a href={note.link} target="_blank" rel="noreferrer" className="ml-2 whitespace-nowrap underline hover:opacity-80">
            {note.linkLabel || 'Learn more'} ↗
          </a>
        )}
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="shrink-0 rounded-lg px-2 py-1 text-white/70 hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}
