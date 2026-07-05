# Phase 1 — "Season 4 dropped, add the new set" playbook

Turn the collection engine on for a **second** collectible. Phase 0 + 0.5 already
shipped the seams (see `src/data/collections.js`, `CollectionSwitcher`, the
`collection` column on `sprite_progress`), so this is mostly *add data + flip a
few queries*, not a rebuild.

Prereq shipped already:
- `src/data/collections.js` — `COLLECTIONS`, `ACTIVE_COLLECTION_ID`, `getCollection()`.
- `src/components/CollectionSwitcher.jsx` — renders nothing until a 2nd set exists.
- `App.jsx` sources its catalog from the **active set** (`getCollection(collectionId)`).
- DB: `sprite_progress.collection text NOT NULL DEFAULT 'sprites'` (+ `(user_id, collection)` index).

---

## ① Add the set (data only) — ~30 min

1. Create `src/data/collections/<newset>.js` with the same shape the sprite
   catalog exposes: `items` (flat, one id per variant — what progress is keyed
   on), `types` (grouped), `variants` + `variantMap`, `rarityOrder`, `total`,
   `released`.
2. Register it in `src/data/collections.js`:
   ```js
   { id: 'relics', label: 'Relics', icon: '🪓',
     items: relics, types: relicTypes, variants: relicTiers,
     variantMap: relicTierMap, rarityOrder: relicRarityOrder,
     total: RELIC_TOTAL, released: RELIC_RELEASED }
   ```
   The moment `COLLECTIONS.length > 1`, the switcher lights up automatically.
3. Default to the season's headline set: set `ACTIVE_COLLECTION_ID` to the new id
   (or make the initial `collectionId` state read a `?set=` param).

## ② DB migrations (additive; paste-ready)

**a) Let one item id live in two sets — extend the PK.** First confirm the name:
```sql
select conname from pg_constraint
where conrelid='public.sprite_progress'::regclass and contype='p';
```
then:
```sql
alter table public.sprite_progress drop constraint sprite_progress_pkey;
alter table public.sprite_progress add primary key (user_id, sprite_id, collection);
```
Also update the upsert `onConflict` in `AuthContext` to `'user_id,sprite_id,collection'`.

**b) Trade board goes per-collection:**
```sql
alter table public.trade_posts add column if not exists collection text not null default 'sprites';
create index if not exists trade_posts_collection_idx on public.trade_posts (collection, created_at desc);
```

**c) Leaderboard: scope by collection + de-hardcode the rarity weights.**
Today `public.leaderboard()` hardcodes sprite names via
`split_part(sprite_id,'_',1)` and reads *all* rows. Generalize:
```sql
create table if not exists public.collection_weights (
  collection text not null,
  item_prefix text not null,
  weight numeric not null default 1,
  primary key (collection, item_prefix)
);
insert into public.collection_weights (collection, item_prefix, weight) values
  ('sprites','zeropoint',20),('sprites','peanut',20),('sprites','grim',20),
  ('sprites','dream',8),('sprites','punk',8),('sprites','boss',8),
  ('sprites','duck',3),('sprites','ghost',3),('sprites','king',3),
  ('sprites','demon',3),('sprites','aura',3)
on conflict do nothing;

create or replace function public.leaderboard(p_collection text default 'sprites')
returns table(user_id uuid, gamertag text, score numeric, owned int, mastered int)
language sql stable security definer set search_path to 'public' as $$
  with pts as (
    select sp.user_id, sp.owned, sp.mastered, coalesce(w.weight,1) as p
    from sprite_progress sp
    join profiles pr on pr.id=sp.user_id and pr.is_public
    left join collection_weights w
      on w.collection=sp.collection and w.item_prefix=split_part(sp.sprite_id,'_',1)
    where sp.collection = p_collection
  )
  select pts.user_id,
    (select gamertag from profiles where id=pts.user_id),
    sum(case when owned then p else 0 end) + sum(case when mastered then p*0.5 else 0 end),
    count(*) filter (where owned)::int, count(*) filter (where mastered)::int
  from pts group by pts.user_id
  having sum(case when owned then p else 0 end) > 0
  order by 3 desc limit 100;
$$;
```
Add a `p_collection` param + `where collection = p_collection` to the trade RPCs
`trade_board_list` and `trade_matches_for_me` too.

## ③ Code that goes collection-aware

| File | Change |
|---|---|
| `data/collections.js` | + the new set entry (step ①) |
| `context/AuthContext.jsx` | Make the active collection **dynamic**: hold `activeCollection` in state, re-run the load effect on change, filter reads + tag writes with it, extend upsert `onConflict` to include `collection`. (Phase 0 already tags writes with a constant — swap the constant for the selected id.) |
| `App.jsx` | Already reads `getCollection(collectionId)`. Add `?set=` deep-link + call into `AuthContext` to switch the tracked set when `collectionId` changes. |
| `Leaderboard.jsx` | pass `{ p_collection: collectionId }` to the RPC + label the set |
| `TradeBoard.jsx` · `TradePanel.jsx` · `lib/tradeBoard.js` | pass/insert `collection` on posts and list/match RPCs |
| `StatsBreakdown.jsx` · `ProgressStats.jsx` | denominators from `set.released` (already available) |
| `SpriteCard` · `SpriteDetailModal` · `SpriteArt` | already prop-fed — feed variants/rarity from the active set |
| `lib/exportImage.js` | poster grid from `set.items × set.variants` |
| `lib/spriteOcr.js` · `ScreenshotImportModal` | roster from active set — **or** gate the importer to sprites if the new set isn't locker-OCR-able |
| `lib/sharedCollection.js` + share links | add `&set=` so a shared `?u=` profile opens the right set |

## ④ Pre-deploy checklist

- `npm run lint && npm run build`
- Guest **and** logged-in: switch sets → progress %, leaderboard, trade board all
  scope correctly and **don't bleed across sets**.
- Existing sprite data untouched (spot-check a known account).
- Deploy: push to `main` **alone** first, then update the preview branch — pushing
  the same commit to both refs at once makes Vercel dedupe to a preview and skip
  the production build.

## Naming

Keep "FN Sprite Tracker" while sprites are the draw; the seams mean a later rename
to a broader "FN Tracker" is a tagline swap, not a migration. See the roadmap for
the full phasing.
