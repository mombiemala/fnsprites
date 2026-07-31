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
import { THEME_MAP, FINISH_ODDS_FACTOR } from '../src/data/themes.js'

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
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.main>h2:first-of-type{margin-top:4px}
header.site{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:8px 0 20px}
.hgroup{min-width:0}.tagline{margin:4px 0 0;font-size:12px;color:var(--muted);line-height:1.5}
.logo{display:inline-flex;align-items:center;gap:8px;color:var(--text)}.logo .mark-sm{width:32px;height:32px;flex:0 0 auto}
.logo .wm{font-family:'Luckiest Guy','Inter',sans-serif;font-weight:400;font-size:30px;line-height:1;letter-spacing:.02em}.logo .wm b{color:var(--brand);font-weight:400}
.cta{background:linear-gradient(90deg,var(--brand),var(--brand2));color:#000;font-weight:800;padding:9px 16px;border-radius:12px;font-size:13px;white-space:nowrap}
.crumbs{font-size:12px;color:var(--muted);margin-bottom:16px}.crumbs a{color:var(--muted)}
.nav{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:18px}
.nav a,.nav .more>summary{display:inline-flex;align-items:center;background:var(--panel2);color:var(--muted);padding:9px 14px;border-radius:12px;font-size:13px;font-weight:700;line-height:1;white-space:nowrap;transition:color .15s}
.nav a:hover{color:#fff}.nav a.on{background:var(--brand);color:#000}
.nav .more{position:relative;list-style:none}
.nav .more>summary{list-style:none;cursor:pointer;user-select:none}
.nav .more>summary::-webkit-details-marker{display:none}.nav .more>summary::marker{content:''}
.nav .more[open]>summary,.nav .more>summary:hover{color:#fff}
.nav .more>summary .mcaret{font-size:9px;color:var(--muted);transition:transform .15s}.nav .more[open]>summary .mcaret{transform:rotate(180deg)}
.moremenu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:190px;display:flex;flex-direction:column;padding:6px;gap:2px;background:var(--panel);border:1px solid var(--border);border-radius:12px;box-shadow:0 14px 34px rgba(0,0,0,.45)}
.moremenu a{background:none;color:var(--muted);padding:8px 12px;border-radius:8px;font-size:13px;font-weight:700;white-space:nowrap}
.moremenu a:hover{background:var(--panel2);color:#fff}
/* Two-column layout for /sprites — grid + right sidebar (mirrors the app). */
.cols{display:block}.side{display:flex;flex-direction:column;gap:16px;margin-top:32px}
@media(min-width:960px){.cols{display:flex;align-items:flex-start;gap:24px}.main{min-width:0;flex:1}.side{margin-top:0;width:320px;flex:0 0 320px}}
.sidecard{padding:16px}.sidecard .sh{font-family:'Inter',sans-serif;font-size:16px;font-weight:800;color:#fff;margin:0;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sidecard .sub{margin:6px 0 10px;font-size:12px;color:var(--muted)}
.sidecard .rumored{background:rgba(245,158,11,.16);color:#fcd34d;font-size:9px;font-weight:800;text-transform:uppercase;padding:2px 6px;border-radius:5px}
.sidecard .fine{margin:10px 0 0;font-size:11px;color:var(--muted);opacity:.85}
details.gd{background:var(--panel2);border:0;border-radius:10px;padding:0 12px;margin:8px 0 0}
details.gd summary{font-size:13px;font-weight:700;padding:10px 0}details.gd p{font-size:13px;color:#cdd6f0;margin:0 0 10px;max-width:none}
.ctacard{display:block;text-align:center;background:linear-gradient(90deg,var(--brand),var(--brand2) 175%);color:#04121f;font-weight:800;padding:15px 16px;border-radius:16px;font-size:15px;box-shadow:0 8px 22px rgba(54,197,255,.22)}
.ctacard:hover{filter:brightness(1.04)}
.uplist{display:flex;flex-direction:column;gap:8px}
.uprow{display:flex;align-items:center;gap:10px;background:var(--panel2);border:1px solid transparent;border-radius:12px;padding:8px;color:inherit;transition:border-color .15s}
.uprow:hover{border-color:var(--brand)}
.upic{width:40px;height:40px;border-radius:9px;flex:0 0 auto;overflow:hidden;display:block}.upic img{width:100%;height:100%;object-fit:contain}
.upmeta{min-width:0;flex:1}.upmeta b{font-size:13px;color:#fff}.upmeta small{display:block;font-size:11px}.upmeta .upab{color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.update{flex:0 0 auto;font-size:11px;font-weight:800;color:#fcd34d;text-align:right}
.chestcard .cl-lab{display:block;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:2px 0 4px}
.chestcard .cl-sel,.chestcard .cl-fin{width:100%;background:var(--panel2);color:#fff;border:1px solid var(--border);border-radius:12px;padding:9px 10px;font-size:13px;margin-bottom:10px}
.chestcard .cl-warn{margin:-4px 0 10px;padding:6px 9px;border-radius:9px;background:rgba(251,191,36,.1);color:#fde68a;font-size:10.5px;line-height:1.4}
.chestcard .cl-rate{display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--bg2);border-radius:12px;padding:8px 10px;font-size:13px;color:#fff;margin-bottom:10px}
.chestcard .cl-rate .cl-dot{width:9px;height:9px;border-radius:50%;display:inline-block;margin-right:6px}
.chestcard .cl-avg{color:var(--muted);text-align:right}.chestcard .cl-avg b{color:#fff}
.chestcard .cl-rows{display:flex;flex-direction:column;gap:4px}
.chestcard .cl-rows>div{display:flex;justify-content:space-between;font-size:13px}.chestcard .cl-rows span{color:var(--muted)}.chestcard .cl-rows b{color:#fff;font-weight:700}
.chestcard .cl-open{margin-top:10px;background:var(--bg2);border-radius:12px;padding:10px}
.chestcard .cl-open .cl-in{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
.chestcard .cl-n{width:92px;background:var(--panel);color:#fff;border:1px solid var(--border);border-radius:8px;padding:5px 8px;font-size:13px}
.chestcard .cl-res{margin:8px 0 0;font-size:13px;color:#fff}.chestcard .cl-res b{color:var(--brand)}
.supportcard{background:linear-gradient(160deg,rgba(123,97,255,.22),rgba(54,197,255,.12))}
.supportcard .cc2{color:var(--brand);font-weight:800;letter-spacing:.03em}
.supportcard .bmc{display:block;text-align:center;margin-top:10px;background:#FFDD00;color:#000;font-weight:800;padding:10px;border-radius:10px}
.hero{display:flex;gap:22px;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:24px}
.avatar{width:108px;height:108px;border-radius:16px;display:grid;place-items:center;font-size:54px;flex:0 0 auto;border:1px solid var(--border);position:relative;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
.avatar .art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:1}
.avatar .avfallback{position:absolute;inset:0;display:grid;place-items:center;font-size:54px;z-index:0}
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
.variants{display:grid;grid-template-columns:repeat(auto-fill,minmax(158px,1fr));gap:10px}
.variant{background:var(--panel2);border:1px solid var(--border);border-radius:14px;padding:12px 10px;text-align:center;font-size:12px}
.variant .sw{width:64px;height:64px;border-radius:12px;margin:0 auto 6px;overflow:hidden;position:relative}
.variant .sw img{width:100%;height:100%;object-fit:contain;position:relative;z-index:1}.variant .sw .swfallback{position:absolute;inset:0;display:grid;place-items:center;font-size:30px;z-index:0}.variant small{color:var(--muted);display:block;font-size:10px}
.variant .nm{display:block;font-weight:700;color:var(--text);font-size:12.5px}
.variant .perk{display:block;margin-top:7px;padding-top:7px;border-top:1px solid var(--border);color:var(--muted);font-size:10.5px;line-height:1.4;text-align:left}
.variant .perk b{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;font-weight:800}
details{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:2px 16px;margin-bottom:8px}
summary{cursor:pointer;font-weight:700;padding:13px 0}details p{margin:0 0 12px;max-width:none}
.related{display:flex;gap:10px;flex-wrap:wrap}.related a{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:9px 13px;font-weight:700;font-size:14px;color:var(--text);transition:border-color .15s}
.related a:hover{border-color:var(--brand)}
.bigcta{display:block;text-align:center;background:linear-gradient(90deg,var(--brand),var(--brand2));color:#000;font-weight:800;padding:16px;border-radius:14px;margin:32px 0 10px;font-size:16px;max-width:none}
footer.foot{margin-top:48px;border-top:1px solid var(--border);padding-top:24px;text-align:center;font-size:12px;color:var(--muted)}
.foot .row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 16px;margin-bottom:12px;font-weight:600}
.foot .row a{color:var(--muted)}.foot .row a:hover{color:#fff}.foot .sep{opacity:.3}
.foot .cc b{color:var(--brand);font-weight:700}
.foot p{max-width:none;margin:8px auto 0;opacity:.8;line-height:1.5;color:var(--muted)}
.foot p a{color:var(--muted);text-decoration:underline}.foot p a:hover{color:#fff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.tile{display:flex;gap:12px;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:12px;color:var(--text);transition:border-color .15s}
.tile:hover{border-color:var(--brand)}
.tile .ic{width:48px;height:48px;border-radius:12px;display:grid;place-items:center;font-size:24px;flex:0 0 auto;overflow:hidden}
.tile .ic{position:relative}.tile .ic img{width:100%;height:100%;object-fit:contain;position:relative;z-index:1}.tile .ic .icfallback{position:absolute;inset:0;display:grid;place-items:center;font-size:24px;z-index:0}
.guide{display:grid;gap:10px;margin:0 0 8px}
.guide .card h3{font-family:'Inter',sans-serif;font-size:15px;font-weight:800;color:var(--brand);letter-spacing:0;margin:0 0 6px}
.guide .card p{margin:0 0 8px;max-width:none}.guide .card p:last-child{margin-bottom:0}.guide .card b{color:#fff}
@media(min-width:640px){.wrap{padding:24px 24px 96px}.logo{gap:10px}.logo .mark-sm{width:36px;height:36px}.logo .wm{font-size:36px}.tagline{font-size:14px}}
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
<header class="site"><div class="hgroup"><a class="logo" href="/">${MARK}<span class="wm">FN <b>Sprite</b> Tracker</span></a><p class="tagline">${RELEASED_COUNT} released variants · accurate to the Jul 30, 2026 New Sprite Day (v41.30 — Peeky Peely, Lootin’ Llama, Ironmouse + the John Wick &amp; Spider-Man collabs).</p></div><a class="cta" href="/">Log in to save</a></header>
<nav class="nav" aria-label="Sections">
  <a href="/">Collection</a>
  <a href="/?view=leaderboard">🏆 Leaderboard</a>
  <a href="/?view=stats">📊 Stats</a>
  <a href="/?view=news">📰 News</a>
  <a href="/?view=shop">🛒 Item Shop</a>
  <a href="/sprites" class="on" aria-current="page">🧩 Sprites</a>
  <a href="/?cosmetics=1">🧢 Cosmetics</a>
  <details class="more"><summary>⋯ More <span class="mcaret">▾</span></summary><div class="moremenu">
    <a href="/?about=1">About</a>
    <a href="/?changelog=1">Changelog</a>
    <a href="/?backup=1">Backup</a>
    <a href="/?bug=1">Report a bug</a>
    <a href="https://buymeacoffee.com/kamalathedesigner" target="_blank" rel="noreferrer">☕ Buy me a coffee</a>
  </div></details>
</nav>`
}

// Chest luck calculator data + runtime — a static clone of the app's
// src/components/ChestOdds.jsx. RATED_MAP is every Sprite with a known base
// drop rate; the inline script wires each .chestcard (select + "open N chests").
const RATED_MAP = Object.fromEntries(
  SPRITE_TYPES.map((t) => {
    const p = parseRate(t.dropRate)
    if (!p) return null
    // Obtainable finishes for this Sprite (released variant + known odds factor).
    const finishes = Object.keys(t.variants)
      .filter((f) => THEME_MAP[f] && FINISH_ODDS_FACTOR[f] != null && SPRITE_BY_ID[`${t.id}_${f}`]?.released)
      .map((f) => ({ id: f, name: THEME_MAP[f].name, factor: FINISH_ODDS_FACTOR[f] }))
    return [t.id, { p, dropRate: t.dropRate, name: t.name, color: RARITY_TINT[t.rarity] || '#888', finishes }]
  }).filter(Boolean),
)
const CHEST_SCRIPT = `<script>window.__RATED=${JSON.stringify(RATED_MAP)};(function(){var R=window.__RATED||{};var cf=function(p,c){return Math.ceil(Math.log(1-c)/Math.log(1-p))};var a1=function(p,n){return 1-Math.pow(1-p,n)};var fmt=function(x){return Math.round(x).toLocaleString()};var pct=function(x){var v=x*100;if(v>=99.95)return'>99.9%';if(v<0.1)return v.toPrecision(2)+'%';return v.toFixed(1)+'%'};var rs=function(x){var v=x*100;return (v<0.1?v.toPrecision(2):v.toFixed(2))+'%'};document.querySelectorAll('.chestcard').forEach(function(card){var sel=card.querySelector('.cl-sel'),fin=card.querySelector('.cl-fin'),finlab=card.querySelector('.cl-finlab'),warn=card.querySelector('.cl-warn'),n=card.querySelector('.cl-n');function d(){return R[sel.value];}function cur(){var o=(d()&&d().finishes)||[];for(var i=0;i<o.length;i++){if(o[i].id===fin.value)return o[i];}return{id:'normal',name:'Normal',factor:1};}function eff(){return d().p*cur().factor;}function fill(){var o=(d()&&d().finishes)||[];if(o.length>1){fin.innerHTML=o.map(function(f){return '<option value="'+f.id+'">'+f.name+(f.id==='normal'?' (base rate)':' \\u2014 ~'+Math.round(1/f.factor)+'x rarer')+'</option>';}).join('');fin.value='normal';fin.style.display='';finlab.style.display='';}else{fin.innerHTML='';fin.style.display='none';finlab.style.display='none';}}function res(){if(!d())return;var p=eff(),c=cur();var v=Math.max(0,Math.floor(Number(n.value)||0));var nm=c.id==='normal'?d().name:(c.name+' '+d().name);card.querySelector('.cl-res').innerHTML='<b>'+pct(a1(p,v))+'</b> chance of at least one <b>'+nm+'</b>';}function draw(){if(!d())return;var p=eff(),c=cur(),sp=c.id!=='normal';card.querySelector('.cl-dot').style.background=d().color;card.querySelector('.cl-ratelab').textContent=sp?(c.name+' rate'):'Drop rate';card.querySelector('.cl-rateval').textContent=sp?('\\u2248'+rs(p)):d().dropRate;card.querySelector('.cl-avg').innerHTML='~<b>'+fmt(1/p)+'</b> chests avg';card.querySelector('.cl-c50').textContent=fmt(cf(p,.5))+' chests';card.querySelector('.cl-c90').textContent=fmt(cf(p,.9))+' chests';card.querySelector('.cl-c99').textContent=fmt(cf(p,.99))+' chests';if(sp){warn.style.display='';warn.textContent='\\u26A0\\uFE0E Estimate only \\u2014 assumes the '+c.name+' finish is ~'+Math.round(1/c.factor)+'x rarer than the base pull.';}else{warn.style.display='none';}res();}sel.addEventListener('change',function(){fill();n.value=cf(eff(),.5);draw();});fin.addEventListener('change',function(){n.value=cf(eff(),.5);draw();});n.addEventListener('input',res);if(d()){fill();n.value=cf(eff(),.5);}draw();});})();</script>`

// Mirrors the app footer (src/App.jsx) so the whole site shares one footer:
// the same sections row, the utility/support row (modal links deep-link into
// the app via ?about=1 etc.), the #EpicPartner line and the attribution notes.
const FOOT = `<footer class="foot">
<nav class="row" aria-label="Sections"><a href="/">Collection</a><span class="sep">·</span><a href="/?view=leaderboard">🏆 Leaderboard</a><span class="sep">·</span><a href="/?view=stats">📊 Stats</a><span class="sep">·</span><a href="/?view=news">📰 News</a><span class="sep">·</span><a href="/?view=shop">🛒 Item Shop</a></nav>
<div class="row"><a href="/?cosmetics=1">🧢 Cosmetics (beta)</a><span class="sep">·</span><a href="/?about=1">About</a><span class="sep">·</span><a href="/?changelog=1">Changelog</a><span class="sep">·</span><a href="/?backup=1">Backup</a><span class="sep">·</span><a href="/?bug=1">Report a bug</a><span class="sep">·</span><a href="https://buymeacoffee.com/kamalathedesigner" target="_blank" rel="noreferrer">☕ Buy me a coffee</a><span class="sep">·</span><a href="/sprites">🗂️ Sprite database</a><span class="sep">·</span><span class="cc">Creator Code <b>MOMBIE</b></span></div>
<p>Fan-made sprite tracker · not affiliated with Epic Games. #EpicPartner</p>
<p>Sprite images are © Epic Games, Inc., used for identification only. Official base art sourced from <a href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore/sprite-tracker</a>; some variant art — the Holofoil renders and the Air &amp; Seven sprites — is AI-generated (Google Gemini), while real-person collab sprites (Vini Jr., Pollo) use Epic's official art with the background removed, never an AI likeness. A built-in generator covers anything still missing an image.</p>
<p>Roster, themes &amp; drop rates cross-referenced from <a href="https://fortnite.gg/sprites" target="_blank" rel="noreferrer">fortnite.gg</a>, <a href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore</a> &amp; the <a href="https://fortnite.fandom.com/wiki/Sprites" target="_blank" rel="noreferrer">Fortnite Wiki</a>. Upcoming/leaked sprites &amp; forms are labelled <b>Rumored</b> until Epic confirms; gameplay tiers are a community/meta snapshot (<a href="https://games.gg" target="_blank" rel="noreferrer">GAMES.GG</a>, <a href="https://www.playerauctions.com" target="_blank" rel="noreferrer">PlayerAuctions</a>, <a href="https://www.destructoid.com" target="_blank" rel="noreferrer">Destructoid</a>). News &amp; events from official Fortnite patch notes, <a href="https://communities.epicgames.com" target="_blank" rel="noreferrer">Epic communities</a> &amp; <a href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>, with some event details cross-referenced from community trackers (<a href="https://www.vice.com" target="_blank" rel="noreferrer">Vice</a>, <a href="https://beebom.com" target="_blank" rel="noreferrer">Beebom</a>, <a href="https://allthings.how" target="_blank" rel="noreferrer">AllThings.How</a>, <a href="https://www.hotspawn.com" target="_blank" rel="noreferrer">Hotspawn</a>, <a href="https://insider-gaming.com" target="_blank" rel="noreferrer">Insider Gaming</a>) — each event shows its source and whether it's official. Item Shop, cosmetics &amp; player stats come from <a href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>. Drop rates are community estimates cross-referenced from player-tracking projects (<a href="https://accountshark.net/blog/fortnite-chapter-7-season-3-sprites" target="_blank" rel="noreferrer">AccountShark</a> &amp; <a href="https://games.gg/fortnite" target="_blank" rel="noreferrer">GAMES.GG</a>) — Epic hasn't published official rates. Built with React, Vite &amp; Supabase.</p>
</footer></div>${CHEST_SCRIPT}</body></html>`

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
    .map((tid) => ({ tid, name: THEME_MAP[tid].name, bonus: THEME_MAP[tid].bonus, accent: THEME_MAP[tid].accent, released: !!SPRITE_BY_ID[`${type.id}_${tid}`]?.released, vaulted: !!SPRITE_BY_ID[`${type.id}_${tid}`]?.vaulted }))

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
<section class="hero" style="background:linear-gradient(135deg,${tint}22,var(--panel))">
  <div class="avatar" style="background:${VARIANT_BG.normal}"><span class="avfallback">${esc(type.icon || '🧩')}</span><img class="art" src="/sprites/${type.id}_normal.png" alt="${esc(name)} Sprite (Normal)" onerror="this.style.display='none'"></div>
  <div><h1>${esc(name)} Sprite</h1>
    <div class="tags"><span class="tag" style="background:${tint};color:#0a0606;border-color:transparent">${esc(type.rarity)}</span>${tier ? `<span class="tag">${tier}-Tier</span>` : ''}${type.vaulted ? '<span class="tag" style="background:#ef444422;color:#fca5a5;border-color:transparent">Vaulted</span>' : ''}${type.released ? '' : '<span class="tag">Upcoming</span>'}</div>
    <p class="lede">${esc(desc)}</p></div>
</section>
<div class="stats">${stats.map(([n, l]) => `<div class="stat"><div class="n">${esc(n)}</div><div class="l">${esc(l)}</div></div>`).join('')}</div>

<div class="cols">
  <div class="main">
<h2>How to get the ${esc(name)} Sprite</h2>
<p>${esc(source)}${p ? ` As a ${type.rarity}, at ${type.dropRate} per chest you'll typically need to open Sprite Chests at volume — or pick one up through a trade.` : ''}</p>
${oddsTable}
${type.ability ? `<h2>Ability &amp; leveling</h2><div class="card"><p style="margin:0">${esc(type.ability)}${scaling ? ` <span style="color:var(--muted)">${esc(scaling)}</span>` : ''} Reaches full effect at <b>Level 5 (Mastered)</b>. Community-reported — Epic doesn't publish exact figures.</p></div>` : ''}

<h2>${esc(name)} variants</h2>
<p style="color:var(--muted);margin:-4px 0 14px;font-size:13px">Every finish shares the Sprite’s base ability and adds its own bonus perk. Below: what each ${esc(name)} finish grants and whether it’s currently obtainable.</p>
<div class="variants">${variants.map((v) => `<div class="variant"><div class="sw" style="background:${VARIANT_BG[v.tid] || VARIANT_BG.normal}"><span class="swfallback">${esc(type.icon || '🧩')}</span><img src="/sprites/${type.id}_${v.tid}.png" alt="${esc(name)} ${esc(v.name)}" loading="lazy" onerror="this.style.display='none'"></div><b class="nm">${esc(v.name)}</b><small${v.vaulted ? ' style="color:#fca5a5"' : ''}>${v.vaulted ? 'Vaulted' : v.released ? 'Available' : 'Coming soon'}</small>${v.bonus ? `<span class="perk" style="border-top-color:${v.accent}44"><b style="color:${v.accent}">Perk</b>${esc(v.bonus)}</span>` : ''}</div>`).join('')}</div>

<h2>${esc(name)} FAQ</h2>
${faqs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}

<a class="bigcta" href="/">Track the ${esc(name)} in your collection — free →</a>

<h2>Other sprites</h2>
<div class="related">${others.map((o) => `<a href="/sprite/${slug(o.name)}">${esc(o.icon || '🧩')} ${esc(o.name)}</a>`).join('')}</div>
  </div>
  <aside class="side">
    ${chestLuckCard(type.id)}
    ${supportCard()}
  </aside>
</div>
` + FOOT
}

// The "How Sprites work" guide — same content as the old in-app HowItWorksModal,
// consolidated here as the single source of truth (the modal and its nav entry
// were removed; in-app "How Sprites work" links now point at #how-sprites-work).
const GUIDE = [
  { h: '✨ Getting Sprites', body: [
    'Sprites mostly come from **Sprite Chests** around the island (a few also spawn mid-match). Rarer ones — Zero Point, Grim Reaper, Burnt Peanut — have very low drop rates, which is why trading duplicates is popular.',
    '**Any chest can drop any Sprite** — rarity sets the odds, not the location. Chests glow blue with a pink crystal; turn on **Visualized Sounds** to spot them. Busiest farm is **Sinister Strip** (4 chests); Wonkeeland, Calamari Canyon, Heatwave Harbor & Shaken Sanctuary have 3 each.',
  ] },
  { h: '⚠️ Extract it, or you lose it', body: [
    'A Sprite **isn’t yours until you Extract it.** If you’re eliminated before extracting, it’s gone. Extract at an **Extraction Site** or with a **Portable Extractor** (a Mastery reward). Only extracted Sprites count toward your collection.',
  ] },
  { h: '⬆️ Leveling (1 → 5)', body: [
    'A Sprite gets stronger as it levels, up to **Lv 5**. You earn level points by:',
    '• Opening containers — **≈75 pts**\n• Eliminations — **≈200 pts**\n• Extracting a duplicate Sprite — **≈200 pts**',
    '**Mastery Mondays** (every Monday, 9 AM ET, 24h) grant **2× Sprite XP & Dust** — the fastest time to level. A common tactic: land quiet, get one to Lv 3 in game one, finish to Lv 5 in game two.',
  ] },
  { h: '⭐ Mastery', body: [
    'Reaching Lv 5 **isn’t enough on its own** — you must **Extract a Sprite while it’s at Lv 5** to Master it. Each Mastery unlocks rewards in the Sprites menu: **Portable Extractors, Sprite Dust, XP and cosmetics.**',
    'In this tracker, marking a variant **★ Mastered** = you’ve extracted it at Lv 5.',
  ] },
  { h: '🎨 Variants & forms', body: [
    'Each Sprite comes in variant finishes — Normal, Gold, Gummy, Galaxy, and newer Gem / Holofoil / Cube / Quack — each stacking a small **bonus** on top of the Sprite’s ability. Re-summoning a variant you’ve traded away costs **Sprite Dust**.',
  ] },
  { h: '🔁 Trading', body: [
    'There’s **no official trade menu** — trades happen in-game by dropping a Sprite for another player to pick up and **co-extract**. Rule of thumb: **don’t drop first**, use quiet/bot lobbies, and stick to **vouched** partners.',
  ] },
]
const rich = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')

// ---------- /sprites right-sidebar cards (mirror the app's collection sidebar) ----------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmtLeak = (d) => { const [, m, day] = d.split('-').map(Number); return `${MONTHS[m - 1]} ${day}` }

// "How Sprites work" as a compact sidebar card (collapsible sections).
const guideCard = () => `<div class="card sidecard" id="how-sprites-work"><h3 class="sh">How Sprites work</h3>
<p class="sub">Extraction, leveling, mastery &amp; trading — the parts people get caught out by.</p>
${GUIDE.map((s, i) => `<details class="gd"${i === 0 ? ' open' : ''}><summary>${esc(s.h)}</summary>${s.body.map((t) => `<p>${rich(t)}</p>`).join('')}</details>`).join('')}
<p class="fine">Community-sourced — Epic doesn’t publish exact point/drop values, so treat numbers as estimates.</p></div>`

const ctaCard = () => `<a class="card ctacard" href="/">Start tracking your collection — free →</a>`

// Upcoming & leaked sprites — same data the app's UpcomingSprites card uses.
const upcomingCard = () => {
  const up = SPRITE_TYPES.filter((t) => !t.released)
    .sort((a, b) => (a.releaseDate ? 0 : 1) - (b.releaseDate ? 0 : 1) || (a.releaseDate || '').localeCompare(b.releaseDate || ''))
  if (!up.length) return ''
  return `<div class="card sidecard"><h3 class="sh">🔮 Upcoming &amp; leaked <span class="rumored">Rumored</span></h3>
<p class="sub">Datamined / leaked — dates &amp; details aren’t confirmed by Epic.</p>
<div class="uplist">${up.map((t) => `<a class="uprow" href="/?sprite=${encodeURIComponent(t.id)}" title="Open ${esc(t.name)}"><span class="upic" style="background:${VARIANT_BG.normal}"><img src="/sprites/${t.id}_normal.png" alt="${esc(t.name)} Sprite" loading="lazy" onerror="this.style.display='none'"></span><span class="upmeta"><b>${esc(t.name)}</b> <small style="color:${RARITY_TINT[t.rarity] || '#95a0c4'}">${esc(t.rarity)}</small>${t.ability ? `<small class="upab">${esc(t.ability)}</small>` : ''}</span><span class="update">${t.releaseDate ? fmtLeak(t.releaseDate) : 'TBA'}</span></a>`).join('')}</div></div>`
}

// Chest luck card HTML. `selId` pre-selects a Sprite (used on its own page).
const chestSelectOptions = (selId) => ['Mythic', 'Legendary', 'Epic', 'Rare'].map((r) => {
  const items = SPRITE_TYPES.filter((t) => t.rarity === r && parseRate(t.dropRate))
  return items.length ? `<optgroup label="${r}">${items.map((t) => `<option value="${t.id}"${t.id === selId ? ' selected' : ''}>${esc(t.icon || '')} ${esc(t.name)} — ${esc(t.dropRate)}</option>`).join('')}</optgroup>` : ''
}).join('')
const chestLuckCard = (selId) => `<div class="card sidecard chestcard">
<h3 class="sh">🎲 Chest luck</h3>
<label class="cl-lab">Sprite</label>
<select class="cl-sel" aria-label="Pick a Sprite">${chestSelectOptions(RATED_MAP[selId] ? selId : undefined)}</select>
<label class="cl-lab cl-finlab" style="display:none">Finish</label>
<select class="cl-fin" aria-label="Pick a finish" style="display:none"></select>
<div class="cl-rate"><span><span class="cl-dot"></span><span class="cl-ratelab">Drop rate</span> <b class="cl-rateval"></b></span><span class="cl-avg"></span></div>
<p class="cl-warn" style="display:none"></p>
<div class="cl-rows"><div><span>Coin-flip (50%)</span><b class="cl-c50"></b></div><div><span>Likely (90%)</span><b class="cl-c90"></b></div><div><span>Almost sure (99%)</span><b class="cl-c99"></b></div></div>
<div class="cl-open"><div class="cl-in"><span>Open</span><input class="cl-n" type="number" min="0" aria-label="Chests to open"><span>chests →</span></div><p class="cl-res"></p></div>
<p class="fine">Base (Normal-form) rates are community-estimated — Epic doesn’t publish official odds. Special-finish odds multiply that base by a rough finish-rarity estimate and are approximate, not measured.</p></div>`

const supportCard = () => `<div class="card sidecard supportcard"><h3 class="sh">Support the maker 💜</h3>
<p class="sub">This tracker is free &amp; fan-made. Two easy ways to help:</p>
<p style="font-size:13px;color:#cdd6f0;margin:0 0 4px">Enter Creator Code <b class="cc2">MOMBIE</b> in the Fortnite Item Shop at checkout — it supports me at no extra cost. #EpicPartner</p>
<a class="bmc" href="https://buymeacoffee.com/kamalathedesigner" target="_blank" rel="noreferrer">☕ Buy me a coffee</a></div>`

// ---------- /sprites index hub ----------
function indexPage(types) {
  const byRarity = ['Mythic', 'Legendary', 'Epic', 'Rare'].map((r) => ({ r, items: types.filter((t) => t.rarity === r) })).filter((g) => g.items.length)
  const desc = `The complete Fortnite Sprite checklist — all ${RELEASED_COUNT} released sprite variants with drop rates, re-summon Dust costs, abilities and tiers. Track and compare your collection free.`
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'All Fortnite Sprites',
    url: SITE + '/sprites', description: desc,
  }
  return head({ title: 'All Fortnite Sprites — Checklist, Drop Rates & Dust Costs | FN Sprite Tracker', desc, canonical: SITE + '/sprites', jsonld }) + `
<div class="cols">
  <div class="main">
    <h1 class="sr-only">All Fortnite Sprites</h1>
${byRarity.map((g) => `    <h2>${g.r} sprites</h2><div class="grid">${g.items.map((t) => `<a class="tile" href="/sprite/${slug(t.name)}"><span class="ic" style="background:${VARIANT_BG.normal}"><span class="icfallback">${esc(t.icon || '🧩')}</span><img src="/sprites/${t.id}_normal.png" alt="${esc(t.name)} Sprite" loading="lazy" onerror="this.style.display='none'"></span><span><b>${esc(t.name)}</b><br><small style="color:var(--muted)">${esc(t.rarity)}${t.dropRate ? ` · ${esc(t.dropRate)}` : ''}${t.vaulted ? ' · <span style="color:#fca5a5;font-weight:700">Vaulted</span>' : ''}</small></span></a>`).join('')}</div>`).join('\n')}
  </div>
  <aside class="side">
    ${guideCard()}
    ${ctaCard()}
    ${upcomingCard()}
    ${chestLuckCard()}
    ${supportCard()}
  </aside>
</div>
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
