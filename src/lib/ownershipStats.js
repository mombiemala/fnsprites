import { supabase } from './supabase'

// Community ownership aggregates from the `sprite_ownership_stats()` RPC — how
// many distinct collectors own (and have mastered) each Sprite variant, plus the
// total collector count, so we can show "owned by X% of collectors". The RPC is
// SECURITY DEFINER and returns COUNTS ONLY (no user identity) — same privacy-safe
// pattern as the tier-vote aggregates. Memoized for the session so opening many
// Sprite detail views only hits the network once.
let _promise

export function fetchOwnershipStats() {
  if (!_promise) _promise = load()
  return _promise
}

async function load() {
  try {
    const { data, error } = await supabase.rpc('sprite_ownership_stats')
    if (error || !Array.isArray(data)) return null
    const owners = {}
    const masters = {}
    let total = 0
    for (const r of data) {
      if (r.sprite_id === '__collectors__') {
        total = Number(r.owners) || 0
        continue
      }
      owners[r.sprite_id] = Number(r.owners) || 0
      masters[r.sprite_id] = Number(r.masters) || 0
    }
    return { total, owners, masters }
  } catch {
    return null
  }
}
