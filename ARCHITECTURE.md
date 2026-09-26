# Architecture (rough, written a while ago)

```
apps/api          <- node/express, main service, talks to postgres
services/rate-engine  <- rust, quotes shipping rates, called by api over http
scripts/          <- python, runs out of cron on the ops box, not deployed with the rest
db/migrations     <- plain sql, applied by apps/api/scripts/migrate.ts
```

api -> postgres (direct)
api -> rate-engine (http, port 8080)
rate-engine -> carrier sandbox api (http)

Nothing here uses queues or workers currently - email sends and rate
lookups all happen inline in the request. Has come up as something to
change if volume grows, not urgent yet.

Auth is a single JWT scheme for warehouse/ops staff logins. There isn't
a customer-facing login at all right now, customers interact through
Dana's team, not directly.

This doc doesn't get updated often, if something here looks wrong
trust the code over this file. Most of the actual "why" for decisions
lives in Notion, not here - see docs/notion-export for a partial mirror
of the more important pages, but that folder isn't kept in sync
automatically, someone has to remember to re-export.
