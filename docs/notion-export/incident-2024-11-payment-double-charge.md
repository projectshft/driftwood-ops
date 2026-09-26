# Incident: Enterprise customers double charged on discount rollout

> exported from Notion, "Engineering" workspace > Incidents
> Nov 14, 2024. Written by Priya. Reviewed by Sarah.

## Summary

After the enterprise pricing rollout (ENG-118), a handful of Fulfillco
orders showed totals higher than expected instead of getting the 10%
enterprise discount applied. Caught by Dana's team when a customer
complained.

## Timeline

- **Nov 12** - enterprise billing tier + discount logic shipped
- **Nov 13, ~4pm** - Dana flags a ticket (SUP-51, since closed) that a
  Fulfillco order total looked wrong
- **Nov 13, ~6pm** - Marcus looks into it, can't reproduce locally,
  pushes a hotfix anyway that he believed fixed a rounding issue in the
  discount math, marks it resolved
- **Nov 14** - happens again on a different order. Marcus had already
  left for a new job by this point so Priya picked it up.

## Root cause

Turned out to be two separate things:

1. The discount is applied to a running total built from floating point
   line-item math before being rounded once at the very end. For most
   orders this rounds fine, but for specific combinations of quantity
   and unit price the intermediate float math accumulates enough error
   that the final rounded total is off by a cent or two.
2. Marcus's hotfix from Nov 13 didn't actually touch the rounding, he
   fixed a different (real but unrelated) bug in how the discount
   percentage was being read from the customer record. That was a
   legitimate fix, it just wasn't THE fix, which is why it looked
   resolved for a day and then wasn't.

## What we did

Nothing, actually - this got deprioritized after the initial hotfix
because it seemed fixed, and the ticket got closed. Writing this
postmortem now because it came up again in a different form. The
underlying float rounding issue is probably still there.

## Follow ups (not done)

- [ ] Someone should look at `applyDiscount` / the money utils and make
      sure discounting happens on integer cents throughout, not floats
- [ ] Add a test that actually exercises the discount math with a range
      of quantities/prices instead of the one skipped test that's
      apparently been skipped since before this incident
