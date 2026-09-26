import { Router } from "express";
import { pool } from "../db";
import { requireAuth } from "../middleware/auth";
import { createOrder, listOrdersWithItems, quoteShippingForOrder } from "../services/orderService";
import { sendShipmentNotice } from "../services/emailService";

const router = Router();

router.get("/orders", requireAuth, async (req, res) => {
  const warehouseId = parseInt((req.query.warehouseId as string) || "1", 10);
  const page = parseInt((req.query.page as string) || "1", 10);
  const pageSize = 20;
  const orders = await listOrdersWithItems(warehouseId, pageSize, (page - 1) * pageSize);
  res.json(orders);
});

router.post("/orders", requireAuth, async (req, res) => {
  const { customerId, warehouseId, items } = req.body;
  try {
    const result = await createOrder(customerId, warehouseId, items);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/orders/:id/quote", requireAuth, async (req, res) => {
  const { warehouseCode, destZip } = req.query;
  const quote = await quoteShippingForOrder(
    parseInt(req.params.id, 10),
    warehouseCode as string,
    destZip as string
  );
  res.json(quote);
});

// marks an order shipped and kicks off the notification email. this
// used to also create the shipment row but that moved to a separate
// endpoint when the label printing flow got added, so now you have to
// call both in the right order or the CS dashboard shows shipped with
// no tracking info (see SUP-54)
router.post("/orders/:id/ship", requireAuth, async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  await pool.query(`UPDATE orders SET status = 'shipped' WHERE id = $1`, [orderId]);

  const { rows } = await pool.query(
    `SELECT c.email FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.id = $1`,
    [orderId]
  );

  const { tracking } = req.body;
  await sendShipmentNotice(rows[0].email, orderId, tracking);

  res.json({ ok: true });
});

export default router;
