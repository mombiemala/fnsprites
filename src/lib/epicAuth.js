// Epic Account Services OAuth — account linking ("Connect Epic").
// The browser only needs the *public* Client ID to start the redirect; the
// authorization-code → token exchange happens server-side in a Supabase edge
// function so the client secret never touches the browser.
//
// Set VITE_EPIC_CLIENT_ID (Vercel env) to enable. Until then, the Connect
// button shows as "coming soon" rather than a broken flow.
const EPIC_CLIENT_ID = import.meta.env.VITE_EPIC_CLIENT_ID || ''
export const isEpicConfigured = !!EPIC_CLIENT_ID

const AUTHORIZE = 'https://www.epicgames.com/id/authorize'

// Where Epic sends the user back — must be registered in the Epic Dev Portal.
export function epicRedirectUri() {
  return `${window.location.origin}${window.location.pathname}`
}

// Kick off the Epic login/consent redirect. `scope` defaults to basic profile;
// add 'friends_list' when we ship the compare-with-Epic-friends feature.
export function startEpicLink(scope = 'basic_profile') {
  if (!isEpicConfigured) return
  const params = new URLSearchParams({
    client_id: EPIC_CLIENT_ID,
    response_type: 'code',
    scope,
    redirect_uri: epicRedirectUri(),
    state: 'epic_link',
  })
  window.location.href = `${AUTHORIZE}?${params.toString()}`
}
