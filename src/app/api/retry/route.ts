import { createChat } from "@/app/playground-ai/[[...chatId]]/actions";
import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { currentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
import { fetchTranscript } from "youtube-subtitle-transcript";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { initialProgrammerMessages } from "@/app/api/message/messages";
import fs from "fs";

export const POST = async (req: NextRequest, res: NextResponse) => {
  console.log("retry Post 요청 들어옴");
  const data = await readRequestBody(req);
  const { chatId } = data;
  const [chat] = await db.select().from(chats).where(eq(chats.id, chatId));
  console.log(chat);

  const { videoId } = chat;

  if (videoId) {
    console.log("유튜브인 경우");
    const { transcript, error } = await fetchTranscript(videoId, "ko");
    let parsed_script = transcript
      .map((entry) => [
        Math.floor(Number(entry.start) / 60).toFixed(0) +
          ":" +
          (Number(entry.start) % 60).toFixed(0).padStart(2, "0") +
          "-" +
          entry.text,
      ])
      .join("/");
    let lang = "ko";
    const videoDetails = await getVideoDetails({ videoID: videoId, lang });
    const content = JSON.stringify(parsed_script);
    const body = JSON.stringify({ content, chatId });

    const allDBMessages = await db
      .select({
        role: messages.role,
        content: messages.content,
      })
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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
        console.log("retry completed, insertDB");
        try {
          await db.insert(messages).values([
            {
              chatId,
              role: "user",
              content,
            },
            {
              chatId,
              role: "system",
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

  // 유튜브 동영상 말고 그냥 데이터 인 경우
  let url = data.url;
  let contents = data.contents;
  console.log(url, contents);
  return new Response("OK");
};

async function readRequestBody(req: Request) {
  const chunks = [];
  for await (const chunk of req.body as any) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

// preflight - OPTIONS
export const OPTIONS = async (req: NextRequest, res: NextResponse) => {
  console.log("options..");
  console.log(req);
  return new Response("OK");
};
