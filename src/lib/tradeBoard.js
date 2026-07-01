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
