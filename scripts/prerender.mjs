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
  RARITY_COLORS, RARITY_ORDER, TIER_META, TIER_ORDER, GENERATIONS,
  dustCost, spriteTier, spriteScaling, spriteSource,
} from '../src/data/sprites.js'
import { THEME_MAP, FINISH_ODDS_FACTOR } from '../src/data/themes.js'
import { SPRITE_GUIDE } from '../src/data/spriteGuide.js'
import { NEWS, NEWS_TAGS } from '../src/data/news.js'
import { CODES_INTRO, CODE_CATEGORIES, LOBBY_CODES } from '../src/data/codes.js'

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
  cheatmaster: 'linear-gradient(135deg,#12351f,#0f2a3a 45%,#2a0f3a)',
}

// Season 4 "Override" art ships as .webp; Season 3 as .png. SpriteArt/onerror
// handles the fallback either way.
const imgExt = (type) => (type.gen === 'c7s4' ? 'webp' : 'png')
// Human season label for a Sprite's generation (for the per-page "Season" tag).
const genLabel = (type) => {
  const g = GENERATIONS.find((x) => x.id === (type.gen || 'c7s3'))
  return g ? `${g.name} · ${g.sub}` : null
}

// Design tokens + primitives are lifted verbatim from the app (src/index.css +
// tailwind usage in App.jsx) so the static pages read as the SAME product:
// identical palette, the app's two-radial background, its max-w-6xl (1152px)
// container, rounded-2xl cards, and the Inter body / Luckiest-Guy display split.
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Inter:wght@400;500;600;700;800&display=swap');
:root{--bg:#0d0b12;--bg2:#15111c;--panel:#191420;--panel2:#241d30;--border:#2f2740;--text:#f4efe9;--muted:#a99fb8;--brand:#ffc93c;--brand2:#b45cff}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;color:var(--text);line-height:1.6;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;background:radial-gradient(1200px 600px at 80% -10%,rgba(180,92,255,.18),transparent 60%),radial-gradient(1000px 500px at 0% 0%,rgba(255,201,60,.14),transparent 55%),var(--bg)}
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
details.gd summary{font-size:13px;font-weight:700;padding:10px 0}details.gd p{font-size:13px;color:#dcd2e6;margin:0 0 10px;max-width:none}
.ctacard{display:block;text-align:center;background:linear-gradient(90deg,var(--brand),var(--brand2) 175%);color:#1a1020;font-weight:800;padding:15px 16px;border-radius:16px;font-size:15px;box-shadow:0 8px 22px rgba(255,201,60,.22)}
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
.supportcard{background:linear-gradient(160deg,rgba(180,92,255,.22),rgba(255,201,60,.12))}
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
p{color:#dcd2e6;max-width:70ch}
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
/* /sprites "How to get every Sprite" board — mirrors the in-app SpriteGuide:
   a searchable, sortable, filterable table (sort/filter/search run client-side). */
.board .lede{color:var(--muted);margin:2px 0 14px;font-size:14px;max-width:70ch}
.board .bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}
.board .search{position:relative;flex:1 1 100%}
.board .search input{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:9px 12px 9px 34px;color:#fff;font-size:14px;font-family:inherit}
.board .search input::placeholder{color:var(--muted)}.board .search input:focus{outline:none;border-color:var(--brand)}
.board .search .mag{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:13px}
.board .segs{display:flex;flex-wrap:wrap;gap:4px}
.board .seg{background:var(--panel2);color:var(--muted);border:0;border-radius:999px;padding:5px 11px;font-size:11px;font-weight:800;cursor:pointer;font-family:inherit}
.board .seg:hover{color:#fff}
.board .sortsegs .seg.on{background:var(--brand);color:#000}
.board .filtsegs{margin-left:auto}.board .filtsegs .seg.on{background:rgba(255,255,255,.9);color:#000}
.board .monday{margin:0 0 12px;border-radius:12px;padding:8px 12px;font-size:12px;font-weight:700;background:var(--bg2);color:var(--muted)}
.ghead{display:none}
@media(min-width:640px){.ghead{display:grid;grid-template-columns:1.6fr .7fr .9fr .7fr 2fr;gap:8px;padding:0 10px 4px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}.ghead .r{text-align:right}}
.grows{display:flex;flex-direction:column;gap:4px}
.grow{display:grid;grid-template-columns:1fr 1fr;gap:6px 8px;align-items:center;background:var(--bg2);border:1px solid transparent;border-radius:12px;padding:9px 10px;color:inherit;transition:background .15s,border-color .15s}
.grow:hover{background:var(--panel2);border-color:var(--brand)}
@media(min-width:640px){.grow{grid-template-columns:1.6fr .7fr .9fr .7fr 2fr}}
.grow .nm{display:flex;align-items:center;gap:8px;min-width:0}
.grow .nm .ic{font-size:18px;line-height:1;flex:0 0 auto}.grow .nm .nt{min-width:0}
.grow .nm .nt b{display:block;font-size:13.5px;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.grow .badges{display:flex;gap:4px;margin-top:3px}
.grow .badges span{font-size:9px;font-weight:800;text-transform:uppercase;padding:1px 5px;border-radius:4px;line-height:1.5}
.grow .tier{text-align:right}@media(min-width:640px){.grow .tier{text-align:left}}
.grow .tier span{font-size:10px;font-weight:800;padding:2px 6px;border-radius:5px}
.grow .drop,.grow .dust{text-align:right;font-size:12px}
.grow .drop b,.grow .dust b{color:#fff;font-weight:700}.grow .drop small,.grow .dust small{display:block;font-size:10px;color:var(--muted)}
.grow .src{grid-column:1/-1;font-size:11px;line-height:1.5;color:var(--muted)}
@media(min-width:640px){.grow .src{grid-column:auto;margin:0}}
.board .empty{display:none;text-align:center;padding:16px;border-radius:12px;background:var(--bg2);color:var(--muted);font-size:13px}
.board .fine{margin:12px 0 0;font-size:10.5px;line-height:1.5;color:var(--muted)}
/* /news feed — mirrors the in-app NewsFeed: tag chips + search over card rows. */
.nf .bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}
.nf .search{position:relative;flex:1 1 100%}
.nf .search input{width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:9px 12px 9px 34px;color:#fff;font-size:14px;font-family:inherit}
.nf .search input::placeholder{color:var(--muted)}.nf .search input:focus{outline:none;border-color:var(--brand)}
.nf .search .mag{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:13px}
.nf .segs{display:flex;flex-wrap:wrap;gap:4px}
.nf .seg{background:var(--panel2);color:var(--muted);border:0;border-radius:999px;padding:5px 11px;font-size:11px;font-weight:800;cursor:pointer;font-family:inherit}
.nf .seg:hover{color:#fff}.nf .seg.on{background:var(--sc);color:#000}
.nf .list{display:flex;flex-direction:column;gap:8px}
.ncard{display:flex;gap:12px;background:var(--bg2);border:1px solid var(--border);border-left-width:3px;border-radius:12px;padding:12px;color:inherit;transition:transform .15s,background .15s}
.ncard:hover{transform:translateY(-2px);background:var(--panel2)}
.ncard .thumb{position:relative;width:64px;height:64px;flex:0 0 auto;border-radius:10px;overflow:hidden;display:grid;place-items:center;font-size:26px}
.ncard .thumb img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;z-index:1}
.ncard .thumb .live{position:absolute;left:4px;top:4px;z-index:2;background:#ef4444;color:#fff;font-size:8px;font-weight:800;text-transform:uppercase;padding:2px 4px;border-radius:4px;letter-spacing:.04em}
.ncard .meta{min-width:0;flex:1}
.ncard .tgs{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:4px}
.ncard .tg{font-size:10px;font-weight:800;text-transform:uppercase;color:#000;padding:1px 6px;border-radius:4px}
.ncard .tent{font-size:10px;font-weight:800;text-transform:uppercase;color:#fcd34d;background:rgba(245,158,11,.16);padding:1px 6px;border-radius:4px}
.ncard .res{font-size:10px;font-weight:800;text-transform:uppercase;color:#6ee7b7;background:rgba(52,211,153,.18);padding:1px 6px;border-radius:4px}
.ncard .when{font-size:11px;font-weight:700;color:var(--muted)}
.ncard h3{font-size:14px;font-weight:800;color:#fff;margin:0;line-height:1.3}
.ncard .bd{font-size:12px;color:var(--muted);margin:3px 0 0;max-width:none;line-height:1.5}
.ncard .src{font-size:10px;font-weight:700;color:var(--muted);margin-top:6px}
.ncard .src .off{color:#6ee7b7}.ncard .src .un{color:#fcd34d}
.nf .empty{display:none;text-align:center;padding:16px;border-radius:12px;background:var(--bg2);color:var(--muted);font-size:13px}
.nf .fine{margin:12px 0 0;font-size:10.5px;line-height:1.5;color:var(--muted)}
@media(min-width:640px){.wrap{padding:24px 24px 96px}.logo{gap:10px}.logo .mark-sm{width:36px;height:36px}.logo .wm{font-size:36px}.tagline{font-size:14px}}
@media(max-width:640px){.stats{grid-template-columns:repeat(2,1fr)}.hero{flex-direction:column;text-align:center}h1{font-size:28px}.avatar{width:92px;height:92px}.tags{justify-content:center}}
`

// The shared sprite logomark (mirrors src/components/Logo.jsx).
const MARK = `<svg class="mark-sm" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="flm-edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc93c"/><stop offset="1" stop-color="#b45cff"/></linearGradient></defs><path d="M36 30 C36 20 44 14 50 14 C56 14 64 20 64 30 Z" fill="#7c5a4c"/><circle cx="50" cy="15" r="10" fill="#7c5a4c"/><path d="M43 10 C46 6 54 6 57 10 M41 16 C44 11 50 10 52 14 M48 8 C52 9 55 12 56 16 M44 20 C47 15 53 15 57 19" stroke="#5f4436" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M50 30 C31 30 22 40 22 56 L22 66 C22 84 34 92 50 92 C66 92 78 84 78 66 L78 56 C78 40 69 30 50 30 Z" fill="url(#flm-edge)"/><ellipse cx="38" cy="91" rx="8" ry="5.5" fill="url(#flm-edge)"/><ellipse cx="62" cy="91" rx="8" ry="5.5" fill="url(#flm-edge)"/><path d="M23 66 C19 64 15 65 13 68" stroke="url(#flm-edge)" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="6" y="60" width="15" height="13" rx="3" fill="#fff7ec" stroke="#241533" stroke-width="1.8"/><ellipse cx="13.5" cy="61" rx="6.5" ry="2" fill="#5a3a22"/><path d="M21 63 q5 0 5 4 q0 4 -5 4" stroke="#241533" stroke-width="1.8" fill="none"/><ellipse cx="13.5" cy="74" rx="10" ry="2.2" fill="#fff7ec" stroke="#241533" stroke-width="1.4"/><path d="M10 57 q3 -3 0 -6 q-3 -3 0 -6 M17 57 q3 -3 0 -6 q-3 -3 0 -6" stroke="#cdbfe0" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M24 50 C21 60 23 69 28 74 C25 66 25 57 28 50 Z" fill="#7c5a4c"/><path d="M76 50 C79 60 77 69 72 74 C75 66 75 57 72 50 Z" fill="#7c5a4c"/><path d="M24 55 C22 37 32 26 50 26 C68 26 78 37 76 55 C71 46 64 43 60 45 C57 47 56 50 52 49 C50 48.5 49 46 46 45 C40 43 31 46 24 55 Z" fill="#7c5a4c"/><path d="M33 44 C37 40 42 39 46 42 M54 42 C58 39 63 40 67 44 M48 41 C50 40 52 40 53 42" stroke="#5f4436" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/><path d="M50 26 L41 21 L41 31 Z" fill="#b45cff"/><path d="M50 26 L59 21 L59 31 Z" fill="#b45cff"/><circle cx="50" cy="26" r="2.6" fill="#8a3fd4"/><path d="M34.5 54 Q41 51 47 54 M53 54 Q59 51 65.5 54" stroke="#3a2740" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5"/><ellipse cx="41" cy="58" rx="7" ry="7.9" fill="#fff"/><ellipse cx="59" cy="58" rx="7" ry="7.9" fill="#fff"/><circle cx="41.4" cy="59" r="4.7" fill="#3a2740"/><circle cx="59.4" cy="59" r="4.7" fill="#3a2740"/><circle cx="39.6" cy="56.6" r="2.1" fill="#fff"/><circle cx="57.6" cy="56.6" r="2.1" fill="#fff"/><circle cx="43.4" cy="61" r="1.1" fill="#fff" opacity=".85"/><circle cx="61.4" cy="61" r="1.1" fill="#fff" opacity=".85"/><ellipse cx="30" cy="66" rx="4.8" ry="3" fill="#ff8a7a" opacity=".6"/><ellipse cx="70" cy="66" rx="4.8" ry="3" fill="#ff8a7a" opacity=".6"/><path d="M46 71 C47.5 74.8 52.5 74.8 54 71 C52 73 48 73 46 71 Z" fill="#3a2740"/><path d="M49 72.3 Q50 73.8 51 72.3 Z" fill="#ff9d8a"/></svg>`

// Primary nav — mirrors the in-app TABS order (src/App.jsx) exactly so the app
// and the static pages read as one product. /sprites and /news are real static
// pages; the rest deep-link into the app. `active` marks the current one.
const NAV_LINKS = [
  { key: 'collection', href: '/', label: 'Collection' },
  { key: 'sprites', href: '/sprites', label: '🧩 Sprites' },
  { key: 'codes', href: '/codes', label: '🔓 Lobby Hacks' },
  { key: 'leaderboard', href: '/?view=leaderboard', label: '🏆 Leaderboard' },
  { key: 'garden', href: '/?view=garden', label: '🌱 Garden' },
  { key: 'news', href: '/news', label: '📰 News' },
  { key: 'stats', href: '/?view=stats', label: '📊 Stats' },
  { key: 'shop', href: '/?view=shop', label: '🛒 Item Shop' },
]

function head({ title, desc, canonical, jsonld, ogImage, active = 'sprites' }) {
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
<header class="site"><div class="hgroup"><a class="logo" href="/">${MARK}<span class="wm">FN <b>Sprite</b> Tracker</span></a><p class="tagline">${RELEASED_COUNT} released variants · v41.30 (Jul 30, 2026)</p></div><a class="cta" href="/">Log in to save</a></header>
<nav class="nav" aria-label="Sections">
  ${NAV_LINKS.map((l) => `<a href="${l.href}"${l.key === active ? ' class="on" aria-current="page"' : ''}>${l.label}</a>`).join('\n  ')}
  <details class="more"><summary>⋯ More <span class="mcaret">▾</span></summary><div class="moremenu">
    <a href="/?about=1">About</a>
    <a href="/?changelog=1">Changelog</a>
    <a href="/?backup=1">Backup</a>
    <a href="/?bug=1">Report a bug</a>
    <a href="/tier-list">🏆 Tier list</a>
    <a href="/sprite-garden">🌱 Sprite Garden</a>
    <a href="/sprite-dust">🔷 Sprite Dust</a>
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
    // Obtainable finishes for this Sprite (released, non-vaulted variant + known
    // odds factor). Vaulted finishes aren't currently pullable, so they're excluded.
    const finishes = Object.keys(t.variants)
      .filter((f) => THEME_MAP[f] && FINISH_ODDS_FACTOR[f] != null && SPRITE_BY_ID[`${t.id}_${f}`]?.released && !SPRITE_BY_ID[`${t.id}_${f}`]?.vaulted)
      .map((f) => ({ id: f, name: THEME_MAP[f].name, factor: FINISH_ODDS_FACTOR[f] }))
    return [t.id, { p, dropRate: t.dropRate, name: t.name, color: RARITY_TINT[t.rarity] || '#888', finishes }]
  }).filter(Boolean),
)
const CHEST_SCRIPT = `<script>window.__RATED=${JSON.stringify(RATED_MAP)};(function(){var R=window.__RATED||{};var cf=function(p,c){return Math.ceil(Math.log(1-c)/Math.log(1-p))};var a1=function(p,n){return 1-Math.pow(1-p,n)};var fmt=function(x){return Math.round(x).toLocaleString()};var pct=function(x){var v=x*100;if(v>=99.95)return'>99.9%';if(v<0.1)return v.toPrecision(2)+'%';return v.toFixed(1)+'%'};var rs=function(x){var v=x*100;return (v<0.1?v.toPrecision(2):v.toFixed(2))+'%'};document.querySelectorAll('.chestcard').forEach(function(card){var sel=card.querySelector('.cl-sel'),fin=card.querySelector('.cl-fin'),finlab=card.querySelector('.cl-finlab'),warn=card.querySelector('.cl-warn'),n=card.querySelector('.cl-n');function d(){return R[sel.value];}function cur(){var o=(d()&&d().finishes)||[];for(var i=0;i<o.length;i++){if(o[i].id===fin.value)return o[i];}return{id:'normal',name:'Normal',factor:1};}function eff(){return d().p*cur().factor;}function fill(){var o=(d()&&d().finishes)||[];if(o.length>1){fin.innerHTML=o.map(function(f){return '<option value="'+f.id+'">'+f.name+(f.id==='normal'?' (base rate)':' \\u2014 ~'+Math.round(1/f.factor)+'x rarer')+'</option>';}).join('');fin.value='normal';fin.style.display='';finlab.style.display='';}else{fin.innerHTML='';fin.style.display='none';finlab.style.display='none';}}function res(){if(!d())return;var p=eff(),c=cur();var v=Math.max(0,Math.floor(Number(n.value)||0));var nm=c.id==='normal'?d().name:(c.name+' '+d().name);card.querySelector('.cl-res').innerHTML='<b>'+pct(a1(p,v))+'</b> chance of at least one <b>'+nm+'</b>';}function draw(){if(!d())return;var p=eff(),c=cur(),sp=c.id!=='normal';card.querySelector('.cl-dot').style.background=d().color;card.querySelector('.cl-ratelab').textContent=sp?(c.name+' rate'):'Drop rate';card.querySelector('.cl-rateval').textContent=sp?('\\u2248'+rs(p)):d().dropRate;card.querySelector('.cl-avg').innerHTML='~<b>'+fmt(1/p)+'</b> chests avg';card.querySelector('.cl-c50').textContent=fmt(cf(p,.5))+' chests';card.querySelector('.cl-c90').textContent=fmt(cf(p,.9))+' chests';card.querySelector('.cl-c99').textContent=fmt(cf(p,.99))+' chests';if(sp){warn.style.display='';warn.textContent='\\u26A0\\uFE0E Estimate only \\u2014 assumes the '+c.name+' finish is ~'+Math.round(1/c.factor)+'x rarer than the base pull.';}else{warn.style.display='none';}res();}sel.addEventListener('change',function(){fill();n.value=cf(eff(),.5);draw();});fin.addEventListener('change',function(){n.value=cf(eff(),.5);draw();});n.addEventListener('input',res);if(d()){fill();n.value=cf(eff(),.5);}draw();});})();</script>`

// Runtime for the /sprites "how to get every Sprite" board: client-side sort,
// filter and search over the pre-rendered rows. No-ops on pages without #how-to-get.
const GUIDE_SCRIPT = `<script>(function(){var b=document.getElementById('how-to-get');if(!b)return;var grows=b.querySelector('.grows'),rows=[].slice.call(b.querySelectorAll('.grow')),search=b.querySelector('#gsearch'),empty=b.querySelector('#gempty');var sort='easiest',filter='all';function num(v,f){return v===''||v==null?f:parseFloat(v)}var S={easiest:function(a,b){var sa=a.dataset.status==='available'?0:1,sb=b.dataset.status==='available'?0:1;return sa-sb||num(b.dataset.p,-1)-num(a.dataset.p,-1)||(+a.dataset.rank)-(+b.dataset.rank)},rarest:function(a,b){return (+b.dataset.rank)-(+a.dataset.rank)||num(a.dataset.p,2)-num(b.dataset.p,2)},dust:function(a,b){return num(a.dataset.dust,Infinity)-num(b.dataset.dust,Infinity)},az:function(a,b){return a.dataset.name<b.dataset.name?-1:a.dataset.name>b.dataset.name?1:0}};function apply(){var q=(search.value||'').trim().toLowerCase();var shown=rows.filter(function(r){if(filter!=='all'&&r.dataset.status!==filter)return false;if(q&&r.dataset.search.indexOf(q)===-1)return false;return true;});rows.forEach(function(r){r.style.display='none'});shown.sort(S[sort]);shown.forEach(function(r){r.style.display='';grows.appendChild(r)});empty.style.display=shown.length?'none':'';empty.textContent=q?('No Sprites match \\u201C'+search.value.trim()+'\\u201D.'):'No Sprites match this filter.';}b.querySelectorAll('[data-sort]').forEach(function(el){el.addEventListener('click',function(){sort=el.dataset.sort;b.querySelectorAll('[data-sort]').forEach(function(x){x.classList.toggle('on',x===el)});apply();});});b.querySelectorAll('[data-filter]').forEach(function(el){el.addEventListener('click',function(){filter=el.dataset.filter;b.querySelectorAll('[data-filter]').forEach(function(x){x.classList.toggle('on',x===el)});apply();});});search.addEventListener('input',apply);apply();})();</script>`

// Runtime for the /news feed: client-side tag filter + search over the
// pre-rendered cards. No-ops on pages without #newsfeed.
const NEWS_SCRIPT = `<script>(function(){var b=document.getElementById('newsfeed');if(!b)return;var cards=[].slice.call(b.querySelectorAll('.ncard')),search=b.querySelector('#nsearch'),empty=b.querySelector('#nempty');var tag='all';function apply(){var q=(search.value||'').trim().toLowerCase();var shown=0;cards.forEach(function(c){var ok=(tag==='all'||c.dataset.tag===tag)&&(!q||c.dataset.search.indexOf(q)!==-1);c.style.display=ok?'':'none';if(ok)shown++;});empty.style.display=shown?'none':'';empty.textContent=q?('No news matches \\u201C'+search.value.trim()+'\\u201D.'):'No news matches this filter.';}b.querySelectorAll('.seg').forEach(function(el){el.addEventListener('click',function(){tag=el.dataset.tag;b.querySelectorAll('.seg').forEach(function(x){x.classList.toggle('on',x===el)});apply();});});search.addEventListener('input',apply);apply();})();</script>`

// Makes the static header behave like the app's: (1) if a Supabase session is
// present in localStorage (same origin as the app), swap the "Log in to save"
// CTA for a "⚙ Profile" link — so a logged-in visitor never sees the wrong CTA;
// (2) refresh the tagline's version from the live build (same /api/news the app
// reads) so it never goes stale. Progressive enhancement — no-ops if JS is off.
const HEADER_SCRIPT = `<script>(function(){try{var k=Object.keys(localStorage).find(function(x){return /^sb-.*-auth-token$/.test(x)});var authed=false;if(k){var v=JSON.parse(localStorage.getItem(k)||'null');authed=!!(v&&(v.access_token||(v.currentSession&&v.currentSession.access_token)))}if(authed){document.querySelectorAll('.cta').forEach(function(c){c.textContent='⚙ Profile';c.setAttribute('title','Your profile & collection')})}}catch(e){}try{fetch('/api/news').then(function(r){return r.ok?r.json():null}).then(function(b){if(b&&b.data&&b.data.build){document.querySelectorAll('.tagline').forEach(function(t){t.textContent=t.textContent.replace(/v[\\d.]+.*/,'v'+b.data.build+' live')})}}).catch(function(){})}catch(e){}})();</script>`

// Mirrors the app footer (src/App.jsx) so the whole site shares one footer:
// the same sections row, the utility/support row (modal links deep-link into
// the app via ?about=1 etc.), the #EpicPartner line and the attribution notes.
const FOOT = `<footer class="foot">
<nav class="row" aria-label="Sections"><a href="/">Collection</a><span class="sep">·</span><a href="/sprites">🧩 Sprites</a><span class="sep">·</span><a href="/codes">🔓 Lobby Hacks</a><span class="sep">·</span><a href="/?view=leaderboard">🏆 Leaderboard</a><span class="sep">·</span><a href="/?view=garden">🌱 Garden</a><span class="sep">·</span><a href="/news">📰 News</a><span class="sep">·</span><a href="/?view=stats">📊 Stats</a><span class="sep">·</span><a href="/?view=shop">🛒 Item Shop</a></nav>
<div class="row"><a href="/?about=1">About</a><span class="sep">·</span><a href="/?changelog=1">Changelog</a><span class="sep">·</span><a href="/?backup=1">Backup</a><span class="sep">·</span><a href="/?bug=1">Report a bug</a><span class="sep">·</span><a href="/tier-list">🏆 Tier list</a><span class="sep">·</span><a href="/sprite-garden">🌱 Sprite Garden</a><span class="sep">·</span><a href="/sprite-dust">🔷 Sprite Dust</a><span class="sep">·</span><a href="https://buymeacoffee.com/kamalathedesigner" target="_blank" rel="noreferrer">☕ Buy me a coffee</a><span class="sep">·</span><span class="cc">Creator Code <b>MOMBIE</b></span></div>
<p>Fan-made sprite tracker · not affiliated with Epic Games. #EpicPartner</p>
<p>Sprite images are © Epic Games, Inc., used for identification only. Official base art sourced from <a href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore/sprite-tracker</a>; some variant art — the Holofoil renders and the Air &amp; Seven sprites — is AI-generated (Google Gemini), while real-person collab sprites (Vini Jr., Pollo) use Epic's official art with the background removed, never an AI likeness. A built-in generator covers anything still missing an image.</p>
<p>Roster, themes &amp; drop rates cross-referenced from <a href="https://fortnite.gg/sprites" target="_blank" rel="noreferrer">fortnite.gg</a>, <a href="https://github.com/UltronCore/sprite-tracker" target="_blank" rel="noreferrer">UltronCore</a> &amp; the <a href="https://fortnite.fandom.com/wiki/Sprites" target="_blank" rel="noreferrer">Fortnite Wiki</a>. Upcoming/leaked sprites &amp; forms are labelled <b>Rumored</b> until Epic confirms; gameplay tiers are a community/meta snapshot (<a href="https://games.gg" target="_blank" rel="noreferrer">GAMES.GG</a>, <a href="https://www.playerauctions.com" target="_blank" rel="noreferrer">PlayerAuctions</a>, <a href="https://www.destructoid.com" target="_blank" rel="noreferrer">Destructoid</a>). News &amp; events from official Fortnite patch notes, <a href="https://communities.epicgames.com" target="_blank" rel="noreferrer">Epic communities</a> &amp; <a href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>, with some event details cross-referenced from community trackers (<a href="https://www.vice.com" target="_blank" rel="noreferrer">Vice</a>, <a href="https://beebom.com" target="_blank" rel="noreferrer">Beebom</a>, <a href="https://allthings.how" target="_blank" rel="noreferrer">AllThings.How</a>, <a href="https://www.hotspawn.com" target="_blank" rel="noreferrer">Hotspawn</a>, <a href="https://insider-gaming.com" target="_blank" rel="noreferrer">Insider Gaming</a>) — each event shows its source and whether it's official. Leaks &amp; datamines are credited to HYPEX, ShiinaBR, <a href="https://x.com/FN_Assist" target="_blank" rel="noreferrer">@FN_Assist</a> &amp; FNBRIntel, with tier &amp; farm-route context from <a href="https://punksprite.com" target="_blank" rel="noreferrer">punksprite</a> &amp; <a href="https://quackadex.com" target="_blank" rel="noreferrer">quackadex</a>. Item Shop, cosmetics &amp; player stats come from <a href="https://fortnite-api.com" target="_blank" rel="noreferrer">fortnite-api.com</a>. Drop rates are community estimates cross-referenced from player-tracking projects (<a href="https://accountshark.net/blog/fortnite-chapter-7-season-3-sprites" target="_blank" rel="noreferrer">AccountShark</a> &amp; <a href="https://games.gg/fortnite" target="_blank" rel="noreferrer">GAMES.GG</a>) — Epic hasn't published official rates. Built with React, Vite &amp; Supabase.</p>
</footer></div>${HEADER_SCRIPT}${CHEST_SCRIPT}${GUIDE_SCRIPT}${NEWS_SCRIPT}</body></html>`

// ---------- per-sprite page ----------
function spritePage(type, others) {
  const name = type.name
  const url = `${SITE}/sprite/${slug(name)}`
  const tint = RARITY_TINT[type.rarity] || '#a99fb8'
  const p = parseRate(type.dropRate)
  const dustN = dustCost(type.rarity, 'normal')
  const dustV = dustCost(type.rarity, 'gold')
  const tier = spriteTier(type.id)
  const scaling = spriteScaling(type.id)
  const source = spriteSource(type.id)

  const variants = Object.keys(type.variants)
    .filter((tid) => THEME_MAP[tid])
    .map((tid) => ({ tid, name: THEME_MAP[tid].name, bonus: THEME_MAP[tid].bonus, accent: THEME_MAP[tid].accent, released: !!SPRITE_BY_ID[`${type.id}_${tid}`]?.released, vaulted: !!SPRITE_BY_ID[`${type.id}_${tid}`]?.vaulted }))

  // New-generation (Season 4 "Override") Sprites carry a season qualifier so they
  // rank for the high-intent "Override" queries the whole field is chasing.
  const s4 = type.gen === 'c7s4'
  const seasonTitle = s4 ? ' (Season 4 Override)' : ''
  const desc = `${name} is a ${type.rarity} Fortnite Sprite${s4 ? ' from Chapter 7 Season 4 “Override”' : ''}${p ? ` with about a ${type.dropRate} drop rate from Sprite Chests` : ''}. See its ${p ? 'drop rate, ' : ''}re-summon Dust cost, ability, variants${p ? ', and how many chests it takes to get one' : ''}.`
  const title = `${name} Sprite${seasonTitle} — ${p ? 'Drop Rate, ' : ''}Dust Cost & How to Get | FN Sprite Tracker`

  // FAQ (drives rich results) — generation-aware: Season 4 Sprites use Cheat/
  // Lobby codes, not chests; older Season 3 Sprites keep the chest-odds answers.
  const faqs = []
  if (s4) {
    const codeForSprite = LOBBY_CODES.find((c) => c.spriteId === type.id && c.status === 'working')
    faqs.push([`How do I get the ${name} Sprite?`,
      `${spriteSource(type.id)}${codeForSprite ? ` Its Cheatmaster finish unlocks with the Hack the Lobby code “${codeForSprite.code}” — enter it in the lobby Admin Panel.` : ''}`])
  } else {
    faqs.push([`How rare is the ${name} Sprite?`, p
      ? `${name} is a ${type.rarity} Sprite with about a ${type.dropRate} chance per Sprite Chest — roughly a 1-in-${fmt(1 / p)} pull.`
      : `${name} is a ${type.rarity} Sprite. Its exact drop rate hasn't been documented by the community yet.`])
    if (p) faqs.push([`How many chests to get a ${name} Sprite?`,
      `About ${fmt(chestsFor(p, 0.5))} Sprite Chests for a 50% chance, and around ${fmt(chestsFor(p, 0.9))} for a 90% chance.`])
    if (dustN != null) faqs.push([`How much Sprite Dust to re-summon ${name}?`,
      `${fmt(dustN)} Dust for the Normal form${dustV != null ? `, or ${fmt(dustV)} for a special variant` : ''}.`])
  }
  if (type.ability) faqs.push([`What does the ${name} Sprite do?`, type.ability])
  faqs.push([`Is the ${name} Sprite usable in Battle Royale?`, s4
    ? `Yes — ${name} is part of the current Season 4 “Override” generation, so you can equip and use it in Battle Royale this season.`
    : `${name} is a Season 3 “Runners” Sprite. It's kept forever in your collection and the in-game Sprite Garden, but the Season 4 “Override” generation took over Battle Royale — so older-generation Sprites aren't used in BR matches this season (Epic says they may return later).`])

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
  <div class="avatar" style="background:${VARIANT_BG.normal}"><span class="avfallback">${esc(type.icon || '🧩')}</span><img class="art" src="/sprites/${type.id}_normal.${imgExt(type)}" alt="${esc(name)} Sprite (Normal)" onerror="this.style.display='none'"></div>
  <div><h1>${esc(name)} Sprite</h1>
    <div class="tags"><span class="tag" style="background:${tint};color:#0a0606;border-color:transparent">${esc(type.rarity)}</span>${genLabel(type) ? `<span class="tag" title="Which season / generation this Sprite belongs to">${esc(genLabel(type))}</span>` : ''}${tier ? `<span class="tag">${tier}-Tier</span>` : ''}${type.vaulted ? '<span class="tag" style="background:#ef444422;color:#fca5a5;border-color:transparent">Vaulted</span>' : ''}${type.released ? '' : '<span class="tag">Upcoming</span>'}${type.rumored ? '<span class="tag" style="background:rgba(245,158,11,.16);color:#fcd34d;border-color:transparent">Rumored</span>' : ''}</div>
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
<div class="variants">${variants.map((v) => `<div class="variant"><div class="sw" style="background:${VARIANT_BG[v.tid] || VARIANT_BG.normal}"><span class="swfallback">${esc(type.icon || '🧩')}</span><img src="/sprites/${type.id}_${v.tid}.${imgExt(type)}" alt="${esc(name)} ${esc(v.name)}" loading="lazy" onerror="this.style.display='none'"></div><b class="nm">${esc(v.name)}</b><small${v.vaulted ? ' style="color:#fca5a5"' : ''}>${v.vaulted ? 'Vaulted' : v.released ? 'Available' : 'Coming soon'}</small>${v.bonus ? `<span class="perk" style="border-top-color:${v.accent}44"><b style="color:${v.accent}">Perk</b>${esc(v.bonus)}</span>` : ''}</div>`).join('')}</div>

<h2>${esc(name)} FAQ</h2>
${faqs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}

<a class="bigcta" href="/?sprite=${encodeURIComponent(type.id)}">Track the ${esc(name)} in your collection — free →</a>

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

// The "How Sprites work" guide content is shared with the in-app sidebar card
// (src/components/HowSpritesWork.jsx) via src/data/spriteGuide.js — one source
// of truth so the static page and the app never drift.
const GUIDE = SPRITE_GUIDE
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
<div class="uplist">${up.map((t) => `<a class="uprow" href="/sprite/${slug(t.name)}" title="Open ${esc(t.name)}"><span class="upic" style="background:${VARIANT_BG.normal}"><img src="/sprites/${t.id}_normal.${imgExt(t)}" alt="${esc(t.name)} Sprite" loading="lazy" onerror="this.style.display='none'"></span><span class="upmeta"><b>${esc(t.name)}</b> <small style="color:${RARITY_TINT[t.rarity] || '#a99fb8'}">${esc(t.rarity)}</small>${t.ability ? `<small class="upab">${esc(t.ability)}</small>` : ''}</span><span class="update">${t.releaseDate ? fmtLeak(t.releaseDate) : 'TBA'}</span></a>`).join('')}</div></div>`
}

// Chest luck card HTML. `selId` pre-selects a Sprite (used on its own page).
const chestSelectOptions = (selId) => ['Mythic', 'Legendary', 'Epic', 'Rare'].map((r) => {
  const items = SPRITE_TYPES.filter((t) => t.rarity === r && parseRate(t.dropRate))
  return items.length ? `<optgroup label="${r}">${items.map((t) => `<option value="${t.id}"${t.id === selId ? ' selected' : ''}>${esc(t.icon || '')} ${esc(t.name)} — ${esc(t.dropRate)}</option>`).join('')}</optgroup>` : ''
}).join('')
const chestLuckCard = (selId) => `<div class="card sidecard chestcard">
<h3 class="sh">🎲 Chest luck <span style="font-size:11px;color:var(--muted)">· Season 3</span></h3>
<p class="sub" style="margin:2px 0 8px">Season 3 “Runners” Sprites come from Sprite Chests. Season 4 “Override” Sprites come from in-world Cheat Codes and <a href="/codes">Hack the Lobby codes</a> (and, since a recent update, Chests too) — no fixed odds published.</p>
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
<p style="font-size:13px;color:#dcd2e6;margin:0 0 4px">Enter Creator Code <b class="cc2">MOMBIE</b> in the Fortnite Item Shop at checkout — it supports me at no extra cost. #EpicPartner</p>
<a class="bmc" href="https://buymeacoffee.com/kamalathedesigner" target="_blank" rel="noreferrer">☕ Buy me a coffee</a></div>`

// ---------- /sprites "how to get every Sprite" board ----------
// A static mirror of the in-app SpriteGuide: one row per base Sprite, enriched
// with tier / drop rate / avg chests / Dust / source, plus data-* keys the
// inline script uses to sort, filter and search entirely client-side.
const STATUS_META = {
  available: { label: 'Available', color: '#34d399' },
  upcoming: { label: 'Upcoming', color: '#3da9fc' },
  vaulted: { label: 'Vaulted', color: '#ef4444' },
}
const RARITY_RANK = Object.fromEntries(RARITY_ORDER.map((r, i) => [r, i]))

function buildGuideRows() {
  return SPRITE_TYPES.map((t) => {
    const live = SPRITE_BY_ID[`${t.id}_normal`]
    const released = !!live?.released
    const vaulted = !!(t.vaulted || live?.vaulted)
    const p = parseRate(t.dropRate)
    return {
      id: t.id, name: t.name, icon: t.icon || '🧩', rarity: t.rarity,
      tier: spriteTier(t.id), dropRate: t.dropRate, p,
      avg: p ? Math.round(1 / p) : null,
      dust: dustCost(t.rarity, 'normal'), source: spriteSource(t.id),
      status: vaulted ? 'vaulted' : released ? 'available' : 'upcoming',
      released,
      // Released Sprites and the datamined Season 4 roster each have a static page.
      hasPage: released || t.gen === 'c7s4',
    }
  })
}

function guideRow(r) {
  const rc = RARITY_COLORS[r.rarity] || '#a99fb8'
  const st = STATUS_META[r.status]
  const tm = r.tier ? TIER_META[r.tier] : null
  const href = r.hasPage ? `/sprite/${slug(r.name)}` : `/?sprite=${encodeURIComponent(r.id)}`
  return `<a class="grow" href="${href}" title="Open ${esc(r.name)}"`
    + ` data-status="${r.status}" data-p="${r.p ?? ''}" data-rank="${RARITY_RANK[r.rarity] ?? 0}"`
    + ` data-dust="${r.dust ?? ''}" data-name="${esc(r.name.toLowerCase())}" data-search="${esc(`${r.name} ${r.rarity}`.toLowerCase())}">`
    + `<span class="nm"><span class="ic">${esc(r.icon)}</span><span class="nt"><b>${esc(r.name)}</b>`
    + `<span class="badges"><span style="color:${rc};background:${rc}22">${esc(r.rarity)}</span>`
    + `<span style="color:${st.color};background:${st.color}22">${st.label}</span></span></span></span>`
    + `<span class="tier">${tm ? `<span style="color:${tm.color};background:${tm.color}22" title="${esc(tm.blurb || '')}">${esc(tm.label)}</span>` : '<small style="color:var(--muted)">—</small>'}</span>`
    + `<span class="drop">${r.p ? `<b>${esc(r.dropRate)}</b><small>~${fmt(r.avg)} chests</small>` : '<small>rate TBD</small>'}</span>`
    + `<span class="dust">${r.dust != null ? `<b>${fmt(r.dust)}</b><small>dust</small>` : '<small>—</small>'}</span>`
    + `<span class="src">${esc(r.source)}</span></a>`
}

function guideBoard() {
  const rows = buildGuideRows()
  const available = rows.filter((r) => r.status === 'available').length
  const SORTS = [['easiest', 'Easiest'], ['rarest', 'Rarest'], ['dust', 'Cheapest Dust'], ['az', 'A–Z']]
  const FILTERS = [['all', 'All'], ['available', 'Available'], ['upcoming', 'Upcoming'], ['vaulted', 'Vaulted']]
  return `<section class="board" id="how-to-get">
<div class="bar"><div class="search"><span class="mag">🔍</span><input type="search" id="gsearch" placeholder="Search Sprites by name…" aria-label="Search Sprites by name"></div></div>
<div class="bar">
  <div class="segs sortsegs" role="tablist" aria-label="Sort">${SORTS.map(([k, l], i) => `<button class="seg${i === 0 ? ' on' : ''}" data-sort="${k}">${l}</button>`).join('')}</div>
  <div class="segs filtsegs" role="tablist" aria-label="Filter">${FILTERS.map(([k, l], i) => `<button class="seg${i === 0 ? ' on' : ''}" data-filter="${k}">${l}</button>`).join('')}</div>
</div>
<p class="monday">📅 <b style="color:#fcd34d">Mastery Mondays</b> — 2× Sprite Dust &amp; XP and boosted Sprite spawns every Monday. The fastest day to farm and level up.</p>
<div class="ghead"><span>Sprite</span><span>Tier</span><span class="r">Drop / chests</span><span class="r">Dust</span><span>How to get</span></div>
<div class="grows">${rows.map(guideRow).join('')}</div>
<p class="empty" id="gempty">No Sprites match this filter.</p>
<p class="fine">${available} obtainable right now. Drop rates &amp; Dust are community-estimated — Epic doesn’t publish official figures. Tap a Sprite for its full page.</p>
</section>`
}

// ---------- /sprites index hub ----------
function indexPage() {
  const desc = `The Fortnite Sprites checklist — every Sprite across Chapter 7 Season 4 “Override” and Season 3, with drop rates, average Sprite Chests, re-summon Dust, Cheatmaster/Gold finishes and tiers. Track what you own, search, sort and filter, free.`
  // A real checklist: an ItemList of every released Sprite, so search engines can
  // build a "list of Fortnite Sprites" result and rank us for the checklist query.
  const listed = SPRITE_TYPES.filter((t) => t.released)
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: 'Fortnite Sprites Checklist', url: SITE + '/sprites', description: desc },
    { '@type': 'ItemList', name: 'All Fortnite Sprites', numberOfItems: listed.length,
      itemListElement: listed.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: `${t.name} Sprite`, url: `${SITE}/sprite/${slug(t.name)}` })) },
  ] }
  return head({ title: 'Fortnite Sprites Checklist — Every Sprite (Season 4 Override), Drop Rates & Dust | FN Sprite Tracker', desc, canonical: SITE + '/sprites', jsonld }) + `
<div class="cols">
  <div class="main">
    <h1>How to get every Fortnite Sprite</h1>
    <p class="board-lede lede" style="color:var(--muted);margin:6px 0 16px;font-size:14px;max-width:70ch">Every Sprite ranked by how easy it is to land — with its drop rate, average Sprite Chests, re-summon Dust cost and where to find it. Search, sort or filter, then tap one for its full page.</p>
    ${guideBoard()}
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

// ---------- /news feed ----------
// A static mirror of the in-app NewsFeed (src/components/NewsFeed.jsx): the same
// curated items, ordered live-now → upcoming → history, rendered as crawlable
// cards with data-* keys the inline script uses to tag-filter and search. The
// runtime "live build" pull the app does is app-only; the static page is the
// curated feed, which is what search engines should index anyway.
const TAG_ICON = { sprites: '🧩', update: '🛠️', event: '🎉', upcoming: '🔮', bug: '🐛' }
const NEWS_TODAY = new Date().toISOString().slice(0, 10)
const newsLive = (n) => {
  if (!n.start && !n.end) return false
  if (n.start && NEWS_TODAY < n.start) return false
  if (n.end && NEWS_TODAY > n.end) return false
  return true
}
const newsDateNum = (n) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(n.ts || '')
  if (m) return Number(m[1] + m[2] + m[3])
  if (n.start && /^\d{4}-\d{2}-\d{2}$/.test(n.start)) return Number(n.start.replace(/-/g, ''))
  return Number(NEWS_TODAY.replace(/-/g, ''))
}
function orderedNews() {
  const liveNow = NEWS.filter(newsLive).sort((a, b) => newsDateNum(b) - newsDateNum(a))
  const upcoming = NEWS.filter((n) => n.tag === 'upcoming' && !newsLive(n)).sort((a, b) => newsDateNum(a) - newsDateNum(b))
  const history = NEWS.filter((n) => n.tag !== 'upcoming' && !newsLive(n)).sort((a, b) => newsDateNum(b) - newsDateNum(a))
  return [...liveNow, ...upcoming, ...history]
}

function newsCard(n) {
  const tag = NEWS_TAGS[n.tag] || NEWS_TAGS.update
  const live = newsLive(n)
  const resolved = n.tag === 'bug' && n.resolved
  const spriteId = n.sprites?.[0]
  const spriteArt = spriteId && SPRITE_BY_ID[`${spriteId}_normal`]
  const img = n.image
    ? `<img src="${esc(n.image)}" alt="" loading="lazy">`
    : spriteArt
      ? `<img src="/sprites/${spriteId}_normal.${spriteArt.gen === 'c7s4' ? 'webp' : 'png'}" alt="" loading="lazy" onerror="this.style.display='none'">`
      : ''
  const search = `${n.title} ${n.body || ''} ${n.source || ''} ${tag.label}`.toLowerCase()
  const badge = resolved
    ? `<span class="res">✓ Resolved${n.resolvedOn ? ` · ${esc(n.resolvedOn)}` : ''}</span>`
    : `<span class="tg" style="background:${tag.color}">${esc(tag.label)}</span>`
  return `<a class="ncard" href="${esc(n.link || '#')}"${n.link ? ' target="_blank" rel="noreferrer"' : ''} style="border-left-color:${tag.color}" data-tag="${esc(n.tag)}" data-search="${esc(search)}">`
    + `<span class="thumb" style="background:linear-gradient(150deg,${tag.color}33,${tag.color}0f)">${esc(TAG_ICON[n.tag] || '📰')}${img}${live ? '<span class="live">● Live</span>' : ''}</span>`
    + `<span class="meta"><span class="tgs">${badge}${n.tentative ? '<span class="tent">Tentative</span>' : ''}<span class="when">${esc(n.when || '')}</span></span>`
    + `<h3>${esc(n.title)}</h3>${n.body ? `<p class="bd">${esc(n.body)}</p>` : ''}`
    + `${n.source ? `<p class="src">Source: ${esc(n.source)} <span class="${n.official ? 'off' : 'un'}">· ${n.official ? 'official' : 'unofficial'}</span>${n.link ? ' · opens in a new tab ↗' : ''}</p>` : ''}`
    + `</span></a>`
}

function newsBoard() {
  const items = orderedNews()
  return `<section class="nf" id="newsfeed">
<div class="bar"><div class="search"><span class="mag">🔍</span><input type="search" id="nsearch" placeholder="Search news &amp; events…" aria-label="Search news and events"></div></div>
<div class="bar"><div class="segs" role="tablist" aria-label="Filter news">
  <button class="seg on" data-tag="all" style="--sc:var(--brand)">All</button>
  ${Object.entries(NEWS_TAGS).map(([k, t]) => `<button class="seg" data-tag="${k}" style="--sc:${t.color}">${esc(t.label)}</button>`).join('')}
</div></div>
<div class="list">${items.map(newsCard).join('')}</div>
<p class="empty" id="nempty">No news matches this filter.</p>
<p class="fine">Curated Fortnite update feed — sprites, events &amp; known issues, each with its source shown. The in-app version also auto-pulls the current live build. Not affiliated with Epic Games.</p>
</section>`
}

// ---------- /news page ----------
function newsPage() {
  const desc = 'Latest Fortnite Sprite news, patch notes and events — New Sprite Days, Shiny/Mastery hours, vaulted Sprites and known issues, each with its source. Searchable and filterable.'
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Fortnite Sprite News & Updates', url: SITE + '/news', description: desc,
  }
  return head({ title: 'Fortnite Sprite News, Patch Notes & Events | FN Sprite Tracker', desc, canonical: SITE + '/news', jsonld, active: 'news' }) + `
<div class="cols">
  <div class="main">
    <h1>Fortnite Sprite news &amp; updates</h1>
    <p class="lede" style="color:var(--muted);margin:6px 0 16px;font-size:14px;max-width:70ch">New Sprite Days, events, vaulted Sprites and known issues — a curated feed with each item's source. Filter by type or search, then tap through for the full story.</p>
    ${newsBoard()}
  </div>
  <aside class="side">
    ${ctaCard()}
    ${upcomingCard()}
    ${supportCard()}
  </aside>
</div>
` + FOOT
}

// ---------- /tier-list page ----------
// A ranked gameplay tier list (S→C), assembled from the same per-Sprite tier data
// the app uses (SPRITE_TIER / TIER_META). SEO asset — links out to each Sprite's
// full page. Not in the primary nav (kept identical to the app); reachable from
// the footer + the /sprites sidebar.
function tierListPage() {
  const bySpriteName = (a, b) => (RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity)) || a.name.localeCompare(b.name)
  const rated = SPRITE_TYPES.filter((t) => t.released && spriteTier(t.id))
  const byTier = TIER_ORDER.map((tk) => ({
    tk, meta: TIER_META[tk],
    items: rated.filter((t) => spriteTier(t.id) === tk).sort(bySpriteName),
  })).filter((g) => g.items.length)
  // Released Sprites with no settled tier yet — every Season 4 "Override" Sprite
  // (too new to rank) plus a few niche/collab S3 ones. Shown as their own group
  // so the page is complete and mirrors the app's "Unranked" tier bucket.
  const unranked = SPRITE_TYPES.filter((t) => t.released && !spriteTier(t.id)).sort(bySpriteName)

  const desc = `The Fortnite Sprites tier list — every released Sprite ranked S through C by how strong its ability is, with what each one does and how to get it. Season 4 “Override” Sprites are still Unranked (too new for a settled meta). A community snapshot, updated as the game shifts.`
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Fortnite Sprites Tier List', url: SITE + '/tier-list', description: desc,
  }
  const row = (t) => {
    const rc = RARITY_COLORS[t.rarity] || '#a99fb8'
    return `<a class="grow" href="/sprite/${slug(t.name)}" title="Open ${esc(t.name)}">
      <span class="nm"><span class="ic">${esc(t.icon || '🧩')}</span><span class="nt"><b>${esc(t.name)}</b>
        <span class="badges"><span style="color:${rc};background:${rc}22">${esc(t.rarity)}</span>${t.dropRate ? `<span style="color:var(--muted);background:transparent">${esc(t.dropRate)}</span>` : ''}</span></span></span>
      <span class="src" style="grid-column:1/-1;margin-top:2px">${esc(t.ability || spriteSource(t.id))}</span></a>`
  }
  const section = (g) => `<section style="margin:0 0 22px">
    <div style="display:flex;align-items:center;gap:10px;margin:0 0 10px">
      <span style="font-family:'Luckiest Guy','Inter',sans-serif;font-size:30px;line-height:1;color:${g.meta.color}">${g.tk}</span>
      <div><div style="font-weight:800;font-size:15px;color:#fff">${esc(g.meta.label)}</div>
      <div style="font-size:12.5px;color:var(--muted)">${esc(g.meta.blurb)} · ${g.items.length} sprite${g.items.length === 1 ? '' : 's'}</div></div>
    </div>
    <div class="grows">${g.items.map(row).join('')}</div>
  </section>`

  const unrankedSection = unranked.length ? `<section style="margin:0 0 22px">
    <div style="display:flex;align-items:center;gap:10px;margin:0 0 10px">
      <span style="font-family:'Luckiest Guy','Inter',sans-serif;font-size:26px;line-height:1;color:#8b93a7">–</span>
      <div><div style="font-weight:800;font-size:15px;color:#fff">Unranked</div>
      <div style="font-size:12.5px;color:var(--muted)">New (all Season 4 “Override” Sprites) or niche — no settled meta tier yet · ${unranked.length} sprite${unranked.length === 1 ? '' : 's'}</div></div>
    </div>
    <div class="grows">${unranked.map(row).join('')}</div>
  </section>` : ''

  return head({ title: 'Fortnite Sprites Tier List — Every Sprite Ranked S–C (Season 4 Override) | FN Sprite Tracker', desc, canonical: SITE + '/tier-list', jsonld, active: 'sprites' }) + `
<div class="cols">
  <div class="main">
    <h1>Fortnite Sprites tier list</h1>
    <p class="lede" style="color:var(--muted);margin:6px 0 18px;font-size:14px;max-width:70ch">Every released Sprite ranked <b>S → C</b> by how strong its ability is — with what it does and how to get it. Rarity is how <i>hard</i> a Sprite is to find; tier is how <i>good</i> it is once you have it. Season 4 “Override” Sprites sit in <b>Unranked</b> until the meta settles.</p>
    ${byTier.map(section).join('')}
    ${unrankedSection}
    <p class="fine" style="margin-top:6px;font-size:11px;color:var(--muted)">Tiers are a community/meta snapshot (cross-referenced from GAMES.GG, PlayerAuctions &amp; Destructoid) — opinion-based and shifting; not official Epic rankings. Tap any Sprite for its full page.</p>
    <a class="bigcta" href="/">Track your collection — free →</a>
  </div>
  <aside class="side">
    ${ctaCard()}
    ${chestLuckCard()}
    ${supportCard()}
  </aside>
</div>
` + FOOT
}

// ---------- /sprite-garden guide page ----------
// The Sprite Garden is Override's UEFN social island where your whole collection
// lives. Trackers (our competitors) are all pure checklists — none has a Garden
// guide — so this factual how-it-works page targets a query they cede to outlets.
function spriteGardenPage() {
  const ISLAND = '4220-9404-7987'
  const desc = `The Fortnite Sprite Garden explained — what it is, how to get in (Discovery menu / island code ${ISLAND}), how your Season 3 “Runners” and Season 4 “Override” Sprites are preserved and displayed, visiting friends’ gardens, and what to expect at launch.`
  const steps = [
    ['Open the Discovery menu', 'From the Battle Royale lobby, open the Discovery/Search menu — the Sprite Garden is listed there as an official experience.'],
    ['Or enter the island code', `Search the island code ${ISLAND} in the Discovery menu to jump straight in.`],
    ['Launch and look around', 'Load in — every Sprite you’ve collected is already there. Nothing to deposit or unlock; your collection populates automatically.'],
  ]
  const faqs = [
    ['What is the Fortnite Sprite Garden?', 'It’s a personal island getaway added in Chapter 7 Season 4 “Override” — a calm, social space (a UEFN experience) where your whole Sprite collection lives. You can display and interact with your Sprites, and visit friends’ gardens or invite them to yours. It sits outside Battle Royale, so it’s about showing off and organising your collection rather than fighting.'],
    ['How do I get into the Sprite Garden?', `Open the Discovery/Search menu from the lobby and pick the Sprite Garden, or enter the island code ${ISLAND}. The in-game Discovery menu is the most reliable route if a code ever changes.`],
    ['Are my Season 3 Sprites kept in the Garden?', 'Yes. Every Season 3 “Runners” Sprite you collected is preserved automatically, and every new Season 4 “Override” Sprite is added the moment you get it. Sprites from past, present and future generations can all live in your Garden at once — and losing a Sprite in a match never removes it.'],
    ['What can you actually do in the Sprite Garden?', 'Display Sprites on pedestals and in buildings, watch them wander the island, pick one up to have it follow you, or return it to your inventory. Interaction works like it does in Battle Royale — walk up and press the prompt. You can also drop into friends’ gardens or host them in yours.'],
    ['Is there much to do at launch?', 'Not a lot yet — at launch it’s mostly a showcase-and-hangout space. Epic has said they plan to grow the Sprite Garden with future updates (more mechanics and expanded islands), so expect it to fill out over the season.'],
    ['Can I use my Season 3 Sprites in Battle Royale now?', 'No — a new generation takes over Battle Royale each season, so Season 3 Sprites aren’t used in BR at launch (Epic says older generations “may return down the line”). They’re kept and displayable in the Sprite Garden and your Collection. Filter by generation on our Sprites checklist to see what’s current vs archived.'],
  ]
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: 'Fortnite Sprite Garden Guide', description: desc, url: SITE + '/sprite-garden', dateModified: NEWS_TODAY, author: { '@type': 'Organization', name: 'FN Sprite Tracker' } },
    { '@type': 'HowTo', name: 'How to access the Fortnite Sprite Garden', description: `Get into the Sprite Garden from the Discovery menu or island code ${ISLAND}.`,
      step: steps.map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })) },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] }
  const card = (title, body) => `<div class="card" style="padding:16px;margin:0 0 12px"><h2 style="font-size:16px;margin:0 0 6px">${title}</h2><div style="font-size:13.5px;color:var(--muted);line-height:1.65">${body}</div></div>`
  return head({ title: `Fortnite Sprite Garden Guide — How It Works, Island Code & What to Expect | FN Sprite Tracker`, desc, canonical: SITE + '/sprite-garden', jsonld, active: '' }) + `
<div class="cols">
  <div class="main">
    <h1>🌱 Fortnite Sprite Garden — how it works</h1>
    <p class="lede" style="color:var(--muted);margin:6px 0 16px;font-size:14px;max-width:70ch">The Sprite Garden is Override’s new home for your whole Sprite collection — a calm, social island where every Sprite you’ve ever caught lives on, even the ones a new season retires from Battle Royale. Here’s what it is, how to get in, and what to expect.</p>
    ${card('What it is', 'A personal island getaway (a UEFN experience) added in Chapter 7 Season 4 “Override.” Your entire Sprite collection lives here — display it, play with it, and visit friends’ gardens. It’s separate from Battle Royale, so it’s the showcase side of the Sprite system, not a combat mode.')}
    <div class="card" style="padding:16px;margin:0 0 12px">
      <h2 style="font-size:16px;margin:0 0 6px">How to get in</h2>
      <p style="font-size:13.5px;color:var(--muted);margin:0 0 8px">Open the <b style="color:#fff">Discovery / Search menu</b> from the lobby and choose the Sprite Garden, or enter the island code:</p>
      <p style="font-family:ui-monospace,Menlo,monospace;font-weight:800;font-size:18px;letter-spacing:.04em;color:#fff;background:var(--panel2);border-radius:10px;padding:10px 14px;display:inline-block;margin:0 0 8px">${ISLAND}</p>
      <ol style="margin:6px 0 0;padding-left:18px;color:var(--muted);font-size:13px;line-height:1.7">${steps.map(([n, t]) => `<li><b style="color:#fff">${esc(n)}</b> — ${esc(t)}</li>`).join('')}</ol>
      <p style="font-size:11px;color:var(--muted);margin:8px 0 0">The in-game Discovery menu is the most reliable route if the island code ever changes.</p>
    </div>
    ${card('How it works', 'Every Sprite you’ve collected is added automatically — Season 3 “Runners,” Season 4 “Override,” and future generations can all live in your Garden at once. Display them on pedestals and in buildings, watch them wander, pick one up to have it follow you, or send it back to your inventory. Interaction is the same as in Battle Royale: walk up and press the prompt. A Sprite that goes down in a match is never erased from your Garden.')}
    ${card('What to expect at launch', 'It’s mostly a showcase-and-hangout space to begin with — not a lot of objectives yet. Epic has said they plan to expand the Sprite Garden with future updates (new mechanics and bigger islands), so expect it to grow over the season.')}
    ${card('Season 3 vs Season 4 — what carries', 'The “kept forever” promise is made literal here: your Season 3 Sprites stay displayable in the Garden and your Collection even though the Override generation has taken over Battle Royale. Older-gen Sprites aren’t used in BR this season (Epic says they “may return down the line”). Use the <a href="/sprites" style="color:var(--brand)">Generation filter on our Sprites checklist</a> to see what’s current vs archived.')}
    ${card('Show off your garden', 'Built something you’re proud of? Share a screenshot in our <a href="/?view=garden" style="color:var(--brand)">Community Garden Gallery</a> and browse everyone else’s — or generate a shareable “My Sprite Garden” poster of your whole collection from the app’s Share &amp; export bar.')}
    <h2 style="font-size:16px;margin:22px 0 8px">Sprite Garden — FAQ</h2>
    ${faqs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}
    <p class="fine" style="margin-top:12px;font-size:11px;color:var(--muted)">Details are compiled from Epic’s Season 4 “Override” announcements and community guides; the Sprite Garden is evolving, so features may change. Not affiliated with Epic Games.</p>
    <a class="bigcta" href="/">Track your Sprite collection — free →</a>
  </div>
  <aside class="side">
    ${ctaCard()}
    ${supportCard()}
  </aside>
</div>
` + FOOT
}

// ---------- /sprite-dust guide page ----------
// Override turned Sprite Dust from a cosmetic-summon currency into a loadout
// economy (Loot Hacks). Outlets have guides; no tracker does — same gap as the
// Garden guide. High-intent "sprite dust / loot hacks" queries.
function spriteDustPage() {
  const desc = `Fortnite Sprite Dust in Chapter 7 Season 4 “Override”, explained — how to earn it (extracting Sprites, duplicate Sprites, Lobby Hack codes), the new Loot Hacks that customise what drops from your chests, unlock/upgrade costs, the Loot Hack Override, and a spend strategy. Note: Dust resets each season.`
  const steps = [
    ['Open the Loot Hack tab', 'In the Lobby, click “Override,” then open the “Loot Hack” tab to see the Loot Items you can unlock with Sprite Dust.'],
    ['Unlock a Loot Hack', 'Spend Dust to unlock an item (e.g. the Oni Shotgun starts at 500 Dust). Once unlocked it can drop from the chests you open in Battle Royale.'],
    ['Upgrade it', 'Spend more Dust to upgrade — raising how often the item appears from your chests and its maximum rarity.'],
    ['Guarantee it in-match', 'Use the “Loot Hack Override” match modifier to make your next Chest drop a Loot Hack item, so you can pull your boosted loadout early.'],
  ]
  const faqs = [
    ['What is Sprite Dust used for in Season 4?', 'Three things: (1) summon a Sprite you’ve already extracted at the start of a match (rarer Sprites cost more), (2) upgrade a Sprite’s powers, and (3) the new Loot Hacks — spending Dust in the Lobby to customise what drops from your own chests in Battle Royale, including exclusive items you can’t find any other way.'],
    ['How do I earn Sprite Dust?', 'Mainly by extracting Sprites in Battle Royale / Zero Build — drop them into a Portable Extractor (a Gizmo) or an Extraction Crate at an Extraction Site. You also get Dust from redeeming a duplicate Sprite you already own (worth a big chunk), and from certain Hack the Lobby codes that grant ~2,000 Dust each — see our Lobby Hacks page.'],
    ['What are Loot Hacks?', 'Loot Hacks let you spend Sprite Dust to change what’s inside your chests. Unlocking one adds that item to your personal chest drop pool; upgrading it increases how often it appears and its max rarity. Some Loot Hack items are exclusive to the system. It’s a way to shape your loadout before a match even starts.'],
    ['How much Dust does a Loot Hack cost?', 'It varies by item and tier. The Oni Shotgun, for example, was shown at 500 Dust to unlock, with more Dust needed for each upgrade. Higher tiers cost more but raise drop frequency and max rarity.'],
    ['Does Sprite Dust carry over between seasons?', 'No — Sprite Dust resets at the season flip (along with Portable Extractors and Lucky Locators). Spend it before the season ends rather than hoarding it; your collected Sprites themselves are kept forever.'],
  ]
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: 'Fortnite Sprite Dust & Loot Hacks Guide', description: desc, url: SITE + '/sprite-dust', dateModified: NEWS_TODAY, author: { '@type': 'Organization', name: 'FN Sprite Tracker' } },
    { '@type': 'HowTo', name: 'How to spend Sprite Dust on Loot Hacks', description: 'Unlock and upgrade Loot Hacks with Sprite Dust to customise your chest loot.',
      step: steps.map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })) },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] }
  const card = (title, body) => `<div class="card" style="padding:16px;margin:0 0 12px"><h2 style="font-size:16px;margin:0 0 6px">${title}</h2><div style="font-size:13.5px;color:var(--muted);line-height:1.65">${body}</div></div>`
  return head({ title: `Fortnite Sprite Dust & Loot Hacks Guide — How to Earn & Spend It (Season 4 Override) | FN Sprite Tracker`, desc, canonical: SITE + '/sprite-dust', jsonld, active: '' }) + `
<div class="cols">
  <div class="main">
    <h1>🔷 Fortnite Sprite Dust &amp; Loot Hacks — how it works</h1>
    <p class="lede" style="color:var(--muted);margin:6px 0 16px;font-size:14px;max-width:70ch">In Season 4 “Override,” Sprite Dust stopped being just a cosmetic-summon currency — it now shapes your loadout through <b class="" style="color:#cfe9dc">Loot Hacks</b>. Here’s how to earn it, what to spend it on, and how to get the most out of it.</p>
    ${card('What Sprite Dust is now', 'The Sprite system’s currency. You still spend it to summon Sprites you’ve extracted (rarer ones cost more) and to upgrade their powers — but the headline in Override is <b style="color:#fff">Loot Hacks</b>: spending Dust to customise what drops from your own chests in Battle Royale.')}
    <div class="card" style="padding:16px;margin:0 0 12px">
      <h2 style="font-size:16px;margin:0 0 6px">How to earn it</h2>
      <ul style="margin:6px 0 0;padding-left:18px;color:var(--muted);font-size:13px;line-height:1.75">
        <li><b style="color:#fff">Extract Sprites</b> — the main source. Drop them in a Portable Extractor (a Gizmo) or an Extraction Crate at an Extraction Site in BR / Zero Build.</li>
        <li><b style="color:#fff">Duplicate Sprites</b> — redeeming a Sprite you already own converts it to a big chunk of Dust.</li>
        <li><b style="color:#fff">Lobby Hack codes</b> — several <a href="/codes" style="color:var(--brand)">Admin Panel codes</a> grant ~2,000 Dust each (one-time).</li>
      </ul>
      <p style="margin:10px 0 0;font-size:12px;color:var(--muted)">Season 4 Sprites (and the Dust from duplicates) come from <b style="color:#fff">Cheat Code Chests</b> — <span style="color:#60a5fa">blue</span> codes give Rare Sprites, <span style="color:#c084fc">purple</span> give Epic, and <span style="color:#fbbf24">gold</span> give Legendary.</p>
    </div>
    <div class="card" style="padding:16px;margin:0 0 12px">
      <h2 style="font-size:16px;margin:0 0 6px">Spending Dust on Loot Hacks</h2>
      <ol style="margin:6px 0 0;padding-left:18px;color:var(--muted);font-size:13px;line-height:1.75">${steps.map(([n, t]) => `<li><b style="color:#fff">${esc(n)}</b> — ${esc(t)}</li>`).join('')}</ol>
    </div>
    ${card('The Loot Hack Override', 'One of the new match Overrides, the <b style="color:#fff">Loot Hack Override</b> makes your next Chest drop a Loot Hack item. Pair it with a high-value unlock (a strong weapon you’ve boosted) to reliably pull your custom loadout early in a match.')}
    <div class="card" style="padding:16px;margin:0 0 12px">
      <h2 style="font-size:16px;margin:0 0 6px">Getting the most from your Dust</h2>
      <ul style="margin:6px 0 0;padding-left:18px;color:var(--muted);font-size:13px;line-height:1.75">
        <li>Treat Dust as a <b style="color:#fff">loadout economy</b>, not a cosmetic tax — extract Sprites every match to keep it flowing.</li>
        <li><b style="color:#fff">Unlock one Loot Hack you’ll actually use</b> and upgrade it, rather than spreading Dust thin across many.</li>
        <li>Higher upgrade tiers raise both <b style="color:#fff">drop frequency and max rarity</b> — the compounding payoff is on the items you already run.</li>
        <li><b style="color:#fff">Spend before the season ends</b> — Dust resets at the flip; your Sprites don’t.</li>
      </ul>
    </div>
    ${card('Heads-up: Dust resets each season', 'Sprite Dust, Portable Extractors and Lucky Locators all reset when the season changes. The Sprites you’ve collected are kept forever (and live on in your <a href="/sprite-garden" style="color:var(--brand)">Sprite Garden</a>), but the Dust economy starts fresh — so don’t hoard across a season flip.')}
    <h2 style="font-size:16px;margin:22px 0 8px">Sprite Dust — FAQ</h2>
    ${faqs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}
    <p class="fine" style="margin-top:12px;font-size:11px;color:var(--muted)">Compiled from Epic’s Season 4 “Override” notes and community guides; costs/mechanics can change as Epic tunes the system. Not affiliated with Epic Games.</p>
    <a class="bigcta" href="/">Track your Sprite collection — free →</a>
  </div>
  <aside class="side">
    ${ctaCard()}
    ${supportCard()}
  </aside>
</div>
` + FOOT
}

// ---------- /codes page ----------
// Season 4 "Override" Hack-the-Lobby admin codes. High-intent SEO page; the codes
// come from src/data/codes.js (shared with the in-app modal). Copy runs client-side.
const CODES_SCRIPT = `<script>(function(){document.querySelectorAll('.codecopy').forEach(function(b){b.addEventListener('click',function(){var c=b.getAttribute('data-code');if(navigator.clipboard){navigator.clipboard.writeText(c).then(function(){var o=b.textContent;b.textContent='✓ Copied';setTimeout(function(){b.textContent=o},1400)})}})})})();</script>`
function codesPage() {
  const CST = { working: ['Working', '#34d399'], regional: ['Regional', '#fbbf24'], rumored: ['Unverified', '#8b93a7'] }
  const working = LOBBY_CODES.filter((c) => c.status === 'working').length
  const spriteCodes = LOBBY_CODES.filter((c) => c.type === 'sprite')
  // Build-time month + date, so the page self-dates on every deploy (a freshness
  // signal search engines reward for fast-moving "codes" queries).
  const monthLabel = new Date(NEWS_TODAY + 'T12:00:00Z').toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const spriteHref = (id) => { const t = SPRITE_TYPES.find((x) => x.id === id); return t ? `/sprite/${slug(t.name)}` : null }
  // Group by reward category (what you get), status stays a per-code badge. Within
  // a category, lead with the codes that work right now.
  const statusRank = { working: 0, regional: 1, rumored: 2 }
  // "New this week" — codes with an `added` date within 7 days of the build date.
  // A concrete freshness signal (for both readers and search) on a fast-moving page.
  const weekAgo = new Date(new Date(NEWS_TODAY + 'T12:00:00Z').getTime() - 7 * 864e5).toISOString().slice(0, 10)
  const isNew = (c) => c.added && c.added >= weekAgo
  const newCount = LOBBY_CODES.filter(isNew).length
  const dustCodes = LOBBY_CODES.filter((c) => c.category === 'dust').map((c) => c.code).join(', ')
  const desc = `All ${LOBBY_CODES.length} Fortnite “Override” Hack the Lobby admin-panel codes for ${monthLabel} and what each unlocks — the Cheatmaster Sonic (GOTTAGOFAST), Tails, 8-Bit, Jonesy & Adventure Sprites plus reward codes. ${working} working now${newCount ? `, ${newCount} added this week` : ''}, updated as Epic drops more.`
  // Rich results: CollectionPage + a FAQ (drives the "how/which code" answer box)
  // + an ItemList of the codes. Kept factual and dated.
  const faqs = [
    ['What are Fortnite “Override” Hack the Lobby codes?', 'In Chapter 7 Season 4 “Override,” you enter admin-panel codes in the Battle Royale lobby to unlock Cheatmaster Sprites, gizmos and rewards. Open the Admin Panel (the “…”/admin prompt, top-right), type a code (capitalization doesn’t matter), and hit Submit — a “LOBBY HACK ACTIVATED!” screen confirms it.'],
    ['How do I redeem a Hack the Lobby code?', CODES_INTRO.how],
    ['Which code unlocks the Cheatmaster Sonic Sprite?', 'Enter GOTTAGOFAST in the lobby Admin Panel. Other Sprite codes: Tails = IWANNAFLYHIGH, 8-Bit Blaster = 8BITBLAST, Jonesy = PLAY4ALL, Adventure = BORN2PLAY.'],
    ['Do Fortnite lobby codes expire?', 'Sprite and reward codes stay claimable until you redeem them, but regional/promo codes expire when their campaign ends. Redeeming a Sprite you already own grants roughly 10,000 Sprite Dust instead.'],
    [`How many Fortnite lobby codes are there right now?`, `As of ${monthLabel} there are ${LOBBY_CODES.length} known Hack the Lobby codes — ${working} confirmed working, including ${spriteCodes.length} that unlock Cheatmaster Sprites${newCount ? `, with ${newCount} added this week` : ''}. We update the list as Epic drops more.`],
    ['Are Fortnite admin panel codes case-sensitive?', 'No — capitalization doesn’t matter, so you don’t have to type them in all caps. Spelling does matter, though: a couple of codes mix letters and numbers (e.g. H0p0nVC uses zeros, not the letter “O”).'],
    ['Which lobby codes give free Sprite Dust?', `Several codes grant about 2,000 Sprite Dust each — ${dustCodes}. And redeeming a Sprite code for a Sprite you already own converts to roughly 10,000 Dust.`],
    ['Do the codes work on console and mobile?', 'Yes — the Admin Panel is in the Battle Royale lobby on every platform. Open the “…”/admin prompt in the top-right, type the code, and hit Submit.'],
  ]
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: 'Fortnite Override Lobby Hack Codes', url: SITE + '/codes', description: desc, dateModified: NEWS_TODAY },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'ItemList', name: 'Fortnite Override lobby codes', numberOfItems: LOBBY_CODES.length,
      itemListElement: LOBBY_CODES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.code, description: c.unlocks })) },
  ] }
  const codeRow = (c) => {
    const [lbl, col] = CST[c.status] || CST.rumored
    const href = c.type === 'sprite' ? spriteHref(c.spriteId) : null
    const unlocks = href ? `<a href="${href}" style="color:#dcd2e6;text-decoration:underline;text-decoration-color:var(--border)">${esc(c.unlocks)}</a>` : `<b style="font-weight:600;color:#dcd2e6">${esc(c.unlocks)}</b>`
    return `<div class="grow" style="cursor:default">
      <span class="nm"><button class="codecopy" data-code="${esc(c.code)}" title="Copy ${esc(c.code)}" style="font-family:ui-monospace,Menlo,monospace;font-weight:800;font-size:13px;letter-spacing:.03em;color:#fff;background:var(--panel2);border:0;border-radius:8px;padding:6px 10px;cursor:pointer">${esc(c.code)}</button>
        <span class="nt">${unlocks}<span class="badges">${isNew(c) ? `<span style="color:#7dd3fc;background:#7dd3fc22">🆕 New</span>` : ''}<span style="color:${col};background:${col}22">${lbl}</span>${c.repeatable ? `<span style="color:#7dd3fc;background:#7dd3fc22">↻ Reusable</span>` : ''}${c.region ? `<span style="color:var(--muted);background:transparent">${esc(c.region)}</span>` : ''}</span></span></span>
      <span class="src" style="grid-column:1/-1;margin-top:2px">via ${esc(c.source)} · verified ${NEWS_TODAY}</span></div>`
  }
  const section = (cat) => {
    const items = LOBBY_CODES.filter((c) => c.category === cat.key)
      .sort((a, b) => (statusRank[a.status] ?? 3) - (statusRank[b.status] ?? 3))
    if (!items.length) return ''
    return `<h2 style="font-size:16px;margin:20px 0 4px">${cat.icon} ${esc(cat.label)} <span style="color:var(--muted);font-weight:600;font-size:13px">· ${items.length}</span></h2>
      <p style="margin:0 0 8px;font-size:12px;color:var(--muted)">${esc(cat.blurb)}</p>
      <div class="grows">${items.map(codeRow).join('')}</div>`
  }
  return head({ title: `Fortnite Override Lobby Hack Codes (${monthLabel}) — Admin Panel Cheat Codes | FN Sprite Tracker`, desc, canonical: SITE + '/codes', jsonld, active: 'news' }) + `
<div class="cols">
  <div class="main">
    <h1>Fortnite “Override” Lobby Hack codes (${monthLabel})</h1>
    <p style="margin:2px 0 10px;font-size:12.5px;color:var(--muted)"><b style="color:#34d399">${working} working</b> · <b style="color:#fff">${spriteCodes.length} Cheatmaster Sprites</b>${newCount ? ` · <b style="color:#7dd3fc">${newCount} new this week</b>` : ''} · verified <b style="color:#fff">${NEWS_TODAY}</b> — we keep this list fresh as Epic drops more.</p>
    <p class="lede" style="color:var(--muted);margin:0 0 14px;font-size:14px;max-width:70ch">${esc(CODES_INTRO.how)}</p>
    <div class="card" style="padding:14px;margin:0 0 8px"><b style="color:#fff;font-size:13px">Rules</b><ul style="margin:8px 0 0;padding-left:18px;color:var(--muted);font-size:12.5px;line-height:1.7">${CODES_INTRO.rules.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
    ${CODE_CATEGORIES.map(section).join('')}
    <h2 style="font-size:16px;margin:22px 0 8px">Fortnite lobby codes — FAQ</h2>
    ${faqs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
    <p class="fine" style="margin-top:12px;font-size:11px;color:var(--muted)">Community-sourced and moving fast — Epic drops new codes all season and promo codes expire. Verify each code in-game before relying on it; unverified ones are labelled. Not affiliated with Epic Games.</p>
    <a class="bigcta" href="/">Track the Sprites you unlock — free →</a>
  </div>
  <aside class="side">${ctaCard()}${supportCard()}</aside>
</div>
` + FOOT.replace('</body></html>', `${CODES_SCRIPT}</body></html>`)
}

// ---------- sitemap ----------
function sitemap(types) {
  const urls = [
    { loc: SITE + '/', changefreq: 'daily', priority: '1.0' },
    { loc: SITE + '/sprites', changefreq: 'weekly', priority: '0.9' },
    { loc: SITE + '/tier-list', changefreq: 'weekly', priority: '0.7' },
    { loc: SITE + '/codes', changefreq: 'daily', priority: '0.9' },
    { loc: SITE + '/sprite-garden', changefreq: 'weekly', priority: '0.8' },
    { loc: SITE + '/sprite-dust', changefreq: 'weekly', priority: '0.8' },
    { loc: SITE + '/news', changefreq: 'daily', priority: '0.8' },
    { loc: SITE + '/?view=shop', changefreq: 'daily', priority: '0.7' },
    { loc: SITE + '/?view=leaderboard', changefreq: 'weekly', priority: '0.6' },
    { loc: SITE + '/?view=stats', changefreq: 'weekly', priority: '0.6' },
    ...types.map((t) => ({ loc: `${SITE}/sprite/${slug(t.name)}`, changefreq: 'weekly', priority: '0.8' })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`
}

// ---------- write ----------
// Give every released Sprite AND every datamined Season 4 "Override" Sprite its
// own page (the new-gen roster ships with real art). Related links prefer the
// released roster so "Other sprites" stays useful.
const types = SPRITE_TYPES.filter((t) => t.released || t.gen === 'c7s4')
const releasedPool = SPRITE_TYPES.filter((t) => t.released)
let n = 0
for (const type of types) {
  const others = releasedPool.filter((o) => o.id !== type.id && o.rarity === type.rarity).concat(releasedPool.filter((o) => o.rarity !== type.rarity)).slice(0, 6)
  const dir = resolve(DIST, 'sprite', slug(type.name))
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), spritePage(type, others))
  n++
}
mkdirSync(resolve(DIST, 'sprites'), { recursive: true })
writeFileSync(resolve(DIST, 'sprites', 'index.html'), indexPage())
mkdirSync(resolve(DIST, 'tier-list'), { recursive: true })
writeFileSync(resolve(DIST, 'tier-list', 'index.html'), tierListPage())
mkdirSync(resolve(DIST, 'news'), { recursive: true })
writeFileSync(resolve(DIST, 'news', 'index.html'), newsPage())
mkdirSync(resolve(DIST, 'codes'), { recursive: true })
writeFileSync(resolve(DIST, 'codes', 'index.html'), codesPage())
mkdirSync(resolve(DIST, 'sprite-garden'), { recursive: true })
writeFileSync(resolve(DIST, 'sprite-garden', 'index.html'), spriteGardenPage())
mkdirSync(resolve(DIST, 'sprite-dust'), { recursive: true })
writeFileSync(resolve(DIST, 'sprite-dust', 'index.html'), spriteDustPage())
writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap(types))

console.log(`prerender: ${n} sprite pages + /sprites + /tier-list + /codes + /sprite-garden + /sprite-dust + /news + sitemap.xml → dist/`)
