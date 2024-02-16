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
import { chats as chatsTable, userInWorkspace, workspace } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { error } from "console";
import {
  currentUser,
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
  FaYoutube,
} from "react-icons/fa6";
import VideoView2 from "../edit/view2";
import { PgSchema } from "drizzle-orm/pg-core";

import { cookies } from "next/headers";
import { ClientComponent } from "./resizable_page";
import { request } from "http";
import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ShareSelector from "@/components/playground/shareSelector";
import DelebeButton from "@/components/playground/delebeButton";
import { redirect } from "next/navigation";
import AccessDenied from "@/components/playground/access-denined";
export interface TeamSpace {
  id: string | null;
  name: string | null;
  description: string | null;
  isHost: boolean;
}
export default async function Page({
  params,
  searchParams,
}: {
  params: { params: string };
  searchParams: { search?: string };
}) {
  const search = searchParams.search;

  const effectiveSearch = search?.trim().replace(/ /g, " | ") ?? null;

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
ORDER BY rank DESC;`),
    );

  const getChats = async (spaceId: string) =>
    await db
      .select({
        id: chatsTable.id,
        name: chatsTable.name,
        videoId: chatsTable.videoId,
      })
      .from(chatsTable)
      .where(eq(chatsTable.workspaceId, spaceId))
      .orderBy(desc(chatsTable.createdAt));

  const spaceId = params.params[0];
  const chatId = params.params[1] ?? null;
  const chats = effectiveSearch
    ? await searchedChats()
    : await getChats(spaceId);

  // console.log("spaceid:", spaceId);
  // console.log("chatId:", chatId);
  const currentSpace = await getSpace(spaceId);
  const user = await currentUser();
  if (user === null) {
    window.location.href = `/playground-hjin/${spaceId}`;
    return;
  }

  const [isUserDeserveForWorkspace] = await db
    .select()
    .from(userInWorkspace)
    .where(
      and(
        eq(userInWorkspace.userId, user.id),
        eq(userInWorkspace.workspaceId, spaceId),
        eq(userInWorkspace.accept, true),
      ),
    );

  if (isUserDeserveForWorkspace === undefined) {
    return <AccessDenied />;
  }

  const layout = cookies().get("react-resizable-panels:layout");
  const toggleList = cookies().get("react-chatlist-toggle:show");

  // console.log("cookies =", cookies());
  let defaultLayout, chatToggle;
  // console.log("chatToggle =", chatToggle);
  if (layout) {
    // console.log('layout =', layout);
    defaultLayout = JSON.parse(layout.value);
  }
  if (toggleList) {
    chatToggle = JSON.parse(toggleList.value);
  } else {
    chatToggle = "false";
  }

  return (
    <ClientComponent
      defaultLayout={defaultLayout}
      chatId={chatId}
      chatToggle={chatToggle}
    >
      {/* first children */}
      <Suspense>
        <ChatList
          spaceId={spaceId}
          chats={chats}
          chatId={chatId}
          search={search}
        />
      </Suspense>

      {/* second children */}
      {chatId ? (
        <Suspense fallback={<div className="flex-1" />}>
          <ChatContentWrapper chatId={chatId} />
        </Suspense>
      ) : (
        <div className="w-full h-full flex flex-col justify-center align-middle items-center">
          {chats ? (
            <VideoView2
              chats={chats}
              workspaceId={"/playground-hjin/"}
              spaceId={spaceId}
            ></VideoView2>
          ) : (
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size={30} />
              요약하고 싶은 youtube 영상에서 digest 아이콘을 눌러주세요!
            </a>
          )}
        </div>
      )}
      {/* third children */}
      {
        chatId && (
          <div>
            <VideoWrapper chatId={chatId}></VideoWrapper>
          </div>
        )

        //  : (
        //   null
        // <div className="w-full h-full flex flex-col justify-center align-middle items-center">
        //   {" "}
        //   <FaRegCircleXmark size={25}></FaRegCircleXmark>동영상 없음{" "}
        // </div>
        // )
      }
    </ClientComponent>
  );
}
