import { db } from "@/db";
import { eq } from "drizzle-orm";
import { accounts as accountTable } from "@/db/schema";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.query.accounts.findFirst({
      where: eq(accountTable.userId, userId),
    });

    return account;
  } catch {
    return null;
  }
};
