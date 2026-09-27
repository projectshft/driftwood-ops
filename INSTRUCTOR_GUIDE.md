# Instructor guide — driftwood-ops workshop (6 hours)

Not a script. Use your own words with students — this is the reasoning
behind the exercises and what to watch for, not something to read aloud.

## Why these seven, why this repo

Anthropic's own usage data on how engineers actually use Claude Code
breaks sessions down roughly as: 25% writing new code, 26% fixing bugs,
17% "operating software" (deploying, configuring, running pipelines),
13% data analysis/docs, 5% testing/orchestrating. ([source](https://www.anthropic.com/research/claude-code-expertise))
That's the split this workshop is built around — it's deliberately not
"6 hours of feature-building," because that's not what the job is.

driftwood-ops exists because a clean codebase doesn't teach anything.
The bugs, the stale docs, the missing tests, the person who left — all
seeded on purpose. Don't apologize for the mess when introducing it;
the mess is the point.

## Considered and cut

More was scoped than fits in a day, on purpose (see step 1 of how this
was built). Cut or demoted to optional:

- A second debugging exercise on the inventory oversell race condition
  (ENG-142) — real and good, but concurrency bugs need more runway than
  a 30-45 min slot allows. Good as a take-home or a longer workshop.
- Building the ETA feature end-to-end across all three services (rust +
  node + next) as the *only* feature exercise — kept as the main feature
  exercise but flagged as the one to trim first if the day is running
  long, since it's the most time-elastic.
- A pure "read the incident postmortem and summarize" exercise — cut,
  too passive, doesn't produce a verifiable artifact.

## The seven

Core path (do these, ~4.5–5h with debriefs). Optional/bonus below.

### 1. Onboarding: get the rate engine running (~30 min)
`docs/exercises/onboarding-get-rate-engine-running.md`
**Category:** finding docs / context-gathering
**Teaches:** Claude is good at "ask it like a senior engineer" codebase
questions, but here the answer isn't *in* the codebase — it's split
across a stale Notion export, a README, a RUNBOOK, and a real Google
Doc that contradicts one of them. This is the "explore before you code"
muscle: the task can't be done by jumping straight to editing files.
**Good looks like:** they notice the contradiction, figure out which
source is current and why, don't just grab the first key-shaped string
they find. Success is a running service, not a successful carrier
quote — there's no real carrier sandbox behind this, and part of the
exercise is realizing that and not chasing a dead end.
**Watch for:** students who edit `.env` by guessing instead of reading.
That's the failure mode this exercise is designed to surface.

### 2. Bug: customer search crashes the api (~30–40 min)
`docs/exercises/bug-customer-search-apostrophe.md`
**Category:** debugging
**Teaches:** symptom → repro → root cause → verified fix. This is the
"describe the symptom, don't diagnose it yourself" prompting pattern —
good prompts here read like the ticket, not like "add a try/catch to
line 17."
**Good looks like:** they reproduce it first (don't take the ticket's
word for it), find that it's a full process crash and not just a bad
response, fix with a parameterized query, add a test. Bonus points if
they flag that the same raw-query pattern might exist elsewhere without
scope-creeping into fixing it.
**Watch for:** a patch that only handles apostrophes specifically
instead of the actual class of bug (unescaped input in a raw query).

### 3. Investigation: order totals off by a cent (~45–60 min)
`docs/exercises/investigation-invoice-mismatch.md`
**Category:** debugging / data exploration hybrid
**Teaches:** not every ticket should end in a code change. This one is
explicitly scoped as "investigate and report," which fights the
tendency to jump straight to a diff. Also a real lesson in
verification: the root cause (rounding order, not float bugs) is only
believable with evidence — a couple of concrete before/after numbers,
not a paragraph of theory.
**Good looks like:** a short write-up citing specific order(s) — order
3 in the seed data ($27.55 vs a naive $27.56) is the smoking gun — and
correctly identifies that it only shows up on discounted tiers, and
correctly explains *why* 5% behaves differently than 10% here (not just
"floating point is imprecise," but the specific rounding-order
mismatch: round-once-at-the-end vs round-per-line).
**Watch for:** conflating this with a security bug or "the code is
wrong" when arguably it's a legitimate rounding convention question —
the investigation should surface that judgment call, not paper over it.

### 4. Feature: show delivery ETA on order tracking (~75–90 min)
`docs/exercises/feature-order-eta.md`
**Category:** vague feature request
**Teaches:** the interview-before-you-build pattern. The ticket
deliberately doesn't specify whether ETA should be computed from quote
time or ship time — that's a real product decision the student has to
make and defend, not infer wrong and move on. Also the only exercise
that spans all three pieces (rust rate-engine → node api → next
portal), so it's a real test of navigating an unfamiliar multi-service
change.
**Good looks like:** they ask the ambiguous-scope question explicitly
(to you, playing Sarah, or just state their assumption clearly in the
PR) before implementing, add a migration, and the portal actually shows
something on a real shipped order.
**Watch for:** the "trust-then-verify gap" — an ETA field that's wired
up but never actually verified against a real order in the running
app. Make them click through it.

### 5. Deploy/operate: schedule the reconciliation script in CI (~45 min)
`docs/exercises/deploy-reconciliation-to-ci.md`
**Category:** operating software
**Depends on:** exercise 6 (testing) conceptually — mention the
dependency even if you run them out of order for time
**Teaches:** the "operating software" category is 17% of real usage and
almost never covered in coding exercises. This is intentionally scoped
down (disposable postgres service container, not real infra) so it's
achievable in 45 minutes while still being a real CI concept.
**Good looks like:** a workflow file that actually runs (have them show
you a green run, not just the yaml), and — this is the part people
skip — the script actually exits non-zero on drift. Untested claim of
"it would fail" doesn't count.
**Watch for:** scope creep into "let's also add Slack alerts" — the
ticket explicitly says what's out of scope, good students respect that.

## Optional / if time allows

### 6. Testing: cover the reconciliation script (~30 min)
`docs/exercises/testing-reconciliation-script.md`
**Category:** testing
Good as a warm-up before #5, or a standalone if you're running short on
slots. No existing test infra to build on — that's realistic and the
point. Confirmed while building this: `find_drift` correctly flags
negative available stock and correctly does *not* flag exactly-zero —
that boundary is worth asking students to notice and test explicitly.

### 7. Data exploration: pricing numbers for Sarah (~20–30 min)
`docs/exercises/data-exploration-tier-pricing.md`
**Category:** data exploration
Lowest-stakes exercise, good energizer or wrap-up. No fixed "correct"
query. Grade on whether the answer is actually useful to a
non-engineer (Sarah), not on SQL elegance. The seed data has a real
low-stock warehouse (ATL2) and real tier variance built in, so the
numbers aren't trivial/uniform.

## Facilitation notes (general)

- Push students toward Claude Code's plan mode for #4 and the
  investigation in #3 — anything where jumping straight to code risks
  solving the wrong problem. For the bug fix and docs-hunt exercises,
  planning overhead usually isn't worth it — small, clear scope.
- The recurring theme across all seven: **give the agent something it
  can verify against** (a test, a repro script, a running app you
  click through, a CI run going green). Call this out explicitly after
  the first exercise or two once students have felt the difference
  between "looks done" and "verified done."
- Watch for the failure loop: same correction given twice on one
  problem with no progress. Coach students to stop, clear/reset
  context, and re-prompt with what they learned, rather than
  compounding corrections.
- Fictional staff (Priya, Tom, Sarah, Dana, Jake-who-left) recur across
  tickets on purpose — treat questions like "what does Priya mean by
  X" as a chance to make students go find the answer in the docs
  themselves rather than answering for them.
