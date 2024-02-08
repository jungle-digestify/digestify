import ChatList, { ChatListSkeleton } from "../[...params]/chat-list";
import { Suspense, useEffect } from "react";

import { unstable_cache as cache } from "next/cache";
import { currentUser } from "@/lib/auth";


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
}: {
  params: { workspaceId: string };
}) {

  console.log("inside~!");

  const getChats = cache(
    async (workspaceId: string) =>
      await db
        .select({
          id: chatsTable.id,
          name: chatsTable.name,
          video_id: chatsTable.videoId,
        })
        .from(chatsTable)
        .where(eq(chatsTable.workspaceId, params.workspaceId)),
    ["get-chats-for-chat-list"],
    {
      tags: ["get-chats-for-chat-list"],
    }
  );
  console.log("1")
  const user = await currentUser();

  console.log("2", params)
  const chats = user ? await getChats(params.workspaceId) : [];
  console.log("!!!!!!!!!!!!!chats =", chats);
  const chatId = null

  const defaultLayout = [20, 80];

  return (
    <div className="w-full h-full flex flex-col">
        <div className="header w-full h-[10%] flex items-center border">
          {/* <button className="ListBtn">리스트</button> */}
          {/* <ChatListBtn></ChatListBtn> */}
        </div>

        <div className="main w-full h-[85%] flex flex-row">
          
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={defaultLayout[0]} className="chat-list w-full h-full">
              <div className="h-full w-full">
                {/* <Suspense fallback={<ChatListSkeleton />}> */}
                <Suspense>
                  <ChatList workspaceId={params.workspaceId} chatId ={chatId} pageName='edit'/>
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
