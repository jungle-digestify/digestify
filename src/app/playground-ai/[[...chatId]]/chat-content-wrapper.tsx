import ChatContents from "./chat-contents";
import { createChat } from "./actions";

import { db } from "@/db";
import { eq, desc, and, InferSelectModel } from "drizzle-orm";
import { messages as messagesTable } from "@/db/schema";

export type MessagesType = InferSelectModel<typeof messagesTable>[] | undefined;
export type MessageType = InferSelectModel<typeof messagesTable>;

export default async function ChatContentWrapper({
  chatId,
}: {
  chatId: string | undefined;
}) {
  let messages: MessagesType;
  if (chatId) {
    messages = await db
      .select()
      .from(messagesTable)
      .where(
        and(
          eq(messagesTable.chatId, chatId),
          eq(messagesTable.role, "assistant")
        )
      )
      .orderBy(messagesTable.createdAt);
  }

  return (
    <ChatContents createChat={createChat} messages={messages} chatId={chatId} />
  );
}
