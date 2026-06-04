import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Music2 } from 'lucide-react'

const SPOTIFY_GREEN = '#1DB954'
const WIDGET_WIDTH = 280
const POLL_INTERVAL_MS = 30_000
const SPOTIFY_API = 'https://api.spotify.com/v1/me/player/currently-playing'
const SPOTIFY_RECENT_API = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

const MOCK_TRACK = {
  isPlaying: true,
  status: 'now_playing',
  title: 'Redbone',
  artist: 'Childish Gambino',
  albumArt:
    'https://i.scdn.co/image/ab67616d0000b273ef77e47b2036c1d9ab6eb9e4',
  progressMs: 94_000,
  durationMs: 326_933,
  spotifyUrl: 'https://open.spotify.com/track/0wXuerDYhVugK1D7LSFt7n',
}

function isSpotifyConfigured() {
  return Boolean(import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN)
}

function mapSpotifyTrack(item, { isPlaying, status }) {
  const track = item?.item ?? item
  if (!track) return null

  return {
    isPlaying,
    status,
    title: track.name,
    artist: track.artists?.map((a) => a.name).join(', ') ?? 'Unknown artist',
    albumArt: track.album?.images?.[1]?.url ?? track.album?.images?.[0]?.url ?? null,
    progressMs: item.progress_ms ?? 0,
    durationMs: track.duration_ms ?? 0,
    spotifyUrl: track.external_urls?.spotify ?? null,
  }
}

async function fetchWithToken(url, token) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function fetchSpotifyPlayback() {
  const token = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN
  if (!token) return null

  try {
    const currentRes = await fetchWithToken(SPOTIFY_API, token)

    if (currentRes.status === 200) {
      const data = await currentRes.json()
      return mapSpotifyTrack(data, {
        isPlaying: data.is_playing,
        status: data.is_playing ? 'now_playing' : 'last_played',
      })
    }

    if (currentRes.status === 204 || currentRes.status === 404) {
      const recentRes = await fetchWithToken(SPOTIFY_RECENT_API, token)
      if (!recentRes.ok) return null
      const recent = await recentRes.json()
      const item = recent.items?.[0]
      if (!item) return null
      return mapSpotifyTrack(item, { isPlaying: false, status: 'last_played' })
    }

    return null
  } catch {
    return null
  }
}

function useSpotifyNowPlaying() {
  const configured = isSpotifyConfigured()
  const [track, setTrack] = useState(() => (configured ? null : MOCK_TRACK))
  const [loading, setLoading] = useState(configured)
  const [error, setError] = useState(false)
  const hasTrackRef = useRef(!configured)

  useEffect(() => {
    if (!configured) return undefined

    let active = true

    const load = async () => {
      setLoading(true)
      const next = await fetchSpotifyPlayback()
      if (!active) return
      if (next) {
        setTrack(next)
        setError(false)
        hasTrackRef.current = true
      } else if (!hasTrackRef.current) {
        setError(true)
      }
      setLoading(false)
    }

    const id = setInterval(() => void load(), POLL_INTERVAL_MS)
    void load()

    return () => {
      active = false
      clearInterval(id)
    }
  }, [configured])

  return { track, loading, error, isDemo: !configured }
}

function getDefaultPosition(defaultBottom = 24, defaultRight = 24) {
  if (typeof window === 'undefined') return { x: 16, y: 16 }
  return {
    x: window.innerWidth - WIDGET_WIDTH - defaultRight,
    y: window.innerHeight - 120 - defaultBottom,
  }
}

function useDraggablePosition(defaultBottom = 24, defaultRight = 24) {
  const [position, setPosition] = useState(() => getDefaultPosition(defaultBottom, defaultRight))
  const dragRef = useRef({ active: false, offsetX: 0, offsetY: 0, moved: false })

  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - WIDGET_WIDTH - 8),
        y: Math.min(prev.y, window.innerHeight - 100),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    dragRef.current = {
      active: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      moved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return
    dragRef.current.moved = true
    const x = Math.max(
      8,
      Math.min(e.clientX - dragRef.current.offsetX, window.innerWidth - WIDGET_WIDTH - 8),
    )
    const y = Math.max(8, Math.min(e.clientY - dragRef.current.offsetY, window.innerHeight - 88))
    setPosition({ x, y })
  }

  const onPointerUp = (e) => {
    dragRef.current.active = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* pointer may already be released */
    }
  }

  const didDrag = () => dragRef.current.moved

  return { position, onPointerDown, onPointerMove, onPointerUp, didDrag }
}

function TrackDisplay({ track, isDemo, onOpen }) {
  const [offsetMs, setOffsetMs] = useState(0)

  useEffect(() => {
    if (!track.isPlaying) return undefined
    const id = setInterval(() => setOffsetMs((ms) => ms + 1000), 1000)
    return () => clearInterval(id)
  }, [track.isPlaying])

  const progressPercent =
    track.durationMs > 0
      ? Math.min(100, ((track.progressMs + offsetMs) / track.durationMs) * 100)
      : 0

  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative flex w-full cursor-grab items-center gap-3 p-3 text-left active:cursor-grabbing"
    >
      <GripVertical
        className="absolute left-1.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20"
        strokeWidth={1.5}
        aria-hidden
      />
      <motion.div className="relative ml-4 h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg bg-white/10">
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt=""
            width={60}
            height={60}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            <Music2 className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
      </motion.div>
      <div className="min-w-0 flex-1 pr-1">
        <p
          className="text-[0.6rem] font-bold uppercase tracking-widest"
          style={{ color: SPOTIFY_GREEN }}
        >
          {track.status === 'now_playing' ? 'Now Playing' : 'Last Played'}
        </p>
        <p className="mt-0.5 truncate font-sans text-sm font-semibold text-white">{track.title}</p>
        <p className="truncate font-sans text-xs text-white/55">{track.artist}</p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: SPOTIFY_GREEN }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.9, ease: 'linear' }}
          />
        </div>
        {isDemo && (
          <p className="mt-2 font-sans text-[0.65rem] leading-snug text-white/40">
            Connect Spotify to see what I&apos;m listening to
          </p>
        )}
      </div>
    </button>
  )
}

function WidgetSkeleton() {
  return (
    <motion.div className="flex animate-pulse items-center gap-3 p-3" aria-hidden>
      <div className="ml-4 h-[60px] w-[60px] rounded-lg bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-2 w-16 rounded bg-white/10" />
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="h-2 w-24 rounded bg-white/10" />
        <div className="h-1 w-full rounded bg-white/10" />
      </div>
    </motion.div>
  )
}

export default function SpotifyWidget() {
  const { track, loading, error, isDemo } = useSpotifyNowPlaying()
  const { position, onPointerDown, onPointerMove, onPointerUp, didDrag } =
    useDraggablePosition()

  const handleOpenSpotify = () => {
    if (didDrag() || !track?.spotifyUrl) return
    window.open(track.spotifyUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      className="fixed z-50 touch-none select-none"
      style={{ left: position.x, top: position.y, width: WIDGET_WIDTH }}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.8 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="complementary"
      aria-label="Spotify now playing"
    >
      <motion.div
        className="overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
        style={{ backgroundColor: '#1a1a1a' }}
        whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}
      >
        {loading && !track ? (
          <WidgetSkeleton />
        ) : error && !track ? (
          <div className="p-4 font-sans text-sm text-white/60">
            Couldn&apos;t load playback. Retrying…
          </div>
        ) : track ? (
          <TrackDisplay
            key={`${track.title}-${track.progressMs}-${track.isPlaying}`}
            track={track}
            isDemo={isDemo}
            onOpen={handleOpenSpotify}
          />
        ) : (
          <div className="p-4 font-sans text-sm text-white/60">
            Connect Spotify to see what I&apos;m listening to
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
