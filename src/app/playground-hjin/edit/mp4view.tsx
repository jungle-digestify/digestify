"use client"

import { useEffect } from 'react';
import React from 'react';
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';




// export default function VideoView({ openVideoUrl }: VideoViewProps) {
export default function VideoView(all: any) {
    const [getVideoId, setVideoId] = useState();
    const [test, setTest] = useState(null);
    const [showVideo, setShowVideo] = useState(false); //document 가 업데이트 됬는지 확인용
    // console.log('VideoView all = ', all);
    let videoID = ''
    videoID = all.videoID+".mp4";
    let shortTime: any[][] = [];
    const playerRef1 = useRef(null);
    const playerRef2 = useRef(null);
    useEffect(()=>{
        
        // setTest(document.getElementsByClassName('short1'));
        // setTest(document.getElementsByClassName('short2'));
        if(document){
            setShowVideo(true);
        }

        if(videoID!==null || videoID!==undefined){
            setVideoId(videoID);
        }
        let getTimeLine = all.getTimeLine;
        
        if(getTimeLine!==null && getTimeLine.length!==0){
            for(let i=0; i<getTimeLine.length; i++){
                if (getTimeLine.length === 1){
                    return shortTime.push(['00:00', getTimeLine[0]]);
                }
                if(i!=getTimeLine.length-1){
                    shortTime.push([getTimeLine[i], getTimeLine[i+1]]);
                }
                
            }
        }
    }, [all])
    // console.log('test = ',test );

    if(!showVideo){
        return <></>
    }
    else{
        return (
        <div className="videoPlayer">
            <div className='oriVideo'>
                <ReactPlayer
                    // url='/downloads/8VZvs6O5tZY.mp4'
                    url={'/downloads/'+getVideoId}
                    controls
                    width="400px"
                    height='auto'
                    onError={(e: any)=> console.log("onError", e)}
                />
            </div>
            <div className='shortVideo'>
                {/* {shortTime.map((time:any, index:number)=>{ 
                    console.log('time =',time, 'index=',index);
                    //playerRef 바꿔야함
                    return(
                        <ReactPlayer
                        key={index}
                    url={`/downloads/`+getVideoId+`#t=${time[0]},${time[1]}`}
                    ref={playerRef}
                    controls
                    width="200px"
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
                        playerRef.current.seekTo(5, 'seconds', () => {
                            // seekTo 메서드 완료 후에 실행되는 콜백
                            console.log('Seek completed. Pausing now.');
                            playerRef.current.start();
                        });
                    }}
                    onProgress={(progress :any) => {
                        // progress 객체에서 seconds를 가져와 사용
                        // console.log('progress = ', progress);
                        const playedSeconds = progress.playedSeconds;
                        console.log('progress.playedSeconds = ', progress.playedSeconds);
                        if (playedSeconds > 10) {
                            playerRef.current.seekTo(5, 'seconds', () => {
                                // seekTo 메서드 완료 후에 실행되는 콜백
                                console.log('Seek completed. Pausing now.');
                                playerRef.current.pause();
                            });
                        }
                    }}
                    />
                    )
                })} */}
                <ReactPlayer
                    className='short1'
                    url={'/downloads/'+getVideoId+'#t=00:05,00:10'}
                    ref={playerRef1}
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
                        playerRef1.current.seekTo(5, 'seconds', () => {
                            // seekTo 메서드 완료 후에 실행되는 콜백
                            console.log('Seek completed. Pausing now.');
                            playerRef1.current.start();
                        });
                    }}
                    onProgress={(progress :any) => {
                        // progress 객체에서 seconds를 가져와 사용
                        // console.log('progress = ', progress);
                        const playedSeconds = progress.playedSeconds;
                        console.log('progress.playedSeconds = ', progress.playedSeconds);
                        if (playedSeconds > 10) {
                            playerRef1.current.seekTo(5, 'seconds', () => {
                                // seekTo 메서드 완료 후에 실행되는 콜백
                                console.log('Seek completed. Pausing now.');
                                playerRef1.current.pause();
                            });
                        }
                    }}
                    />
        
                <ReactPlayer
                    className='short2'
                    url={'/downloads/'+getVideoId+'#t=00:20,00:25'}
                    ref={playerRef2}
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
                        playerRef2.current.seekTo(20, 'seconds', () => {
                            // seekTo 메서드 완료 후에 실행되는 콜백
                            console.log('Seek completed. Pausing now.');
                            playerRef2.current.start();
                        });
                    }}
                    onProgress={(progress :any) => {
                        // progress 객체에서 seconds를 가져와 사용
                        // console.log('progress = ', progress);
                        const playedSeconds = progress.playedSeconds;
                        console.log('progress.playedSeconds = ', progress.playedSeconds);
                        if (playedSeconds > 25) {
                            playerRef2.current.seekTo(20, 'seconds', () => {
                                // seekTo 메서드 완료 후에 실행되는 콜백
                                console.log('Seek completed. Pausing now.');
                                playerRef2.current.pause();
                            });
                        }
                    }}
                    />      
            </div>
        </div>
    
        );
    }
};


