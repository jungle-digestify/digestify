import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
export const currentUser = async () => {
  // const session = await auth();
  // return session?.user;
  if (!process.env.USER_EMAIL) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, process.env.USER_EMAIL));
  return user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
