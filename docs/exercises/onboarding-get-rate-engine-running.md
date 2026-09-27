# Onboarding task: get the rate engine running locally

**From:** Priya Nair (this is what she gives every new engineer in week one)

## The ask

Before touching any code, get your whole local environment working end
to end - postgres, the api, and the rate engine. Most of it is
straightforward and in the README. The rate engine is the part people
get stuck on, specifically the carrier sandbox key.

## What "done" looks like

- `cargo run` in `services/rate-engine` starts without panicking
- `curl -X POST localhost:8080/rates` with a plausible body returns a
  200 (an empty `quotes` array is fine and expected - we don't have a
  real carrier sandbox reachable from here, so getting an actual quote
  back isn't the bar. Getting the service to start correctly configured
  and respond without crashing is)
- You can explain, in your own words, where the real carrier api key
  actually lives and why there's more than one document that seems to
  answer that question

## Where to look

There's more than one place that talks about the rate engine and the
carrier api key, and they don't all agree:

- `services/rate-engine/README.md`
- `RUNBOOK.md`
- `docs/notion-export/shipping-rate-engine-notes.md`
- there's also a doc in the shared Google Drive, "Driftwood — Carrier
  Sandbox API Notes" - ask if you don't have access yet

Figure out which one is current, why the others exist, and get your
`.env` set up correctly.
