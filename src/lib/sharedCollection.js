import { supabase } from './supabase'

// Normalize DB rows into a { sprite_id: {owned, mastered} } map.
export function rowsToMap(rows) {
  const map = {}
  for (const r of rows || []) {
    map[r.sprite_id] = {
      owned: !!r.owned,
      mastered: !!r.mastered,
      level: r.level ?? 0,
      forTrade: !!r.for_trade,
      wanted: !!r.wanted,
    }
  }
  return map
}

// Fetch a public profile + progress for the read-only share view.
//
// The profile comes from the get_shared_profile() RPC (security definer), not a
// direct table read: it returns only public display fields, and the saved Epic
// account ONLY when the player turned on public stats (stats_public && is_public).
// anon's direct SELECT on the Epic columns is revoked, so this RPC is the single
// gated path by which an Epic name can reach a viewer.
export async function fetchSharedCollection(userId) {
  const [{ data: profRows }, { data: rows }] = await Promise.all([
    supabase.rpc('get_shared_profile', { uid: userId }),
    supabase.from('sprite_progress').select('*').eq('user_id', userId),
  ])
  return { profile: Array.isArray(profRows) ? profRows[0] || null : profRows, tracking: rowsToMap(rows) }
}
