CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
  carrier VARCHAR(32),
  service_level VARCHAR(32),
  tracking_number VARCHAR(64),
  rate_quoted_cents INTEGER,
  label_url TEXT,
  shipped_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- added for the CS dashboard, see SUP-54
CREATE INDEX idx_shipments_order_id ON shipments(order_id);
