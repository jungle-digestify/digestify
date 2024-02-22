import ChatContent from "./chat-content";
import { createChat } from "./actions";

import { db } from "@/db";
import { eq, desc, and } from "drizzle-orm";
import { chats, messages as messagesTable } from "@/db/schema";
import ChatContentFallback from "./chat-content-fallback";
import { FaRegCircleXmark } from "react-icons/fa6";

export default async function ChatContentWrapper({
  chatId,
}: {
  chatId: string;
}) {
  const message = await db
    .select()
    .from(messagesTable)
    .where(
      and(eq(messagesTable.chatId, chatId), eq(messagesTable.role, "system"))
    )
    .orderBy(desc(messagesTable.createdAt));

  if (message.length === 0) {
    const [chatExit] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId));
    if (chatExit === undefined) {
      return (
        <div className="flex flex-col justify-center align-middle items-center">
          <FaRegCircleXmark size={25}></FaRegCircleXmark>존재하지 않습니다
        </div>
      );
    }
    return <ChatContentFallback chatId={chatId} />;
  }

  return (
    <ChatContent
      createChat={createChat}
      script={""}
      initialAssistantResponse={message[0]?.content}
      messageResponseId={message[0]?.id}
    />
  );
}
