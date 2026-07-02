import { useEffect } from 'react'

// Closes a modal on Escape and locks body scroll while open.
//
// `active` gates the effect: pass `false` while the modal is closed so the
// body scroll-lock only applies when something is actually shown. Components
// that are mounted only while open can omit it (defaults to true). Components
// that stay mounted and render `null` when closed (e.g. WelcomeModal) MUST
// pass their open state — otherwise the lock leaks and freezes page scroll.
export function useEscClose(onClose, active = true) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, active])
}
