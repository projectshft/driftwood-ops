import { Router } from "express";
import { pool } from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/shipments", requireAuth, async (req, res) => {
  const { orderId, warehouseId, carrier, serviceLevel, trackingNumber, rateQuotedCents, labelUrl } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO shipments (order_id, warehouse_id, carrier, service_level, tracking_number, rate_quoted_cents, label_url, shipped_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, now())
     RETURNING id`,
    [orderId, warehouseId, carrier, serviceLevel, trackingNumber, rateQuotedCents, labelUrl]
  );

  res.status(201).json({ id: rows[0].id });
});

router.get("/shipments/:orderId", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM shipments WHERE order_id = $1 ORDER BY created_at DESC`,
    [req.params.orderId]
  );
  res.json(rows);
});

export default router;
