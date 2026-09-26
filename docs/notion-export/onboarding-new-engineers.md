# Onboarding: Engineering

> exported from Notion, "Engineering" workspace > Onboarding
> last edited by Priya Nair

Welcome! A few things to get set up.

## Access

- GitHub: ask Tom to add you to the `projectshft` org
- Postgres (staging): creds are in 1Password under "driftwood staging db"
- Carrier sandbox API key: this one's not in 1Password for historical
  reasons, ask in #eng and someone will paste it to you directly. Sorry,
  yes, we know. It's on the list to fix.
- Sentry: Tom can invite you, project is "driftwood-api"

## Local dev

Follow the README in the repo root. If migrations fail on a fresh
checkout, check your postgres version, we've had issues with 14 vs 15
before.

## Who does what

- **Priya** - backend, owns the api service, most familiar with the
  order/inventory flow
- **Tom** - infra/devops, owns deploys, the cron box, and CI
- **Sarah** - product, has the actual context on billing tiers and
  pricing rules, ask her before changing anything discount related
- **Dana** - runs customer support, files most of the bug tickets you'll
  see in Linear, good source of "here's what actually happens in
  practice" info
- **Jake** - was our contractor for the rate engine rewrite, wrapped up
  his contract in March and isn't reachable anymore. If you're touching
  `rate-engine`, you're mostly on your own for context beyond what's in
  the code and this doc.

## Style stuff

Nothing formal. We don't use a linter config right now (there's an old
eslintrc that's not actually wired into anything, ignore it). Just try to
match what's around you.
