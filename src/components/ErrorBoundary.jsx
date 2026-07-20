import { Component } from 'react'

// Unregister any service workers and drop all caches, then reload — the escape
// hatch for "stuck on a stale/broken cached build after an update."
async function clearAndReload() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))
    }
    if (window.caches) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
  } catch {
    /* best effort */
  }
  window.location.reload()
}

// App-wide safety net: any render error shows a recovery screen (with the error
// text, so it can be reported) instead of a blank white page. Styled inline so a
// missing/late stylesheet can't take the recovery UI down too.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface details for debugging / user bug reports.
    console.error('FN Sprite Tracker crashed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    const msg = String(this.state.error?.message || this.state.error)
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0c0f1a', color: '#e8ecf8', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <div style={{ maxWidth: 460, textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>🧩</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '10px 0 6px' }}>Something went wrong</h1>
          <p style={{ color: '#9aa4bf', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>
            The tracker hit an error while loading. This is often a stale cached file
            after an update — clearing it usually fixes it. Your saved progress isn’t affected.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#232a41', color: '#fff', border: 0, borderRadius: 12, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Reload
            </button>
            <button onClick={clearAndReload} style={{ background: 'linear-gradient(90deg,#36c5ff,#7b61ff)', color: '#000', border: 0, borderRadius: 12, padding: '10px 16px', fontWeight: 800, cursor: 'pointer' }}>
              Clear cache &amp; reload
            </button>
          </div>
          <pre style={{ marginTop: 16, textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#11162a', color: '#f6a5b5', fontSize: 11, padding: 10, borderRadius: 8, maxHeight: 120, overflow: 'auto' }}>{msg}</pre>
        </div>
      </div>
    )
  }
}
