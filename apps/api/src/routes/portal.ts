import { Router } from "express";
import { pool } from "../db";
import { requirePortalKey } from "../middleware/portalAuth";

const router = Router();

// everything under here is for the customer portal app to call, not for
// warehouse/staff use. see requirePortalKey for the (temporary, allegedly)
// auth story.

router.get("/portal/customers/:customerId/orders", requirePortalKey, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, status, total_cents, created_at
     FROM orders
     WHERE customer_id = $1
     ORDER BY created_at DESC`,
    [req.params.customerId]
  );
  res.json(rows);
});

router.get("/portal/customers/:customerId/orders/:orderId", requirePortalKey, async (req, res) => {
  const { customerId, orderId } = req.params;

  const { rows: orderRows } = await pool.query(
    `SELECT * FROM orders WHERE id = $1 AND customer_id = $2`,
    [orderId, customerId]
  );
  if (orderRows.length === 0) {
    return res.status(404).json({ error: "not found" });
  }

  const { rows: items } = await pool.query(
    `SELECT oi.*, p.sku, p.name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  const { rows: shipments } = await pool.query(
    `SELECT carrier, service_level, tracking_number, shipped_at
     FROM shipments
     WHERE order_id = $1
     ORDER BY created_at DESC`,
    [orderId]
  );

  res.json({ ...orderRows[0], items, shipments });
});

export default router;
