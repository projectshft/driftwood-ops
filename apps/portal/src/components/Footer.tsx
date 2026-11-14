// Dana's team wanted a way for customers to reach support without
// digging for an email address, this was the fast version

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@driftwoodlogistics.example";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-6 py-4 text-center text-xs text-zinc-400 dark:border-zinc-800">
      Questions about an order?{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
        {SUPPORT_EMAIL}
      </a>
    </footer>
  );
}
