import { supabase } from './supabase'

// Maps the current user can see: the community map + their own + shared-with-them.
// Each row: { id, name, visibility, is_community, owner_id, mine, role }.
export async function fetchMaps() {
  const { data, error } = await supabase.rpc('maps_list')
  if (error) return []
  return data || []
}

export async function createMap({ name, visibility, ownerId }) {
  const { data, error } = await supabase
    .from('maps')
    .insert({ name: name || 'My map', visibility: visibility || 'private', owner_id: ownerId })
    .select()
    .maybeSingle()
  return { data, error }
}

export async function updateMap(id, fields) {
  const { error } = await supabase.from('maps').update(fields).eq('id', id)
  return { error }
}

export async function deleteMap(id) {
  const { error } = await supabase.from('maps').delete().eq('id', id)
  return { error }
}

// Owner-only: who an owned map is shared with (with gamertags).
export async function fetchShares(mapId) {
  const { data, error } = await supabase.rpc('map_shares_list', { p_map_id: mapId })
  if (error) return []
  return data || []
}

// Share an owned map with a player by gamertag.
export async function shareWithGamertag({ mapId, gamertag, role }) {
  const { data: uid, error: e1 } = await supabase.rpc('find_user_by_gamertag', { tag: gamertag })
  if (e1) return { error: e1 }
  if (!uid) return { error: { message: 'No player found with that gamertag' } }
  const { error } = await supabase
    .from('map_shares')
    .upsert({ map_id: mapId, user_id: uid, role: role || 'viewer' })
  return { error, userId: uid }
}

export async function unshare({ mapId, userId }) {
  const { error } = await supabase.from('map_shares').delete().eq('map_id', mapId).eq('user_id', userId)
  return { error }
}
