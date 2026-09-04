import { supabase } from './supabase'

// Community tier voting for the current-season Sprites (whose competitive meta
// isn't settled yet). Backed by public.sprite_tier_votes (one row per user per
// Sprite, RLS-guarded) + the public.sprite_tier_results() aggregate RPC, which
// returns only vote COUNTS (no user data). Voting requires a logged-in account.

export const VOTE_TIERS = ['S', 'A', 'B', 'C', 'D']

// Community results → { [spriteId]: { counts: {S,A,B,C,D}, total, consensus } }.
export async function fetchTierResults() {
  const { data, error } = await supabase.rpc('sprite_tier_results')
  if (error || !Array.isArray(data)) return {}
  const out = {}
  for (const row of data) {
    const s = (out[row.sprite_id] ||= { counts: { S: 0, A: 0, B: 0, C: 0, D: 0 }, total: 0, consensus: null })
    if (row.tier in s.counts) {
      s.counts[row.tier] = Number(row.votes) || 0
      s.total += Number(row.votes) || 0
    }
  }
  // Consensus = the tier with the most votes; ties break toward the higher tier.
  for (const s of Object.values(out)) {
    s.consensus = VOTE_TIERS.reduce((best, t) => (s.counts[t] > s.counts[best] ? t : best), 'S')
  }
  return out
}

// The signed-in user's own votes → { [spriteId]: tier }. RLS limits the read to
// the caller's rows, so no user filter is needed. Returns {} for guests.
export async function fetchMyVotes() {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) return {}
  const { data, error } = await supabase.from('sprite_tier_votes').select('sprite_id, tier')
  if (error || !data) return {}
  return Object.fromEntries(data.map((r) => [r.sprite_id, r.tier]))
}

// Cast (or change) the caller's vote for a Sprite. Upsert on (user_id, sprite_id).
export async function castVote(spriteId, tier) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) return { error: 'not-signed-in' }
  if (!VOTE_TIERS.includes(tier)) return { error: 'bad-tier' }
  const { error } = await supabase.from('sprite_tier_votes').upsert(
    { user_id: auth.user.id, sprite_id: spriteId, tier, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,sprite_id' },
  )
  return { error: error?.message || null }
}

// Remove the caller's vote for a Sprite.
export async function clearVote(spriteId) {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) return { error: 'not-signed-in' }
  const { error } = await supabase.from('sprite_tier_votes').delete().eq('sprite_id', spriteId)
  return { error: error?.message || null }
}
