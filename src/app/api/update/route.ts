import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const { content, id } = await req.json();

  const sucess = await db
    .update(messages)
    .set({ content: content })
    .where(eq(messages.id, id));

  return new Response();
}
