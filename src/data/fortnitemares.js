// Fortnitemares 2026 hub content. Halloween is Fortnite's biggest seasonal spike,
// so this powers a dedicated /fortnitemares SEO page. The event is now LIVE
// (update v42.30, Oct 1 → Oct 31), so items carry a status — `live` = in-game now,
// `leak` = reported but not yet live, `rumor` = softer / single-source — and the
// page labels them clearly. Keep statuses current as more of the event rolls out.

export const FORTNITEMARES = {
  year: 2026,
  startEstimate: '2026-10-01', // now the confirmed start
  endEstimate: '2026-10-31',
  confirmed: true,
  live: true,
  updated: '2026-10-01',
  sourceUrl: 'https://www.vice.com/en/article/fortnitemares-2026-collabs-weapons-map-changes-sprites/',

  // Sprite-relevant first (this is a Sprite tracker), then collabs, then the wider event.
  sprites: [
    { title: 'Four new Sprites are live', status: 'live', source: 'Epic (v42.30) / Vice',
      detail: 'Vampire (heal when you damage enemies), Spooky Dash (Mythic — dash charges that phase through objects), The Deer (99 Nights in the Forest collab — stronger melee) and Dumpster Dive (foraged food heals more). Full powers, finishes and where to farm each are in the Fortnitemares Sprite farming guide.' },
    { title: 'Trick-or-Treat finish — drops Oct 8', status: 'leak', source: 'Sprite Checklist / The Click',
      detail: 'The Halloween “Trick-or-Treat” recolour (24 Sprites) is datamined for Oct 8 — not generally obtainable yet. (The Crown’s Trick-or-Treat is reachable earlier only via the Crown Victory-Royale chain, i.e. winning with the Bounty Hunter Crown — a niche progression unlock, not the general drop.) It’s a cosmetic finish that keeps each Sprite’s base ability.' },
    { title: 'Honey & Obsession Sprites', status: 'leak', source: 'Vice / The Click',
      detail: 'Two more Sprites are expected in a mid-event wave around Oct 15 — the Honey Sprite (a Design-a-Sprite winner) and a new Obsession Sprite. Not live yet.' },
  ],
  collabs: [
    { title: 'Five Nights at Freddy’s (FNAF)', status: 'live', source: 'Epic (trailer Sep 27)',
      detail: 'Live: Freddy Fazbear’s Pizzeria is a new POI, and the four animatronics (Freddy, Bonnie, Chica, Foxy) appear as bosses — beating them is one way to get the Vampire Sprite.' },
    { title: 'Ghostface (Scream)', status: 'live', source: 'The Click / Dexerto',
      detail: 'Ghostface content is in the event, including a Ghostface knife item in the Fortnitemares loot.' },
    { title: 'Universal Halloween Horror Nights', status: 'rumor', source: 'Dexerto',
      detail: 'A Halloween Horror Nights tie-in was among the rumored crossovers; unconfirmed.' },
  ],
  content: [
    { title: 'Halloween Loot Hacks', status: 'live', source: 'Epic (v42.30)',
      detail: 'The Loot Hacks pool refreshed with Fortnitemares items — the Pumpkin Launcher and Slap Candy Corn joined the Infantry Rifle, LMG and Last Call.' },
    { title: 'Map shake-up', status: 'live', source: 'Epic (v42.30)',
      detail: 'Battlewoods became Gravegate, the old Arcade is now Freddy Fazbear’s Pizzeria, and a new Nightmare Neighborhood POI appeared.' },
    { title: 'Witch Broom & Chainsaw', status: 'live', source: 'The Click',
      detail: 'Halloween mobility and melee items including the Witch Broom and Chainsaw are back for the event.' },
  ],
}

// Whole days until the estimated start (negative once it's begun / past).
export function daysUntilFortnitemares(now = new Date()) {
  return Math.ceil((new Date(FORTNITEMARES.startEstimate + 'T13:00:00Z') - now) / 86400000)
}
