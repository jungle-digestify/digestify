import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { content, chatId } = await req.json();

  const sucess = await db
    .update(messages)
    .set({ content: content })
    .where(and(eq(messages.chatId, chatId), eq(messages.role, "assistant")));

  return new Response();
}
