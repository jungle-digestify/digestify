import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema, logger: true });

async function reset() {
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error("No table schema found");
  }

  console.log("🗑️  Emptying the entire database");
  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return sql.raw(
      `truncate table "${table.dbName}" restart identity cascade;`,
    );
  });

  console.log("📨 Sending reset queries...");
  for (let query of queries) {
    try {
      const result = await db.execute(query);
      console.log(result);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log(err);
      }
    }
  }

  console.log("✅ Database emptied");
  process.exit();
}

reset().catch((e) => {
  console.error(e);
});
