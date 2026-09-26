#!/usr/bin/env python3
#
# one-off-turned-permanent script from the Fulfillco migration (they
# used to run their own warehouse software and exported CSVs weekly for
# a while during the transition). Marcus wrote this, he's not around
# anymore to ask about the column mapping below - if a new customer
# ever needs a bulk import again, start here but double check the
# column order, it's very much tied to Fulfillco's specific export format
#
# usage: python import_legacy_csv.py path/to/export.csv <customer_id>

import csv
import sys
import psycopg2
import os

DB_URL = os.environ.get("DATABASE_URL")


def main():
    if len(sys.argv) < 3:
        print("usage: import_legacy_csv.py <csv_path> <customer_id>")
        sys.exit(1)

    csv_path = sys.argv[1]
    customer_id = sys.argv[2]

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    with open(csv_path, newline="") as f:
        reader = csv.reader(f)
        next(reader)  # header row, Fulfillco's export always has this

        count = 0
        for row in reader:
            # column order from Fulfillco's export: sku, name, qty, weight_lbs, warehouse_code
            sku, name, qty, weight_lbs, warehouse_code = row

            weight_oz = float(weight_lbs) * 16

            cur.execute(
                "INSERT INTO products (customer_id, sku, name, weight_oz) VALUES (%s, %s, %s, %s) "
                "ON CONFLICT (customer_id, sku) DO UPDATE SET name = EXCLUDED.name "
                "RETURNING id",
                (customer_id, sku, name, weight_oz),
            )
            product_id = cur.fetchone()[0]

            cur.execute("SELECT id FROM warehouses WHERE code = %s", (warehouse_code,))
            warehouse_row = cur.fetchone()
            warehouse_id = warehouse_row[0]  # blows up if the code doesn't exist, hasn't happened yet

            cur.execute(
                "INSERT INTO inventory (product_id, warehouse_id, qty_on_hand) VALUES (%s, %s, %s) "
                "ON CONFLICT (product_id, warehouse_id) DO UPDATE SET qty_on_hand = EXCLUDED.qty_on_hand",
                (product_id, warehouse_id, int(qty)),
            )

            count += 1

    conn.commit()
    print(f"imported {count} rows")


if __name__ == "__main__":
    main()
