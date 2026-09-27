# Get the reconciliation script off Tom's laptop^Wcron box

**From:** Tom Vasquez
**Priority:** Tom's going on vacation and doesn't want to be the single
point of failure for this anymore
**Depends on:** the testing ticket for this script - don't automate
something with no tests

## The problem

`scripts/reconcile_inventory.py` runs every night from a cron job on a
box Tom manages by hand. Nobody else knows how it's configured, there's
no record of whether it ran or what it found beyond whatever's in that
box's shell history, and if that machine dies this just silently stops
happening.

## The ask

Get this running on a schedule somewhere that isn't a machine under
someone's desk, with output that doesn't disappear. GitHub Actions is
fine - we don't have a real staging environment with production data
yet, so don't try to point this at anything real. Wire it up against a
disposable postgres you spin up as part of the workflow (migrate +
seed), so it's at least proving the script runs correctly end to end.
Pointing it at a real environment is a separate, later ticket once we
have one.

## Definition of done

- A scheduled workflow that sets up postgres, runs migrations and
  seeds, runs the reconciliation script, and fails the job if drift is
  found (the script currently always exits 0 regardless of what it
  finds - that needs to change for a CI failure to mean anything)
- Can be triggered manually too, not just on schedule, so it's easy to
  demo
- A short note on what this does NOT solve yet (real data, alerting
  Dana's team, anything beyond "the job goes red")
