-- for the low stock warnings on the warehouse dashboard
ALTER TABLE inventory ADD COLUMN reorder_point INTEGER NOT NULL DEFAULT 10;
