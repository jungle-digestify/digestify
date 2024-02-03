import { db } from "@/db";
import { eq } from "drizzle-orm";
import { twoFactorTokens as twoFactorTokenTable } from "@/db/schema";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokenTable.token, token),
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokenTable.email, email),
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
