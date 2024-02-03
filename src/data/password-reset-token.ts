import { db } from "@/db";
import { eq } from "drizzle-orm";
import { passwordResetTokens as passwordResetTable } from "@/db/schema";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTable.token, token),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTable.email, email),
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
