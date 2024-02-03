"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { chats, users as userTable, InsertChat } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { generateRandomString } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function createChat() {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const [result] = await db
    .insert(chats)
    .values({
      name: "새로운 채팅",
      userId: user.id,
    })
    .returning();

  revalidateTag("get-chats-for-chat-list");

  return {
    id: result.id,
  };
}

export type CreateChat = typeof createChat;
