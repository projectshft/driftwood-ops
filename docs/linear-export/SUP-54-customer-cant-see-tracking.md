# SUP-54: Customer says order shows "shipped" but no tracking number

**Status:** Open
**Assignee:** unassigned
**Reported by:** Dana Osei
**Priority:** Low

## Description

Recurring low-volume complaint from customers: order status shows
"shipped" but there's no tracking number anywhere on their end.

## What Dana's team has figured out

Happens when whoever's fulfilling the order calls the "mark as shipped"
action before creating the shipment record with the tracking number,
instead of after. Both are separate API calls now (used to be one step
before the label printing flow got built), and nothing stops you from
doing them out of order or skipping the shipment creation entirely.

Dana's workaround for now: when this comes up, support looks up the
order in the warehouse system directly to get the actual tracking
number and emails it to the customer manually.

## Ask

Would be good to either:
- combine these back into one call, or
- have the "mark as shipped" endpoint require a tracking number / reject
  if there's no shipment record yet

Not urgent, low volume, but it's been open a while and the workaround is
manual for support every time.
