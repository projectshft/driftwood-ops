# rate-engine

Jake wrote this before he left (contractor, was here ~5 months). It quotes
shipping rates by calling the carrier sandbox API and applying our zone
markup on top.

There isn't a design doc beyond what's in Notion, and that doc is already
out of date against the zone table rewrite in `rates.rs`. If you're trying
to understand the actual zone logic, read the code, not the doc.

## Running

```
cargo run
```

Needs `CARRIER_API_BASE` and `CARRIER_API_KEY` set. Ask in #eng for the
sandbox key, it's not the same as the production one (obviously don't
use the production one for local dev).

## Known issues

- Retries more than it should, see `carrier_client.rs`. This has caused
  us to get rate limited by the carrier sandbox before during load
  testing. Nobody's fixed it because it "mostly works."
- Panics if the carrier response doesn't have the shape we expect
  instead of returning an error. Has taken the whole service down at
  least once when the sandbox API had a bad day.
