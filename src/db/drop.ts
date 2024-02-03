import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema, logger: true });

async function drop() {
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error("No table schema found");
  }

  console.log("🗑️  droping the entire database");
  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing drop query for table: ${table.dbName}`);
    return sql.raw(`DROP TABLE "${table.dbName}" CASCADE;`);
  });

  console.log("📨 Sending drop queries...");
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

  console.log("✅ Database dropped");
  process.exit();
}

drop().catch((e) => {
  console.error(e);
});
