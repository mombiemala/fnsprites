import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Mail } from 'lucide-react'
import { profileData } from '../data/caseStudies.js'
import ResumeRequestModal from './ResumeRequestModal.jsx'

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const BADGES = ['Full-time', 'Contract', 'Leesburg VA', 'Remote US']

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

function ContactCard({ icon: Icon, label, value, buttonLabel, onClick, index }) {
  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="flex flex-col rounded-lg border border-border bg-background p-6 transition-all-expo hover:border-foreground/15 hover:shadow-card"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground/70">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-foreground/45">{label}</p>
      <p className="mt-1 font-sans text-sm font-medium text-foreground">{value}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-6 w-full rounded-lg border border-foreground/15 bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-all-expo hover:border-foreground/25 hover:bg-secondary"
      >
        {buttonLabel}
      </button>
    </motion.article>
  )
}

export default function Contact() {
  const [resumeModalOpen, setResumeModalOpen] = useState(false)

  return (
    <>
      <section
        id="contact"
        className="snap-section flex min-h-[100dvh] flex-col items-center justify-center bg-background px-5 py-16 md:px-10 md:py-20"
      >
        <motion.div
          className="mx-auto w-full max-w-[900px] text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="font-display text-4xl leading-tight tracking-tight text-foreground md:text-[2.75rem]"
          >
            Building something complex? Let&apos;s talk.
          </motion.h2>

          <motion.p
            custom={1}
            variants={fadeUp}
            className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-foreground/65 md:text-lg"
          >
            Open to Lead, Staff, and Principal product design roles — full-time or contract.
            Let&apos;s build clarity into what you&apos;re shipping next.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground/55"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            <ContactCard
              icon={Mail}
              label="Email"
              value={profileData.email}
              buttonLabel="Send Message"
              onClick={() => {
                window.location.href = `mailto:${profileData.email}`
              }}
              index={3}
            />
            <ContactCard
              icon={LinkedInIcon}
              label="LinkedIn"
              value="@kamalathedesigner"
              buttonLabel="Connect"
              onClick={() => {
                window.open(profileData.linkedin, '_blank', 'noopener,noreferrer')
              }}
              index={4}
            />
            <ContactCard
              icon={FileText}
              label="Resume"
              value="Request my resume"
              buttonLabel="Request Resume"
              onClick={() => setResumeModalOpen(true)}
              index={5}
            />
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border bg-background px-5 py-8 md:px-10">
        <motion.div
          className="mx-auto flex max-w-[900px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-sans text-xs text-foreground/45">
            © 2025 Kamala Espig · Designed and shipped from Leesburg, VA
          </p>
          <div className="flex items-center gap-4">
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-foreground/45 transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profileData.email}`}
              className="font-sans text-xs text-foreground/45 transition-colors hover:text-foreground"
            >
              Email
            </a>
          </div>
        </motion.div>
      </footer>

      <ResumeRequestModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </>
  )
}
