import ChatContent from "./chat-content";
import ChatList, { ChatListSkeleton } from "./chat-list";
import { createChat } from "./actions";
import { Suspense, useEffect } from "react";
import ChatContentWrapper from "./chat-content-wrapper";

import { ClientComponent } from "./resizable_page";

// import VideoView from "./video-view"
import VideoWrapper from "./video-wrapper";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cookies } from "next/headers";
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
  const chatId = params.chatId?.[0];
  // const defaultLayout = [20, 40, 40];
  const layout = cookies().get("react-resizable-panels:layout");
  const toggleList = cookies().get("react-chatlist-toggle:show");

  let defaultLayout, chatToggle;
  if (layout) {
    defaultLayout = JSON.parse(layout.value);
  }
  if (toggleList) {
    chatToggle = JSON.parse(toggleList.value);
  } else {
    chatToggle = "false";
  }

  // console.log('cookie chatToggle =',chatToggle);
  return (
    <ClientComponent
      defaultLayout={defaultLayout}
      chatId={chatId}
      chatToggle={chatToggle}
    >
      {/* first children */}
      <Suspense>
        <ChatList chatId={chatId} pageName="main" />
      </Suspense>

      {/* second children */}
      {chatId ? (
        <Suspense fallback={<div className="flex-1" />}>
          <ChatContentWrapper chatId={chatId} />
        </Suspense>
      ) : (
        <div className="w-full h-full flex flex-col justify-center align-middle items-center">
          <FaRegCircleXmark size={25}></FaRegCircleXmark>요약 없음
        </div>
      )}
      {/* third children */}
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
    </ClientComponent>
  );
}
