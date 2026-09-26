# Feature request: show estimated delivery date on order tracking

**From:** Sarah Kim (product)
**Priority:** Moderate, came up a few times in customer feedback since
the portal launched

## The ask

Customers using the portal can see their order status and, once shipped,
the carrier + tracking number. Support keeps hearing "ok but when will it
actually arrive" - we have this info (the rate engine returns an ETA in
days when we quote shipping) but we never persist or show it anywhere
customer-facing.

Want the order detail page in the portal to show something like
"Estimated delivery: Nov 18" once the order has shipped.

## What's involved

This isn't stored anywhere right now - `quoteShippingForOrder` in the api
gets an `etaDays` back from the rate engine at quote time, but nothing
saves it. By the time an order actually ships, we've long since thrown
that number away.

You'll need to figure out where in the flow to capture and persist the
ETA (quote time vs ship time - they're different steps, look at how
`orders`, `shipments`, and the rate engine fit together), get it exposed
through the portal API, and surface it on the order detail page.

Whether "estimated delivery" should be computed from `shipped_at + eta`
or from whenever the quote was originally taken is a real product
question - use your judgement, but write down which you picked and why
somewhere reviewable (PR description is fine).

## Out of scope

- Don't need to handle re-quoting if a shipment gets delayed after the
  fact, that's a different problem
- No need to email customers about it, just show it in the portal for now
