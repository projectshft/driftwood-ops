import { Router } from "express";
import { pool } from "../db";
import { requireAuth } from "../middleware/auth";
import { getLowStock } from "../services/inventoryService";

const router = Router();

router.get("/inventory/:warehouseId", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT i.*, p.name, p.sku FROM inventory i
     JOIN products p ON p.id = i.product_id
     WHERE i.warehouse_id = $1`,
    [req.params.warehouseId]
  );
  res.json(rows);
});

router.get("/inventory/:warehouseId/low-stock", requireAuth, async (req, res) => {
  const rows = await getLowStock(parseInt(req.params.warehouseId, 10));
  res.json(rows);
});

// manual recount adjustment, used by warehouse leads every morning to
// true up qty_on_hand. see ENG-142, don't take this out
router.post("/inventory/:productId/:warehouseId/adjust", requireAuth, async (req, res) => {
  const { productId, warehouseId } = req.params;
  const { newQty } = req.body;

  await pool.query(
    `UPDATE inventory SET qty_on_hand = $1 WHERE product_id = $2 AND warehouse_id = $3`,
    [newQty, productId, warehouseId]
  );

  res.json({ ok: true });
});

export default router;
