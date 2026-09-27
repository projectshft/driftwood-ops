INSERT INTO warehouses (code, name, timezone) VALUES
  ('PDX1', 'Portland', 'America/Los_Angeles'),
  ('ATL2', 'Atlanta', 'America/New_York'),
  ('DFW1', 'Dallas', 'America/Chicago');

INSERT INTO customers (company_name, email, billing_tier) VALUES
  ('Fulfillco', 'ops@fulfillco.example', 'enterprise'),
  ('BrightGear', 'hello@brightgear.example', 'plus'),
  ('Nimbus Snacks', 'orders@nimbussnacks.example', 'standard'),
  ('O''Brien Retail', 'ops@obrienretail.example', 'standard');

INSERT INTO products (customer_id, sku, name, weight_oz) VALUES
  (1, 'FC-1001', 'Insulated Tumbler', 14.5),
  (1, 'FC-1002', 'Travel Mug', 9.0),
  (2, 'BG-200', 'Trail Backpack', 42.0),
  (3, 'NS-050', 'Trail Mix 12pk', 96.0);

INSERT INTO inventory (product_id, warehouse_id, qty_on_hand, qty_reserved, reorder_point) VALUES
  (1, 1, 120, 0, 20),
  (2, 1, 80, 0, 15),
  (3, 2, 8, 0, 10),
  (4, 3, 200, 0, 40);
