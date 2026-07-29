// Build-time prerender of per-sprite SEO pages.
//
// Runs AFTER `vite build` (see package.json). Reads the curated sprite data —
// the same single source of truth the app uses — and emits static, crawlable
// HTML into dist/: one page per released Sprite type, a /sprites index hub, and
// a regenerated sitemap.xml. No SSR framework, no runtime cost: plain files
// Vercel serves directly, with real content + meta + JSON-LD in the markup so
// search engines index them without executing any JavaScript.

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import {
  SPRITE_TYPES, SPRITE_BY_ID, RELEASED_COUNT,
  dustCost, spriteTier, spriteScaling, spriteSource,
} from '../src/data/sprites.js'
import { THEME_MAP } from '../src/data/themes.js'

const SITE = 'https://fnsprites.vercel.app'
const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slug = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const fmt = (n) => Math.round(n).toLocaleString('en-US')
const parseRate = (s) => {
  if (!s) return null
  const n = parseFloat(String(s).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n / 100 : null
}
const chestsFor = (p, conf) => Math.ceil(Math.log(1 - conf) / Math.log(1 - p))

const RARITY_TINT = { Rare: '#3da9fc', Epic: '#a855f7', Legendary: '#f59e0b', Mythic: '#ef4444' }
const VARIANT_BG = {
  normal: 'linear-gradient(160deg,#5a6488,#171c2e)',
  gold: 'linear-gradient(160deg,#ffe27a,#b8801c)',
  gummy: 'radial-gradient(circle at 40% 30%,#ffd1e0,#c81d5a)',
  galaxy: 'linear-gradient(160deg,#3b1d77,#0a0820)',
  gem: 'linear-gradient(160deg,#bdfff4,#0b6c8c)',
  holofoil: 'linear-gradient(135deg,#8ef0ff,#c77dff,#ffd86b)',
  cube: 'linear-gradient(160deg,#8a2be2,#2a0a4a)',
  quack: 'linear-gradient(160deg,#ffcf4d,#a0691a)',
}

// Design tokens + primitives are lifted verbatim from the app (src/index.css +
// tailwind usage in App.jsx) so the static pages read as the SAME product:
// identical palette, the app's two-radial background, its max-w-6xl (1152px)
// container, rounded-2xl cards, and the Inter body / Luckiest-Guy display split.
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Inter:wght@400;500;600;700;800&display=swap');
:root{--bg:#0c0f1a;--bg2:#131829;--panel:#1a2036;--panel2:#222a45;--border:#2c3556;--text:#eaf0ff;--muted:#95a0c4;--brand:#36c5ff;--brand2:#7b61ff}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;color:var(--text);line-height:1.6;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;background:radial-gradient(1200px 600px at 80% -10%,rgba(123,97,255,.18),transparent 60%),radial-gradient(1000px 500px at 0% 0%,rgba(54,197,255,.14),transparent 55%),var(--bg)}
a{color:var(--brand);text-decoration:none}
.wrap{max-width:1152px;margin:0 auto;padding:24px 16px 96px}
header.site{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0 20px}
.logo{display:inline-flex;align-items:center;gap:8px;color:var(--text)}.logo .mark-sm{width:32px;height:32px;flex:0 0 auto}
.logo .wm{font-family:'Luckiest Guy','Inter',sans-serif;font-weight:400;font-size:30px;line-height:1;letter-spacing:.02em}.logo .wm b{color:var(--brand);font-weight:400}
.cta{background:linear-gradient(90deg,var(--brand),var(--brand2));color:#000;font-weight:800;padding:9px 16px;border-radius:12px;font-size:13px;white-space:nowrap}
.crumbs{font-size:12px;color:var(--muted);margin-bottom:16px}.crumbs a{color:var(--muted)}
.nav{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.nav a{background:var(--panel2);color:var(--muted);padding:8px 14px;border-radius:12px;font-size:13px;font-weight:700;white-space:nowrap;transition:color .15s}
.nav a:hover{color:#fff}.nav a.on{background:var(--brand);color:#000}
.hero{display:flex;gap:22px;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:24px}
.avatar{width:108px;height:108px;border-radius:16px;display:grid;place-items:center;font-size:54px;flex:0 0 auto;border:1px solid var(--border);position:relative;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
.avatar .art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
h1{margin:0;font-family:'Luckiest Guy','Inter',sans-serif;font-weight:400;font-size:36px;letter-spacing:.02em;line-height:1.1}
.tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.tag{font-size:12px;font-weight:800;padding:4px 12px;border-radius:999px;border:1px solid var(--border);background:var(--panel2)}
.lede{color:var(--muted);margin:12px 0 0;font-size:15px;max-width:70ch}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:24px 0}
.stat{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:16px 14px;text-align:center}
.stat .n{font-size:22px;font-weight:800}.stat .l{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:4px}
h2{font-family:'Inter',sans-serif;font-size:22px;font-weight:800;letter-spacing:-.01em;margin:36px 0 12px}
p{color:#cdd6f0;max-width:70ch}
.card{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:18px}
table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--border)}
th{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.06em}td.v{text-align:right;font-weight:700}
.variants{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}
.variant{background:var(--panel2);border:1px solid var(--border);border-radius:14px;padding:12px 8px;text-align:center;font-size:12px}
.variant .sw{width:64px;height:64px;border-radius:12px;margin:0 auto 6px;overflow:hidden;position:relative}
.variant .sw img{width:100%;height:100%;object-fit:contain}.variant small{color:var(--muted);display:block;font-size:10px}
details{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:2px 16px;margin-bottom:8px}
summary{cursor:pointer;font-weight:700;padding:13px 0}details p{margin:0 0 12px;max-width:none}
.related{display:flex;gap:10px;flex-wrap:wrap}.related a{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:9px 13px;font-weight:700;font-size:14px;color:var(--text);transition:border-color .15s}
.related a:hover{border-color:var(--brand)}
.bigcta{display:block;text-align:center;background:linear-gradient(90deg,var(--brand),var(--brand2));color:#000;font-weight:800;padding:16px;border-radius:14px;margin:32px 0 10px;font-size:16px;max-width:none}
footer{color:var(--muted);font-size:12px;margin-top:44px;border-top:1px solid var(--border);padding-top:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.tile{display:flex;gap:12px;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:12px;color:var(--text);transition:border-color .15s}
.tile:hover{border-color:var(--brand)}
.tile .ic{width:48px;height:48px;border-radius:12px;display:grid;place-items:center;font-size:24px;flex:0 0 auto;overflow:hidden}
.tile .ic img{width:100%;height:100%;object-fit:contain}
.fnav{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 4px;margin-bottom:14px;font-size:12px}
.fnav a{color:var(--muted)}
@media(min-width:640px){.wrap{padding:24px 24px 96px}.logo{gap:10px}.logo .mark-sm{width:36px;height:36px}.logo .wm{font-size:36px}}
@media(max-width:640px){.stats{grid-template-columns:repeat(2,1fr)}.hero{flex-direction:column;text-align:center}h1{font-size:28px}.avatar{width:92px;height:92px}.tags{justify-content:center}}
`

// The shared sprite logomark (mirrors src/components/Logo.jsx).
const MARK = `<svg class="mark-sm" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="smg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#36c5ff"/><stop offset="1" stop-color="#7b61ff"/></linearGradient></defs><rect x="8" y="8" width="84" height="84" rx="26" fill="url(#smg)"/><circle cx="50" cy="15" r="5" fill="#eafcff"/><rect x="48" y="15" width="4" height="10" fill="#eafcff"/><circle cx="38" cy="50" r="9" fill="#0c1330"/><circle cx="41" cy="47" r="3" fill="#fff"/><circle cx="66" cy="50" r="9" fill="#0c1330"/><circle cx="69" cy="47" r="3" fill="#fff"/><path d="M40 68 Q52 78 64 68" stroke="#0c1330" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`

function head({ title, desc, canonical, jsonld, ogImage }) {
  const img = ogImage || `${SITE}/og-image.png`
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="article"><meta property="og:site_name" content="FN Sprite Tracker">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(img)}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
<style>${CSS}</style></head><body><div class="wrap">
<header class="site"><a class="logo" href="/">${MARK}<span class="wm">FN <b>Sprite</b> Tracker</span></a><a class="cta" href="/">Track your collection →</a></header>
<nav class="nav" aria-label="Sections">
  <a href="/">Collection</a>
  <a href="/?view=leaderboard">🏆 Leaderboard</a>
  <a href="/?view=stats">📊 Stats</a>
  <a href="/?view=news">📰 News</a>
  <a href="/?view=shop">🛒 Item Shop</a>
  <a href="/sprites" class="on" aria-current="page">🧩 Sprites</a>
  <a href="/?cosmetics=1">🧢 Cosmetics</a>
</nav>`
}

const FOOT = `<nav class="fnav" aria-label="Sections">
  <a href="/">Collection</a> · <a href="/?view=leaderboard">🏆 Leaderboard</a> · <a href="/?view=stats">📊 Stats</a> · <a href="/?view=news">📰 News</a> · <a href="/?view=shop">🛒 Item Shop</a> · <a href="/sprites">🧩 Sprites</a>
</nav>
<footer>Fan-made — not affiliated with Epic Games. Drop rates &amp; dust are community estimates; Epic doesn't publish official figures. Creator Code MOMBIE.</footer></div></body></html>`

// ---------- per-sprite page ----------
function spritePage(type, others) {
  const name = type.name
  const url = `${SITE}/sprite/${slug(name)}`
  const tint = RARITY_TINT[type.rarity] || '#7f8ab0'
  const p = parseRate(type.dropRate)
  const dustN = dustCost(type.rarity, 'normal')
  const dustV = dustCost(type.rarity, 'gold')
  const tier = spriteTier(type.id)
  const scaling = spriteScaling(type.id)
  const source = spriteSource(type.id)

  const variants = Object.keys(type.variants)
    .filter((tid) => THEME_MAP[tid])
    .map((tid) => ({ tid, name: THEME_MAP[tid].name, bonus: THEME_MAP[tid].bonus, released: !!SPRITE_BY_ID[`${type.id}_${tid}`]?.released }))

  const desc = `${name} is a ${type.rarity} Fortnite Sprite${p ? ` with about a ${type.dropRate} drop rate from Sprite Chests` : ''}. See its ${p ? 'drop rate, ' : ''}re-summon Dust cost, ability, variants${p ? ', and how many chests it takes to get one' : ''}.`
  const title = `${name} Sprite — ${p ? 'Drop Rate, ' : ''}Dust Cost & How to Get | FN Sprite Tracker`

  // FAQ (drives rich results)
  const faqs = []
  faqs.push([`How rare is the ${name} Sprite?`, p
    ? `${name} is a ${type.rarity} Sprite with about a ${type.dropRate} chance per Sprite Chest — roughly a 1-in-${fmt(1 / p)} pull.`
    : `${name} is a ${type.rarity} Sprite. Its exact drop rate hasn't been documented by the community yet.`])
  if (p) faqs.push([`How many chests to get a ${name} Sprite?`,
    `About ${fmt(chestsFor(p, 0.5))} Sprite Chests for a 50% chance, and around ${fmt(chestsFor(p, 0.9))} for a 90% chance.`])
  if (dustN != null) faqs.push([`How much Sprite Dust to re-summon ${name}?`,
    `${fmt(dustN)} Dust for the Normal form${dustV != null ? `, or ${fmt(dustV)} for a special variant` : ''}.`])
  if (type.ability) faqs.push([`What does the ${name} Sprite do?`, type.ability])

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Sprites', item: SITE + '/sprites' },
        { '@type': 'ListItem', position: 3, name: `${name} Sprite`, item: url },
      ] },
      { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({
        '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
      })) },
    ],
  }

  const stats = [
    p ? [type.dropRate, 'Drop rate / chest'] : ['—', 'Drop rate'],
    p ? [`~${fmt(1 / p)}`, 'Avg chests'] : [tier ? `${tier}-Tier` : '—', 'Tier'],
    dustN != null ? [fmt(dustN), 'Dust (Normal)'] : null,
    dustV != null ? [fmt(dustV), 'Dust (variant)'] : null,
  ].filter(Boolean)

  const oddsTable = p ? `
  <h2>Chest odds — how many chests will it take?</h2>
  <div class="card"><table>
    <tr><th>Confidence</th><th style="text-align:right">Chests to open</th></tr>
    <tr><td>Coin-flip (50% chance)</td><td class="v">${fmt(chestsFor(p, 0.5))}</td></tr>
    <tr><td>Likely (90% chance)</td><td class="v">${fmt(chestsFor(p, 0.9))}</td></tr>
    <tr><td>Almost sure (99% chance)</td><td class="v">${fmt(chestsFor(p, 0.99))}</td></tr>
  </table><p style="margin:12px 0 0;color:var(--muted);font-size:13px">Modeled as independent draws at the base rate. Run your own numbers in the live <a href="/">Chest luck calculator →</a></p></div>` : ''

  return head({ title, desc, canonical: url, jsonld, ogImage: `${SITE}/api/og?sprite=${encodeURIComponent(type.id)}` }) + `
<nav class="crumbs"><a href="/">Home</a> › <a href="/sprites">Sprites</a> › <span>${esc(name)}</span></nav>
<section class="hero" style="background:linear-gradient(135deg,${tint}22,var(--panel))">
  <div class="avatar" style="background:${VARIANT_BG.normal}"><img class="art" src="/sprites/${type.id}_normal.png" alt="${esc(name)} Sprite (Normal)" onerror="this.style.display='none'"></div>
  <div><h1>${esc(name)} Sprite</h1>
    <div class="tags"><span class="tag" style="background:${tint};color:#0a0606;border-color:transparent">${esc(type.rarity)}</span>${tier ? `<span class="tag">${tier}-Tier</span>` : ''}${type.released ? '' : '<span class="tag">Upcoming</span>'}</div>
    <p class="lede">${esc(desc)}</p></div>
</section>
<div class="stats">${stats.map(([n, l]) => `<div class="stat"><div class="n">${esc(n)}</div><div class="l">${esc(l)}</div></div>`).join('')}</div>

<h2>How to get the ${esc(name)} Sprite</h2>
<p>${esc(source)}${p ? ` As a ${type.rarity}, at ${type.dropRate} per chest you'll typically need to open Sprite Chests at volume — or pick one up through a trade.` : ''}</p>
${oddsTable}
${type.ability ? `<h2>Ability &amp; leveling</h2><div class="card"><p style="margin:0">${esc(type.ability)}${scaling ? ` <span style="color:var(--muted)">${esc(scaling)}</span>` : ''} Reaches full effect at <b>Level 5 (Mastered)</b>. Community-reported — Epic doesn't publish exact figures.</p></div>` : ''}

<h2>${esc(name)} variants</h2>
<div class="variants">${variants.map((v) => `<div class="variant"><div class="sw" style="background:${VARIANT_BG[v.tid] || VARIANT_BG.normal}"><img src="/sprites/${type.id}_${v.tid}.png" alt="${esc(name)} ${esc(v.name)}" loading="lazy" onerror="this.style.display='none'"></div>${esc(v.name)}<small>${v.released ? 'Available' : 'Coming soon'}</small></div>`).join('')}</div>

<h2>${esc(name)} FAQ</h2>
${faqs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}

<a class="bigcta" href="/">Track the ${esc(name)} in your collection — free →</a>

<h2>Other sprites</h2>
<div class="related">${others.map((o) => `<a href="/sprite/${slug(o.name)}">${esc(o.icon || '🧩')} ${esc(o.name)}</a>`).join('')}</div>
` + FOOT
}

// ---------- /sprites index hub ----------
function indexPage(types) {
  const byRarity = ['Mythic', 'Legendary', 'Epic', 'Rare'].map((r) => ({ r, items: types.filter((t) => t.rarity === r) })).filter((g) => g.items.length)
  const desc = `The complete Fortnite Sprite checklist — all ${RELEASED_COUNT} released sprite variants with drop rates, re-summon Dust costs, abilities and tiers. Track and compare your collection free.`
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'All Fortnite Sprites',
    url: SITE + '/sprites', description: desc,
  }
  return head({ title: 'All Fortnite Sprites — Checklist, Drop Rates & Dust Costs | FN Sprite Tracker', desc, canonical: SITE + '/sprites', jsonld }) + `
<nav class="crumbs"><a href="/">Home</a> › <span>Sprites</span></nav>
<h1>All Fortnite Sprites</h1>
<p class="lede">Every released sprite type — tap one for its drop rate, Dust cost, ability, variants and chest odds. ${RELEASED_COUNT} variants obtainable right now.</p>
${byRarity.map((g) => `<h2>${g.r} sprites</h2><div class="grid">${g.items.map((t) => `<a class="tile" href="/sprite/${slug(t.name)}"><span class="ic" style="background:${VARIANT_BG.normal}"><img src="/sprites/${t.id}_normal.png" alt="${esc(t.name)} Sprite" loading="lazy" onerror="this.style.display='none'"></span><span><b>${esc(t.name)}</b><br><small style="color:var(--muted)">${esc(t.rarity)}${t.dropRate ? ` · ${esc(t.dropRate)}` : ''}</small></span></a>`).join('')}</div>`).join('')}
<a class="bigcta" href="/">Start tracking your collection — free →</a>
` + FOOT
}

// ---------- sitemap ----------
function sitemap(types) {
  const urls = [
    { loc: SITE + '/', changefreq: 'daily', priority: '1.0' },
    { loc: SITE + '/sprites', changefreq: 'weekly', priority: '0.9' },
    { loc: SITE + '/?view=news', changefreq: 'daily', priority: '0.8' },
    { loc: SITE + '/?view=shop', changefreq: 'daily', priority: '0.7' },
    { loc: SITE + '/?view=leaderboard', changefreq: 'weekly', priority: '0.6' },
    { loc: SITE + '/?view=stats', changefreq: 'weekly', priority: '0.6' },
    ...types.map((t) => ({ loc: `${SITE}/sprite/${slug(t.name)}`, changefreq: 'weekly', priority: '0.8' })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`
}

// ---------- write ----------
const types = SPRITE_TYPES.filter((t) => t.released)
let n = 0
for (const type of types) {
  const others = types.filter((o) => o.id !== type.id && o.rarity === type.rarity).concat(types.filter((o) => o.rarity !== type.rarity)).slice(0, 6)
  const dir = resolve(DIST, 'sprite', slug(type.name))
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), spritePage(type, others))
  n++
}
mkdirSync(resolve(DIST, 'sprites'), { recursive: true })
writeFileSync(resolve(DIST, 'sprites', 'index.html'), indexPage(types))
writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap(types))

console.log(`prerender: ${n} sprite pages + /sprites index + sitemap.xml → dist/`)
