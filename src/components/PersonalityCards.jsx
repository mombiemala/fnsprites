import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Star } from 'lucide-react'

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
import { profileData } from '../data/caseStudies.js'
import Headshot from './Headshot.jsx'

const CARD_SHADOW = '0 8px 24px rgba(0, 0, 0, 0.12)'

const DEFAULT_POSITIONS = {
  profile: { x: 6, y: 10 },
  reading: { x: 58, y: 6 },
  interests: { x: 66, y: 38 },
  building: { x: 44, y: 14 },
  hobbies: { x: 4, y: 54 },
  online: { x: 36, y: 48 },
  timezone: { x: 74, y: 68 },
  rating: { x: 22, y: 74 },
}

const SIZE_CLASSES = {
  large: 'w-[min(100%,20rem)] md:w-80',
  medium: 'w-[min(100%,17rem)] md:w-64',
  small: 'w-[min(100%,13rem)] md:w-48',
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])

  return isMobile
}

function LiveClock() {
  const [time, setTime] = useState(() => formatLeesburgTime())

  useEffect(() => {
    const id = setInterval(() => setTime(formatLeesburgTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <time dateTime={time.iso} className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
      {time.display}
    </time>
  )
}

function formatLeesburgTime() {
  const now = new Date()
  const display = now.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  return { display, iso: now.toISOString() }
}

function StarRating() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const active = hover || rating

  return (
    <motion.div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="rounded p-0.5 text-foreground/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={`h-6 w-6 transition-colors ${star <= active ? 'fill-amber-400 text-amber-400' : ''}`}
            strokeWidth={1.5}
          />
        </motion.button>
      ))}
    </motion.div>
  )
}

function DraggableCard({
  id,
  size,
  position,
  dragEnabled,
  onDragStart,
  onDragEnd,
  children,
  className = '',
}) {
  return (
    <motion.div
      layout={!dragEnabled}
      draggable={dragEnabled}
      onDragStart={(e) => onDragStart(e, id)}
      onDragEnd={onDragEnd}
      animate={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={`${dragEnabled ? 'absolute cursor-grab active:cursor-grabbing' : 'relative w-full'} ${SIZE_CLASSES[size]} ${className}`}
      style={{
        transform: dragEnabled ? 'translate(-50%, -50%)' : undefined,
        boxShadow: CARD_SHADOW,
      }}
      whileHover={dragEnabled ? { y: -4, boxShadow: 'var(--shadow-pop)' } : { y: -2 }}
    >
      <motion.div
        className="rounded-xl border border-white/80 bg-white p-4 transition-all-expo md:p-5"
        style={{ boxShadow: 'inherit' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function PersonalityCards() {
  const containerRef = useRef(null)
  const [positions, setPositions] = useState(DEFAULT_POSITIONS)
  const isMobile = useIsMobile()

  const handleDragStart = useCallback((e, id) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', id)
    e.currentTarget.style.opacity = '0.5'
  }, [])

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = '1'
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/html')
    if (!id || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPositions((prev) => ({
      ...prev,
      [id]: {
        x: Math.min(92, Math.max(8, x)),
        y: Math.min(92, Math.max(8, y)),
      },
    }))
  }, [])

  const cardProps = {
    dragEnabled: !isMobile,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  }

  return (
    <section
      id="about"
      className="snap-section relative min-h-[100dvh] bg-background px-5 py-16 md:px-10 md:py-20 lg:px-20"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-7xl font-display text-h1 text-foreground"
      >
        I design and ship.
      </motion.h2>

      <motion.div
        ref={containerRef}
        onDragOver={!isMobile ? handleDragOver : undefined}
        onDrop={!isMobile ? handleDrop : undefined}
        className={
          isMobile
            ? 'relative z-10 mx-auto mt-10 flex max-w-md flex-col gap-4'
            : 'relative z-10 mx-auto mt-12 h-[calc(100dvh-12rem)] max-w-7xl'
        }
      >
        <DraggableCard id="profile" size="large" position={positions.profile} {...cardProps}>
          <motion.div className="flex gap-4" layout>
            <Headshot
              alt=""
              className="h-[60px] w-[60px]"
              imgClassName="border-2 border-white shadow-card"
            />
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm font-semibold text-foreground">
                {profileData.name} · {profileData.location}
              </p>
              <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest text-emerald-800">
                available now
              </span>
              <motion.div className="mt-3 flex flex-wrap gap-1.5">
                {['Leesburg, VA', profileData.timezone, 'Remote-friendly'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </DraggableCard>

        <DraggableCard id="reading" size="medium" position={positions.reading} {...cardProps}>
          <div className="flex gap-3">
            <motion.div
              className="flex h-14 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground/40"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="h-5 w-5" strokeWidth={1.5} />
            </motion.div>
            <motion.div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/45">
                Currently reading
              </p>
              <p className="mt-1 font-sans text-sm font-semibold leading-snug text-foreground">
                {profileData.currentReading.title}
              </p>
              <p className="text-xs text-foreground/55">by {profileData.currentReading.author}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${profileData.currentReading.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p className="mt-1 text-right text-[0.65rem] text-foreground/45">
                {profileData.currentReading.progress}%
              </p>
            </motion.div>
          </div>
        </DraggableCard>

        <DraggableCard id="interests" size="medium" position={positions.interests} {...cardProps}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/45">
            Interests
          </p>
          <motion.div className="mt-3 flex flex-wrap gap-2">
            {profileData.interests.map((interest) => (
              <motion.span
                key={interest}
                whileHover={{ y: -2, scale: 1.03 }}
                className="cursor-default rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground/75 transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {interest}
              </motion.span>
            ))}
          </motion.div>
        </DraggableCard>

        <DraggableCard id="building" size="small" position={positions.building} {...cardProps}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/45">
                Currently building
              </p>
              <p className="mt-2 font-sans text-sm leading-snug text-foreground">
                {profileData.currentlyBuilding}
              </p>
            </div>
            <Sparkles className="h-5 w-5 shrink-0 text-amber-400" strokeWidth={1.5} aria-hidden />
          </div>
        </DraggableCard>

        <DraggableCard id="hobbies" size="medium" position={positions.hobbies} {...cardProps}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/45">
            Hobbies
          </p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/80">{profileData.hobbies}</p>
        </DraggableCard>

        <DraggableCard id="online" size="medium" position={positions.online} {...cardProps}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/45">
            Find me online
          </p>
          <motion.a
            href={profileData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 2 }}
            className="mt-3 flex items-center gap-2 font-sans text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            <LinkedInIcon className="h-5 w-5" />
            LinkedIn
          </motion.a>
          <p className="mt-2 text-xs text-foreground/55">Design × Systems Thinking</p>
        </DraggableCard>

        <DraggableCard id="timezone" size="small" position={positions.timezone} {...cardProps}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/45">
            Local time
          </p>
          <LiveClock />
          <p className="mt-1 font-sans text-sm font-medium text-foreground">{profileData.location}</p>
          <p className="text-xs text-foreground/50">{profileData.timezone}</p>
        </DraggableCard>

        <DraggableCard id="rating" size="medium" position={positions.rating} {...cardProps}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground/45">
            Rate this portfolio
          </p>
          <div className="mt-3">
            <StarRating />
          </div>
        </DraggableCard>
      </motion.div>
    </section>
  )
}
