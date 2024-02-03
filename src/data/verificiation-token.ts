import { db } from "@/db";
import { eq } from "drizzle-orm";
import { verificationTokens as verificationTokenTable } from "@/db/schema";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokenTable.token, token),
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokenTable.email, email),
    });

    return verificationToken;
  } catch {
    return null;
  }
};
