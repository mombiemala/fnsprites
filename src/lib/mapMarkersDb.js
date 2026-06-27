import { supabase } from './supabase'

// Community map markers backed by Supabase. Markers are world-readable; writes
// (create / vote / delete) require a signed-in user and are guarded by RLS.

// Fetch all markers with confirm/stale tallies and the caller's own vote.
export async function fetchMarkers() {
  const { data, error } = await supabase.rpc('map_markers_list')
  if (error) return []
  return (data || []).map((m) => ({
    ...m,
    x: Number(m.x),
    y: Number(m.y),
    confirms: Number(m.confirms) || 0,
    stales: Number(m.stales) || 0,
  }))
}

// Drop a new marker. Returns { error } on failure.
export async function addMarker({ kind, x, y, label, userId }) {
  const { data, error } = await supabase
    .from('map_markers')
    .insert({ kind, x, y, label: label || '', created_by: userId })
    .select()
    .maybeSingle()
  return { data, error }
}

// Set (or clear) the caller's vote on a marker. Passing the same vote again
// clears it (toggle); passing null clears it.
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

// Delete a marker you created.
export async function deleteMarker(id) {
  const { error } = await supabase.from('map_markers').delete().eq('id', id)
  return { error }
}
