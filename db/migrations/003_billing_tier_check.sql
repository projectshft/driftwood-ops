-- quick fix after the enterprise pricing rollout, see ENG-118 comments
ALTER TABLE customers
  ADD CONSTRAINT billing_tier_check
  CHECK (billing_tier IN ('standard', 'plus', 'enterprise'));
