import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCustomerOrder } from "@/lib/opsClient";
import { formatCents } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const order = await getCustomerOrder(session!.opsCustomerId, parseInt(id, 10));

  const shipment = order.shipments[0];

  return (
    <div className="flex-1 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard" className="mb-6 inline-block text-sm text-zinc-500 hover:underline dark:text-zinc-400">
          ← Back to orders
        </Link>

        <h1 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Order #{order.id}
        </h1>
        <div className="mb-6">
          <StatusBadge status={order.status} />
        </div>

        <div className="mb-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 text-sm last:border-b-0 dark:border-zinc-900"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {item.sku} · qty {item.qty}
                </p>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                {formatCents(item.qty * item.unit_price_cents)}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 text-sm font-medium">
            <span>Total</span>
            <span>{formatCents(order.total_cents)}</span>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <h2 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Shipping</h2>
          {shipment ? (
            <div className="text-zinc-600 dark:text-zinc-400">
              <p>
                {shipment.carrier} · {shipment.service_level}
              </p>
              <p>Tracking: {shipment.tracking_number || "—"}</p>
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">Not shipped yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
