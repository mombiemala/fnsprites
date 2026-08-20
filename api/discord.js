// FN Sprite Tracker — Discord bot (slash-command interactions endpoint).
//
// Runs on Vercel's Edge runtime so we get the raw request body for Discord's
// Ed25519 signature check (required on every request). Reuses the same Supabase
// RPCs the app uses, so the bot and the site always agree.
//
// Commands (all resolve by public gamertag / sprite name — no account linking):
//   /holders  sprite:<name>       → who publicly owns a Sprite
//   /vault    gamertag:<name>     → a player's collection stats + rank
//   /spritematch gamertag:<name>  → that player's two-way trade matches
//   /codes    [category]          → live "Hack the Lobby" Override codes
//
// Setup: see DISCORD_BOT.md. Requires env vars DISCORD_PUBLIC_KEY (this file) and
// DISCORD_APP_ID + DISCORD_BOT_TOKEN (the register script).

import nacl from 'tweetnacl'
import { createClient } from '@supabase/supabase-js'
import { LOBBY_CODES } from '../src/data/codes.js'
import { SPRITE_TYPES, SPRITE_BY_ID } from '../src/data/sprites.js'

export const config = { runtime: 'edge' }

const SITE = 'https://fnsprites.vercel.app'
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://cjfproobzmqafdojzzsy.supabase.co'
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LrNHfVEfZPCyMQtei5Jeug_9QcQft1E'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } })

const hexToBytes = (hex) => {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return out
}
const json = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: { 'content-type': 'application/json' } })
// A plain, ephemeral (only the caller sees it) message reply.
const reply = (content) => json({ type: 4, data: { content: content.slice(0, 1990), flags: 64 } })

// Resolve a free-text sprite name/id to a Sprite type.
const findType = (q) => {
  const s = (q || '').trim().toLowerCase()
  if (!s) return null
  return SPRITE_TYPES.find((t) => t.id === s)
    || SPRITE_TYPES.find((t) => t.name.toLowerCase() === s)
    || SPRITE_TYPES.find((t) => t.name.toLowerCase().includes(s))
    || null
}
// sprite_id (e.g. "zeropoint_gold") → readable label.
const spriteLabel = (id) => {
  const sp = SPRITE_BY_ID[id]
  if (!sp) return id
  return sp.themeId === 'normal' ? sp.typeName : `${sp.typeName} (${sp.themeId})`
}
const opt = (interaction, name) => (interaction.data?.options || []).find((o) => o.name === name)?.value

async function handleHolders(interaction) {
  const type = findType(opt(interaction, 'sprite'))
  if (!type) return reply('Couldn’t find that Sprite. Try the exact name, e.g. `/holders sprite: Zero Point`.')
  const { data, error } = await supabase.rpc('sprite_holders', { type_id: type.id })
  if (error) return reply('Something went wrong looking that up — try again in a bit.')
  if (!data?.length) return reply(`No public collectors of **${type.name}** yet. Be the first — make your profile public at ${SITE}.`)
  const lines = data.slice(0, 15).map((h, i) => `\`${String(i + 1).padStart(2)}\` **${h.gamertag || 'Anonymous'}** — ${h.owned} owned${h.mastered ? ` · ${h.mastered}★` : ''}`)
  const more = data.length > 15 ? `\n…and ${data.length - 15} more.` : ''
  return reply(`👥 **Who owns ${type.name}** (public collectors)\n${lines.join('\n')}${more}\n${SITE}/sprite/${type.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`)
}

async function handleVault(interaction) {
  const name = (opt(interaction, 'gamertag') || '').trim()
  if (!name) return reply('Usage: `/vault gamertag: <your Fortnite name>`')
  const { data: rows, error } = await supabase.rpc('leaderboard')
  if (error) return reply('Something went wrong — try again in a bit.')
  const idx = (rows || []).findIndex((r) => (r.gamertag || '').toLowerCase() === name.toLowerCase())
  if (idx < 0) return reply(`No public collection found for **${name}**. Check the spelling, or set the profile to public at ${SITE}.`)
  const r = rows[idx]
  return reply(`🎒 **${r.gamertag}** — Sprite collection\n**${r.owned}** owned · **${r.mastered}**★ mastered\nFlex Score **${Math.round(r.score)}** · Rank **#${idx + 1}**\n${SITE}/?u=${r.user_id}`)
}

async function handleSpriteMatch(interaction) {
  const name = (opt(interaction, 'gamertag') || '').trim()
  if (!name) return reply('Usage: `/spritematch gamertag: <your Fortnite name>` — mark spares 🔁 For trade and wants 🎯 Want on the site first.')
  const { data: prof } = await supabase.rpc('profile_by_gamertag', { name })
  const me = prof?.[0]
  if (!me) return reply(`No public profile found for **${name}**. Make your profile public at ${SITE} and flag some 🔁/🎯 Sprites.`)
  const { data, error } = await supabase.rpc('trade_matches_for', { target: me.user_id })
  if (error) return reply('Something went wrong — try again in a bit.')
  if (!data?.length) return reply(`No trade matches for **${me.gamertag}** yet. Flag more spare duplicates (🔁 For trade) and wants (🎯 Want) at ${SITE}.`)
  const blocks = data.slice(0, 6).map((m) => {
    const they = (m.they_give || []).map(spriteLabel).join(', ') || '—'
    const you = (m.i_give || []).map(spriteLabel).join(', ') || '—'
    const dc = m.discord ? ` · DM \`${m.discord}\`` : ''
    return `**${m.gamertag || 'Anonymous'}**${dc}\n  ↙ they give: ${they}\n  ↗ you give: ${you}`
  })
  return reply(`🔁 **Trade matches for ${me.gamertag}**\n${blocks.join('\n')}\nMore at ${SITE}/?view=trade`)
}

function handleCodes(interaction) {
  const cat = (opt(interaction, 'category') || 'all').toLowerCase()
  let list = LOBBY_CODES.filter((c) => c.status === 'working')
  if (cat === 'sprites') list = list.filter((c) => c.type === 'sprite')
  if (!list.length) return reply('No live codes match that filter right now.')
  const lines = list.slice(0, 20).map((c) => `\`${c.code}\` — ${c.unlocks}`)
  return reply(`🎟️ **Hack the Lobby — working Override codes**\nOpen the BR lobby Admin Panel, type a code exactly (case-sensitive), Submit.\n${lines.join('\n')}\nFull list & rules: ${SITE}/codes`)
}

export default async function handler(request) {
  if (request.method !== 'POST') return new Response('OK', { status: 200 })
  const sig = request.headers.get('x-signature-ed25519')
  const ts = request.headers.get('x-signature-timestamp')
  const body = await request.text()
  const pub = process.env.DISCORD_PUBLIC_KEY
  const ok = sig && ts && pub && (() => {
    try {
      return nacl.sign.detached.verify(new TextEncoder().encode(ts + body), hexToBytes(sig), hexToBytes(pub))
    } catch { return false }
  })()
  if (!ok) return new Response('invalid request signature', { status: 401 })

  const interaction = JSON.parse(body)
  if (interaction.type === 1) return json({ type: 1 }) // PING → PONG
  if (interaction.type === 2) {
    try {
      switch (interaction.data?.name) {
        case 'holders': return await handleHolders(interaction)
        case 'vault': return await handleVault(interaction)
        case 'spritematch': return await handleSpriteMatch(interaction)
        case 'codes': return handleCodes(interaction)
        default: return reply('Unknown command.')
      }
    } catch {
      return reply('Something went wrong handling that command.')
    }
  }
  return json({ type: 4, data: { content: 'Unsupported interaction.', flags: 64 } })
}
