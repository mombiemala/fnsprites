// Roster parity + consistency audit.  Run: `npm run audit`
//
// Two checks, both FLAG-ONLY (they never change data):
//   1. Parity  — our computed released-variant totals vs watch/reference.json
//                (which the maintainer keeps in sync with Fortnite.GG). Catches
//                "we're N behind the authoritative tracker" drift.
//   2. Shape   — current-gen RELEASED base Sprites whose `variants` map defines
//                an unusually small finish set (the "Mega Man shipped base-only"
//                signature). Intentional exceptions live in reference.json.
//
// Exits 1 if anything mismatches so CI / the watch digest can surface it.
import { readFileSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildSpriteList, SPRITE_TYPES, CURRENT_GEN } from '../src/data/sprites.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const REF = JSON.parse(readFileSync(resolve(HERE, '../watch/reference.json'), 'utf8'))

export function runAudit() {
  const released = buildSpriteList().filter((r) => r.released && !r.unreleased)
  const byGen = {}
  for (const r of released) byGen[r.gen] = (byGen[r.gen] || 0) + 1

  const findings = []

  // 1 — parity vs reference
  const exp = REF.expected || {}
  if (exp.releasedRowsTotal != null && exp.releasedRowsTotal !== released.length)
    findings.push(`Released variant rows: ours=${released.length}, reference=${exp.releasedRowsTotal} (Δ ${released.length - exp.releasedRowsTotal}). Update watch/reference.json if ours is right, else investigate the gap.`)
  for (const [gen, n] of Object.entries(exp.byGen || {}))
    if ((byGen[gen] || 0) !== n)
      findings.push(`${gen} released rows: ours=${byGen[gen] || 0}, reference=${n} (Δ ${(byGen[gen] || 0) - n}).`)

  // 2 — finish-set shape for current-gen released base types
  const std = REF.standardOverrideFinishKeys || 6
  const exceptions = REF.baseFinishExceptions || {}
  for (const t of SPRITE_TYPES) {
    if ((t.gen || 'c7s3') !== CURRENT_GEN || !t.released) continue
    const keys = Object.keys(t.variants || {}).length
    if (keys < std && !(t.id in exceptions))
      findings.push(`Small finish set: '${t.id}' (${t.name}) defines ${keys} finish${keys === 1 ? '' : 'es'} (< ${std}). If intentional (e.g. a licensed collab) add it to baseFinishExceptions in watch/reference.json; otherwise it may be missing finishes.`)
  }

  return { ok: findings.length === 0, released: released.length, byGen, findings }
}

export function formatAudit(r) {
  const out = [
    `Released variant rows: ${r.released}`,
    `By generation: ${Object.entries(r.byGen).map(([g, n]) => `${g}=${n}`).join(', ')}`,
  ]
  if (r.ok) out.push('✅ Parity + shape: no mismatches vs reference.')
  else { out.push(`⚠️ ${r.findings.length} finding(s):`); r.findings.forEach((f) => out.push(`  - ${f}`)) }
  return out.join('\n')
}

// CLI
const isMain = process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const r = runAudit()
  console.log(formatAudit(r))
  process.exit(r.ok ? 0 : 1)
}
