import { supabase } from './supabase'

// Normalize DB rows into a { sprite_id: {owned, mastered} } map.
export function rowsToMap(rows) {
  const map = {}
  for (const r of rows || []) {
    map[r.sprite_id] = { owned: !!r.owned, mastered: !!r.mastered }
  }
  return map
}

// Fetch a public profile + progress for the read-only share view.
export async function fetchSharedCollection(userId) {
  const [{ data: prof }, { data: rows }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('sprite_progress').select('*').eq('user_id', userId),
  ])
  return { profile: prof, tracking: rowsToMap(rows) }
}
