# driftwood-portal

Customer-facing portal for Driftwood Logistics customers - lets them log
in and see their own orders and shipment tracking. Talks to the
`driftwood-ops` api (`apps/api`) for the actual data, doesn't own it.

(This used to be its own repo. It got moved in here, but it's still a
separate app with a separate database and a separate deploy.)

## Running it

Needs postgres. If you already have `driftwood-ops` running locally
against your own postgres, you can reuse that instance, just point
`DATABASE_URL` at a different database name (this app has its own
schema, `prisma/schema.prisma`, separate from the ops db).

```
createdb driftwood_portal   # skip if you used docker compose, it's created for you
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

`OPS_PORTAL_API_KEY` has to match whatever `PORTAL_API_KEY` is set to on
the driftwood-ops api - that api needs to be running too
(`OPS_API_URL`, defaults to `http://localhost:4000`).

The seed script creates one demo login:

```
ops@fulfillco.example / password123
```

mapped to customer id 1 in the ops db's seed data (Fulfillco). If you
re-seed driftwood-ops and the ids come out different, update
`opsCustomerId` in `prisma/seed.ts`.

## What's here vs what's not

This app owns customer *login* (email, password, which ops customer id
it maps to). It does not own orders, inventory, shipments, or pricing -
all of that lives in driftwood-ops and gets fetched live through its
`/portal/*` routes (see `src/lib/opsClient.ts`). There's no local
caching or syncing, every page load hits the ops api directly.

Session is a JWT in an httpOnly cookie. Middleware only checks that the
cookie is present (edge runtime can't use `jsonwebtoken`, see the
comment in `src/middleware.ts`) - actual verification happens
server-side on the page itself via `getSession()`.
