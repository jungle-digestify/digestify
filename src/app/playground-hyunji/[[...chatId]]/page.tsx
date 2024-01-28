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

let allscript = "";

const lang = 'ko'; // Optional, default is 'ko' (English)

export default async function Page(all:any) {
  // console.log("all", all)
  const test = async(videoID: string, lang = 'ko')=>{
    if(videoID!=undefined){
      try{
        allscript = '';
        const { transcript, error } = await fetchTranscript(videoID, lang);
        // console.log(transcript);
        allscript = transcript.map(entry => entry.text).join('');
        const videoDetails = await getVideoDetails({ videoID, lang });
        // console.log("videoDetails:!", videoDetails)
        
        allscript += "\n제목:" + videoDetails.title
        allscript += "\ndescription: " + videoDetails.description
        // allscript += "\n자막: " + videoDetails.subtitles.map(entry => entry.text).join('');
        
        // Fetching Subtitles
        let subtitles;
  
        const fetchSubtitles = async (videoID: string, lang = 'ko') => {
          try {
            subtitles = await getSubtitles({ videoID, lang });
            // console.log("subtitles:")
          } catch (error) {
            console.error('Error fetching subtitles:', error);
          }
        };
        // Fetching Video Details
        const fetchVideoDetails = async (videoID: string, lang = 'ko') => {
          try {
            
            // console.log("videoDetails:");
          } catch (error) {
            console.error('Error fetching video details:', error);
          }
        };
  
  
        fetchSubtitles(videoID, lang);
        fetchVideoDetails(videoID, lang);
  
        // console.log("allscript final: ", allscript)
        if(error!=undefined){
          console.log('error = ', error)
        }
        
      }
      catch(error){
        console.log(error);  
      }
    }
    
  }
  const chatId = all.chatId?.[0]
  const videoID = all.searchParams.v;
  await test(videoID, lang); 
  
  
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
              <div className="ChatContent h-full flex-1 flex flex-col">

                {/* {chatId ? (
                    <Suspense fallback={<div className="flex-1" />}>
                      <ChatContentWrapper chatId={chatId} />
                    </Suspense>
                  ) : (
                    <ChatContent createChat={createChat} script={allscript}/>
                  )} */}
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
          footer
        </div>
    </div>
    // <div className="w-full h-full flex">
    //   <div className="w-full h-15">
    //     <ChatHeader></ChatHeader>
    //   </div>
      
    //   <div className="w-full h-75">
    //     <div className="w-80 h-75 max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
    //       <Suspense fallback={<ChatListSkeleton />}>
    //         <ChatList />
    //       </Suspense>
    //     </div>
    //     <div className="h-full flex-1 flex flex-col">
    //       {chatId ? (
    //         <Suspense fallback={<div className="flex-1" />}>
    //           <ChatContentWrapper chatId={chatId} />
    //         </Suspense>
    //       ) : (
    //         <ChatContent createChat={createChat} script={allscript}/>
    //       )}
          
    //     </div>
    //   </div>
    // </div>
    
  )
}
