import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import {
  fetchGardenFeed, uploadGardenShowcase, toggleGardenLike,
  reportGardenShowcase, deleteGardenShowcase, MAKER_EMAIL,
} from '../lib/gardenApi'

const PAGE = 24

// Community Garden Gallery — players share screenshots of their in-game Sprite
// Garden. Upload is validated client-side (imageModeration); moderation is
// report → auto-hide (3) + owner/maker delete, enforced by RLS.
export default function GardenGallery({ onRequireLogin }) {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const isMaker = user?.email === MAKER_EMAIL

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [busy, setBusy] = useState(new Set()) // ids mid-action

  // Upload state
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const rows = await fetchGardenFeed({ limit: PAGE, offset: 0 })
        if (!alive) return
        setItems(rows); setHasMore(rows.length === PAGE)
      } catch {
        if (alive) toast('Couldn’t load the gallery — try again', 'error')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [toast])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const rows = await fetchGardenFeed({ limit: PAGE, offset: items.length })
      setItems((prev) => [...prev, ...rows]); setHasMore(rows.length === PAGE)
    } catch {
      toast('Couldn’t load more', 'error')
    } finally {
      setLoadingMore(false)
    }
  }

  const pickFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview((p) => { if (p) URL.revokeObjectURL(p); return URL.createObjectURL(f) })
  }
  const clearUpload = () => {
    setFile(null); setCaption('')
    setPreview((p) => { if (p) URL.revokeObjectURL(p); return null })
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = async () => {
    if (!file || uploading) return
    setUploading(true)
    try {
      const row = await uploadGardenShowcase({ file, caption })
      // Denormalise the poster's gamertag for immediate display.
      const withTag = { ...row, gamertag: profile?.gamertag || null, display_name: profile?.display_name || null, liked_by_me: false, like_count: 0 }
      setItems((prev) => [withTag, ...prev])
      clearUpload()
      toast('Shared to the Garden gallery 🌱')
    } catch (err) {
      toast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const mark = (id, on) => setBusy((prev) => { const n = new Set(prev); on ? n.add(id) : n.delete(id); return n })

  const onLike = async (row) => {
    if (!user) { onRequireLogin?.(); return }
    if (busy.has(row.id)) return
    const liked = !row.liked_by_me
    // Optimistic
    setItems((prev) => prev.map((r) => r.id === row.id
      ? { ...r, liked_by_me: liked, like_count: Math.max(0, r.like_count + (liked ? 1 : -1)) } : r))
    mark(row.id, true)
    try {
      await toggleGardenLike(row.id, row.liked_by_me)
    } catch {
      // Revert on failure
      setItems((prev) => prev.map((r) => r.id === row.id
        ? { ...r, liked_by_me: row.liked_by_me, like_count: row.like_count } : r))
      toast('Couldn’t update like', 'error')
    } finally { mark(row.id, false) }
  }

  const onReport = async (row) => {
    if (!user) { onRequireLogin?.(); return }
    if (!window.confirm('Report this screenshot for review? It’s hidden automatically once a few people report it.')) return
    try {
      await reportGardenShowcase(row.id)
      toast('Reported — thanks for keeping the garden tidy')
    } catch {
      toast('Couldn’t report — try again', 'error')
    }
  }

  const onDelete = async (row) => {
    if (!window.confirm('Delete this screenshot?')) return
    mark(row.id, true)
    try {
      await deleteGardenShowcase({ id: row.id, imagePath: row.image_path })
      setItems((prev) => prev.filter((r) => r.id !== row.id))
      toast('Deleted')
    } catch {
      toast('Couldn’t delete', 'error')
    } finally { mark(row.id, false) }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-6">
      <div className="mb-1 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-white">🌱 Community Garden Gallery</h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">Show off your in-game Sprite Garden — and browse everyone else’s.</p>
        </div>
        <a href="/sprite-garden" title="How the Sprite Garden works" className="shrink-0 rounded-lg bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-bold text-[var(--muted)] hover:text-white">Garden guide ↗</a>
      </div>

      {/* Upload */}
      {user ? (
        <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3">
          {!file ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-[var(--text)]/90">Share a screenshot of your Sprite Garden.</p>
              <button onClick={() => fileRef.current?.click()} className="rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-1.5 text-xs font-extrabold text-black">＋ Add screenshot</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <img src={preview} alt="Preview" className="h-40 w-full rounded-lg object-cover sm:w-56" />
              <div className="flex flex-1 flex-col gap-2">
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={200}
                  placeholder="Add a caption (optional)"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--brand)]"
                />
                <div className="mt-auto flex items-center gap-2">
                  <button onClick={submit} disabled={uploading} className="rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--brand-2)] px-3 py-1.5 text-xs font-extrabold text-black disabled:opacity-60">
                    {uploading ? 'Sharing…' : 'Share to gallery'}
                  </button>
                  <button onClick={clearUpload} disabled={uploading} className="rounded-lg bg-[var(--panel-2)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:text-white">Cancel</button>
                </div>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={pickFile} className="hidden" />
          <p className="mt-2 text-[10px] leading-relaxed text-[var(--muted)]">PNG/JPG/WebP up to 6 MB. Keep it to Sprite Garden screenshots — off-topic or inappropriate images are auto-checked, and anyone can report a post (hidden automatically after a few reports).</p>
        </div>
      ) : (
        <div className="mt-3 rounded-xl bg-[var(--bg-2)] p-3 text-sm text-[var(--muted)]">
          <button onClick={() => onRequireLogin?.()} className="font-bold text-[var(--brand)] underline">Log in</button> to share your own garden. Anyone can browse below.
        </div>
      )}

      {/* Feed */}
      {loading ? (
        <p className="mt-6 text-center text-sm text-[var(--muted)]">Loading the gallery…</p>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-xl bg-[var(--bg-2)] p-8 text-center">
          <p className="text-3xl">🪴</p>
          <p className="mt-2 font-display text-lg text-white">No gardens shared yet</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Be the first to plant one — share a screenshot above.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((row) => {
              const canDelete = isMaker || (user && row.user_id === user.id)
              return (
                <figure key={row.id} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-2)]">
                  <div className="aspect-video w-full overflow-hidden bg-black/30">
                    {row.imageUrl && <img src={row.imageUrl} alt={row.caption || 'Sprite Garden'} loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <figcaption className="p-3">
                    {row.caption && <p className="mb-1.5 text-sm text-white">{row.caption}</p>}
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-semibold text-[var(--muted)]">
                        {row.gamertag ? `@${row.gamertag}` : 'A collector'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onLike(row)}
                          disabled={busy.has(row.id)}
                          title={row.liked_by_me ? 'Unlike' : 'Like'}
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${row.liked_by_me ? 'bg-rose-400/15 text-rose-300' : 'bg-[var(--panel-2)] text-[var(--muted)] hover:text-white'}`}
                        >
                          {row.liked_by_me ? '♥' : '♡'} {row.like_count || 0}
                        </button>
                        <button onClick={() => onReport(row)} title="Report" className="rounded-lg bg-[var(--panel-2)] px-2 py-1 text-xs text-[var(--muted)] hover:text-amber-300">⚑</button>
                        {canDelete && <button onClick={() => onDelete(row)} disabled={busy.has(row.id)} title="Delete" className="rounded-lg bg-[var(--panel-2)] px-2 py-1 text-xs text-[var(--muted)] hover:text-rose-300">🗑</button>}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              )
            })}
          </div>
          {hasMore && (
            <div className="mt-4 text-center">
              <button onClick={loadMore} disabled={loadingMore} className="rounded-lg bg-[var(--panel-2)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60">
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}

      <p className="mt-4 text-[10px] leading-relaxed text-[var(--muted)]">Screenshots are shared by players and hosted for the gallery. Report anything off-topic or inappropriate; posts are hidden automatically after a few reports, and the maker can remove any post. Not affiliated with Epic Games.</p>
    </div>
  )
}
