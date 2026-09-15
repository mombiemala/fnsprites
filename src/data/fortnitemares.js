// Fortnitemares 2026 hub content. Halloween is Fortnite's biggest seasonal spike,
// so this powers a dedicated /fortnitemares SEO page. It's LEAK-heavy right now —
// Epic hasn't officially announced the event — so EVERY item carries a status
// (`leak` = datamined / multi-source; `rumor` = softer / single-source) and the
// page labels them clearly. Update / promote items to confirmed as Epic reveals
// them; the Season-5 / daily watches can keep this current.

export const FORTNITEMARES = {
  year: 2026,
  // Reported for Thursday Oct 1 (fits the usual Thursday cadence) — NOT Epic-confirmed.
  startEstimate: '2026-10-01',
  endEstimate: '2026-10-31',
  confirmed: false,
  updated: '2026-09-15',
  sourceUrl: 'https://www.theclick.gg/fortnitemares-2026/',

  // Sprite-relevant first (this is a Sprite tracker), then collabs, then the wider event.
  sprites: [
    { title: 'Trick-or-Treat Sprite finish', status: 'leak', source: 'The Click',
      detail: 'A Halloween “Trick or Treat” Sprite finish is datamined (internal name “TrickTreat”), with leak imagery pointing to an X-Ray Trick-or-Treat variant. Which base Sprite gets it — and its ability — aren’t in the files yet.' },
    { title: 'Returning Gummy & Holofoil variants', status: 'leak', source: 'Vice / The Click',
      detail: 'Leaks suggest the Gummy and Holofoil finishes from earlier seasons make a limited return during the event.' },
  ],
  collabs: [
    { title: 'Five Nights at Freddy’s (FNAF)', status: 'leak', source: 'Vice',
      detail: 'Dataminers (SamLeakss) report a FNAF crossover this Halloween — FNAF files surfaced in a recent update and a Freddy Fazbear’s Pizzeria-style building is under construction on the Chapter 7 Season 4 map. Epic hasn’t named Fortnite directly yet.' },
    { title: 'Ghostface (Scream)', status: 'leak', source: 'The Click / Dexerto',
      detail: 'Ghostface content is reported — current info points to a Ghostface-themed knife item / Loot Hack rather than just an Item Shop return.' },
    { title: 'Universal Halloween Horror Nights', status: 'rumor', source: 'Dexerto',
      detail: 'A Halloween Horror Nights tie-in is among the rumored crossovers.' },
  ],
  content: [
    { title: 'Halloween Loot Hacks', status: 'leak', source: 'The Click',
      detail: 'A Halloween set of Loot Hacks is expected (e.g. a Ghostface knife) rotating into the Sprite-Dust loot-hack pool.' },
    { title: 'Witch Broom returns', status: 'leak', source: 'The Click',
      detail: 'The Witch Broom mobility item is reported to return for the event.' },
    { title: 'Chainsaw item', status: 'leak', source: 'The Click',
      detail: 'A Chainsaw is among the leaked Fortnitemares weapon/item additions.' },
    { title: 'Spooky map changes', status: 'leak', source: 'The Click',
      detail: 'Halloween map changes including purple water and themed points of interest are reported.' },
    { title: 'New Dash Medallion', status: 'rumor', source: 'The Click',
      detail: 'A new Dash Medallion is among the leaked gameplay additions.' },
  ],
}

// Whole days until the estimated start (negative once it's begun / past).
export function daysUntilFortnitemares(now = new Date()) {
  return Math.ceil((new Date(FORTNITEMARES.startEstimate + 'T13:00:00Z') - now) / 86400000)
}
