import { NEWS } from '../data/news'
import { LOBBY_CODES } from '../data/codes'

// "New since your last visit" badges for the News and Lobby Hacks tabs.
// We store a per-tab last-seen date in localStorage and count items dated after
// it. A brand-new visitor has their marks initialised to today, so they never
// see a meaningless "60 new" on first load — badges only reflect what dropped
// since they actually last looked.
const KEY = (k) => `fnsprites:seen:${k}`
const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}/.test(s)
const today = () => {
  try {
    return new Date().toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

function read(k) {
  try {
    return localStorage.getItem(KEY(k))
  } catch {
    return null
  }
}

// Return the stored mark, initialising it to today on first ever visit.
function ensureMark(k) {
  let m = read(k)
  if (!m) {
    m = today()
    try {
      localStorage.setItem(KEY(k), m)
    } catch {
      /* ignore */
    }
  }
  return m
}

// Mark a tab seen now, clearing its badge.
export function markSeen(k) {
  try {
    localStorage.setItem(KEY(k), today())
  } catch {
    /* ignore */
  }
}

const countAfter = (items, field, mark) => {
  const m = mark.slice(0, 10)
  return items.filter((it) => isDate(it[field]) && it[field].slice(0, 10) > m).length
}

// { news, codes } counts of items newer than each tab's last-seen date.
export function newCounts() {
  return {
    news: countAfter(NEWS, 'ts', ensureMark('news')),
    codes: countAfter(LOBBY_CODES, 'added', ensureMark('codes')),
  }
}
