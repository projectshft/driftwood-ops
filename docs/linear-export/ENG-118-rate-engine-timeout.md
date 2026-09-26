# ENG-118: Rate engine timeouts during business hours

**Status:** Open
**Assignee:** unassigned (Jake was on this, ticket needs a new owner)
**Reported by:** Tom Vasquez
**Priority:** Medium

## Description

Rate engine requests to the carrier sandbox intermittently time out
between roughly 9am-5pm ET, coinciding with when the carrier sandbox
seems to be under the most load from everyone testing against it (it's
shared across all of the carrier's integration partners, not just us).

The api service's `getCheapestRate` call has a 3s timeout, and quite a
few requests to `rate-engine` are taking longer than that during peak
hours because of how much time gets burned in retries when the sandbox
is slow to respond.

## Notes from Tom

I looked at `carrier_client.rs` and the retry loop is pretty aggressive
- it'll retry up to 5 times with only 200ms between attempts, and it
retries on ANY non-success response including stuff that's never going
to succeed on retry (like a 400). Combined with the sandbox already
being slow during peak hours, this is probably making the timeout
problem worse, not better.

Also raised this with Jake before he wrapped up, he agreed it was
overly aggressive but didn't get to changing it before his contract
ended.

## Related

This is separate from the pricing double-counting quirk Sarah flagged
(zone base rate + carrier rate both getting charged) - that's a
pricing/business question, this ticket is purely about the timeout
behavior.
