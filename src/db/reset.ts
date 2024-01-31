import { drizzle } from "drizzle-orm/better-sqlite3";
import * as dotenv from "dotenv";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import Database from "better-sqlite3";
dotenv.config({ path: "./.env.local" });

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema, logger: true });

//reset.ts
async function reset() {
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error("No table schema found");
  }

  console.log("🗑️  Emptying the entire database");
  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return sql.raw(`DELETE FROM ${table.dbName};`);
  });

  console.log("📨 Sending delete queries...");
  try {
    await Promise.allSettled(
      queries.map(async (query) => {
        if (query) await db.run(query);
      })
    );
  } catch (err) {
    console.log(err);
  }
  console.log("✅ Database emptied");
}

reset().catch((e) => {
  console.error(e);
});
