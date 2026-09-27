# Numbers for the pricing conversation

**From:** Sarah Kim (product)
**Priority:** She has a call about this Thursday

## The ask

Ahead of the plus-tier pricing renewal conversation, Sarah wants a
quick, honest read on the data, not a dashboard - just answers she can
talk from:

1. Order volume and total revenue by customer billing tier
   (standard/plus/enterprise)
2. Average order value by tier
3. How many SKUs are currently at or below their reorder point, broken
   down by warehouse

## What she actually wants

A short written summary with the numbers and how you got them (a query
is fine to paste), not a report. If something in the data looks off or
surprising while you're in there, mention it - she'd rather hear "hey,
this number looks weird" than have it come up on the call.

## Where to look

Everything needed is in the postgres schema - `orders`, `order_items`,
`customers`, `inventory`, `products`. Use `psql` directly, a script,
whatever's fastest. This is a one-off, not something that needs to live
in the codebase afterward - though if you think it's worth turning into
something repeatable, say so.
