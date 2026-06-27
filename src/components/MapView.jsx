import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { MAP_IMAGE, MAP_LINK, KINDS, KIND_MAP } from '../data/mapMarkers'
import { fetchLivePois } from '../lib/livePois'
import { fetchMarkers, addMarker, voteMarker, deleteMarker } from '../lib/mapMarkersDb'

// Net confidence → visual weight. Unconfirmed spots are faded; confirmed ones
// are solid. Enough "not here" votes can push a spot below zero (greyed).
function confidence(m) {
  const net = m.confirms - m.stales
  if (net >= 3) return { opacity: 1, ring: '#fff' }
  if (net >= 1) return { opacity: 0.85, ring: '#ffffffcc' }
  if (net <= -2) return { opacity: 0.35, ring: '#ffffff55' }
  return { opacity: 0.6, ring: '#ffffff88' }
}

export default function MapView() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [pois, setPois] = useState([])
  const [poisLive, setPoisLive] = useState(false)
  const [markers, setMarkers] = useState([])
  const [imgOk, setImgOk] = useState(true)

  // Layer visibility: POIs + each community kind, all on by default.
  const [on, setOn] = useState(() => ({ pois: true, ...Object.fromEntries(KINDS.map((k) => [k.id, true])) }))

  const [addKind, setAddKind] = useState(null) // kind id when placing a new marker
  const [draft, setDraft] = useState(null) // { x, y, kind, label }
  const [selected, setSelected] = useState(null) // marker object
  const [busy, setBusy] = useState(false)

  const reload = useCallback(async () => {
    setMarkers(await fetchMarkers())
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [poiRes, ms] = await Promise.all([fetchLivePois(), fetchMarkers()])
      if (cancelled) return
      setPois(poiRes.pois)
      setPoisLive(poiRes.live)
      setMarkers(ms)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onMapClick = (e) => {
    if (!addKind) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSelected(null)
    setDraft({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, kind: addKind, label: '' })
  }

  const saveDraft = async () => {
    if (!draft || !user) return
    setBusy(true)
    const { error } = await addMarker({ kind: draft.kind, x: draft.x, y: draft.y, label: draft.label.trim(), userId: user.id })
    setBusy(false)
    if (error) {
      toast('Could not save the marker', 'error')
      return
    }
    toast(`${KIND_MAP[draft.kind].label.replace(/s$/, '')} added — thanks for contributing! 🙏`)
    setDraft(null)
    setAddKind(null)
    reload()
  }

  const castVote = async (vote) => {
    if (!selected || !user) return
    setBusy(true)
    const { error } = await voteMarker({ markerId: selected.id, userId: user.id, vote, current: selected.my_vote })
    setBusy(false)
    if (error) {
      toast('Could not record your vote', 'error')
      return
    }
    const fresh = await fetchMarkers()
    setMarkers(fresh)
    setSelected(fresh.find((m) => m.id === selected.id) || null)
  }

  const removeMarker = async () => {
    if (!selected) return
    setBusy(true)
    const { error } = await deleteMarker(selected.id)
    setBusy(false)
    if (error) {
      toast('Could not delete', 'error')
      return
    }
    toast('Marker removed')
    setSelected(null)
    reload()
  }

  const visibleMarkers = markers.filter((m) => on[m.kind])

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">🗺️ Island Map</h3>
        <a href={MAP_LINK} target="_blank" rel="noreferrer" className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">
          Open full map ↗
        </a>
      </div>

      {/* Layer toggles */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => setOn((s) => ({ ...s, pois: !s.pois }))}
          title={poisLive ? 'Named locations — pulled live from the Fortnite map API' : 'Named locations (approximate — live data unavailable)'}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: on.pois ? '#fff' : 'var(--panel-2)', color: on.pois ? '#000' : 'var(--muted)' }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: on.pois ? '#0008' : '#fff' }} />
          POIs {poisLive ? '· live' : ''}
        </button>
        {KINDS.map((k) => (
          <button
            key={k.id}
            onClick={() => setOn((s) => ({ ...s, [k.id]: !s[k.id] }))}
            title={k.note}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{ background: on[k.id] ? k.color : 'var(--panel-2)', color: on[k.id] ? '#000' : 'var(--muted)' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: on[k.id] ? '#0008' : k.color }} />
            {k.emoji} {k.label}
          </button>
        ))}
      </div>

      {/* Add controls */}
      {user ? (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[var(--muted)]">Add a spot:</span>
          {KINDS.map((k) => (
            <button
              key={k.id}
              onClick={() => { setAddKind(addKind === k.id ? null : k.id); setDraft(null); setSelected(null) }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                addKind === k.id ? 'text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'
              }`}
              style={addKind === k.id ? { background: k.color } : undefined}
            >
              {k.emoji} {k.label.replace(/s$/, '')}
            </button>
          ))}
          {addKind && <span className="text-[11px] font-bold text-[var(--brand)]">→ tap the map to place it</span>}
        </div>
      ) : (
        <p className="mb-3 text-[11px] text-[var(--muted)]">Log in to add &amp; confirm chest / fishing spots.</p>
      )}

      {/* Map + markers */}
      <div
        className={`relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)] ${addKind ? 'cursor-crosshair' : ''}`}
        onClick={onMapClick}
      >
        {imgOk ? (
          <img src={MAP_IMAGE} alt="Fortnite map" onError={() => setImgOk(false)} className="h-full w-full select-none object-cover" draggable={false} />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-sm text-[var(--muted)]">
            Couldn’t load the live map.{' '}
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="underline">Open the full interactive map ↗</a>
          </div>
        )}

        {/* POIs */}
        {imgOk && on.pois && pois.map((p, i) => (
          <div key={`poi-${i}`} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <span className="whitespace-nowrap rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white/90 backdrop-blur-sm">{p.label}</span>
          </div>
        ))}

        {/* Community markers */}
        {imgOk && visibleMarkers.map((m) => {
          const k = KIND_MAP[m.kind]
          const c = confidence(m)
          return (
            <button
              key={m.id}
              onClick={(e) => { e.stopPropagation(); setSelected(m); setDraft(null) }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${m.x}%`, top: `${m.y}%`, opacity: c.opacity }}
              title={`${k?.label}: ${m.label || '(no label)'} · ${m.confirms} confirmed`}
            >
              <span
                className={`block h-3.5 w-3.5 rounded-full border-2 shadow ${selected?.id === m.id ? 'ring-2 ring-white' : ''}`}
                style={{ background: k?.color || '#888', borderColor: c.ring }}
              />
            </button>
          )
        })}

        {/* Draft (pending new marker) */}
        {imgOk && draft && (
          <span
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-2 border-white"
            style={{ left: `${draft.x}%`, top: `${draft.y}%`, background: KIND_MAP[draft.kind].color }}
          />
        )}
      </div>

      {/* Draft form */}
      {draft && (
        <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
          <p className="mb-2 text-xs font-bold text-white">
            New {KIND_MAP[draft.kind].emoji} {KIND_MAP[draft.kind].label.replace(/s$/, '')} at {draft.x}%, {draft.y}%
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              autoFocus
              value={draft.label}
              onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
              placeholder="Label (optional) — e.g. “north of Sinister Strip”"
              className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
            />
            <button onClick={saveDraft} disabled={busy} className="rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-extrabold text-black disabled:opacity-60">
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setDraft(null)} className="rounded-lg bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* Selected marker detail + voting */}
      {selected && (
        <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-white">
                {KIND_MAP[selected.kind]?.emoji} {KIND_MAP[selected.kind]?.label.replace(/s$/, '')}
                {selected.label ? ` · ${selected.label}` : ''}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                ✓ {selected.confirms} confirmed · ⚠ {selected.stales} say it’s gone
              </p>
            </div>
            <button onClick={() => setSelected(null)} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
          </div>
          {user ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => castVote('confirm')}
                disabled={busy}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-60 ${selected.my_vote === 'confirm' ? 'bg-emerald-500 text-white' : 'bg-[var(--panel-2)] text-white hover:bg-[var(--border)]'}`}
              >
                ✓ {selected.my_vote === 'confirm' ? 'Confirmed' : 'Confirm it’s here'}
              </button>
              <button
                onClick={() => castVote('stale')}
                disabled={busy}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-60 ${selected.my_vote === 'stale' ? 'bg-red-500 text-white' : 'bg-[var(--panel-2)] text-white hover:bg-[var(--border)]'}`}
              >
                ⚠ Not here anymore
              </button>
              {selected.created_by === user.id && (
                <button onClick={removeMarker} disabled={busy} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-white disabled:opacity-60">
                  🗑 Delete
                </button>
              )}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-[var(--muted)]">Log in to confirm or flag this spot.</p>
          )}
        </div>
      )}

      <p className="mt-3 text-[10px] text-[var(--muted)]">
        Map image &amp; POIs via fortnite-api.com{poisLive ? ' (live)' : ''}. Chest, fishing &amp; pond spots are
        community-submitted &amp; confirmed — approximate, and they shift each update. Use the full interactive map for precision. Not affiliated with Epic Games.
      </p>
    </div>
  )
}
