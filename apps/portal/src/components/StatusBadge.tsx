// small enough it didn't seem worth its own file at first, but it's used
// in both the dashboard table and the order detail page now so pulling
// it out here

// keys have to match the lowercase status strings driftwood-ops stores
// (see orders.status in db/migrations/001_init.sql over there) - these
// were capitalized originally because that's how they render on screen
// via the old `capitalize` css class, not because that's the actual
// value. every order showed up gray because of that mismatch until
// someone noticed.
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  picking: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  shipped: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400";

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}
