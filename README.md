# driftwood-ops

Internal ops platform for Driftwood Logistics. Handles orders, inventory,
warehouses, and shipment/rate lookups for the 3 fulfillment centers.

Not customer facing. This is what CS and the warehouse leads use.

## Running it

You need postgres running locally. Easiest way is:

```
docker-compose up -d postgres
```

Then from `apps/api`:

```
npm install
npm run migrate
npm run dev
```

Server comes up on port 4000 (check `.env`).

The rate engine is a separate service (Rust, see `services/rate-engine`).
Jake set it up, ask him if the retry logic looks weird to you. API expects
it on port 8080 by default, see `RATE_ENGINE_URL`.

There's also a couple python scripts under `scripts/` for the nightly
inventory reconciliation and the legacy CSV importer we used during the
Fulfillco migration. Those still run out of cron on the ops box, they're
not part of the deploy.

## Env vars

Copy `.env.example` to `.env`. Most of it is self explanatory. The carrier
API key isn't in there for obvious reasons, ask in #eng if you need it for
local dev, or check the onboarding doc in Notion.

## Docs

Most of the "how this actually works" stuff lives in Notion, not here.
Some of it got exported into `docs/` at some point but I wouldn't trust
all of it, especially the rate engine doc, that's from before the zone
table rewrite.

Linear tickets referenced in commit messages are in `docs/linear-export`
for a few of the gnarlier ones, in case the ticket itself gets archived.

## Portal app

The customer-facing app (`parsity-agentic-engineering` repo) calls this
service's `/portal/*` routes for order/shipment data. Separate repo,
separate database, auth'd with a shared key (`PORTAL_API_KEY` here,
`OPS_PORTAL_API_KEY` over there - yes they should probably be named the
same thing). See `ARCHITECTURE.md`.

## Status

Mostly stable. Known issues are tracked in Linear, project "OPS". The
inventory oversell thing (ENG-142) is still open, don't remove the
manual recount step in the warehouse until that's fixed.

Open work items are in `docs/exercises/` for now instead of Linear since
they haven't been triaged into a sprint yet.
