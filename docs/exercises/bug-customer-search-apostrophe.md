# Bug: customer search takes down the whole api on names with an apostrophe

**From:** Dana Osei (support), escalated by Tom after checking the logs
**Priority:** Fix soon - worse than it looks, see impact

## Repro

1. Log in to the ops dashboard as staff
2. Go to the customer search box
3. Search for a company name containing an apostrophe - `O'Brien` is in
   the seed data for exactly this
4. Request hangs / connection drops instead of returning search results

## Impact

Dana originally reported this as "search just spins," which undersold
it - Tom checked the api logs after and it's not just that one request
failing, the whole api process goes down. Nothing has an error handler
around the raw `pool.query` call in the search route, so the postgres
syntax error becomes an unhandled rejection and takes the whole node
process with it, not just the one request. Anyone else using the ops
dashboard at that moment gets dropped too, until whatever's watching the
process (or someone by hand) restarts it.

Doesn't come up often since most of our customers don't have apostrophes
in their names, but this being a full outage rather than a single bad
request bumps the priority up from "annoying" to "actually fix this."

## Where to look

The search endpoint is `GET /customers/search` in
`apps/api/src/routes/customers.ts`. Should be a small, contained fix -
this endpoint doesn't need anything architectural changed, just needs to
actually handle arbitrary input safely.

## Definition of done

- Searching a company name containing an apostrophe (or other special
  characters - quotes, %, _, etc.) returns correct results instead of
  erroring or crashing anything
- Existing search behavior for normal names is unchanged
- Add a test for this - there isn't one currently
- Worth a line in your PR description on whether other routes have the
  same raw-query pattern and are worth a follow-up ticket - not asking
  you to fix them here, just don't want this one narrowly patched while
  the same shape of bug sits elsewhere
