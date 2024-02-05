import ChatContent from "./chat-content"
import ChatList, { ChatListSkeleton } from "./chat-list"
import { createChat } from "./actions"
import { Suspense, useEffect } from "react"
import ChatContentWrapper from "./chat-content-wrapper"
import ChatHeader from "./header"
import TeamMenu from "./team-select"
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';
import { fetchTranscript } from "youtube-subtitle-transcript";
import { FaSearch } from "react-icons/fa";

// import VideoView from "./video-view"
import VideoWrapper from "./video-wrapper"
import ReactPlayer from 'react-player';

//db
import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm"
import { error } from "console"

//show list
// import ShowChatList from "./show-chat-list"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"

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

    if ('videoID' != undefined) {
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
  
  return (

    <div className="w-full h-full flex flex-col">
        <div className="header w-full h-full flex items-center border">
          <button className="ListBtn">리스트 보기</button>
          
          <p>여기 형진이가 헤드 만들어준데 로고, 팀워크스페이스버튼, 사용자 로그인 현황</p>
          {/* <div className="w-1/3 TeamSelectBtnUp">
            <TeamMenu></TeamMenu>
          </div> */}
          {/* <div className="w-2/3 form-group">
            <form className="form" id="SearchForm">
            <div className="flex">
             <input className="SearchInput py-2 px-4" placeholder="Search ..." />
             <button type="submit" className="SearchBtn text-white font-bold py-2 px-4 rounded-lg" style={{ backgroundColor: '#3490dc' }}>
                <FaSearch style={{ backgroundColor: '#3490dc' }} />
              </button>
            </div>
            </form>
          </div>  */}
          
        </div>

        <div className="main w-full h-full flex flex-row">
          
          <div className="ChatlistDiv border h-full w-[15%]">
            
            {/* <Suspense fallback={<ChatListSkeleton />}>
              <ChatList />
            </Suspense> */}

          </div>
        
          <div className="ChatContentDiv flex flex-col">
            <div className="ChatContentUp2">
              <div className="ChatContent h-full flex flex-row overflow-x-hidden overflow-y-scroll">
                <div className="videoPlayerLeft w-[50%]">
                {chatId ? (
                    <Suspense fallback={<div className="flex-1" />}>
                      <ChatContentWrapper chatId={chatId} />
                    </Suspense>
                  ) : (
                    <ChatContent createChat={createChat} script={allscript}/>
                  )}
                </div>
                {chatId ? (
                  <div className="videoPlayer w-[50%]">
                    <div className='oriVideo'>
                      <VideoWrapper chatId={chatId}></VideoWrapper>
                    </div>
                  </div>
                ) : (
                  <div className="oriVideo"> 동영상 없음 </div>
                )}
                </div>
                

            </div>
            {/* <div className="MetaDataUp border">
              <div className="MetaData w-full h-full">
                    meta data
              </div>

            </div> */}
          </div>
          
        </div>

        <div className="w-full h-full footer border">
          
        </div>
    </div>
    
  )
}
