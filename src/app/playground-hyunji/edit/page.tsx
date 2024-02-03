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
  console.log("chats =", chats);
  const chatId = params.chatId?.[0];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="header w-full h-full flex items-center">
        <div className="w-1/3 TeamSelectBtnUp">
          {/* <button className="TeamSelectBtn font-bold py-2 px-4 rounded"> team </button> */}
          <TeamMenu></TeamMenu>
        </div>
        <div className="w-2/3 form-group">
          <form className="form" id="SearchForm">
            <div className="flex">
              <input
                className="SearchInput py-2 px-4"
                placeholder="Search ..."
              />
              <button
                type="submit"
                className="SearchBtn text-white font-bold py-2 px-4 rounded-lg"
                style={{ backgroundColor: "#3490dc" }}
              >
                {/* <FaSearch style={{ backgroundColor: '#3490dc' }} /> */}
              </button>
            </div>
            {/* <span><i className="bi bi-search"></i></span> */}
          </form>
        </div>
      </div>

      <div className="main w-full h-full flex flex-row">
        <div className="ChatlistDiv">
          <Suspense fallback={<ChatListSkeleton />}>
            <ChatList />
          </Suspense>
        </div>

        <div className="ChatContentDiv flex flex-col">
          <div className="ChatContentUp2">
            <div className="ChatContent h-full flex flex-row overflow-x-hidden overflow-y-scroll">
              <VideoView2 chats={chats}></VideoView2>
            </div>
          </div>
          {/* <div className="MetaDataUp">
              <div className="MetaData w-full h-full">
                    meta data
              </div>

            </div> */}
        </div>
      </div>

      <div className="w-full h-full footer"></div>
    </div>
  );
}
