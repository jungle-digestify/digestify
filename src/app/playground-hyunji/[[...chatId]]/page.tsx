import ChatContent from "./chat-content";
import ChatList, { ChatListSkeleton } from "./chat-list";
import { createChat } from "./actions";
import { Suspense, useEffect } from "react";
import ChatContentWrapper from "./chat-content-wrapper";
import ChatHeader from "./header";
import TeamMenu from "./team-select";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
import { fetchTranscript } from "youtube-subtitle-transcript";
import { FaSearch } from "react-icons/fa";

// import VideoView from "./video-view"
import VideoWrapper from "./video-wrapper";
import ReactPlayer from "react-player";

//db
import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { error } from "console";

// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  FaCircleXmark,
  FaFaceGrin,
  FaFaceGrinTongue,
  FaFaceGrinTongueSquint,
  FaRegCircleXmark,
} from "react-icons/fa6";

let allscript = "";

export default async function Page({
  params,
  searchParams,
}: {
  params: { chatId?: string[] };
  searchParams: { v: string };
}) {
  // console.log('params = ', params);

  const test = async (videoID: string, lang = "ko") => {
    if ("videoID" != undefined) {
      // if (videoID != undefined) {

      try {
        allscript = "";
        const { transcript, error } = await fetchTranscript(videoID, lang);
        // console.log(transcript);
        allscript = transcript.map((entry) => entry.text).join("");
        const videoDetails = await getVideoDetails({ videoID, lang });
        // console.log("videoDetails:!", videoDetails)

        allscript += "\n제목:" + videoDetails.title;
        allscript += "\ndescription: " + videoDetails.description;
        // allscript += "\n자막: " + videoDetails.subtitles.map(entry => entry.text).join('');

        // Fetching Subtitles
        let subtitles;

        const fetchSubtitles = async (videoID: string, lang = "ko") => {
          try {
            subtitles = await getSubtitles({ videoID, lang });
            // console.log("subtitles:")
          } catch (error) {
            console.error("Error fetching subtitles:", error);
          }
        };
        // Fetching Video Details
        const fetchVideoDetails = async (videoID: string, lang = "ko") => {
          try {
            // console.log("videoDetails:");
          } catch (error) {
            console.error("Error fetching video details:", error);
          }
        };

        fetchSubtitles(videoID, lang);
        fetchVideoDetails(videoID, lang);

        if (error != undefined) {
          console.log("error = ", error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const chatId = params.chatId?.[0];
  const defaultLayout = [20, 40, 40];

  const listClicked = false;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="header w-full h-[10%] flex items-center border">
        {/* <button className="ListBtn">리스트</button> */}
        {/* <ChatListBtn></ChatListBtn> */}
        <p> 헤드 (로고, 팀워크스페이스버튼, 사용자 로그인 현황)</p>
      </div>

      <div
        className="main w-full h-[85%] flex flex-row"
        suppressContentEditableWarning={true}
      >
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            className="chat-list w-full h-full"
            minSize={10}
          >
            <div className="h-full">
              {/* <Suspense fallback={<ChatListSkeleton />}> */}
              <Suspense>
                <ChatList chatId={chatId} pageName="main" />
              </Suspense>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={10}>
            {/* <ScrollArea className="w-96 whitespace-nowrap rounded-md border"> */}

            {chatId ? (
              <Suspense fallback={<div className="flex-1" />}>
                <ChatContentWrapper chatId={chatId} />
              </Suspense>
            ) : (
              // <ChatContent createChat={createChat} script={allscript}/>
              <div className="w-full h-full flex flex-col justify-center align-middle items-center">
                <FaRegCircleXmark size={25}></FaRegCircleXmark>요약 없음
              </div>
            )}

            {/* <ScrollBar orientation="horizontal" /> */}
            {/* </ScrollArea> */}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[2]} minSize={10}>
            {chatId ? (
              <div>
                <VideoWrapper chatId={chatId}></VideoWrapper>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center align-middle items-center">
                {" "}
                <FaRegCircleXmark size={25}></FaRegCircleXmark>동영상 없음{" "}
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="footer w-full h-[5%] min-h-[5%] border">
        <div className="footText">&copy; Digestify</div>
      </div>
    </div>
  );
}
