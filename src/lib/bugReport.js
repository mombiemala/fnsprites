import { supabase } from './supabase'

// Stores a bug report in Supabase. Maker can read them in the dashboard
// (and wire a Database Webhook → email for notifications).
export async function submitBugReport({ message, contact, userId }) {
  const { error } = await supabase.from('bug_reports').insert({
    message,
    contact: contact || null,
    user_id: userId || null,
    context: window.location.href,
    user_agent: navigator.userAgent.slice(0, 400),
  })
  return { error: error?.message }
}
