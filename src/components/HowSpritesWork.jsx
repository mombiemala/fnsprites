import { SPRITE_GUIDE } from '../data/spriteGuide'

// Renders **bold** spans in the guide copy; everything else is plain text.
function Rich({ text }) {
  const parts = text.split(/\*\*([^*]+)\*\*/g)
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <b key={i} className="font-bold text-white">{p}</b>
        ) : (
          p.split('\n').map((line, j, arr) => (
            <span key={`${i}-${j}`}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))
        ),
      )}
    </>
  )
}

// The Sprites-page sidebar explainer — extraction, leveling, mastery & trading,
// the parts people get caught out by. Mirrors the static /sprites guide card
// (scripts/prerender.mjs) and shares its content from src/data/spriteGuide.js.
export default function HowSpritesWork() {
  return (
    <div id="how-sprites-work" className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="font-display text-lg text-white">How Sprites work</h3>
      <p className="mb-2 mt-1 text-xs text-[var(--muted)]">
        Extraction, leveling, mastery &amp; trading — the parts people get caught out by.
      </p>
      {SPRITE_GUIDE.map((s, i) => (
        <details key={s.h} open={i === 0} className="mt-2 rounded-xl bg-[var(--panel-2)] px-3">
          <summary className="cursor-pointer py-2.5 text-[13px] font-bold text-white">{s.h}</summary>
          {s.body.map((t, j) => (
            <p key={j} className="mb-2.5 text-[13px] leading-relaxed text-[var(--text)]/85">
              <Rich text={t} />
            </p>
          ))}
        </details>
      ))}
      <p className="mt-3 text-[10px] leading-relaxed text-[var(--muted)]">
        Community-sourced — Epic doesn’t publish exact point/drop values, so treat numbers as estimates.
      </p>
    </div>
  )
}
