"use client";

import { time } from "console";
import { Tienne } from "next/font/google";
import { useEffect } from "react";
import React from "react";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";

function ChangeSecond(timeArr: any[]) {
  const secodeTimeLine = [];
  let getTime = [];
  let shortTime: any[][] = [];

  if (timeArr && timeArr.length !== 0) {
    //빈배열이 아니면
    for (let i = 0; i < timeArr.length; i++) {
      const [minutes, seconds] = timeArr[i].split(":").map(Number);
      getTime.push(minutes * 60 + seconds);
    }
  }
  // console.log('getTime =', getTime);

  if (getTime !== null && getTime.length !== 0 && shortTime.length === 0) {
    for (let i = 0; i < getTime.length; i++) {
      if (getTime.length === 1) {
        return shortTime.push([0, getTime[0]]);
      } else {
        if (i != getTime.length - 1) {
          shortTime.push([getTime[i], getTime[i + 1] - 2]);
        }
        // else{
        //     shortTime.push([getTime[i], getTime[i]+10]); //마지막꺼 영상 끝시간 알수없나..
        // }
      }
    }
  }

  return shortTime;
}

// export default function VideoView({ openVideoUrl }: VideoViewProps) {
export default function VideoView({
  videoId,
  getTimeLine,
}: {
  videoId: string | null;
  getTimeLine: string[];
}) {
  const [showVideo, setShowVideo] = useState(false); //document 가 업데이트 됬는지 확인용
  // const [secondeTimeLine, setSTL] = useState<number[][]>([]);
  // console.log('VideoView all = ', all);
  // let videoID = ''

  // let videoUrl = 'http://www.youtube.com/watch?v='+videoID;

  // const playerRef1 = useRef(null);
  // const playerRef2 = useRef(null);

  // console.log('all.getTimeLine = ', all.getTimeLine);
  // console.log('getSTL = ', getSecondTimeLine);

  const playerRefs: (React.LegacyRef<ReactPlayer> | undefined)[] = [];
  const timeLineArr: (React.LegacyRef<ReactPlayer> | undefined)[] = [];

  const playerRef = useRef<ReactPlayer | null>(null); //하나만할때

  for (let i = 0; i < getTimeLine.length; i++) {
    // playerRefs.push(useRef(null)); // 여러개 할땐 필요
    timeLineArr.push(getTimeLine[i]);
  }

  // console.log('timeLineArr=', timeLineArr);
  const [startTime, setST] = useState(0);
  useEffect(() => {
    if (document) {
      //document 가 생성되고 난후에 reactplayer 할당
      setShowVideo(true);
    }
  }, [videoId, getTimeLine]);

  const timeLineBtn = (timeInSeconds: any) => {
    if (playerRef.current) {
      const [minutes, seconds] = timeInSeconds.split(":").map(Number);
      const getSeconds = minutes * 60 + seconds; //분 단위로 변경
      setST(getSeconds);
      // console.log('getSeconds = ', getSeconds);
      playerRef.current.seekTo(getSeconds);
      playerRef.current.getInternalPlayer()?.playVideo();
    }
  };

  if (!showVideo) {
    return <></>;
  } else {
    return (
      <div className="videoPlayer">
        <div className="oriVideo px-5 py-5">
          <ReactPlayer
            // url='/downloads/8VZvs6O5tZY.mp4'
            ref={playerRef}
            url={"https://www.youtube.com/watch?v=" + videoId}
            // url={videoUrl}
            controls
            width="400px"
            height="230px"
            onError={(e: any) => console.log("onError", e)}
            onStart={() => {
              // if(playerRef.current!==null && startTime!==0){
              //     playerRef.current.seekTo(startTime, 'seconds')
              // }
            }}
            onReady={() => {}}
          />
        </div>
        <div className="timeLine gap-4 px-5">
          {
            typeof timeLineArr === "number" || timeLineArr.length === 0 ? (
              <div> 타임라인이 없습니다. </div>
            ) : (
              timeLineArr.map((time: any, index: number) => (
                <div key={index}>
                  <button
                    className="showTimeLine"
                    onClick={() => timeLineBtn(timeLineArr[index])}
                  >
                    {timeLineArr[index]?.toString()}
                  </button>
                </div>
              ))
            )
            // <button onClick={()=>timeLineBtn(30)}>30</button>
          }
        </div>
        {/* <div className='shortVideo h-full w-full gap-5'>
                { typeof getSecondTimeLine === 'number' || getSecondTimeLine.length === 0 ?
                    <div>타임라인이 없습니다.</div>
                    :
                    
                    getSecondTimeLine.map((row:any, rowIndex:number)=>(
                        
                    <div key={rowIndex} className='short h-full w-full'>
                        <div className='shortTime'>
                            <p> {all.getTimeLine[rowIndex]} </p>
                        </div>
                        {/* <p> end time = {row[1]}</p> */}
        {/* <ReactPlayer
                            className={'short'+rowIndex}
                            url={'/downloads/'+videoID+'.mp4#t='+row[0].toString()+','+row[1].toString()}
                            ref={playerRefs[rowIndex]}
                            controls
                            width="300px"
                            height="auto"
                            config={{
                            file: {
                                attributes: {
                                    controlsList: 'nodownload', // 다운로드 비활성화
                                    crossOrigin: 'true',
                                },
                                
                            },
                            }}
                            // onStart={() => console.log('Video started')}
                            onEnded={() => console.log('Video ended')}
                            onPause={() => console.log('Video Paused')}
                            onReady={() => {
                                // playerRef.current.seekTo(5, 'seconds')
                                // playerRef.current.pause();
                            }}
                            // playing={true} //자동 재생 muted, playing 둘다 해야함
                            // muted={true}   // 자동 재생 
                            
                            // 동영상을 특정 구간에서 재생하기 위해 onStart 이벤트를 활용           
                            onStart={() => {
                                if(playerRefs[rowIndex].current){
                                    playerRefs[rowIndex].current.seekTo(row[0], 'seconds', () => {
                                        // seekTo 메서드 완료 후에 실행되는 콜백
                                        console.log('Seek completed. Pausing now.');
                                        playerRefs[rowIndex].current.start();
                                    });
                                }
                                
                            }}
                            onProgress={(progress :any) => {
                                // progress 객체에서 seconds를 가져와 사용
                                // console.log('progress = ', progress);
                                const playedSeconds = progress.playedSeconds;
                                // console.log('progress.playedSeconds = ', progress.playedSeconds);
                                if (playedSeconds > row[1]) {
                                    if(playerRefs[rowIndex].current){
                                        playerRefs[rowIndex].current.seekTo(row[0], 'seconds', () => {
                                            // seekTo 메서드 완료 후에 실행되는 콜백
                                            console.log('Seek completed. Pausing now.');
                                            playerRefs[rowIndex].current.pause();
                                        });
                                    }
                                }
                            }}
                            /> */}
        {/* </div> */}
        {/* ))} */}
        {/* </div> */}
      </div>
    );
  }
}
