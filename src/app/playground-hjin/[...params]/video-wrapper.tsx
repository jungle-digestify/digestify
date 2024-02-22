import ChatContent from "./chat-content";
import { createChat } from "./actions";

import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import VideoView from "./video-view";
import fs from "fs";

import { messages as messagesTable } from "@/db/schema";
import { getCurrentUserTeamSpace } from "@/lib/auth";
import ShareSelector from "@/components/playground/shareSelector";
import DelebeButton from "@/components/playground/delebeButton";
import { FaRegCircleXmark } from "react-icons/fa6";
const lang = "ko"; // Optional, default is 'ko' (English)
let videoLink = "";
let outputPath = "";
let openVideoUrl = "";

export default async function VideoWrapper({
  chatId,
  spaceId,
  spaceType,
}: // getTimeLine
{
  chatId: string;
  spaceId: string;
  spaceType: "personal" | "team";
  // getTimeLine : number[][];
}) {
  //해당 채팅 아이디의 비디오 아이디를 가져옴
  const [chat] = await db
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.id, chatId))
    .orderBy(desc(chatsTable.createdAt));

  if (chat === undefined) {
    return (
      <div className="w-full h-full flex flex-col justify-center align-middle items-center">
        <FaRegCircleXmark size={25}></FaRegCircleXmark>존재하지 않습니다
      </div>
    );
  }
  //해당 채팅 아이디의 메세지 내용 가져와서 타임라인만 가져와야함
  const [message] = await db
    .select()
    .from(messagesTable)
    .where(
      and(eq(messagesTable.chatId, chatId), eq(messagesTable.role, "system"))
    )
    .orderBy(desc(messagesTable.createdAt));

  const teamSpaces = await getCurrentUserTeamSpace();

  // console.log("chat: ",chat)
  // console.log("message.content: ", message?.content);
  // const timelineMatches = message?.content.match(/\d{2}:\d{2} +?/g);
  const timelineMatches = message?.content.match(/\d{1,2}:\d{2}/g);
  // console.log("timelineMatches =", [...new Set(timelineMatches)]);

  //중복 제거
  const getTimeLine = [...new Set(timelineMatches)];

  // // 1. youtube 영상 다운로드
  // const ytdl = require('ytdl-core');
  // const path = require('path');

  // // const ori_youtube_url = 'https://www.youtube.com/watch?v='+chat?.videoId;
  // const videoURL = 'https://www.youtube.com/watch?v='+chat?.videoId;
  // const downloadOptions = {
  //   quality: 'highest',
  //   format: 'mp4',
  // };

  // const publicDownloadsDir = path.join(process.cwd(), 'public', 'downloads'); // 다운로드를 서버에 하면 안되고 public에 해야 접근해서 읽어올 수 있음
  // outputPath = path.join(publicDownloadsDir, chat?.videoId+".mp4");
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
  //       openVideoUrl = outputPath;
  //       //클라이언트에게 다운로드 완료되었다고 알려주기 ?!!!

  //     });
  //   }else{
  //     console.log('이미 해당 영상이 다운로드 되어있습니다.');
  //   }

  // } catch (error) {
  //   console.error(`에러 발생: ${error.message}`);
  // }
  // // 다운로드 완료

  return (
    <>
      <VideoView videoId={chat?.videoId} getTimeLine={getTimeLine} />
      {spaceType === "personal" ? (
        <div className="flex flex-row p-2 gap-2 flex-wrap">
          <ShareSelector teamSpaces={teamSpaces} chatId={chatId} />
          <DelebeButton spaceId={spaceId} chatId={chatId} />
        </div>
      ) : (
        <div className="flex flex-row p-2 gap-2">
          <DelebeButton spaceId={spaceId} chatId={chatId} />
        </div>
      )}
    </>
  );
}
