import { useEffect, useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { ALL_SPRITES, RELEASED_COUNT } from '../data/sprites'
import { generateCollectionImage, downloadDataUrl, CARD_THEMES } from '../lib/exportImage'
import { useEscClose } from '../lib/useEscClose'

const THEME_SWATCH = {
  midnight: 'linear-gradient(135deg,#141a30,#0a0f1e)',
  galaxy: 'linear-gradient(135deg,#241546,#0a0820)',
  ember: 'linear-gradient(135deg,#2a1710,#120a08)',
  slate: 'linear-gradient(135deg,#222839,#0c0f18)',
  forest: 'linear-gradient(135deg,#12291f,#08120d)',
}

// One home for everything "show off / share your collection": a live preview of
// the export image (Sprite-Locker matrix, incl. Holofoil), a Collection/Missing
// toggle, a PNG download, the Discord/Reddit caption, and — when logged in —
// your public share link. Reachable from the prominent button by the progress
// bars, so sharing isn't buried in the sidebar.
export default function ShareExportModal({ onClose }) {
  const { user, profile, tracking } = useAuth()
  const { toast } = useToast()
  useEscClose(onClose, true)

  const gamertag = profile?.gamertag || ''
  const [mode, setMode] = useState('collection')
  const [theme, setTheme] = useState('midnight')
  const [url, setUrl] = useState(null)
  const [rendering, setRendering] = useState(true)

  // Regenerate whenever the mode/theme changes. `rendering` is flipped on in the
  // click handlers (and starts true), so the effect only sets state after the
  // async render resolves — no synchronous setState in the effect.
  useEffect(() => {
    let alive = true
    const base = `${window.location.origin}${window.location.pathname}`
    const link = user ? `${base}?u=${user.id}` : base
    generateCollectionImage({ gamertag, tracking, mode, theme, shareUrl: link }).then((u) => {
      if (alive) { setUrl(u); setRendering(false) }
    })
    return () => { alive = false }
  }, [mode, theme, gamertag, tracking, user])

  const pick = (m) => { if (m !== mode) { setRendering(true); setMode(m) } }
  const pickTheme = (t) => { if (t !== theme) { setRendering(true); setTheme(t) } }

  const owned = ALL_SPRITES.filter((s) => !s.unreleased && tracking[s.id]?.owned).length
  const mastered = ALL_SPRITES.filter((s) => !s.unreleased && tracking[s.id]?.mastered).length
  const pct = RELEASED_COUNT ? Math.round((owned / RELEASED_COUNT) * 100) : 0
  const missing = RELEASED_COUNT - owned

  const base = `${window.location.origin}${window.location.pathname}`
  const shareUrl = user ? `${base}?u=${user.id}` : base
  const captionUrl = user && profile?.is_public ? shareUrl : base
  const who = gamertag.trim() ? `${gamertag.trim()}'s` : 'My'
  const caption = [
    `🧩 ${who} Fortnite sprite collection: ${owned}/${RELEASED_COUNT} (${pct}%)${mastered ? ` · ${mastered} mastered ⭐` : ''}`,
    missing > 0 ? `Still chasing ${missing} more sprite${missing === 1 ? '' : 's'}.` : `Full set — gotta catch ’em all! 🏆`,
    `Track & compare yours → ${captionUrl}`,
  ].join('\n')

  const copy = async (text, msg) => {
    try { await navigator.clipboard.writeText(text); toast(msg) }
    catch { toast('Could not copy — long-press to copy manually', 'error') }
  }
  const download = () => { if (url) downloadDataUrl(url, `fn-sprites-${mode}.png`) }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share & export"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3.5">
          <h2 className="font-display text-xl text-white">📤 Share &amp; export</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg px-2 py-1 text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Mode toggle */}
          <div className="mb-3 inline-flex rounded-xl bg-[var(--bg-2)] p-1">
            {[['collection', '🖼️ My collection'], ['missing', '🎯 Sprites I need']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => pick(m)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${mode === m ? 'bg-[var(--brand)] text-black' : 'text-[var(--muted)] hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Background theme swatches */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Background</span>
            {Object.keys(CARD_THEMES).map((t) => (
              <button
                key={t}
                onClick={() => pickTheme(t)}
                title={CARD_THEMES[t].label}
                aria-label={CARD_THEMES[t].label}
                aria-pressed={theme === t}
                className={`h-7 w-7 rounded-lg border-2 transition-transform hover:scale-105 ${theme === t ? 'border-[var(--brand)]' : 'border-[var(--border)]'}`}
                style={{ background: THEME_SWATCH[t] }}
              />
            ))}
          </div>

          {/* Live preview */}
          <div className="mb-4 grid min-h-[220px] place-items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-2">
            {rendering || !url ? (
              <div className="flex flex-col items-center gap-2 py-10 text-[var(--muted)]">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]" />
                <span className="text-xs">Rendering preview…</span>
              </div>
            ) : (
              <img src={url} alt="Collection export preview" className="max-h-[46vh] w-auto max-w-full rounded-lg" />
            )}
          </div>

          <button
            onClick={download}
            disabled={rendering || !url}
            className="mb-4 w-full rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-4 py-2.5 text-sm font-extrabold text-black disabled:opacity-60"
          >
            ⬇️ Download PNG {mode === 'missing' ? '(sprites I need)' : '(my collection)'}
          </button>

          {/* Caption */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Caption for Discord / Reddit</p>
            <pre className="mb-2 whitespace-pre-wrap break-words rounded-lg bg-[var(--panel)] p-2.5 text-xs text-[var(--text)]/90">{caption}</pre>
            <button onClick={() => copy(caption, 'Caption copied — paste into Discord/Reddit!')} className="w-full rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]">
              📋 Copy caption
            </button>
          </div>

          {/* Share link (logged in) */}
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
            {user ? (
              <>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">Your shareable link</p>
                <div className="flex items-center gap-2">
                  <input readOnly value={shareUrl} className="flex-1 truncate rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--muted)] outline-none" />
                  <button onClick={() => copy(shareUrl, 'Share link copied!')} className="rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]">Copy</button>
                </div>
                {!profile?.is_public && (
                  <p className="mt-2 text-[11px] text-[var(--muted)]">Your profile is private — turn on “Public link” in Profile so others can open it.</p>
                )}
              </>
            ) : (
              <p className="text-xs text-[var(--muted)]">
                Playing as a guest — your progress saves in this browser.{' '}
                <b className="text-white">Log in</b> to get a shareable link with your gamertag.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
