import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ToastProvider'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
      {/* Privacy-friendly, cookieless — no-op until enabled in the Vercel dashboard */}
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  </StrictMode>,
)

// Register the service worker for installable / offline use, and keep open tabs
// fresh: check for a new worker on a short interval and whenever the tab regains
// focus, then auto-reload once the new worker takes control — so a deploy shows
// up without the user having to hard-refresh.
if ('serviceWorker' in navigator) {
  // The FIRST controllerchange on a brand-new visit is just the initial worker
  // claiming this page (not an update), so skip reloading for it. Every later
  // controllerchange means a new deploy activated → reload once.
  let skipFirstClaim = !navigator.serviceWorker.controller
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (skipFirstClaim) { skipFirstClaim = false; return }
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        if (!reg) return
        const check = () => reg.update().catch(() => {})
        setInterval(check, 60 * 1000) // poll for a new deploy ~every minute
        window.addEventListener('focus', check)
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') check()
        })
      })
      .catch(() => {})
  })
}
