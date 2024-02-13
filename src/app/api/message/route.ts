import OpenAI from "openai";

import { OpenAIStream, StreamingTextResponse } from "ai";

import { initialProgrammerMessages } from "./messages";

import { db } from "@/db";
import { chats, users as userTable } from "@/db/schema";
import { messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { content, chatId } = await req.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "not logged in" },
      {
        status: 401,
      },
    );
  }

  if (!chatId) {
    return NextResponse.json({ error: "chat id required" }, { status: 400 });
  }
  const [chat] = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, user.id)));

  if (!chat) {
    return new NextResponse("chat is not found", { status: 400 });
  }

  const allDBMessages = await db
    .select({
      role: messages.role,
      content: messages.content,
    })
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      ...initialProgrammerMessages,
      ...allDBMessages,
      { role: "user", content },
    ],
    model: "gpt-3.5-turbo-1106",
    stream: true,
    max_tokens: 4096,
  });

  const stream = OpenAIStream(chatCompletion, {
    onStart: async () => {},
    onToken: async (token: string) => {},
    onCompletion: async (completion: string) => {
      try {
        await db.insert(messages).values([
          {
            chatId,
            role: "user",
            content,
          },
          {
            chatId,
            role: "assistant",
            content: completion,
          },
        ]);
      } catch (e) {
        console.error(e);
      }
    },
  });

  return new StreamingTextResponse(stream);
}
