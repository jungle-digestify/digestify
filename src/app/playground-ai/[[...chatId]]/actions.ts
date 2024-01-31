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
  videoDetails: VideoDetails;
  videoURL: string;
}) {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const id = generateRandomString(16);
  const result = await db
    .insert(chats)
    .values({
      id: id,
      name: videoDetails?.title ?? id,
      userId: user.id,
      videoId: videoURL ?? "",
    })
    .returning();

  revalidateTag("get-chats-for-chat-list");

  return {
    id,
  };
}

export async function refreshChat(chatId: string) {
  revalidatePath("/" + chatId, "page");
}

export type CreateChat = typeof createChat;
