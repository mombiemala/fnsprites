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
  updated: '2026-10-16',
  sourceUrl: 'https://www.vice.com/en/article/fortnitemares-2026-collabs-october-15-update/',

  // Sprite-relevant first (this is a Sprite tracker), then collabs, then the wider event.
  sprites: [
    { title: 'Four new Sprites are live', status: 'live', source: 'Epic (v42.30) / Vice',
      detail: 'Vampire (heal when you damage enemies), Spooky Dash (Mythic — dash charges that phase through objects), The Deer (99 Nights in the Forest collab — stronger melee) and Dumpster Dive (foraged food heals more). Full powers, finishes and where to farm each are in the Fortnitemares Sprite farming guide.' },
    { title: 'Trick-or-Treat finish — drops Oct 8', status: 'leak', source: 'Sprite Checklist / The Click',
      detail: 'The Halloween “Trick-or-Treat” recolour (24 Sprites) is datamined for Oct 8 — not generally obtainable yet. (The Crown’s Trick-or-Treat is reachable earlier only via the Crown Victory-Royale chain, i.e. winning with the Bounty Hunter Crown — a niche progression unlock, not the general drop.) It’s a cosmetic finish that keeps each Sprite’s base ability.' },
    { title: 'Honey & One Wish Willow Sprites — live Oct 15', status: 'live', source: 'Epic (v42.40) / Vice',
      detail: 'The mid-event wave landed Oct 15 (v42.40): Honey (Design-a-Sprite winner — sends bees after enemies who damage you) and One Wish Willow (the Mythic crossover Sprite from the horror film “Obsession” — eliminate an enemy and it extracts the Sprite they had equipped for you to grab, and it shoves nearby enemies back when you take damage; removing it pings your location). Both shipped with all six finishes. These are the season’s last new Sprites.' },
  ],
  // NOTE: these are cosmetic/skin crossovers, NOT Sprites (this app tracks Sprites —
  // the only Sprite collab this wave is One Wish Willow, in the roster). Kept here as a
  // Fortnitemares heads-up. Status: live (in-game now) · leak (datamined/Epic-named,
  // not in shop yet) · rumor (teased or single-source, unconfirmed).
  collabs: [
    { title: 'Five Nights at Freddy’s (FNAF)', status: 'live', source: 'Epic (trailer Sep 27)',
      detail: 'Live: Freddy Fazbear’s Pizzeria is a new POI, and the four animatronics (Freddy, Bonnie, Chica, Foxy) appear as bosses — beating them is one way to get the Vampire Sprite.' },
    { title: 'Ghostface (Scream)', status: 'live', source: 'The Click / Dexerto',
      detail: 'Ghostface content is in the event, including a Ghostface knife item in the Fortnitemares loot.' },
    { title: 'Hazbin Hotel', status: 'leak', source: 'Epic (event post) / Vice',
      detail: 'Epic-confirmed for the event — Charlie, Vaggie & Alastor outfits expected in the Item Shop around/after the Oct 15 update. Skins, not a Sprite.' },
    { title: 'Beetlejuice', status: 'leak', source: 'Epic (event post) / Vice',
      detail: 'Epic-confirmed among the month’s Fortnitemares crossovers. A cosmetic skin collab, not a Sprite.' },
    { title: 'Slender Man', status: 'leak', source: 'ShiinaBR / Vice (datamine)',
      detail: 'Datamined and expected after the Oct 15 update; no Item Shop date confirmed yet. A skin collab, not a Sprite.' },
    { title: 'Predator: Badlands', status: 'leak', source: 'ShiinaBR / Insider Gaming',
      detail: 'Listed among the month’s Fortnitemares crossovers. Cosmetic collab, not a Sprite.' },
    { title: 'The Purge', status: 'rumor', source: 'ShiinaBR / community',
      detail: 'Teased/reported for the event; timing unconfirmed. Cosmetic collab.' },
    { title: 'Halloween Horror Nights (HamiKuma)', status: 'rumor', source: 'ShiinaBR / Dexerto',
      detail: 'A Universal Halloween Horror Nights tie-in (HamiKuma) is among the leaked crossovers; unconfirmed.' },
    { title: 'More leaked, unconfirmed', status: 'rumor', source: 'ShiinaBR',
      detail: 'Also floated by leakers with a “(?)” — League of Legends, Metal Sonic and The Exorcist, plus “more.” Treat as rumors until Epic confirms. (All skins; only One Wish Willow — the “Obsession” crossover — is a Sprite this wave.)' },
  ],
  content: [
    { title: 'Thrills & Chills — free party rewards', status: 'live', source: 'Epic (Fortnite social)',
      detail: 'Squad up with friends and survive themed horror Islands together to earn free “Thrills & Chills” Fortnitemares cosmetics — the announcement shows a stitched teddy-bear outfit, ghostly reaching hands, a crowbar pickaxe, plus a spray and loading screen. Cosmetics, not Sprites, but free for playing the event with a squad.' },
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
