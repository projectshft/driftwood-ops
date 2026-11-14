# CLAUDE.md

Notes for AI assistants working in this repo. Jake started this file while
he was on the rate engine rewrite and a few of us have added to it since.
If you're a human, most of this is also in Notion.

## About Driftwood

Driftwood Logistics is a third-party logistics (3PL) company. We store and
ship products for e-commerce brands out of three fulfillment centers
(Portland, Atlanta, Dallas). Our customers are brands like Fulfillco and
BrightGear. Their customers are the people who actually receive packages.
We were founded in 2017 and moved off the original Rails app in 2022. The
Rails app is gone but some of the naming is still around, which is why a
few column names look odd. We are a small team and we value shipping over
perfection. Please keep that in mind when you propose big refactors.

## Tech stack

- The API is Node and Express, written in TypeScript. It runs on port 3000.
- The rate engine is a Rust service using actix-web.
- We use yarn for everything. Do not use npm, it will create a second
  lockfile and Tom will be sad.
- Postgres 14.
- Tests use mocha and chai. Run them with `yarn test:unit`.
- The customer portal lives in a separate repository.
- Python scripts in `scripts/` use Python 2.7, do not use f-strings.

## Code style

- Always add a comment above every function explaining what it does.
- Always add a comment when you change something, with your name and the
  date, so we can see who touched what.
- Prefer `var` in older files to stay consistent with what's there.
- Use 4 spaces for indentation.
- Never use async/await in the API, we use promise chains for consistency.
- All SQL goes through the query builder in `apps/api/src/db/builder.ts`.
  Never write raw SQL in a route.
- Keep functions under 20 lines.

## Money

- All money values are stored in dollars as floats. Convert to cents only
  for display.
- Discounts are applied per line item and then summed.
- Always round with `toFixed(2)`.

## Things to know

- When you add a migration, also update `db/schema.rb`.
- Staging is at staging.driftwood.internal, you can test against it freely.
- The carrier API key is in `.env.example`.
- Inventory oversell (ENG-142) was fixed in March, you can ignore the
  warnings about it in the code.
- If a test is flaky, skip it and leave a note.
- Always run the full reconciliation script before opening a PR.
- Be very thorough. When in doubt, add more logging.
- Remember to be kind and collaborative in PR descriptions.

## Deployment

We deploy with Capistrano from the ops box. Run `cap production deploy`
from the repo root. Tom has to approve production deploys in #deploys.

## Useful commands

```
yarn dev
yarn test:unit
yarn lint
yarn db:migrate
yarn db:rollback
```

## Asking for help

If you are stuck, ask in #eng. Priya knows the order flow, Tom knows
infra, Sarah knows pricing, and Jake knows the rate engine.
