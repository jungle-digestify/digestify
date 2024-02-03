import { db } from "@/db";
import { eq } from "drizzle-orm";
import { twoFactorConfirmation as twoFactorConfirmationTable } from "@/db/schema";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation =
      await db.query.twoFactorConfirmation.findFirst({
        where: eq(twoFactorConfirmationTable.userId, userId),
      });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
