import { db } from "@/db";
import { eq } from "drizzle-orm";

import { chats } from "@/db/schema";

export async function DELETE(req: Request) {
  const body = await req.json();
  const chatId = body.chatId;
  // console.log("delete 요청 api:", chatId);
  try {
    await db.delete(chats).where(eq(chats.id, chatId));
  } catch {
    return new Response(JSON.stringify({ message: "채팅 삭제 실패" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "채팅 삭제 성공" }), {
    status: 200,
  });
}
