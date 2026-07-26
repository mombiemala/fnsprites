// Vercel Edge Middleware — gives shared collection links (`/?u=<id>`) a per-player
// social preview. Crawlers (Discord, Twitter, iMessage…) don't run JS, so the SPA's
// static og:image can't be personalized client-side. For requests to `/` that carry
// a `?u=` param, we fetch the built index.html and swap the og:image / twitter:image
// to `/api/og?u=<id>` (a dynamically-rendered Trainer Card PNG) and og:url to the
// share link.
//
// Defensive by design: it only acts when `?u=` is present, and ANY failure falls
// through to the normal static response — a broken preview must never break the page.
import { next } from '@vercel/edge'

// Only run on the app root; static assets and `/index.html` (fetched below) are
// untouched, so there's no recursion.
export const config = { matcher: '/' }

const GENERIC_IMG = 'https://fnsprites.vercel.app/og-image.png'
const GENERIC_URL = 'content="https://fnsprites.vercel.app/"'

export default async function middleware(request) {
  try {
    const url = new URL(request.url)
    const u = url.searchParams.get('u')
    if (!u) return next()

    // Fetch the built shell (different path than the matcher → no middleware loop).
    const res = await fetch(new URL('/index.html', url.origin), { headers: { 'x-og-mw': '1' } })
    if (!res.ok) return next()
    let html = await res.text()

    const img = `${url.origin}/api/og?u=${encodeURIComponent(u)}`
    const share = `${url.origin}/?u=${encodeURIComponent(u)}`
    html = html
      .split(GENERIC_IMG).join(img)
      .replace(GENERIC_URL, `content="${share}"`)

    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=600' },
    })
  } catch {
    // Any problem → behave as if the middleware weren't here.
    return next()
  }
}
