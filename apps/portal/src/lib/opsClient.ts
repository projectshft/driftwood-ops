// talks to driftwood-ops's /portal/* routes. server-side only - the
// portal api key should never end up in a client bundle.

const OPS_API_URL = process.env.OPS_API_URL || "http://localhost:4000";
const OPS_PORTAL_API_KEY = process.env.OPS_PORTAL_API_KEY || "dev-portal-key";

export interface PortalOrder {
  id: number;
  status: string;
  total_cents: number;
  created_at: string;
}

export interface PortalOrderDetail extends PortalOrder {
  items: Array<{ sku: string; name: string; qty: number; unit_price_cents: number }>;
  shipments: Array<{
    carrier: string | null;
    service_level: string | null;
    tracking_number: string | null;
    shipped_at: string | null;
  }>;
}

async function opsFetch(path: string) {
  const res = await fetch(`${OPS_API_URL}${path}`, {
    headers: { "X-Portal-Api-Key": OPS_PORTAL_API_KEY },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`ops api ${path} returned ${res.status}`);
  }
  return res.json();
}

export function getCustomerOrders(customerId: number): Promise<PortalOrder[]> {
  return opsFetch(`/portal/customers/${customerId}/orders`);
}

export function getCustomerOrder(customerId: number, orderId: number): Promise<PortalOrderDetail> {
  return opsFetch(`/portal/customers/${customerId}/orders/${orderId}`);
}
