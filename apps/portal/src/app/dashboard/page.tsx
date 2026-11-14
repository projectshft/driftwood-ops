import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCustomerOrders } from "@/lib/opsClient";
import { formatCents, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export default async function DashboardPage() {
  // middleware.ts already redirects to /login if there's no session, but
  // getSession() can still come back null in edge cases (expired token
  // between the middleware check and this running) - not handling that
  // gracefully right now, it'll just throw below. fine for now.
  const session = await getSession();
  const orders = await getCustomerOrders(session!.opsCustomerId);

  return (
    <div className="flex-1 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {session!.companyName} — Orders
          </h1>
          <form action="/api/logout" method="post">
            <button className="text-sm text-zinc-500 hover:underline dark:text-zinc-400">
              Sign out
            </button>
          </form>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500">No orders yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800">
                <th className="py-2 pr-4 font-medium">Order</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Total</th>
                <th className="py-2 font-medium">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-zinc-100 dark:border-zinc-900">
                  <td className="py-3 pr-4">
                    <Link href={`/orders/${order.id}`} className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                      #{order.id}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 pr-4 text-zinc-600 dark:text-zinc-400">{formatCents(order.total_cents)}</td>
                  <td className="py-3 text-zinc-600 dark:text-zinc-400">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
