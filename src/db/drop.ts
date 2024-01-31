import { drizzle } from "drizzle-orm/better-sqlite3";
import * as dotenv from "dotenv";
import { sql } from "drizzle-orm";
import * as schema from "./schema";
import Database from "better-sqlite3";
dotenv.config({ path: "./.env.local" });

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema, logger: true });

async function drop() {
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error("No table schema found");
  }

  console.log("🗑️  droping the entire database");
  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing drop query for table: ${table.dbName}`);
    return sql.raw(`DROP TABLE ${table.dbName};`);
  });

  console.log("📨 Sending drop queries...");
  try {
    await Promise.allSettled(
      queries.map(async (query) => {
        if (query) await db.run(query);
      })
    );
  } catch (err) {
    console.log(err);
  }
  console.log("✅ Database dropped");
}

drop().catch((e) => {
  console.error(e);
});
