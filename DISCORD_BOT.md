# FN Sprite Tracker — Discord bot

Slash-command bot that reuses the site's own data, so Discord and the site always
agree. Runs as a single Vercel Edge function (`api/discord.js`) — no separate host.

## Commands

| Command | What it does |
|---|---|
| `/holders sprite:<name>` | Public players who own that Sprite, most-mastered first |
| `/vault gamertag:<name>` | A player's collection stats (owned / mastered / Flex Score / rank) |
| `/spritematch gamertag:<name>` | Two-way trade matches for that player (needs 🔁/🎯 flags set on the site) |
| `/codes [category]` | Working "Hack the Lobby" Override codes (all / sprites) |

Replies are **ephemeral** (only the person who ran the command sees them), so the
bot never spams a channel.

## One-time setup (you do this)

1. **Create the app** at <https://discord.com/developers/applications> → *New Application*.
2. From **General Information**, copy the **Public Key** and **Application ID**.
3. Under **Bot**, add a bot and copy its **Token** (reset it if needed).
4. In Vercel (the `fnsprites` project) → **Settings → Environment Variables**, add:
   - `DISCORD_PUBLIC_KEY` = the Public Key
   - (the register script also needs `DISCORD_APP_ID` and `DISCORD_BOT_TOKEN`, but
     those are only used locally when you run the script — they don't need to be in Vercel)
5. **Redeploy** so the function picks up `DISCORD_PUBLIC_KEY`.
6. Back in the Developer Portal → **General Information**, set the
   **Interactions Endpoint URL** to `https://fnsprites.vercel.app/api/discord`
   and save. Discord sends a signed PING; if the key is set correctly it saves ✅.
7. **Register the commands** (locally, once):
   ```bash
   DISCORD_APP_ID=... DISCORD_BOT_TOKEN=... node scripts/register-discord-commands.mjs
   ```
   Add `DISCORD_GUILD_ID=...` to test instantly in one server (global commands can
   take up to ~1 hour to appear).
8. **Invite the bot**: Developer Portal → **Installation** (or OAuth2 URL Generator)
   → scopes `applications.commands` (+ `bot`) → open the URL → add to your server.

## How it works / notes

- **No account linking** — everything resolves by public gamertag or Sprite name,
  so there's nothing for users to connect. `/vault` and `/spritematch` only see
  **public** profiles (set yours public in the site's Profile).
- Signature verification uses `tweetnacl` (Ed25519) on every request — Discord
  requires it, and unsigned requests get a 401.
- Data comes from the same Supabase RPCs the app uses:
  `sprite_holders`, `leaderboard`, `profile_by_gamertag`, `trade_matches_for`.
  Codes come from `src/data/codes.js` (so updating the site updates the bot).
- To change the command list, edit `scripts/register-discord-commands.mjs` and
  re-run it.

## Files

- `api/discord.js` — the interactions endpoint (Edge function).
- `scripts/register-discord-commands.mjs` — registers/updates the slash commands.
