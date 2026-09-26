# Shipping Rate Engine - How It Works

> exported from Notion, "Engineering" workspace > Architecture
> last edited by Jake (contractor), before he left - **this is old, see
> note from Priya at the bottom**

The rate engine quotes shipping cost using a flat rate band system:

- Band A (same region): $3.00 base
- Band B (adjacent region): $4.50 base
- Band C (cross-country): $6.50 base

Plus $0.10/oz over the first 8oz, flat across all bands.

We call the carrier sandbox for ETA only, our own bands handle pricing
entirely. Carrier API base URL and the sandbox key are in the `.env` on
the rate-engine box, check with Jake if you need a fresh one issued.

---

**Priya, June:** this doc is out of date, we redid the whole thing as a
zone table (1-8 per warehouse) with per-zone base + per-oz rates instead
of the band system, and the carrier quote now feeds directly into the
final price instead of just ETA. Whoever updates this doc next, the
actual source of truth is `services/rate-engine/src/rates.rs`, not this
page. Leaving the original text above for history but do not build
anything off it.

Also "check with Jake" doesn't work anymore, he's gone. The real carrier
API key situation: it lives in the shared 1Password vault now under
"driftwood carrier sandbox", ask Tom for vault access if you don't have
it.
