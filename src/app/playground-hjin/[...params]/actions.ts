"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { chats, users as userTable } from "@/db/schema";
import { currentUser, getCurrentUserPersonalSpace } from "@/lib/auth";
import { generateRandomString } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { error } from "console";
import { VideoDetails } from "youtube-caption-extractor";

export async function createChat({
  videoDetails,
  videoURL,
}: {
  videoDetails?: VideoDetails | undefined;
  videoURL?: string | undefined;
}) {
  const user = await currentUser();

  const currentUserPersonalSpace = await getCurrentUserPersonalSpace();
  if (!user) {
    // console.log("unauthorized");
    throw error("Unauthorized");
  }

  const [result] = await db
    .insert(chats)
    .values({
      name: videoDetails?.title ?? "",
      workspaceId: currentUserPersonalSpace ?? "",
      videoId: videoURL ?? "",
    })
    .returning();

  revalidateTag("get-chats-for-chat-list");

  return result;
}

export type CreateChat = typeof createChat;
