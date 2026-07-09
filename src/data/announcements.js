// Dismissible announcement bar content — for live/limited-time events and
// important info (usually from Epic). Newest/most-important first; the bar shows
// the first entry that's currently active and hasn't been dismissed.
//
// Fields:
//   id       unique, stable string (dismissal is remembered per id)
//   emoji    a leading glyph
//   message  the short headline
//   link     optional URL · linkLabel optional link text
//   start/end optional 'YYYY-MM-DD' window — the bar auto-hides outside it
//   tone     'info' | 'event' | 'alert' (colour)
//
// To announce a LIVE event, add an entry with a tight start/end window — it will
// appear automatically during that window and disappear after. Give it a NEW id
// each time so players who dismissed a past notice still see the new one.

export const ANNOUNCEMENTS = [
  {
    id: 'holofoil-sprites-live-2026-07-09',
    emoji: '🌈',
    message: 'Holofoil Sprites are live! A shiny Holofoil for 15 Sprites — +5% squad chance to find rare Gold/Gummy/Galaxy. Holofoil Hours: Sat, Jul 11.',
    link: 'https://communities.epicgames.com/thread/new-holofoil-sprite-variant-arrives-thursday-july-9/kqQk',
    linkLabel: 'Details',
    start: '2026-07-09',
    end: '2026-07-11',
    source: 'Epic Games',
    official: true,
    tone: 'event',
  },
  {
    id: 'holofoil-hours-2026-07-11',
    emoji: '✨',
    message: 'Holofoil Hours — Sat, Jul 11 (2 PM & 9 PM ET): boosted Holofoil Sprite spawns.',
    link: 'https://beebom.com/fortnite-sprite-events-schedule/',
    linkLabel: 'Schedule',
    start: '2026-07-11',
    end: '2026-07-11',
    source: 'Beebom',
    official: false,
    tone: 'event',
  },
  {
    id: 'gold-gummy-hours-2026-07-04',
    emoji: '✨',
    message: 'Gold & Gummy Hours — Sat, Jul 4: boosted Gold & Gummy Sprite spawns + faster Sprite XP (2–4 PM & 9–11 PM ET).',
    link: 'https://www.vice.com/en/article/fortnite-gold-gummy-hours/',
    linkLabel: 'Schedule',
    start: '2026-07-03',
    end: '2026-07-04',
    source: 'Vice',
    official: false,
    tone: 'event',
  },
  {
    id: 'catch-up-day-2026-07-02',
    emoji: '⚡',
    message: 'Catch-Up Day is live — 4× rate-up on Legendary Sprites through Fri, Jul 3 @ 9 AM ET!',
    link: 'https://communities.epicgames.com/thread/catch-up-day-legendary-sprites-4x-rate-up/oM9D',
    linkLabel: 'Details',
    start: '2026-07-02',
    end: '2026-07-03',
    source: 'Epic Games',
    official: true,
    tone: 'event',
  },
  {
    id: 'c7s3-season-end',
    emoji: '⏳',
    message: 'Chapter 7 Season 3 ends Aug 19 — finish your sprite collection before the next chapter!',
    link: 'https://www.fortnite.com/news',
    linkLabel: 'Details',
    start: '2026-07-01',
    end: '2026-08-19',
    source: 'Epic Games',
    official: true,
    tone: 'info',
  },

  // ── Template for a live event (edit dates + text, give it a fresh id): ──
  // {
  //   id: 'catch-up-day-2026-07',
  //   emoji: '🎣',
  //   message: 'Catch-Up Day is live — bonus Sprite XP & gold fishing all day!',
  //   link: 'https://www.fortnite.com/news',
  //   linkLabel: 'What’s on',
  //   start: '2026-07-05',
  //   end: '2026-07-06',
  //   tone: 'event',
  // },
]
