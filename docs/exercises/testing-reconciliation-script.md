# Add test coverage to the inventory reconciliation script

**From:** Tom Vasquez
**Priority:** Blocking - see the follow-up ticket about moving this off
the cron box, don't want to automate something with zero tests

## Context

`scripts/reconcile_inventory.py` runs every night and is the only thing
that catches inventory drift before a customer notices. It has no tests
at all. Before we trust it enough to run somewhere other than Tom's
cron job, it needs coverage.

## What to cover

At minimum, `find_drift`:

- a normal case with no drift (nothing flagged)
- a case where an item has negative available stock (qty_reserved >
  qty_on_hand) - this should get flagged, with the right sku/warehouse/
  amount
- an item exactly at zero available stock - should NOT be flagged
  (confirm this is actually the intended boundary, the current `< 0`
  check suggests it's intentional, but check with whoever owns this if
  you're not sure)

## Where to look

The script talks to postgres directly with `psycopg2` - no existing
test setup, no fixtures, nothing to build on. You'll need to decide how
to test this without hitting a real database for every test run
(mocking the connection/cursor is one option, so is spinning up a real
throwaway postgres for the test suite - your call, explain why in the
PR).

## Definition of done

- Test coverage for the cases above
- Tests run without needing Tom's actual cron box or production data
- Note anywhere the script's behavior surprised you or seems
  questionable - this is legacy code nobody's looked closely at in a
  while
