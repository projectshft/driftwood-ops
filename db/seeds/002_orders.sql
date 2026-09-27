-- a handful of orders across tiers so there's something to look at.
-- totals are computed the same way orderService.createOrder does
-- (sum line totals, apply tier discount once, round once) - that's
-- worth knowing if you're ever trying to recreate these by hand.

INSERT INTO orders (id, customer_id, status, total_cents, created_at) VALUES
  (1, 1, 'shipped', 5040, now() - interval '9 days'),
  (2, 1, 'pending', 1305, now() - interval '1 days'),
  (3, 2, 'shipped', 2755, now() - interval '6 days'),
  (4, 2, 'picking', 5510, now() - interval '2 days'),
  (5, 3, 'shipped', 9000, now() - interval '10 days'),
  (6, 3, 'pending', 18000, now() - interval '3 days');

SELECT setval('orders_id_seq', (SELECT max(id) FROM orders));

INSERT INTO order_items (order_id, product_id, qty, unit_price_cents) VALUES
  (1, 1, 2, 1450),
  (1, 2, 3, 900),
  (2, 1, 1, 1450),
  (3, 3, 2, 1450),
  (4, 3, 4, 1450),
  (5, 4, 5, 1800),
  (6, 4, 10, 1800);

INSERT INTO shipments (order_id, warehouse_id, carrier, service_level, tracking_number, shipped_at) VALUES
  (1, 1, 'UPS', 'Ground', '1Z999AA10123456784', now() - interval '8 days'),
  (3, 1, 'FedEx', 'Home Delivery', '789123456789', now() - interval '5 days'),
  (5, 2, 'USPS', 'Priority', '9400111899561234567890', now() - interval '9 days');
