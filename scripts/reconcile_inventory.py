#!/usr/bin/env python3
#
# runs nightly via cron on the ops box (10pm PT, after the warehouses
# close). Compares qty_on_hand against the picks logged that day and
# flags anything that doesn't match. Emails Dana's team if there's
# drift over 5 units on anything.
#
# ask Tom if this stops running, he set up the cron job and I don't
# think anyone else has touched crontab on that box

import os
import sys
import psycopg2

# falls back to the old creds if DATABASE_URL isn't set, this box has
# had the same postgres user since before we moved to env vars for
# everything else
DB_URL = os.environ.get("DATABASE_URL", "postgres://driftwood:driftwood@localhost:5432/driftwood")

DRIFT_THRESHOLD = 5


def get_connection():
    return psycopg2.connect(DB_URL)


def find_drift(conn):
    cur = conn.cursor()
    cur.execute(
        """
        SELECT i.id, p.sku, p.name, i.qty_on_hand, i.qty_reserved, w.code
        FROM inventory i
        JOIN products p ON p.id = i.product_id
        JOIN warehouses w ON w.id = i.warehouse_id
        """
    )
    rows = cur.fetchall()

    flagged = []
    for row in rows:
        inv_id, sku, name, qty_on_hand, qty_reserved, warehouse_code = row
        # this is supposed to compare against a picks log table that
        # never got built, so it just checks for negative available
        # stock for now. not the same thing as real reconciliation but
        # it's caught a couple things
        available = qty_on_hand - qty_reserved
        if available < 0:
            flagged.append((sku, name, warehouse_code, available))

    return flagged


def main():
    conn = get_connection()
    flagged = find_drift(conn)

    if not flagged:
        print("no drift found")
        return

    print(f"found {len(flagged)} items with negative available stock:")
    for sku, name, warehouse_code, available in flagged:
        print(f"  {warehouse_code} {sku} ({name}): {available}")

    # TODO actually send this to Dana's team instead of just printing it,
    # this was supposed to be temporary when the script was first written


if __name__ == "__main__":
    main()
