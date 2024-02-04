import { createChat } from "@/app/playground-ai/[[...chatId]]/actions";
import { db } from "@/db";
import { messages } from "@/db/schema";
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
  // 스패너 돌기 시작
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "not logged in" },
      {
        status: 401,
      }
    );
  }

  console.log("Post 요청 들어옴");
  const data = await readRequestBody(req);

  let videoURL = data.videoUrl;
  // console.log('videoURL = ',videoURL);

  // 1. youtube 영상 다운로드
  // const ytdl = require('ytdl-core');
  // const path = require('path');
  // let outputPath='';

  // // const ori_youtube_url = 'https://www.youtube.com/watch?v='+chat?.videoId;
  // const downVideoURL = 'https://www.youtube.com/watch?v='+videoURL;
  // const downloadOptions = {
  //   quality: 'highest',
  //   format: 'mp4',
  // };

  // const publicDownloadsDir = path.join(process.cwd(), 'public', 'downloads'); // 다운로드를 서버에 하면 안되고 public에 해야 접근해서 읽어올 수 있음
  // outputPath = path.join(publicDownloadsDir, videoURL+".mp4");
  // // console.log('outputPath = ', outputPath);
  // try {
  //   // downloads 폴더가 없으면 생성
  //   if (!fs.existsSync(publicDownloadsDir)) {

  //     fs.mkdirSync(publicDownloadsDir);
  //   }

  //   if(!fs.existsSync(outputPath)){ //downloads 폴더에 파일이 존재하지 않으면 다운로드
  //     const writeStream = fs.createWriteStream(outputPath);
  //     ytdl(videoURL, downloadOptions).pipe(writeStream);

  //     writeStream.on('finish', () => {
  //       console.log(`다운로드가 완료되어 ${outputPath}에 저장되었습니다.`);
  //       // openVideoUrl = outputPath;
  //       //클라이언트에게 다운로드 완료되었다고 알려주기 ?!!!

  //     });
  //   }else{
  //     console.log('이미 해당 영상이 다운로드 되어있습니다.');
  //   }

  // } catch (error:any) {
  //   console.error(`에러 발생: ${error.message}`);
  // }
  // // 다운로드 완료

  if (videoURL) {
    console.log("유튜브인 경우");
    const { transcript, error } = await fetchTranscript(videoURL, "ko");
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
    const videoDetails = await getVideoDetails({ videoID: videoURL, lang });
    // console.log("parsed_script = ", parsed_script);
    // console.log("videoDetails =", videoDetails);

    // 1. chatId 대신 만들고 결과 넣기
    const chat = await createChat({ videoDetails, videoURL });
    const chatId = chat.id;

    if (chatId === undefined) {
      return new Response("error");
    }

    const content = JSON.stringify(parsed_script);
    const body = JSON.stringify({ content, chatId });
    // console.log("body:", body);
    // 2. transcript ai에 넣고 결과 얻기

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

    return new Response("OK");
  } else {
    // 유튜브 동영상 말고 그냥 데이터 인 경우
    let url = data.url;
    let contents = data.contents;
    console.log(url, contents);
  }
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
