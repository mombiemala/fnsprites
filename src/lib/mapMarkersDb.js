import { supabase } from './supabase'

// Community map markers backed by Supabase. Markers belong to a map (the global
// community map or a user's own/shared map). Reads/writes are governed by RLS.

// Fetch markers for a map, with confirm/stale tallies and the caller's vote.
export async function fetchMarkers(mapId, includeRetired = false) {
  const { data, error } = await supabase.rpc('map_markers_list', {
    p_map_id: mapId,
    p_include_retired: includeRetired,
  })
  if (error) return []
  return (data || []).map((m) => ({
    ...m,
    x: Number(m.x),
    y: Number(m.y),
    confirms: Number(m.confirms) || 0,
    stales: Number(m.stales) || 0,
  }))
}

// Drop a new marker on a map. `source` is optional attribution.
export async function addMarker({ mapId, kind, x, y, label, source, userId }) {
  const { data, error } = await supabase
    .from('map_markers')
    .insert({ map_id: mapId, kind, x, y, label: label || '', source: source || '', created_by: userId })
    .select()
    .maybeSingle()
  return { data, error }
}

// Move a marker (drag-to-reposition). Allowed for the creator or a map manager.
export async function moveMarker({ id, x, y }) {
  const { error } = await supabase.from('map_markers').update({ x, y }).eq('id', id)
  return { error }
}

// Set (or clear) the caller's vote on a marker (toggle).
export async function voteMarker({ markerId, userId, vote, current }) {
  if (!vote || vote === current) {
    const { error } = await supabase
      .from('map_marker_votes')
      .delete()
      .eq('marker_id', markerId)
      .eq('user_id', userId)
    return { error, cleared: true }
  }
  const { error } = await supabase
    .from('map_marker_votes')
    .upsert({ marker_id: markerId, user_id: userId, vote })
  return { error }
}

// Retire (archive) a marker — kept for history, hidden from the active map.
export async function retireMarker({ id, userId }) {
  const { error } = await supabase
    .from('map_markers')
    .update({ retired_at: new Date().toISOString(), retired_by: userId })
    .eq('id', id)
  return { error }
}

// Bring a retired marker back.
export async function unretireMarker(id) {
  const { error } = await supabase
    .from('map_markers')
    .update({ retired_at: null, retired_by: null })
    .eq('id', id)
  return { error }
}

// Hard-delete a marker. Blocked by a DB trigger for confirmed community spots
// (retire those instead) — surfaces as an error the UI can show.
export async function deleteMarker(id) {
  const { error } = await supabase.from('map_markers').delete().eq('id', id)
  return { error }
}
