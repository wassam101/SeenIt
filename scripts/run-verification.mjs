// One-off script to run the supabase/tests/0001_init_test.sql verification
// against the local Supabase Postgres instance, since no psql binary is
// available on this machine. Not part of the app runtime.
import { readFileSync } from "node:fs";
import { Client } from "pg";

const DB_URL =
  process.env.LOCAL_DB_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const sqlPath = new URL("../supabase/tests/0001_init_test.sql", import.meta.url);
const sql = readFileSync(sqlPath, "utf8");

const client = new Client({ connectionString: DB_URL });

try {
  await client.connect();
  await client.query(sql);
  console.log("VERIFICATION PASSED: script completed with no raised exceptions.");
} catch (err) {
  console.error("VERIFICATION FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
