import ChatContent from "./chat-content"
import ChatList, { ChatListSkeleton } from "./chat-list"
import { createChat } from "./actions"
import { Suspense, useEffect } from "react"
import ChatContentWrapper from "./chat-content-wrapper"
import ChatHeader from "./header"
import TeamMenu from "./team-select"
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';
import { fetchTranscript } from "youtube-subtitle-transcript";
import { IoSearchOutline } from "react-icons/io5";
// import VideoView from "./video-view"
import VideoWrapper from "./video-wrapper"
import ReactPlayer from 'react-player';

//db
import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm"
import { error } from "console"
import { getCurrentUserPersonalSpace, getCurrentUserTeamSpace, getSpace } from "@/lib/auth"

let allscript = "";

interface TeamSpace {
  title: string;
  desc: string;
  id: string;
  type: 'team';
}
export default async function Page({
  params,
}: {
  params: { spaceId: string, chatId: string };
}) { 
  const spaceId = params.spaceId
  const chatId = params.chatId
  const currentSpace = await getSpace(spaceId)

  const currentUserPersonalSpace = await getCurrentUserPersonalSpace()
  const currentUserTeamSpace : TeamSpace[] = await getCurrentUserTeamSpace()

  if (!currentSpace){
    return <>not exist space!</>
  }
  
  if (spaceId === currentUserPersonalSpace){
    return <>this is personal space!</>
  }

  const inTeamSpace = currentUserTeamSpace.map(teamSpace => teamSpace.id === spaceId)
  console.log("teamspace 입니다")
  if (!inTeamSpace){
    return <>you are not in this space!</>
  }

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
             <input className="SearchInput py-2 px-4" placeholder="Search ..." />
              <button type="submit" className="SearchBtn text-white font-bold py-2 px-4 border-4 rounded-xl border-black hover:border-gray-300">
                <IoSearchOutline />
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
            <div className="ChatContentUp">
              <div className="ChatContent h-full flex flex-row overflow-x-hidden overflow-y-scroll">
                <div className="videoPlayerLeft w-[55%]">
                {chatId ? (
                    <Suspense fallback={<div className="flex-1" />}>
                      <ChatContentWrapper chatId={chatId} />
                    </Suspense>
                  ) : (
                    <ChatContent createChat={createChat} script={allscript}/>
                  )}
                </div>
                {chatId ? (
                  <div className="videoPlayer w-[45%]">
                    <div className='oriVideo'>
                      <VideoWrapper chatId={chatId}></VideoWrapper>
                    </div>
                  </div>
                ) : (
                  <div className="oriVideo"> 동영상 없음 </div>
                )}
                </div>
                

            </div>
            <div className="MetaDataUp">
              <div className="MetaData w-full h-full">
                    meta data
              </div>

            </div>
          </div>
          
        </div>

        <div className="w-full h-full footer">
          
        </div>
    </div>
    
  )
}
