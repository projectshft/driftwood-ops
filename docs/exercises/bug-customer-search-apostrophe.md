# Bug: customer search 500s on names with an apostrophe

**From:** Dana Osei (support)
**Priority:** Should fix, minor annoyance for CS but happens weekly

## Repro

1. Log in to the ops dashboard as staff
2. Go to the customer search box
3. Search for a company name containing an apostrophe, e.g. `O'Brien`
   (we don't have one in seed data, but any customer whose name has an
   apostrophe reproduces it - add one if you need to test)
4. Get a 500 error instead of search results

## Impact

Doesn't come up often since most of our customers don't have apostrophes
in their names, but when it does happen support has no way to look the
customer up by name and has to fall back to searching by customer ID or
email, which they often don't have handy on a call.

## Where to look

The search endpoint is `GET /customers/search` in
`apps/api/src/routes/customers.ts`. Should be a small, contained fix -
this endpoint doesn't need anything architectural changed, just needs to
actually handle arbitrary input safely.

## Definition of done

- Searching a company name containing an apostrophe (or other special
  characters - quotes, %, _, etc.) returns correct results instead of
  erroring
- Existing search behavior for normal names is unchanged
- Add a test for this - there isn't one currently
