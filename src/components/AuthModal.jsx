import { useState } from 'react'
import { useAuth } from '../context/authStore'
import { useEscClose } from '../lib/useEscClose'

export default function AuthModal({ onClose }) {
  useEscClose(onClose)
  const { signIn, signUp, signInWithProvider } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  const oauth = async (provider) => {
    setMsg(null)
    const res = await signInWithProvider(provider)
    if (res?.error) {
      setMsg({
        type: 'error',
        text:
          /not enabled|unsupported/i.test(res.error)
            ? `${provider[0].toUpperCase() + provider.slice(1)} sign-in isn’t enabled yet. Use email for now.`
            : res.error,
      })
    }
  }

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
          <button onClick={onClose} title="Close" aria-label="Close" className="text-[var(--muted)] hover:text-white">
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Save your sprite collection to the cloud and sync across devices.
        </p>

        <div className="mb-4 flex flex-col gap-2">
          <button
            onClick={() => oauth('google')}
            title="Sign in with your Google account"
            className="flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-[#1a2138] hover:opacity-90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6z"/><path fill="#34A853" d="M12 23c2.8 0 5.2-1 6.9-2.6l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.4 10.4 0 0 0 12 23z"/><path fill="#FBBC05" d="M6.2 14.5a6.2 6.2 0 0 1 0-4V7.8H2.7a10.4 10.4 0 0 0 0 9.4l3.5-2.7z"/><path fill="#EA4335" d="M12 5.4c1.5 0 2.9.5 4 1.5l3-3A10.4 10.4 0 0 0 2.7 7.8l3.5 2.7C7 8 9.3 5.4 12 5.4z"/></svg>
            Continue with Google
          </button>
        </div>
        <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold text-[var(--muted)]">
          <span className="h-px flex-1 bg-[var(--border)]" /> or email <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

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
            title={mode === 'signin' ? 'Sign in with your email & password' : 'Create your account'}
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
          title={mode === 'signin' ? 'Switch to creating a new account' : 'Switch to signing in'}
          className="mt-4 w-full text-center text-xs font-semibold text-[var(--muted)] hover:text-white"
        >
          {mode === 'signin' ? "No account? Create one" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
