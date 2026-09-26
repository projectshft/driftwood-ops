# Investigation: order totals occasionally off by a cent or two

**From:** Dana Osei (support), escalated from a BrightGear complaint
**Priority:** Low volume but recurring, worth understanding

## What's being reported

Someone on BrightGear's ops team emailed asking why an order total in
the portal ($214.19) didn't exactly match what they calculated
themselves from the per-line price times quantity, minus their 5%
plus-tier discount ($214.18 by their math). Dana checked a handful of
their other recent orders and found it happens on maybe 1 in 10, always
off by a cent or two in the same direction.

It's small enough that customers mostly don't notice or don't bother
complaining, but Dana's worried it'll come up more as order volume
grows, and wants to know: is this a bug, or is it just how the math
works out and we should be able to explain it if asked?

## What we know so far

- Only reported by BrightGear (plus tier, 5% discount) so far, but
  nobody's checked whether standard-tier orders (no discount) or
  enterprise-tier orders (10% discount) show the same pattern
- Not consistent - most of BrightGear's orders are fine, only some are
  off, and only by 1-2 cents when it happens
- Dana doesn't have engineering context on how order totals get
  calculated, just knows the symptom

## What's being asked

This is explicitly an investigation, not a "go fix X" ticket - we don't
know yet whether there's actually a bug. Figure out:

1. Where in the code order totals actually get computed, end to end
2. Whether discount tier (standard/plus/enterprise) correlates with
   whether this happens, and if so, why
3. Whether the discrepancy is a genuine bug or just a rounding
   convention mismatch between how we calculate and how a customer
   would naturally calculate it by hand
4. How confident you are in the explanation, and whether it could be
   affecting other customers without anyone noticing

Write up what you find - root cause, your confidence level, and roughly
how many orders/how much money this could touch - before anyone signs
off on a fix. If a fix is small and obvious once you understand the
cause, feel free to include it, but the write-up is the actual
deliverable here.
