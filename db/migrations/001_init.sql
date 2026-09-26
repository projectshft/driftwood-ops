-- initial schema, pulled in from the old rails app's schema.rb by hand
-- (this predates the node rewrite, some column names are legacy)

CREATE TABLE warehouses (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE, -- e.g. 'PDX1', 'ATL2'
  name VARCHAR(255) NOT NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'America/Los_Angeles',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  billing_tier VARCHAR(32) NOT NULL DEFAULT 'standard',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  sku VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  weight_oz NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (customer_id, sku)
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
  qty_on_hand INTEGER NOT NULL DEFAULT 0,
  qty_reserved INTEGER NOT NULL DEFAULT 0,
  UNIQUE (product_id, warehouse_id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status VARCHAR(32) NOT NULL DEFAULT 'pending', -- pending, picking, shipped, cancelled
  total_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  qty INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL
);
