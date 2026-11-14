# Architecture (rough, written a while ago)

```
apps/api          <- node/express, main service, talks to postgres
apps/portal       <- next.js, customer-facing, own db, calls the api
services/rate-engine  <- rust, quotes shipping rates, called by api over http
scripts/          <- python, runs out of cron on the ops box, not deployed with the rest
db/migrations     <- plain sql, applied by apps/api/scripts/migrate.ts
```

api -> postgres (direct)
api -> rate-engine (http, port 8080)
rate-engine -> carrier sandbox api (http)
apps/portal -> api, `/portal/*` routes only (http, shared key)

Nothing here uses queues or workers currently - email sends and rate
lookups all happen inline in the request. Has come up as something to
change if volume grows, not urgent yet.

Auth is a single JWT scheme for warehouse/ops staff logins. Customers
now have their own login through the separate portal app
(`apps/portal` - it lived in its own repo until recently, some docs
still talk about it that way), which is a fullstack app with its own postgres db
for customer accounts. It doesn't share a database with the api - it
calls the `/portal/*` endpoints here for order/shipment data, auth'd
with a shared header key (see `middleware/portalAuth.ts`). This was the
fast way to ship it, wasn't meant to be permanent. There's no real
service-to-service auth between the two apps beyond that shared secret.

This doc doesn't get updated often, if something here looks wrong
trust the code over this file. Most of the actual "why" for decisions
lives in Notion, not here - see docs/notion-export for a partial mirror
of the more important pages, but that folder isn't kept in sync
automatically, someone has to remember to re-export.
