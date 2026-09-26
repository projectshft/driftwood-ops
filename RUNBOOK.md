# Runbook: rate-engine

Rough notes, mostly written by Tom after the last couple incidents.

## Service is down / not responding

Check if it's actually crashed vs just slow. It panics (see known issues
in `services/rate-engine/README.md`) rather than returning errors in a
couple of cases, so "down" often means it hit one of those and the
process died. Restart it, then go look at what request triggered it if
you can find it in the logs.

## Rate quotes are slow / timing out

Probably the carrier sandbox being slow, especially during business
hours (see ENG-118). Check if `carrier_client.rs`'s retry loop is
hammering it - if the sandbox is returning errors, we retry 5x with
barely any delay, which doesn't help and might be making it worse.

Not something you can fix by restarting anything, this is a code issue
that hasn't been prioritized yet.

## Carrier sandbox key rotated / expired

Someone on the carrier's side rotates these occasionally without much
notice. New key goes in the shared 1Password vault ("driftwood carrier
sandbox"), then update `CARRIER_API_KEY` wherever the service is
running and restart it. Ask Tom if you don't have vault access.

## "the numbers look wrong"

Check whether it's a zone/base-rate question (business logic, ask
Sarah) or an actual bug. The zone table in `rates.rs` is the source of
truth, not the old Notion doc.
