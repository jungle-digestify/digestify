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
import { desc, eq, sql } from "drizzle-orm";
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

let allscript = "";

interface TeamSpace {
  title: string;
  desc: string;
  id: string;
  type: "team";
}
export default async function Page({
  params,
  searchParams,
}: {
  params: { params: string };
  searchParams: { search?: string };
}) {
  const search = searchParams.search;

  const effectiveSearch = search?.replace(/ /g, " | ") ?? null;

  const searchedChats = async () =>
    await db.execute<{
      id: string;
      name: string;
      videoId: string;
    }>(
      sql.raw(`SELECT chat_id as id, name, video_id as videoId , ts_rank(vec, to_tsquery('config_2_gram_cjk', '${effectiveSearch}')) AS rank
FROM messages
left join chats on messages.chat_id = chats.id
WHERE vec @@ to_tsquery('config_2_gram_cjk', '${effectiveSearch}') and role = 'system'
ORDER BY rank DESC;`)
    );

  const getChats = cache(
    async (spaceId: string) =>
      await db
        .select({
          id: chatsTable.id,
          name: chatsTable.name,
          videoId: chatsTable.videoId,
        })
        .from(chatsTable)
        .where(eq(chatsTable.workspaceId, spaceId))
        .orderBy(desc(chatsTable.createdAt)),
    ["get-chats-for-chat-list"],
    {
      tags: ["get-chats-for-chat-list"],
    }
  );

  const spaceId = params.params[0];
  const chatId = params.params[1] ?? null;
  const chats = effectiveSearch
    ? await searchedChats()
    : await getChats(spaceId);

  console.log("spaceid:", spaceId);
  console.log("chatId:", chatId);
  const currentSpace = await getSpace(spaceId);

  const currentUserPersonalSpace = await getCurrentUserPersonalSpace();
  const currentUserTeamSpace: TeamSpace[] = await getCurrentUserTeamSpace();

  // if (!currentSpace){
  //   return <>not exist space!</>
  // }

  // if (spaceId === currentUserPersonalSpace){
  //   return <>this is personal space!</>
  // }

  // const inTeamSpace = currentUserTeamSpace.map(teamSpace => teamSpace.id === spaceId)
  // console.log("teamspace 입니다")
  // if (!inTeamSpace){
  //   return <>you are not in this space!</>
  // }

  const defaultLayout = [20, 40, 40];

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="main w-full h-full flex flex-row"
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
                <ChatList
                  spaceId={currentUserPersonalSpace}
                  chats={chats}
                  chatId={chatId}
                  search={search}
                />
              </Suspense>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          {chatId === null ? (
            <ResizablePanel defaultSize={defaultLayout[1] + defaultLayout[2]}>
              <VideoView2 chats={chats} workspaceId={spaceId}></VideoView2>
            </ResizablePanel>
          ) : (
            <>
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
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
