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
    id: 'c7s3-season-end',
    emoji: '⏳',
    message: 'Chapter 7 Season 3 ends Aug 19 — finish your sprite collection before the next chapter!',
    link: 'https://www.fortnite.com/news',
    linkLabel: 'Details',
    start: '2026-07-01',
    end: '2026-08-19',
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
