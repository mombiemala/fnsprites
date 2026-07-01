import { supabase } from './supabase'

// Async trade board. Posts are world-readable; writes require a signed-in user.
export async function fetchTradePosts(spriteId = null) {
  const { data, error } = await supabase.rpc('trade_board_list', { p_sprite: spriteId })
  if (error) return []
  return (data || []).map((p) => ({
    ...p,
    wants: p.wants || [],
    offers: p.offers || [],
    methods: p.methods || [],
  }))
}

export async function createTradePost({ wants, offers, methods, note, contact, userId }) {
  const { data, error } = await supabase
    .from('trade_posts')
    .insert({
      user_id: userId,
      wants: wants || [],
      offers: offers || [],
      methods: methods && methods.length ? methods : ['index', 'full'],
      note: note || '',
      contact: contact || '',
    })
    .select()
    .maybeSingle()
  return { data, error }
}

export async function deleteTradePost(id) {
  const { error } = await supabase.from('trade_posts').delete().eq('id', id)
  return { error }
}

// Trade reputation. A vouch = "I traded/indexed with this collector and it went
// well." One vouch per pair (voucher_id defaults to auth.uid() in the DB); the
// RLS policy blocks self-vouching. Reputation counts are returned by the board
// and match RPCs (vouches / i_vouched).
export async function vouchForTrader(userId) {
  const { error } = await supabase.from('trade_vouches').insert({ vouchee_id: userId })
  return { error }
}

export async function unvouchTrader(userId) {
  const { error } = await supabase.from('trade_vouches').delete().eq('vouchee_id', userId)
  return { error }
}

// Posts that match the caller's wanted / for-trade sprites. `since` (ISO string)
// limits to posts newer than that (for the "new matches" badge).
export async function fetchTradeMatches(since = null) {
  const { data, error } = await supabase.rpc('trade_matches_for_me', since ? { p_since: since } : {})
  if (error) return []
  return (data || []).map((p) => ({ ...p, wants: p.wants || [], offers: p.offers || [], methods: p.methods || [] }))
}
