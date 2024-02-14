import dotenv from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });
console.log(process.env.DATABASE_URL);

const db = drizzle(postgres(process.env.DATABASE_URL!), { schema });

async function main() {
  console.log("migration started");
  await migrate(db, { migrationsFolder: "drizzle" });
  process.exit(0);
}

main().catch((error) => console.log(error));
// esm, commonjs 두개 있는데
// 아직도 commonjs로 쓰는게 편함.
// top level await 불가능...
