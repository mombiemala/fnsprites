import { motion } from 'framer-motion'
import { caseStudies } from '../data/caseStudies.js'

const TAG_STYLES = {
  CYBERSECURITY: 'bg-teal-100 text-teal-900',
  AI: 'bg-emerald-100 text-emerald-900',
  WEB: 'bg-blue-100 text-blue-900',
  FEATURED: 'bg-amber-100 text-amber-900',
}

function getTagClassName(tag) {
  const normalized = tag.toUpperCase()
  if (normalized.includes('CYBERSECURITY')) return TAG_STYLES.CYBERSECURITY
  if (normalized.includes('AI')) return TAG_STYLES.AI
  if (normalized.includes('WEB')) return TAG_STYLES.WEB
  if (normalized.includes('FEATURED')) return TAG_STYLES.FEATURED
  return 'bg-muted text-foreground/70'
}

function CaseStudySection({ study, index }) {
  const isEven = index % 2 === 0
  const bgClass = isEven ? 'bg-background' : 'bg-secondary'
  const isComingSoon = study.status === 'COMING SOON' || !study.link

  return (
    <section
      id={index === 0 ? 'work' : undefined}
      className={`snap-section flex min-h-[100dvh] items-center px-5 py-16 md:px-10 md:py-20 lg:px-20 ${bgClass}`}
    >
      <motion.article
        className="group mx-auto w-full max-w-7xl"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-16"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Image — 60% on desktop */}
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-card lg:order-none lg:aspect-auto lg:min-h-[min(70vh,640px)]">
            <img
              src={study.image}
              alt={study.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </div>

          {/* Content — 40% on desktop */}
          <motion.div className="order-2 flex flex-col justify-center lg:order-none">
            <div className="mb-4 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-widest ${getTagClassName(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mb-2 font-sans text-sm font-medium text-foreground/50">
              {study.client} · {study.year}
            </p>

            <h2 className="font-display text-h2 text-foreground">{study.title}</h2>

            <p className="mt-4 font-sans text-base leading-relaxed text-foreground/75 md:text-lg">
              {study.description}
            </p>

            {study.metrics?.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                {study.metrics.map((metric, metricIndex) => (
                  <motion.div
                    key={metric.label}
                    className={`flex flex-col items-start justify-center px-4 py-5 md:px-5 md:py-6 ${isEven ? 'bg-background' : 'bg-secondary'}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: metricIndex * 0.08,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <span className="font-sans text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-none text-accent">
                      {metric.value}
                    </span>
                    <span className="mt-2 font-sans text-xs leading-snug text-foreground/50 md:text-sm">
                      {metric.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div className="mt-8" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              {isComingSoon ? (
                <span className="inline-flex items-center gap-1 font-sans text-sm font-semibold uppercase tracking-wide text-foreground/40">
                  Coming Soon
                </span>
              ) : (
                <a
                  href={study.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1 font-sans text-sm font-semibold text-accent transition-colors hover:text-accent/80 md:text-base"
                >
                  Read case study
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover/link:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.article>
    </section>
  )
}

export default function CaseStudies() {
  return (
    <>
      {caseStudies.map((study, index) => (
        <CaseStudySection key={study.id} study={study} index={index} />
      ))}
    </>
  )
}
