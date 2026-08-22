// Community Garden Gallery API — screenshots of players' in-game Sprite Gardens.
// Backed by the `garden_showcases` table + `garden-showcases` storage bucket and
// the security-definer `garden_feed` RPC (see the garden_showcases_gallery
// migration). Moderation: pre-upload heuristic (imageModeration) + report →
// auto-hide at 3 reports + owner/maker delete (enforced by RLS).
import { supabase } from './supabase'
import { moderateImage } from './imageModeration'

const BUCKET = 'garden-showcases'

// The maker's email — matched server-side (RLS) for moderation delete, and used
// client-side to show the delete affordance on any card.
export const MAKER_EMAIL = 'dontbemad@gmail.com'

export function gardenImageUrl(path) {
  if (!path) return null
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// Newest-first feed of visible showcases, each with a resolved image URL.
export async function fetchGardenFeed({ limit = 30, offset = 0 } = {}) {
  const { data, error } = await supabase.rpc('garden_feed', { p_limit: limit, p_offset: offset })
  if (error) throw error
  return (data || []).map((r) => ({ ...r, imageUrl: gardenImageUrl(r.image_path) }))
}

// Validate + upload a screenshot, then create the showcase row. Throws on any
// failure (not signed in, moderation reject, storage/insert error).
export async function uploadGardenShowcase({ file, caption = '' }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Please log in to share your garden.')

  const verdict = await moderateImage(file)
  if (!verdict.ok) throw new Error(verdict.reason)

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (upErr) throw upErr

  const { data, error } = await supabase
    .from('garden_showcases')
    .insert({ image_path: path, caption: caption.trim().slice(0, 200) })
    .select()
    .single()
  if (error) {
    // Roll back the orphaned upload if the row insert failed.
    await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
    throw error
  }
  return { ...data, imageUrl: gardenImageUrl(path) }
}

// Like / unlike — the DB trigger keeps like_count in sync.
export async function toggleGardenLike(showcaseId, currentlyLiked) {
  if (currentlyLiked) {
    const { error } = await supabase.from('garden_likes').delete().eq('showcase_id', showcaseId)
    if (error) throw error
    return false
  }
  const { error } = await supabase.from('garden_likes').insert({ showcase_id: showcaseId })
  if (error && error.code !== '23505') throw error // ignore "already liked"
  return true
}

// Report a showcase (unique per user); the DB trigger auto-hides at 3 reports.
export async function reportGardenShowcase(showcaseId) {
  const { error } = await supabase.from('garden_reports').insert({ showcase_id: showcaseId })
  if (error && error.code !== '23505') throw error // ignore "already reported"
}

// Delete a showcase (RLS allows the owner or the maker) + its stored image.
export async function deleteGardenShowcase({ id, imagePath }) {
  const { error } = await supabase.from('garden_showcases').delete().eq('id', id)
  if (error) throw error
  if (imagePath) await supabase.storage.from(BUCKET).remove([imagePath]).catch(() => {})
}

// Upload (into the same bucket, under the user's folder) a single screenshot to
// feature on the player's public Trainer Card. Returns the storage path — the
// caller saves it to profiles.garden_image_path via updateProfile.
export async function uploadProfileGardenImage({ file }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Please log in.')
  const verdict = await moderateImage(file)
  if (!verdict.ok) throw new Error(verdict.reason)
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${user.id}/profile-${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false })
  if (error) throw error
  return path
}

// Remove a stored profile garden image (best-effort).
export async function removeProfileGardenImage(path) {
  if (path) await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
}
