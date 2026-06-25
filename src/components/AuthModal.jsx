import { useState } from 'react'
import { useAuth } from '../context/authStore'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const fn = mode === 'signin' ? signIn : signUp
    const res = await fn(email.trim(), password)
    setBusy(false)
    if (res.error) {
      setMsg({ type: 'error', text: res.error })
    } else if (res.needsConfirmation) {
      setMsg({
        type: 'info',
        text: 'Check your email to confirm your account, then sign in. Your guest progress will sync automatically.',
      })
    } else {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-2xl text-white">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h2>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-white">
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Save your sprite collection to the cloud and sync across devices.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
          {msg && (
            <p
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                msg.type === 'error' ? 'bg-red-500/15 text-red-300' : 'bg-sky-500/15 text-sky-200'
              }`}
            >
              {msg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] py-2.5 text-sm font-extrabold text-black disabled:opacity-60"
          >
            {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setMsg(null)
          }}
          className="mt-4 w-full text-center text-xs font-semibold text-[var(--muted)] hover:text-white"
        >
          {mode === 'signin' ? "No account? Create one" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
