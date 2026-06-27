import { useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { useEscClose } from '../lib/useEscClose'
import { submitBugReport } from '../lib/bugReport'

export default function BugReportModal({ onClose }) {
  useEscClose(onClose)
  const { user } = useAuth()
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState(user?.email || '')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setBusy(true)
    const res = await submitBugReport({ message: message.trim(), contact: contact.trim(), userId: user?.id })
    setBusy(false)
    if (res.error) {
      toast('Could not send report — please try again', 'error')
    } else {
      toast('Thanks! Your report was sent 🙏')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Report a bug"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">Report a bug</h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Found a wrong sprite, bad data, or something broken? Let me know and I’ll fix it.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder="What’s wrong? (which sprite / page, what you expected…)"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
          <input
            type="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Your email (optional, if you want a reply)"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] py-2.5 text-sm font-extrabold text-black disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send report'}
          </button>
        </form>
      </div>
    </div>
  )
}
