"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { chats, users as userTable } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { generateRandomString } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { VideoDetails } from "youtube-caption-extractor";

export async function createChat({
  videoDetails,
  videoURL,
}: {
  videoDetails?: VideoDetails | undefined;
  videoURL?: string | undefined;
}) {
  // const user = await currentUser();

  // if (!user) {
  //   return { error: "Unauthorized" };
  // }
  const user = db.select().from(userTable).where(eq(userTable.email, "x2xgudwls@gmail.com"))

  const [result] = await db
    .insert(chats)
    .values({
      name: videoDetails?.title ?? "새로운 채팅",
      userId: user.id,
      videoId: videoURL ?? "",
    })
    .returning();

  revalidateTag("get-chats-for-chat-list");

  return {
    id: result.id,
  };
}

export async function refreshChat(chatId: string) {
  revalidatePath("/" + chatId, "page");
}

export type CreateChat = typeof createChat;
