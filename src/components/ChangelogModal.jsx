import { CHANGELOG } from '../data/changelog'
import { useEscClose } from '../lib/useEscClose'

const TAG_STYLES = {
  Added: 'bg-emerald-400/15 text-emerald-300',
  Changed: 'bg-amber-400/15 text-amber-300',
  Fixed: 'bg-sky-400/15 text-sky-300',
  Security: 'bg-fuchsia-400/15 text-fuchsia-300',
}

export default function ChangelogModal({ onClose }) {
  useEscClose(onClose)
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Changelog"
        className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-white">📝 Changelog</h2>
            <p className="mt-0.5 text-xs text-[var(--muted)]">What changed, and the thinking behind it.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[var(--muted)] hover:text-white">✕</button>
        </div>

        <div className="-mx-2 mt-3 flex-1 overflow-y-auto px-2">
          <ol className="relative flex flex-col gap-6 border-l border-[var(--border)] pl-5">
            {CHANGELOG.map((rel, i) => (
              <li key={rel.date + rel.title} className="relative">
                <span
                  className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-[var(--panel)] ${i === 0 ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'}`}
                />
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="font-display text-lg text-white">{rel.title}</h3>
                  {i === 0 && <span className="rounded-full bg-[var(--brand)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--brand)]">Latest</span>}
                  <span className="text-xs text-[var(--muted)]">· {rel.date}</span>
                </div>

                {rel.summary && <p className="mt-1.5 text-sm text-[var(--text)]/90">{rel.summary}</p>}

                <ul className="mt-3 flex flex-col gap-1.5">
                  {rel.changes.map((c, j) => (
                    <li key={j} className="flex gap-2 text-sm text-[var(--text)]/85">
                      <span className={`mt-0.5 h-fit shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_STYLES[c.tag] || 'bg-[var(--panel-2)] text-[var(--muted)]'}`}>
                        {c.tag}
                      </span>
                      <span>{c.text}</span>
                    </li>
                  ))}
                </ul>

                {rel.why && (
                  <p className="mt-3 rounded-lg border-l-2 border-[var(--brand)]/50 bg-[var(--bg-2)] px-3 py-2 text-xs italic text-[var(--text)]/75">
                    <span className="font-bold not-italic text-[var(--muted)]">Why: </span>
                    {rel.why}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-4 shrink-0 border-t border-[var(--border)] pt-3 text-[11px] text-[var(--muted)]">
          Got an idea or found a bug? Use “Report a bug” in the footer — feedback shapes this list. 💜
        </p>
      </div>
    </div>
  )
}
