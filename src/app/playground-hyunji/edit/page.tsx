import ChatContent from "../[[...chatId]]/chat-content"
import ChatList, { ChatListSkeleton } from "../[[...chatId]]/chat-list"
import { createChat } from "../[[...chatId]]/actions"
import { Suspense, useEffect } from "react"
import ChatContentWrapper from "../[[...chatId]]/chat-content-wrapper"
import ChatHeader from "../[[...chatId]]/header"
import TeamMenu from "../[[...chatId]]/team-select"
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';
import { fetchTranscript } from "youtube-subtitle-transcript";

//icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

//youtube download
import fs from 'fs';
//mp4 show
// import ReactPlayer from 'react-player'

// import dynamic from 'next/dynamic'; //서버사이드에서 클라이언트 사이드 사용하는 태그 사용할 수 있게 도와줌
import VideoView from './mp4view'
// import { ffmpeg } from 'fluent-ffmpeg';
let allscript = "";

const lang = 'ko'; // Optional, default is 'ko' (English)
let outputPath='';
let openVideoUrl=''
let getTimeLine: RegExpMatchArray | null =null;
//extendinginput display:none 되어있음
export default async function Page2(all:any) {
  // console.log("all", all)
  
  const test = async(videoID: string, lang = 'ko')=>{
    console.log('videoID = ',videoID);
    if(videoID!=undefined){
      try{
        allscript = '';
        const { transcript, error } = await fetchTranscript(videoID, lang);
        // console.log(transcript);
        allscript = transcript.map((entry: { text: any }) => entry.text).join('');
        const videoDetails = await getVideoDetails({ videoID, lang });
        // console.log("videoDetails:!", videoDetails)
        
        allscript += "\n제목:" + videoDetails.title
        allscript += "\ndescription: " + videoDetails.description
        // allscript += "\n자막: " + videoDetails.subtitles.map(entry => entry.text).join('');

        //description 에서 time line만 가져오기
        getTimeLine = videoDetails.description.match(/\d{2}:\d{2}/g);
        
        const lastTimes = videoDetails.subtitles.map((subtitle: { start: string; dur: string }) => parseFloat(subtitle.start) + parseFloat(subtitle.dur));
        const lastTime = Math.max(...lastTimes);
        // console.log('lastTime =', lastTime);

        //마지막 자막 시간으로 변환
        const formatTime = (totalSeconds: number) => {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = Math.floor(totalSeconds % 60);
        
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };
        //마지막 시간도 타임라인에 추가
        getTimeLine?.push(formatTime(lastTime));
        // console.log(formatTime(lastTime));
        // console.log('getTimeLine = ',getTimeLine);
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
          console.log('error = ', error);
        }

        // 현재 위치 /Users/chohyunji/digestify/src/app/playground-hyunji/ai/page.tsx
        // 영상 다운로드 된 위치 /Users/chohyunji/digestify/.next/server/app/playground-hyunji/ai/downloads/video.mp4

        // 1. youtube 영상 다운로드
        const ytdl = require('ytdl-core');
        const path = require('path');

        const ori_youtube_url = 'https://www.youtube.com/watch?v='+videoID;
        const videoURL = ori_youtube_url;
        const downloadOptions = {
          quality: 'highest',
          format: 'mp4',
        };
        
        // const downloadsDir = path.join(__dirname, 'downloads');
        // const downloadsDir = './downloads';
        const publicDownloadsDir = path.join(process.cwd(), 'public', 'downloads'); // 다운로드를 서버에 하면 안되고 public에 해야 접근해서 읽어올 수 있음
        outputPath = path.join(publicDownloadsDir, videoID + ".mp4");
        // outputPath = path.join(downloadsDir, videoID+".mp4");

        // console.log('downloadsDir = ', downloadsDir);
        // console.log('publicDownloadsDir = ', publicDownloadsDir);
        // console.log('outputPath = ', outputPath);
        
        
        try {
          // downloads 폴더가 없으면 생성
          if (!fs.existsSync(publicDownloadsDir)) {
            fs.mkdirSync(publicDownloadsDir);
          }
        
          
          if(!fs.existsSync(outputPath)){ //downloads 폴더에 파일이 존재하지 않으면 다운로드
            const writeStream = fs.createWriteStream(outputPath);
            ytdl(videoURL, downloadOptions).pipe(writeStream);
        
            writeStream.on('finish', () => {
              console.log(`다운로드가 완료되어 ${outputPath}에 저장되었습니다.`);
              openVideoUrl = outputPath;
              //클라이언트에게 다운로드 완료되었다고 알려주기 ?!!!
              
            });
          }else{
            console.log('이미 해당 영상이 다운로드 되어있습니다.');
          }
          
        } catch (error) {
          console.error(`에러 발생: ${error.message}`);
        }

        // 2. 다운한 영상 편집
        
      }
      catch(error){
        console.log(error);  
      }
    }else{ //입력된 영상이 없을때
      outputPath ='';
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
              <input className="SearchInput py-2 px-4" placeholder="Search ..."></input>
              <input type="submit" className="SearchBtn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
              value='S'/>
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

                {/* {chatId ? (
                    <Suspense fallback={<div className="flex-1" />}>
                      <ChatContentWrapper chatId={chatId} />
                    </Suspense>
                  ) : (
                    <ChatContent createChat={createChat} script={allscript}/>
                  )} */}
                  {/* <VideoView openVideoUrl={openVideoUrl}></VideoView> */}
                  <div className="videoPlayer">
                      <div className='oriVideo'>
                        <VideoView videoID={videoID} getTimeLine={getTimeLine}></VideoView>
                      </div>
                  </div>
                 
                  
                  
                  
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
