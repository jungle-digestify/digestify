import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users as userTable } from "@/db/schema";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(userTable.email, email),
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(userTable.id, id),
    });
    return user;
  } catch {
    return null;
  }
};
