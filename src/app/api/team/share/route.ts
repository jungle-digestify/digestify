import { db } from "@/db";
import { messages as messagesTable, chats } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const chatId = body.chatId;
  const spaceId = body.spaceId;
  try {
    const [chat] = await db
      .select({ name: chats.name, videoId: chats.videoId })
      .from(chats)
      .where(eq(chats.id, chatId));

    const [message] = await db
      .select({ content: messagesTable.content })
      .from(messagesTable)
      .where(
        and(eq(messagesTable.chatId, chatId), eq(messagesTable.role, "system")),
      );

    const [newChat] = await db
      .insert(chats)
      .values({
        name: chat.name,
        videoId: chat.videoId,
        workspaceId: spaceId,
      })
      .returning();

    await db.insert(messagesTable).values({
      content: message.content,
      chatId: newChat.id,
      role: "system",
    });
  } catch {
    return new Response(JSON.stringify({ message: "공유에 실패함" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "공유 성공" }), {
    status: 200,
  });
}
