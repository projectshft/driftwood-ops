// dumb migration runner, just applies every .sql file in db/migrations
// in filename order that hasn't been applied yet. no rollback support,
// never needed it.

import fs from "fs";
import path from "path";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT now()
    )
  `);

  const dir = path.join(__dirname, "../../../db/migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const { rows } = await pool.query(
      "SELECT 1 FROM schema_migrations WHERE filename = $1",
      [file]
    );
    if (rows.length > 0) continue;

    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log("applying", file);
    await pool.query(sql);
    await pool.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [
      file,
    ]);
  }

  console.log("done");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
