import ChatContent from "./chat-content";
import ChatList, { ChatListSkeleton } from "./chat-list";
import { createChat } from "./actions";
import { Suspense, useEffect } from "react";
import ChatContentWrapper from "./chat-content-wrapper";
import ChatHeader from "./header";
import TeamMenu from "./team-select";
import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
import { fetchTranscript } from "youtube-subtitle-transcript";
import { IoSearchOutline } from "react-icons/io5";
// import VideoView from "./video-view"
import VideoWrapper from "./video-wrapper";
import ReactPlayer from "react-player";
import { unstable_cache as cache } from "next/cache";

//db
import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { error } from "console";
import {
  getCurrentUserPersonalSpace,
  getCurrentUserTeamSpace,
  getSpace,
} from "@/lib/auth";
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
import VideoView2 from "../edit/view2";
import { PgSchema } from "drizzle-orm/pg-core";

import { cookies } from "next/headers";
import { ClientComponent } from "./resizable_page"
import { request } from "http";

interface TeamSpace {
  title: string;
  desc: string;
  id: string;
  type: "team";
}
export default async function Page({ params }: { params: { params: string } }) {
  const getChats = cache(
    async (spoaceId: string) =>
      await db
        .select({
          id: chatsTable.id,
          name: chatsTable.name,
          videoId: chatsTable.videoId,
        })
        .from(chatsTable)
        .where(eq(chatsTable.workspaceId, spoaceId)),
    ["get-chats-for-chat-list"],
    {
      tags: ["get-chats-for-chat-list"],
    }
  );

  const spaceId = params.params[0];
  const chatId = params.params[1] ?? null;
  const chats = spaceId ? await getChats(spaceId) : [];

  // console.log("spaceid:", spaceId);
  // console.log("chatId:", chatId);
  const currentSpace = await getSpace(spaceId);

  const currentUserPersonalSpace = await getCurrentUserPersonalSpace();
  const currentUserTeamSpace: TeamSpace[] = await getCurrentUserTeamSpace();

  const layout = cookies().get("react-resizable-panels:layout");
  const toggleList = cookies().get("react-chatlist-toggle:show");
  
  // console.log('cookies =', cookies());
  let defaultLayout, chatToggle;
  // console.log('chatToggle =', chatToggle);
  if (layout) {
    // console.log('layout =', layout);
    defaultLayout = JSON.parse(layout.value);
  }
  if(toggleList){
    chatToggle = JSON.parse(toggleList.value);
  }else{
    chatToggle = 'false';
  }

  return (
    <ClientComponent defaultLayout={defaultLayout} chatId={chatId} chatToggle={chatToggle} chats={chats} spaceId={spaceId}>
    {/* first children */}
      <Suspense>
      <ChatList
            spaceId={currentUserPersonalSpace}
            chats={chats}
            chatId={chatId}
          />
      </Suspense>

    {/* second children */}
      {chatId ? (
        <Suspense fallback={<div className="flex-1" />}>
          <ChatContentWrapper chatId={chatId} />
        </Suspense>
      ) : (

        <div className="w-full h-full flex flex-col justify-center align-middle items-center"><FaRegCircleXmark size={25}></FaRegCircleXmark>요약 없음</div>
      )}
    {/* third children */}
      {chatId ? (
          <div >
            <VideoWrapper chatId={chatId}></VideoWrapper>
          </div>
          ) : (
          <div className="w-full h-full flex flex-col justify-center align-middle items-center"> <FaRegCircleXmark size={25}></FaRegCircleXmark>동영상 없음 </div>
      )}
    
  </ClientComponent>
  );
}
