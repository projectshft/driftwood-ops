import { pool } from "../db";

// heads up: this is the thing behind ENG-142 (oversell bug). the check
// and the decrement are two separate queries, so under load two orders
// can both pass the check before either decrements. warehouse does a
// manual recount every morning to catch it. don't remove that step just
// because this looks fine in the code.

export async function checkAvailable(productId: number, warehouseId: number, qty: number): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT qty_on_hand - qty_reserved AS available
     FROM inventory
     WHERE product_id = $1 AND warehouse_id = $2`,
    [productId, warehouseId]
  );
  if (rows.length === 0) return false;
  return rows[0].available >= qty;
}

export async function reserveStock(productId: number, warehouseId: number, qty: number): Promise<void> {
  await pool.query(
    `UPDATE inventory
     SET qty_reserved = qty_reserved + $3
     WHERE product_id = $1 AND warehouse_id = $2`,
    [productId, warehouseId, qty]
  );
}

export async function releaseStock(productId: number, warehouseId: number, qty: number): Promise<void> {
  await pool.query(
    `UPDATE inventory
     SET qty_reserved = qty_reserved - $3
     WHERE product_id = $1 AND warehouse_id = $2`,
    [productId, warehouseId, qty]
  );
}

export async function getLowStock(warehouseId: number) {
  const { rows } = await pool.query(
    `SELECT i.*, p.name, p.sku
     FROM inventory i
     JOIN products p ON p.id = i.product_id
     WHERE i.warehouse_id = $1 AND i.qty_on_hand <= i.reorder_point`,
    [warehouseId]
  );
  return rows;
}
