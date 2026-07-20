import { useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { useEscClose } from '../lib/useEscClose'

// Guest backup / device transfer: encode the local collection into a copyable
// code, and restore it on another device. Signed-in users already sync to the
// cloud, so this is mainly for the no-login crowd.
const PREFIX = 'FNS1:'

function encode(tracking) {
  const compact = {}
  for (const [id, v] of Object.entries(tracking || {})) {
    if (v && (v.level > 0 || v.wanted)) compact[id] = [v.level | 0, v.forTrade ? 1 : 0, v.wanted ? 1 : 0]
  }
  return PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(compact))))
}

function decode(code) {
  const raw = code.trim().replace(/^FNS1:/, '')
  const obj = JSON.parse(decodeURIComponent(escape(atob(raw))))
  const incoming = {}
  for (const [id, a] of Object.entries(obj)) {
    incoming[id] = Array.isArray(a)
      ? { level: a[0] | 0, forTrade: !!a[1], wanted: !!a[2] }
      : a // tolerate a full object shape too
  }
  return incoming
}

export default function BackupModal({ onClose }) {
  useEscClose(onClose)
  const { tracking, importTracking, user } = useAuth()
  const { toast } = useToast()
  const [paste, setPaste] = useState('')
  const [copied, setCopied] = useState(false)

  const ownedCount = Object.values(tracking || {}).filter((v) => v?.level > 0).length
  const code = encode(tracking)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast('Backup code copied')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast('Could not copy — select the text and copy manually', 'error')
    }
  }

  const restore = () => {
    if (!paste.trim()) return
    try {
      const n = importTracking(decode(paste))
      toast(n ? `Restored — ${n} sprite${n === 1 ? '' : 's'} merged in` : 'Nothing new to restore')
      if (n) onClose()
    } catch {
      toast('That code isn’t valid — check you copied all of it', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Backup & restore"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">Backup &amp; restore</h2>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Move your progress to another device with a code. Restoring <b className="text-white">merges</b> (it never wipes what you already have).
          {user
            ? ' You’re logged in, so your collection already syncs to the cloud — this is a handy export too.'
            : ' Tip: logging in saves to the cloud automatically, no codes needed.'}
        </p>

        <div className="rounded-xl bg-[var(--bg-2)] p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Your backup code ({ownedCount} owned)</span>
            <button onClick={copy} title="Copy your backup code to the clipboard" className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[var(--border)]">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          <textarea readOnly value={code} rows={3} onFocus={(e) => e.target.select()}
            className="w-full resize-none break-all rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 font-mono text-[10px] text-[var(--muted)] outline-none" />
        </div>

        <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Restore from a code</span>
          <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={3} placeholder="Paste a backup code…"
            className="w-full resize-none break-all rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 font-mono text-[10px] text-white outline-none focus:border-[var(--brand)]" />
          <button onClick={restore} disabled={!paste.trim()} title="Restore progress from a backup code (merges with your current progress, never wipes)"
            className="mt-2 w-full rounded-xl bg-[var(--brand)] py-2 text-sm font-extrabold text-black disabled:opacity-50">
            Restore &amp; merge
          </button>
        </div>
      </div>
    </div>
  )
}
