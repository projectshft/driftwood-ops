// loads everything in db/seeds in filename order. only meant for a fresh
// local database - running it twice will fail on the duplicate rows.

import fs from "fs";
import path from "path";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const dir = path.join(__dirname, "../../../db/seeds");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    console.log("seeding", file);
    await pool.query(fs.readFileSync(path.join(dir, file), "utf8"));
  }

  console.log("done");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
