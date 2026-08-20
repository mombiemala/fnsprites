// Registers (or updates) the FN Sprite Tracker bot's slash commands with Discord.
//
// Run once after creating the Discord app, and again whenever the command list
// below changes:
//   DISCORD_APP_ID=... DISCORD_BOT_TOKEN=... node scripts/register-discord-commands.mjs
//
// Global commands can take up to ~1 hour to propagate. To test instantly in one
// server, also pass DISCORD_GUILD_ID=... and they register to that guild only.

const APP_ID = process.env.DISCORD_APP_ID
const TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID

if (!APP_ID || !TOKEN) {
  console.error('Missing env. Usage: DISCORD_APP_ID=… DISCORD_BOT_TOKEN=… node scripts/register-discord-commands.mjs')
  process.exit(1)
}

const STRING = 3 // Discord ApplicationCommandOptionType.STRING

const commands = [
  {
    name: 'holders',
    description: 'See who publicly owns a Sprite',
    options: [{ name: 'sprite', description: 'Sprite name (e.g. Zero Point)', type: STRING, required: true }],
  },
  {
    name: 'vault',
    description: "Show a player's Sprite collection stats & rank",
    options: [{ name: 'gamertag', description: 'Public Fortnite gamertag', type: STRING, required: true }],
  },
  {
    name: 'spritematch',
    description: 'Find two-way Sprite trade matches for a player',
    options: [{ name: 'gamertag', description: 'Your public gamertag (flag 🔁/🎯 Sprites on the site first)', type: STRING, required: true }],
  },
  {
    name: 'codes',
    description: 'List working "Hack the Lobby" Override codes',
    options: [{ name: 'category', description: 'Filter: all or sprites', type: STRING, required: false,
      choices: [{ name: 'all', value: 'all' }, { name: 'sprites', value: 'sprites' }] }],
  },
]

const url = GUILD_ID
  ? `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`
  : `https://discord.com/api/v10/applications/${APP_ID}/commands`

const res = await fetch(url, {
  method: 'PUT',
  headers: { Authorization: `Bot ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(commands),
})

if (!res.ok) {
  console.error(`Failed (${res.status}):`, await res.text())
  process.exit(1)
}
console.log(`✅ Registered ${commands.length} commands ${GUILD_ID ? `to guild ${GUILD_ID}` : 'globally (may take ~1h to appear)'}.`)
