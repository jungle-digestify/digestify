import ChatContent from "../[[...chatId]]/chat-content"
import ChatList, { ChatListSkeleton } from "../[[...chatId]]/chat-list"
import { createChat } from "../[[...chatId]]/actions"
import { Suspense, useEffect } from "react"
import ChatContentWrapper from "../[[...chatId]]/chat-content-wrapper"
import ChatHeader from "../[[...chatId]]/header"
import TeamMenu from "../[[...chatId]]/team-select"
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';
import { fetchTranscript } from "youtube-subtitle-transcript";
import { IoSearchOutline } from "react-icons/io5";

//youtube download
import fs from 'fs';

let allscript = "";

const lang = 'ko'; // Optional, default is 'ko' (English)

//extendinginput display:none 되어있음
export default async function Page2(all:any) {
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

        const ytdl = require('ytdl-core');
        const ori_youtube_url = 'https://www.youtube.com/watch?v='+videoID;
        const videoURL = ori_youtube_url;
        const downloadOptions = {
          quality: 'highest',
        };

        ytdl(videoURL, downloadOptions).pipe(fs.createWriteStream('video.mp4'));
        console.log('ytdl.videoInfo = ',ytdl.videoInfo);
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
            </form>
          </div> 
          
        </div>

        <div className="main w-full h-full flex flex-row">
          
          {/* <div className="ChatlistDiv">
            <Suspense fallback={<ChatListSkeleton />}>
              <ChatList />
            </Suspense>
          </div> */}
        
          <div className="ChatContentDiv2 flex flex-col">
            <div className="ChatContentUp">
              <div className="ChatContent h-full flex-1 flex flex-col">

                {chatId ? (
                    <Suspense fallback={<div className="flex-1" />}>
                      <ChatContentWrapper chatId={chatId} />
                    </Suspense>
                  ) : (
                    <ChatContent createChat={createChat} script={allscript}/>
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
          footer
        </div>
    </div>

    
  )
}
