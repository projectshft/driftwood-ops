import { pool } from "../db";
import { checkAvailable, reserveStock } from "./inventoryService";
import { getCheapestRate } from "./rateClient";
import { sendOrderConfirmation } from "./emailService";
import { lineTotal, applyDiscount } from "../utils/money";

// this file does too much, everyone knows it. it grew out of the
// original "just get orders working" PR and nobody's had time to split
// it up. be careful touching createOrder, a lot depends on the order
// steps happening in this order (heh).

interface CreateOrderItem {
  productId: number;
  qty: number;
  unitPriceCents: number;
}

export async function createOrder(customerId: number, warehouseId: number, items: CreateOrderItem[]) {
  // check stock for every item first
  for (const item of items) {
    const ok = await checkAvailable(item.productId, warehouseId, item.qty);
    if (!ok) {
      throw new Error(`insufficient stock for product ${item.productId}`);
    }
  }

  const orderResult = await pool.query(
    `INSERT INTO orders (customer_id, status) VALUES ($1, 'pending') RETURNING id`,
    [customerId]
  );
  const orderId = orderResult.rows[0].id;

  let total = 0;
  for (const item of items) {
    await pool.query(
      `INSERT INTO order_items (order_id, product_id, qty, unit_price_cents) VALUES ($1, $2, $3, $4)`,
      [orderId, item.productId, item.qty, item.unitPriceCents]
    );
    // reserve stock one at a time - not wrapped in the same transaction
    // as the order insert, so if this throws halfway through you get an
    // order with partial reservations. hasn't bitten us yet.
    await reserveStock(item.productId, warehouseId, item.qty);
    total += lineTotal(item.qty, item.unitPriceCents);
  }

  const customer = await getCustomerBillingInfo(customerId);
  if (customer.billing_tier === "enterprise") {
    total = applyDiscount(total, 0.1);
  } else if (customer.billing_tier === "plus") {
    total = applyDiscount(total, 0.05);
  }

  await pool.query(`UPDATE orders SET total_cents = $1 WHERE id = $2`, [
    Math.round(total),
    orderId,
  ]);

  // fire off the confirmation email inline - yes this means order
  // creation is as slow as sendgrid is that day. someone filed a ticket
  // about moving this to a queue, low priority
  try {
    await sendOrderConfirmation(customer.email, orderId);
  } catch (err) {
    console.error("failed to send confirmation email", err);
  }

  return { orderId, total: Math.round(total) };
}

async function getCustomerBillingInfo(customerId: number) {
  const { rows } = await pool.query(`SELECT * FROM customers WHERE id = $1`, [
    customerId,
  ]);
  return rows[0];
}

// used on the ops dashboard order list. n+1's against order_items on
// purpose-ish, dashboard only ever shows ~20 orders per page so it's
// never been worth batching
export async function listOrdersWithItems(warehouseId: number, limit: number, offset: number) {
  const { rows: orders } = await pool.query(
    `SELECT o.* FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     GROUP BY o.id
     ORDER BY o.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  for (const order of orders as any[]) {
    const { rows: items } = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order.id]
    );
    order.items = items;
  }

  return orders;
}

export async function quoteShippingForOrder(orderId: number, warehouseCode: string, destZip: string) {
  const { rows } = await pool.query(
    `SELECT p.weight_oz, oi.qty
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  const totalWeight = rows.reduce((sum: number, r: any) => sum + r.weight_oz * r.qty, 0);

  return getCheapestRate({
    originWarehouseCode: warehouseCode,
    destZip,
    weightOz: totalWeight,
  });
}
