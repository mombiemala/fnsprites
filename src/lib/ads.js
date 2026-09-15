// AdSense configuration — kept out of the component file so Fast Refresh stays
// happy (a component file should only export components).

// Google AdSense publisher ID. The loader <script> lives in index.html's <head>
// (and in every prerendered SEO page via scripts/prerender.mjs); the AdSlot
// component only renders individual ad *units*.
export const AD_CLIENT = 'ca-pub-3458906019268790'

// Master switch. Ads stay DORMANT — nothing renders — until this is turned on.
// Flip it by setting VITE_ADS_ENABLED=true in the Vercel project env AFTER
// AdSense approves the site (no source change / redeploy needed). Kept off by
// default so we never show empty ad boxes or violate policy pre-approval.
export const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true'

// Ad-unit slot ids. Create the units in the AdSense dashboard once approved,
// then paste their data-ad-slot ids here. An empty id keeps that placement
// dormant even when ADS_ENABLED is on, so it's safe to place them now.
export const AD_SLOTS = {
  collectionBottom: '4589403651', // responsive unit above the footer (AdSense "ad 1")
  spritesSidebar: '',   // in-content unit in the /sprites reference sidebar (awaiting its slot id)
}
