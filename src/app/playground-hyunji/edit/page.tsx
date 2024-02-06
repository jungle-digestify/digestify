import ChatContent from "../[[...chatId]]/chat-content";
import ChatList, { ChatListSkeleton } from "../[[...chatId]]/chat-list";
import { createChat } from "../[[...chatId]]/actions";
import { Suspense, useEffect } from "react";
import ChatContentWrapper from "../[[...chatId]]/chat-content-wrapper";
import ChatHeader from "../[[...chatId]]/header";
import TeamMenu from "../[[...chatId]]/team-select";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
import { fetchTranscript } from "youtube-subtitle-transcript";
import { unstable_cache as cache } from "next/cache";
import { currentUser } from "@/lib/auth";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

//youtube download
import fs from "fs";
// import VideoView from "./video-view"
import VideoWrapper from "./video-wrapper";
import ReactPlayer from "react-player";

//db
import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { error } from "console";

import VideoView2 from "./view2";

//resize
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

let allscript = "";

export default async function Page2({
  params,
  searchParams,
}: {
  params: { chatId?: string[] };
  searchParams: { v: string };
}) {
  const getChats = cache(
    async (userId: string) =>
      await db
        .select({
          id: chatsTable.id,
          name: chatsTable.name,
          video_id: chatsTable.videoId,
        })
        .from(chatsTable)
        .where(eq(chatsTable.userId, userId)),
    ["get-chats-for-chat-list"],
    {
      tags: ["get-chats-for-chat-list"],
    }
  );

  const user = await currentUser();
  const chats = user ? await getChats(user.id) : [];
  // console.log("chats =", chats);
  const chatId = params.chatId?.[0];

  const defaultLayout = [265, 1095];

  return (
    <div className="w-full h-full flex flex-col">
        <div className="header w-full h-[10%] flex items-center border">
          {/* <button className="ListBtn">리스트</button> */}
          {/* <ChatListBtn></ChatListBtn> */}
          <p> 헤드 (로고, 팀워크스페이스버튼, 사용자 로그인 현황)</p>
        </div>

        <div className="main w-full h-[85%] flex flex-row">
          
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={defaultLayout[0]} className="chat-list">
              <div>
                {/* <Suspense fallback={<ChatListSkeleton />}> */}
                <Suspense>
                  <ChatList chatId ={chatId}/>
                </Suspense>
              </div>
        
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1]}>
              <VideoView2 chats={chats}></VideoView2>
            </ResizablePanel>
           
          </ResizablePanelGroup>
        </div>

        <div className="footer w-full h-[5%] min-h-[5%] border">
          <div className="footText">&copy; Digestify</div>
        </div>
    </div>

    
  );
}
