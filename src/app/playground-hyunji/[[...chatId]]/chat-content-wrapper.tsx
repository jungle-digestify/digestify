import ChatContent from "./chat-content";
import { createChat } from "./actions";

import { db } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import { messages as messagesTable } from "@/db/schema";
import { Button } from "../ui/button";
import ChatContentFallback from "./chat-content-fallback";

export default async function ChatContentWrapper({
  chatId,
}: {
  chatId: string;
}) {
  const [message] = await db
    .select()
    .from(messagesTable)
    .where(
      and(eq(messagesTable.chatId, chatId), eq(messagesTable.role, "system"))
    )
    .orderBy(desc(messagesTable.createdAt));

  if (message === undefined) {
    return <ChatContentFallback chatId={chatId} />;
  }
  return (
    <ChatContent
      createChat={createChat}
      script={""}
      initialAssistantResponse={message?.content}
      messageResponseId={message?.id}
    />
  );
}
