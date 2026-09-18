import { useState } from 'react'
import { useAuth } from '../context/authStore'
import { useToast } from '../context/toastStore'
import { ALL_SPRITES, RELEASED_COUNT } from '../data/sprites'
import { THEME_MAP, THEME_ORDER } from '../data/themes'
import { CREATOR_CODE } from '../lib/supabase'

export default function ShareBar({ onExport, exporting, onExportGarden, gardenExporting }) {
  const { user, profile, updateProfile, tracking } = useAuth()
  const { toast } = useToast()
  const [gamertag, setGamertag] = useState(profile?.gamertag || '')
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedCap, setCopiedCap] = useState(false)
  const [copiedDiscord, setCopiedDiscord] = useState(false)

  // Re-seed the form fields when the loaded profile changes (React's
  // recommended "adjust state during render" pattern — avoids an effect).
  const [seededId, setSeededId] = useState(null)
  if (profile && profile.id !== seededId) {
    setSeededId(profile.id)
    setGamertag(profile.gamertag || '')
    setIsPublic(profile.is_public ?? true)
  }

  if (!user) return null

  const shareUrl = `${window.location.origin}${window.location.pathname}?u=${user.id}`

  const save = async () => {
    const res = await updateProfile({ gamertag: gamertag.trim() || null, is_public: isPublic })
    if (!res.error) {
      setSaved(true)
      toast('Profile saved')
      setTimeout(() => setSaved(false), 1500)
    } else {
      toast(res.error, 'error')
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast('Share link copied!')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast('Could not copy link', 'error')
    }
  }

  // A ready-to-paste text summary for Discord/Reddit — counts against the
  // released roster (what you can actually collect right now).
  const owned = ALL_SPRITES.filter((s) => !s.unreleased && tracking[s.id]?.owned).length
  const mastered = ALL_SPRITES.filter((s) => !s.unreleased && tracking[s.id]?.mastered).length
  const pctOwned = RELEASED_COUNT ? Math.round((owned / RELEASED_COUNT) * 100) : 0
  const missing = RELEASED_COUNT - owned
  const who = gamertag.trim() ? `${gamertag.trim()}'s` : 'My'
  const captionUrl = isPublic ? shareUrl : `${window.location.origin}${window.location.pathname}`
  const caption = [
    `🧩 ${who} Fortnite sprite collection: ${owned}/${RELEASED_COUNT} (${pctOwned}%)${mastered ? ` · ${mastered} mastered ⭐` : ''}`,
    missing > 0 ? `Still chasing ${missing} more sprite${missing === 1 ? '' : 's'}.` : `Full set — gotta catch ’em all! 🏆`,
    `Track & compare yours → ${captionUrl}`,
  ].join('\n')

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption)
      setCopiedCap(true)
      toast('Caption copied — paste into Discord/Reddit!')
      setTimeout(() => setCopiedCap(false), 1600)
    } catch {
      toast('Could not copy caption', 'error')
    }
  }

  // Richer, Discord-formatted breakdown (markdown bold + a per-finish tally and a
  // few of the sprites you're still missing) — a step up from the one-line caption.
  const relByTheme = {}
  for (const s of ALL_SPRITES) {
    if (s.unreleased) continue
    const t = (relByTheme[s.themeId] ||= { owned: 0, total: 0 })
    t.total++
    if (tracking[s.id]?.owned) t.owned++
  }
  const finishLines = THEME_ORDER
    .filter((id) => relByTheme[id]?.total)
    .map((id) => `${THEME_MAP[id]?.name || id} ${relByTheme[id].owned}/${relByTheme[id].total}`)
  const missingNames = ALL_SPRITES
    .filter((s) => !s.unreleased && !tracking[s.id]?.owned)
    .slice(0, 6)
    .map((s) => (THEME_MAP[s.themeId]?.name && THEME_MAP[s.themeId].name !== 'Normal' ? `${THEME_MAP[s.themeId].name} ${s.typeName}` : s.typeName))
  const discord = [
    `🧩 **${who} Fortnite Sprite Collection** — Season 4 “Override”`,
    `**${owned}/${RELEASED_COUNT} (${pctOwned}%)** collected${mastered ? ` · **${mastered}** mastered ⭐` : ''}`,
    '',
    `**By finish:** ${finishLines.join(' · ')}`,
    missing > 0
      ? `**Still chasing ${missing}:** ${missingNames.join(', ')}${missing > missingNames.length ? '…' : ''}`
      : `**Full set — gotta catch ’em all!** 🏆`,
    '',
    `Track & compare yours → ${captionUrl}`,
    `💜 Support the maker — Creator Code **${CREATOR_CODE.toUpperCase()}**`,
  ].join('\n')

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(discord)
      setCopiedDiscord(true)
      toast('Discord breakdown copied — paste it in your server!')
      setTimeout(() => setCopiedDiscord(false), 1600)
    } catch {
      toast('Could not copy', 'error')
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <h3 className="mb-3 font-display text-lg text-white">Share &amp; export</h3>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
            Gamertag
          </span>
          <input
            value={gamertag}
            onChange={(e) => setGamertag(e.target.value)}
            placeholder="Your Fortnite name"
            maxLength={32}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--brand)]"
          />
        </label>
        <label className="flex items-center gap-2 pb-2 text-xs font-semibold text-[var(--muted)]">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Public link
        </label>
        <button
          onClick={save}
          title="Save your gamertag & public-link setting"
          className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-extrabold text-black"
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          readOnly
          value={shareUrl}
          className="flex-1 truncate rounded-xl border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs text-[var(--muted)] outline-none"
        />
        <button
          onClick={copy}
          title="Copy your shareable collection link"
          className="rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]"
        >
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={copyCaption}
          title="Copies a short one-line summary of your collection — good for Reddit or a quick post"
          className="w-full rounded-xl bg-[var(--panel-2)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--border)]"
        >
          {copiedCap ? 'Caption copied ✓' : '📋 Copy short caption'}
        </button>
        <button
          onClick={copyDiscord}
          title="Copies a full Discord-formatted breakdown (completion %, per-finish tally, what you're missing) — paste it straight into a server"
          className="w-full rounded-xl bg-[#5865F2] px-4 py-2 text-sm font-extrabold text-white hover:brightness-110"
        >
          {copiedDiscord ? 'Copied for Discord ✓' : '🎮 Copy for Discord'}
        </button>
      </div>
      {!isPublic && (
        <p className="mt-2 text-[11px] text-[var(--muted)]">
          Your link is currently private — enable “Public link” and save so others can view it.
        </p>
      )}

      {onExport && (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="mb-2 text-xs font-semibold text-[var(--muted)]">Download a shareable PNG:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onExport('collection')}
              disabled={exporting}
              title="Owned sprites in full colour, missing ones dimmed"
              className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60"
            >
              {exporting ? 'Rendering…' : '⬇️ Collection image'}
            </button>
            <button
              onClick={() => onExport('missing')}
              disabled={exporting}
              title="Just the sprites you still need — handy for trades"
              className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60"
            >
              {exporting ? 'Rendering…' : '⬇️ Missing-sprites image'}
            </button>
            {onExportGarden && (
              <button
                onClick={onExportGarden}
                disabled={gardenExporting}
                title="Your owned Sprites as a lush circular “Sprite Garden” showcase"
                className="rounded-xl bg-[var(--panel-2)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--border)] disabled:opacity-60"
              >
                {gardenExporting ? 'Rendering…' : '🌱 Sprite Garden image'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
