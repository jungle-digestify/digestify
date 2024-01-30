"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { chats, users as userTable } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { generateRandomString } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function createChat() {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }
  const id = generateRandomString(16);
  const result = await db
    .insert(chats)
    .values({
      id: id,
      name: id,
      userId: user.id,
    })
    .returning();
  console.log("result:", result);

  revalidateTag("get-chats-for-chat-list");

  return {
    id,
  };
}

export type CreateChat = typeof createChat;
