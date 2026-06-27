import { createClient } from '@supabase/supabase-js'

// The publishable (anon) key is meant to be exposed in client code — it is
// protected by Row Level Security on the database. Env vars override these
// defaults for local dev / alternate deployments.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://cjfproobzmqafdojzzsy.supabase.co'
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_LrNHfVEfZPCyMQtei5Jeug_9QcQft1E'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Creator code for supporting the maker of this tracker
export const CREATOR_CODE = 'mombie'

// Maker links. Update BUY_ME_A_COFFEE to your exact Buy Me a Coffee URL.
export const LINKS = {
  buyMeACoffee: 'https://buymeacoffee.com/mombie',
}
