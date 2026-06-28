import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { MAP_IMAGE_CANDIDATES, MAP_LINK, KINDS, KIND_MAP, COMMUNITY_MAP_ID } from '../data/mapMarkers'
import { fetchLivePois } from '../lib/livePois'
import { fetchMarkers, addMarker, moveMarker, voteMarker, retireMarker, unretireMarker, deleteMarker } from '../lib/mapMarkersDb'
import { fetchMaps, createMap, updateMap, deleteMap, fetchShares, shareWithGamertag, unshare } from '../lib/maps'

// Net confidence → visual weight. Unconfirmed spots are faded; confirmed solid.
function confidence(m) {
  const net = m.confirms - m.stales
  if (net >= 3) return 1
  if (net >= 1) return 0.9
  return 0.62
}
// Community spots the crowd has downvoted are auto-hidden from the active view.
function downvoteHidden(m) {
  return m.stales - m.confirms >= 2
}

export default function MapView() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [maps, setMaps] = useState([])
  const [mapId, setMapId] = useState(COMMUNITY_MAP_ID)
  const [pois, setPois] = useState([])
  const [poisLive, setPoisLive] = useState(false)
  const [markers, setMarkers] = useState([])
  const [showRetired, setShowRetired] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const imgOk = imgIdx < MAP_IMAGE_CANDIDATES.length

  const [on, setOn] = useState(() => ({ pois: true, ...Object.fromEntries(KINDS.map((k) => [k.id, true])) }))
  const [addKind, setAddKind] = useState(null)
  const [draft, setDraft] = useState(null)
  const [selected, setSelected] = useState(null)
  const [movingId, setMovingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [showManage, setShowManage] = useState(false)

  const currentMap = maps.find((m) => m.id === mapId) || { id: COMMUNITY_MAP_ID, name: 'Community Map', is_community: true, visibility: 'public' }
  const canAdd = !!user && (currentMap.is_community || currentMap.mine || currentMap.role === 'editor')
  const canManageMarker = (m) => !!user && (m.created_by === user.id || currentMap.mine || currentMap.role === 'editor')

  // --- Zoom & pan (in-app, no out-linking to enlarge) ---
  const MIN_Z = 1
  const MAX_Z = 5
  const boxRef = useRef(null)
  const drag = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
  const clampPan = (p, z) => {
    const r = boxRef.current?.getBoundingClientRect()
    if (!r) return p
    return { x: clamp(p.x, -(z - 1) * r.width, 0), y: clamp(p.y, -(z - 1) * r.height, 0) }
  }
  // Screen coords → map percentage, accounting for the current zoom/pan.
  const toPct = (clientX, clientY) => {
    const r = boxRef.current.getBoundingClientRect()
    const mx = (clientX - r.left - pan.x) / zoom
    const my = (clientY - r.top - pan.y) / zoom
    return {
      x: clamp(Math.round((mx / r.width) * 1000) / 10, 0, 100),
      y: clamp(Math.round((my / r.height) * 1000) / 10, 0, 100),
    }
  }
  // Zoom toward a screen point (keeps that point steady).
  const zoomTo = (nextZoom, clientX, clientY) => {
    const r = boxRef.current.getBoundingClientRect()
    const cx = clientX != null ? clientX - r.left : r.width / 2
    const cy = clientY != null ? clientY - r.top : r.height / 2
    const z2 = clamp(nextZoom, MIN_Z, MAX_Z)
    const mapX = (cx - pan.x) / zoom
    const mapY = (cy - pan.y) / zoom
    setZoom(z2)
    setPan(clampPan({ x: cx - mapX * z2, y: cy - mapY * z2 }, z2))
  }
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const reload = useCallback(async () => {
    setMarkers(await fetchMarkers(mapId, showRetired))
  }, [mapId, showRetired])

  // Initial load: maps + live POIs.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [ms, poiRes] = await Promise.all([user ? fetchMaps() : Promise.resolve([]), fetchLivePois()])
      if (cancelled) return
      setMaps(ms.length ? ms : [{ id: COMMUNITY_MAP_ID, name: 'Community Map', is_community: true, visibility: 'public' }])
      setPois(poiRes.pois)
      setPoisLive(poiRes.live)
    })()
    return () => { cancelled = true }
  }, [user])

  // Reload markers whenever the selected map or retired-toggle changes.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const ms = await fetchMarkers(mapId, showRetired)
      if (!cancelled) setMarkers(ms)
    })()
    return () => { cancelled = true }
  }, [mapId, showRetired])

  // Place a marker / move a marker at a given map %.
  const placeAt = async ({ x, y }) => {
    if (movingId) {
      const id = movingId
      setMovingId(null)
      setMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, x, y } : m)))
      const { error } = await moveMarker({ id, x, y })
      if (error) { toast('Could not move marker', 'error'); reload() } else toast('Marker moved 📍')
      return
    }
    if (!addKind) return
    setSelected(null)
    setDraft({ x, y, kind: addKind, label: '', source: '' })
  }

  // Pointer handling on the map: drag to pan (when zoomed in), tap to place a
  // marker when in add/move mode, otherwise a tap on empty map deselects.
  const placing = !!addKind || !!movingId
  const onBoxPointerDown = (e) => {
    if (!imgOk) return
    drag.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y, moved: false }
    boxRef.current?.setPointerCapture?.(e.pointerId)
  }
  const onBoxPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true
    if (d.moved && !placing && zoom > 1) {
      setPan(clampPan({ x: d.px + dx, y: d.py + dy }, zoom))
    }
  }
  const onBoxPointerUp = (e) => {
    const d = drag.current
    drag.current = null
    if (!d || d.moved) return
    if (placing) placeAt(toPct(e.clientX, e.clientY))
    else setSelected(null)
  }

  const saveDraft = async () => {
    if (!draft || !user) return
    setBusy(true)
    const { error } = await addMarker({ mapId, kind: draft.kind, x: draft.x, y: draft.y, label: draft.label.trim(), source: draft.source.trim(), userId: user.id })
    setBusy(false)
    if (error) { toast('Could not save the marker', 'error'); return }
    toast(`${KIND_MAP[draft.kind].label.replace(/s$/, '')} added — thanks! 🙏`)
    setDraft(null); setAddKind(null); reload()
  }

  const castVote = async (vote) => {
    if (!selected || !user) return
    setBusy(true)
    const { error } = await voteMarker({ markerId: selected.id, userId: user.id, vote, current: selected.my_vote })
    setBusy(false)
    if (error) { toast('Could not record your vote', 'error'); return }
    const fresh = await fetchMarkers(mapId, showRetired)
    setMarkers(fresh)
    setSelected(fresh.find((m) => m.id === selected.id) || null)
  }

  const doRetire = async () => {
    if (!selected || !user) return
    setBusy(true)
    const { error } = await retireMarker({ id: selected.id, userId: user.id })
    setBusy(false)
    if (error) { toast('Could not retire', 'error'); return }
    toast('Marker retired — kept for history 🗄')
    setSelected(null); reload()
  }
  const doRestore = async () => {
    if (!selected) return
    setBusy(true)
    const { error } = await unretireMarker(selected.id)
    setBusy(false)
    if (error) { toast('Could not restore', 'error'); return }
    toast('Marker restored ♻')
    setSelected(null); reload()
  }
  const doDelete = async () => {
    if (!selected) return
    setBusy(true)
    const { error } = await deleteMarker(selected.id)
    setBusy(false)
    if (error) { toast(error.message || 'Confirmed spots can be retired, not deleted', 'error'); return }
    toast('Marker deleted')
    setSelected(null); reload()
  }

  const newMap = async () => {
    if (!user) return
    const name = window.prompt('Name your new map:', 'My markers')
    if (name === null) return
    const { data, error } = await createMap({ name: name.trim() || 'My map', visibility: 'private', ownerId: user.id })
    if (error || !data) { toast('Could not create map', 'error'); return }
    setMaps(await fetchMaps())
    setMapId(data.id)
    toast('Map created 🗺️')
  }

  const visibleMarkers = markers.filter((m) => on[m.kind] && (showRetired || !downvoteHidden(m)))

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-white">🗺️ Island Map</h3>
        <span className="text-[11px] text-[var(--muted)]">Pinch / +– to zoom · drag to pan</span>
      </div>

      {/* Map switcher */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <select
          value={mapId}
          onChange={(e) => { setMapId(e.target.value); setSelected(null); setAddKind(null); setMovingId(null); setShowManage(false) }}
          className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-2.5 py-1.5 text-xs font-bold text-white outline-none focus:border-[var(--brand)]"
        >
          {maps.map((m) => (
            <option key={m.id} value={m.id}>
              {m.is_community ? '🌐 ' : m.mine ? '👤 ' : '🤝 '}{m.name}{m.visibility === 'private' ? ' (private)' : m.visibility === 'shared' ? ' (shared)' : ''}
            </option>
          ))}
        </select>
        {user && (
          <button onClick={newMap} className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">＋ New</button>
        )}
        {currentMap.mine && (
          <button onClick={() => setShowManage((v) => !v)} className="rounded-lg bg-[var(--panel-2)] px-2.5 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">⚙ Manage</button>
        )}
        <label className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)]">
          <input type="checkbox" checked={showRetired} onChange={(e) => setShowRetired(e.target.checked)} />
          Show retired
        </label>
      </div>

      {showManage && currentMap.mine && (
        <ManagePanel map={currentMap} onChanged={async () => setMaps(await fetchMaps())} onDeleted={() => { setMapId(COMMUNITY_MAP_ID); setShowManage(false) }} />
      )}

      {/* How it works */}
      <p className="mb-3 rounded-lg bg-[var(--bg-2)] px-3 py-2 text-xs text-[var(--text)]/80">
        💡 Tap a marker to <b className="text-white">confirm</b> it’s still there or flag it gone. Zoom with the ＋/− buttons (or double-tap) and drag to pan.
        {canAdd ? ' To add a spot, pick a type below, then tap the map.' : user ? ' This map is read-only for you.' : ' Log in to add or confirm spots.'}
      </p>

      {/* Layer toggles */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button onClick={() => setOn((s) => ({ ...s, pois: !s.pois }))} className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: on.pois ? '#fff' : 'var(--panel-2)', color: on.pois ? '#000' : 'var(--muted)' }}>
          <span className="h-2 w-2 rounded-full" style={{ background: on.pois ? '#0008' : '#fff' }} />
          POIs {poisLive ? '· live' : ''}
        </button>
        {KINDS.map((k) => (
          <button key={k.id} onClick={() => setOn((s) => ({ ...s, [k.id]: !s[k.id] }))} title={k.note}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{ background: on[k.id] ? k.color : 'var(--panel-2)', color: on[k.id] ? '#000' : 'var(--muted)' }}>
            <span className="h-2 w-2 rounded-full" style={{ background: on[k.id] ? '#0008' : k.color }} />
            {k.emoji} {k.label}
          </button>
        ))}
      </div>

      {/* Add controls */}
      {canAdd && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[var(--muted)]">Add a spot:</span>
          {KINDS.map((k) => (
            <button key={k.id}
              onClick={() => { setAddKind(addKind === k.id ? null : k.id); setDraft(null); setSelected(null); setMovingId(null) }}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${addKind === k.id ? 'text-black' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'}`}
              style={addKind === k.id ? { background: k.color } : undefined}>
              {k.emoji} {k.label.replace(/s$/, '')}
            </button>
          ))}
        </div>
      )}

      {/* Map + markers (zoom/pan in-app) */}
      <div
        ref={boxRef}
        onPointerDown={onBoxPointerDown}
        onPointerMove={onBoxPointerMove}
        onPointerUp={onBoxPointerUp}
        onPointerCancel={() => { drag.current = null }}
        onDoubleClick={(e) => zoomTo(zoom * 1.6, e.clientX, e.clientY)}
        className={`relative mx-auto aspect-square w-full max-w-xl select-none overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)] ${
          zoom > 1 || placing ? 'touch-none' : ''
        } ${placing ? 'cursor-crosshair' : zoom > 1 ? 'cursor-grab' : ''}`}
      >
        {imgOk ? (
          /* Transformed layer: image + POIs + markers all zoom/pan together */
          <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
            <img src={MAP_IMAGE_CANDIDATES[imgIdx]} alt="Fortnite map" onError={() => setImgIdx((i) => i + 1)} className="h-full w-full select-none object-cover" draggable={false} />

            {on.pois && pois.map((p, i) => (
              <div key={`poi-${i}`} className="pointer-events-none absolute origin-center" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%,-50%) scale(${1 / zoom})` }}>
                <span className="whitespace-nowrap rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur-sm">{p.label}</span>
              </div>
            ))}

            {visibleMarkers.map((m) => {
              const k = KIND_MAP[m.kind]
              const unconfirmedSeed = m.seeded && m.confirms - m.stales < 1
              const retired = !!m.retired_at
              const isSel = selected?.id === m.id
              return (
                <button
                  key={m.id}
                  onClick={(e) => { e.stopPropagation(); if (!movingId) { setSelected(m); setDraft(null) } }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute origin-center"
                  style={{ left: `${m.x}%`, top: `${m.y}%`, transform: `translate(-50%,-50%) scale(${1 / zoom})`, opacity: retired ? 0.5 : confidence(m), zIndex: isSel ? 5 : 1 }}
                  title={`${k?.label}: ${m.label || '(no label)'} · ${m.confirms} confirmed${retired ? ' · retired' : ''}`}
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full shadow-md"
                    style={{
                      background: 'rgba(10,12,20,0.82)',
                      border: `2px ${unconfirmedSeed || retired ? 'dashed' : 'solid'} ${k?.color || '#888'}`,
                      boxShadow: isSel ? '0 0 0 2px #fff, 0 1px 4px #000a' : '0 1px 4px #0008',
                    }}
                  >
                    <span className="text-sm leading-none" style={{ filter: retired ? 'grayscale(1)' : 'none' }}>{k?.emoji}</span>
                  </span>
                </button>
              )
            })}

            {draft && (
              <span className="pointer-events-none absolute grid origin-center place-items-center rounded-full border-2 border-white shadow-md" style={{ left: `${draft.x}%`, top: `${draft.y}%`, height: 28, width: 28, transform: `translate(-50%,-50%) scale(${1 / zoom})`, background: KIND_MAP[draft.kind].color }}>
                <span className="animate-pulse text-sm leading-none">{KIND_MAP[draft.kind].emoji}</span>
              </span>
            )}
          </div>
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-sm text-[var(--muted)]">
            Couldn’t load the map image.{' '}
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="underline">Open fortnite.gg map ↗</a>
          </div>
        )}

        {/* Overlays (fixed to the viewport box, do not zoom) */}
        {imgOk && movingId && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-[var(--brand)] px-3 py-2 text-center text-xs font-extrabold text-black">
            📍 Tap the map to move this marker
          </div>
        )}
        {imgOk && addKind && !draft && !movingId && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 bg-[var(--brand)] px-3 py-2 text-xs font-extrabold text-black">
            <span>👆 Tap the map to place a {KIND_MAP[addKind].emoji} {KIND_MAP[addKind].label.replace(/s$/, '')}</span>
            <button onClick={(e) => { e.stopPropagation(); setAddKind(null) }} className="pointer-events-auto rounded bg-black/20 px-2 py-0.5">Cancel</button>
          </div>
        )}
        {imgOk && markers.length === 0 && !addKind && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 rounded-lg bg-black/70 px-3 py-2 text-center text-[11px] font-semibold text-white backdrop-blur">
            No spots on this map yet{canAdd ? ' — pick a type above and tap to add one!' : ''}
          </div>
        )}

        {/* Zoom controls */}
        {imgOk && (
          <div className="absolute right-2 top-2 z-20 flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-black/60 backdrop-blur">
            <button onClick={() => zoomTo(zoom * 1.5)} aria-label="Zoom in" className="grid h-8 w-8 place-items-center text-lg font-bold text-white hover:bg-white/10">＋</button>
            <button onClick={() => zoomTo(zoom / 1.5)} aria-label="Zoom out" className="grid h-8 w-8 place-items-center border-t border-white/15 text-lg font-bold text-white hover:bg-white/10">−</button>
            {zoom > 1 && (
              <button onClick={resetView} aria-label="Reset zoom" className="grid h-8 w-8 place-items-center border-t border-white/15 text-xs font-bold text-white hover:bg-white/10">⤢</button>
            )}
          </div>
        )}
      </div>

      {/* Draft form */}
      {draft && (
        <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
          <p className="mb-2 text-xs font-bold text-white">
            New {KIND_MAP[draft.kind].emoji} {KIND_MAP[draft.kind].label.replace(/s$/, '')} at {draft.x}%, {draft.y}%
          </p>
          <div className="flex flex-col gap-2">
            <input autoFocus value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
              placeholder="Label (optional) — e.g. “north of Sinister Strip”"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]" />
            <input value={draft.source} onChange={(e) => setDraft((d) => ({ ...d, source: e.target.value }))}
              placeholder="Source (optional) — a guide URL or where you saw it"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]" />
            <div className="flex gap-2">
              <button onClick={saveDraft} disabled={busy} className="rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-extrabold text-black disabled:opacity-60">{busy ? 'Saving…' : 'Save spot'}</button>
              <button onClick={() => setDraft(null)} className="rounded-lg bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Selected marker detail */}
      {selected && (
        <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-white">
                {KIND_MAP[selected.kind]?.emoji} {KIND_MAP[selected.kind]?.label.replace(/s$/, '')}
                {selected.label ? ` · ${selected.label}` : ''}
                {selected.seeded && <span className="ml-1 rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--muted)]">📋 from guide</span>}
                {selected.retired_at && <span className="ml-1 rounded bg-[var(--panel-2)] px-1.5 py-0.5 text-[9px] font-bold text-amber-300">🗄 retired</span>}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                ✓ {selected.confirms} confirmed · ⚠ {selected.stales} say it’s gone
                {selected.seeded && selected.confirms - selected.stales < 1 ? ' · approximate, please confirm' : ''}
              </p>
              {selected.source && (
                <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                  Source:{' '}
                  {/^https?:\/\//.test(selected.source)
                    ? <a href={selected.source} target="_blank" rel="noreferrer" className="underline hover:text-white">{selected.source}</a>
                    : <span className="text-[var(--text)]/80">{selected.source}</span>}
                </p>
              )}
            </div>
            <button onClick={() => setSelected(null)} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
          </div>
          {user ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {!selected.retired_at && (
                <>
                  <button onClick={() => castVote('confirm')} disabled={busy}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-60 ${selected.my_vote === 'confirm' ? 'bg-emerald-500 text-white' : 'bg-[var(--panel-2)] text-white hover:bg-[var(--border)]'}`}>
                    ✓ {selected.my_vote === 'confirm' ? 'Confirmed' : 'Confirm it’s here'}
                  </button>
                  <button onClick={() => castVote('stale')} disabled={busy}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-60 ${selected.my_vote === 'stale' ? 'bg-red-500 text-white' : 'bg-[var(--panel-2)] text-white hover:bg-[var(--border)]'}`}>
                    ⚠ Not here anymore
                  </button>
                </>
              )}
              {canManageMarker(selected) && !selected.retired_at && (
                <>
                  <button onClick={() => { setMovingId(selected.id); setSelected(null) }} disabled={busy} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">📍 Move</button>
                  <button onClick={doRetire} disabled={busy} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-[var(--border)]">🗄 Retire</button>
                  <button onClick={doDelete} disabled={busy} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-white">🗑 Delete</button>
                </>
              )}
              {canManageMarker(selected) && selected.retired_at && (
                <button onClick={doRestore} disabled={busy} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-[var(--border)]">♻ Restore</button>
              )}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-[var(--muted)]">Log in to confirm or flag this spot.</p>
          )}
        </div>
      )}

      <p className="mt-3 text-[10px] text-[var(--muted)]">
        Map image &amp; POIs {poisLive ? 'live from' : 'via'} fortnite-api.com. Sprite-chest spots are seeded from public guides
        (dashed = unconfirmed — tap to verify) and refined by the community; other spots are player-submitted.
        Retired spots are archived for history. All approximate &amp; shift each update. Not affiliated with Epic Games.
      </p>
    </div>
  )
}

// --- Owner-only map settings + sharing ---
function ManagePanel({ map, onChanged, onDeleted }) {
  const { toast } = useToast()
  const [name, setName] = useState(map.name)
  const [visibility, setVisibility] = useState(map.visibility)
  const [shares, setShares] = useState([])
  const [gt, setGt] = useState('')
  const [role, setRole] = useState('viewer')
  const [busy, setBusy] = useState(false)

  const loadShares = useCallback(async () => setShares(await fetchShares(map.id)), [map.id])
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const s = await fetchShares(map.id)
      if (!cancelled) setShares(s)
    })()
    return () => { cancelled = true }
  }, [map.id])

  const save = async () => {
    setBusy(true)
    const { error } = await updateMap(map.id, { name: name.trim() || 'My map', visibility })
    setBusy(false)
    if (error) { toast('Could not save', 'error'); return }
    toast('Map updated'); onChanged()
  }
  const addShare = async () => {
    if (!gt.trim()) return
    setBusy(true)
    const { error } = await shareWithGamertag({ mapId: map.id, gamertag: gt.trim(), role })
    setBusy(false)
    if (error) { toast(error.message || 'Could not share', 'error'); return }
    setGt(''); toast('Shared ✓'); loadShares()
  }
  const removeShare = async (userId) => {
    await unshare({ mapId: map.id, userId })
    loadShares()
  }
  const removeMap = async () => {
    if (!window.confirm('Delete this map and all its markers? This can’t be undone.')) return
    const { error } = await deleteMap(map.id)
    if (error) { toast('Could not delete map', 'error'); return }
    toast('Map deleted'); onDeleted(); onChanged()
  }

  return (
    <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] p-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-[11px] font-bold text-[var(--muted)]">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[var(--brand)]" />
        </label>
        <label className="flex flex-col gap-1 text-[11px] font-bold text-[var(--muted)]">
          Visibility
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[var(--brand)]">
            <option value="private">Private (just me)</option>
            <option value="shared">Shared (specific players)</option>
            <option value="public">Public (anyone with the app)</option>
          </select>
        </label>
        <button onClick={save} disabled={busy} className="rounded-lg bg-[var(--brand)] px-3 py-1.5 text-xs font-extrabold text-black disabled:opacity-60">Save</button>
      </div>

      {visibility === 'shared' && (
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-bold text-[var(--muted)]">Share with a player (by gamertag):</p>
          <div className="flex flex-wrap gap-2">
            <input value={gt} onChange={(e) => setGt(e.target.value)} placeholder="Gamertag" className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-2.5 py-1.5 text-xs text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[var(--brand)]">
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button onClick={addShare} disabled={busy} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--border)]">Add</button>
          </div>
          {shares.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {shares.map((s) => (
                <li key={s.user_id} className="flex items-center justify-between rounded-lg bg-[var(--panel)] px-2.5 py-1.5 text-xs text-white">
                  <span>{s.gamertag || 'Player'} <span className="text-[var(--muted)]">· {s.role}</span></span>
                  <button onClick={() => removeShare(s.user_id)} className="text-[var(--muted)] hover:text-white">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button onClick={removeMap} className="mt-3 text-[11px] font-bold text-red-300 hover:text-red-200">🗑 Delete this map</button>
    </div>
  )
}
