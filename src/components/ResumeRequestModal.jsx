import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const initialForm = {
  name: '',
  email: '',
  company: '',
  message: '',
}

export default function ResumeRequestModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm)
  const [submittedEmail, setSubmittedEmail] = useState(null)

  const handleClose = useCallback(() => {
    setForm(initialForm)
    setSubmittedEmail(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, handleClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmittedEmail(form.email.trim())
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={handleClose}
            aria-label="Close modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-pop md:p-8"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {submittedEmail ? (
              <div className="pr-8 pt-2">
                <p className="font-sans text-base leading-relaxed text-foreground">
                  Thanks! I&apos;ll send my resume to{' '}
                  <span className="font-semibold text-accent">{submittedEmail}</span> shortly.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2
                  id="resume-modal-title"
                  className="pr-8 font-display text-2xl text-foreground"
                >
                  Request my resume
                </h2>
                <p className="mt-2 font-sans text-sm text-foreground/60">
                  Share a few details and I&apos;ll follow up with my resume.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="resume-name" className="mb-1.5 block text-sm font-medium text-foreground">
                      Name <span className="text-accent">*</span>
                    </label>
                    <input
                      id="resume-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="resume-email" className="mb-1.5 block text-sm font-medium text-foreground">
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      id="resume-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="resume-company" className="mb-1.5 block text-sm font-medium text-foreground">
                      Company
                    </label>
                    <input
                      id="resume-company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="resume-message" className="mb-1.5 block text-sm font-medium text-foreground">
                      Message
                    </label>
                    <textarea
                      id="resume-message"
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Submit
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
