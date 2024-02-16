import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema, logger: true });

async function rawQuery() {
  console.log("📨 Sending reset queries...");
  const search_word = "개인정보 혹은 신체의 의하여";
  const new_search_word = search_word.replace(/ /g, " | ");
  console.log(new_search_word);
  // without sql<T> type defined
  const res0 = await db.execute(
    sql.raw(`SELECT to_tsquery('config_2_gram_cjk', '${new_search_word}')`),
  );
  console.log("res0: ", res0);

  const res = await db.execute(
    sql.raw(`SELECT *, ts_rank(vec, to_tsquery('config_2_gram_cjk', '${new_search_word}')) AS rank
  FROM posts
  WHERE vec @@ to_tsquery('config_2_gram_cjk', '${new_search_word}')
  ORDER BY rank DESC;`),
  );
  console.log("res: ", res);

  process.exit();
}

rawQuery().catch((e) => {
  console.error(e);
});
