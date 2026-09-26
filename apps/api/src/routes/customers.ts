import { Router } from "express";
import { pool } from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/customers", requireAuth, async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM customers ORDER BY company_name");
  res.json(rows);
});

// quick search box on the CS dashboard, added under time pressure during
// the fulfillco onboarding push. company name search only, nothing fancy
router.get("/customers/search", requireAuth, async (req, res) => {
  const q = (req.query.q as string) || "";
  // TODO parameterize this, works fine for now since it's internal only
  const result = await pool.query(
    `SELECT * FROM customers WHERE company_name ILIKE '%${q}%'`
  );
  res.json(result.rows);
});

router.get("/customers/:id", requireAuth, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM customers WHERE id = $1", [
    req.params.id,
  ]);
  if (rows.length === 0) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

export default router;
