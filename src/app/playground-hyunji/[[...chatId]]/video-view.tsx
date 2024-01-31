"use client"

import { useEffect } from 'react';
import React from 'react';
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

function ChangeSecond(timeArr: any[]){
    const secodeTimeLine = [];
    let getTime = [];
    let shortTime: any[][] = [];

    if(timeArr && timeArr.length !== 0){ //빈배열이 아니면
        for( let i=0; i<timeArr.length; i++){
            const [minutes, seconds] = timeArr[i].split(':').map(Number);
            getTime.push(minutes * 60 + seconds);
        }
    }
    // console.log('getTime =', getTime);

    if(getTime!==null && getTime.length!==0 && shortTime.length===0){
            for(let i=0; i<getTime.length; i++){
                if (getTime.length === 1){
                    return shortTime.push([0, getTime[0]]);
                }else{
                    if(i!=getTime.length-1){
                        shortTime.push([getTime[i], getTime[i+1]]);
                    }else{
                        shortTime.push([getTime[i], getTime[i]+100]); //마지막꺼 영상 끝시간 알수없나..
                    }
                }
            }
        }
    
    return shortTime;
}


// export default function VideoView({ openVideoUrl }: VideoViewProps) {
export default function VideoView(all: any) {

    const [showVideo, setShowVideo] = useState(false); //document 가 업데이트 됬는지 확인용
    // const [secondeTimeLine, setSTL] = useState<number[][]>([]);
    // console.log('VideoView all = ', all);
    // let videoID = ''
    
    let videoID = all.videoId;

    // let videoUrl = 'http://www.youtube.com/watch?v='+videoID;
    
    // const playerRef1 = useRef(null);
    // const playerRef2 = useRef(null);

    let getSecondTimeLine = ChangeSecond(all.getTimeLine);
    console.log('all.getTimeLine = ', all.getTimeLine);
    console.log('getSTL = ', getSecondTimeLine);
    // setSTL(getSecondTimeLine);

    const playerRefs: (React.LegacyRef<ReactPlayer> | undefined)[] = [];

    for (let i = 1; i <= all.getTimeLine.length; i++) {
        playerRefs.push(useRef(null));
    }

    useEffect(()=>{
        
        if(document){
            setShowVideo(true);      
        }
        
    }, [all])

    if(!showVideo){
        return <></>
    }
    else{
        return (
        <div className="videoPlayer">
            <div className='oriVideo'>
                <ReactPlayer
                    // url='/downloads/8VZvs6O5tZY.mp4'
                    url={'https://www.youtube.com/watch?v='+videoID}
                    // url={videoUrl}
                    controls
                    width="400px"
                    height='230px'
                    onError={(e: any)=> console.log("onError", e)}
                />
            </div>
            <div className='shortVideo h-full w-full gap-5'>
                {/* <div className='short'>타임 라인</div> */}
                { typeof getSecondTimeLine === 'number' || getSecondTimeLine.length === 0 ?
                    <div>타임라인이 없습니다.</div>
                    :
                    getSecondTimeLine.map((row:any, rowIndex:number)=>(
                    <div key={rowIndex} className='short h-full w-full'>
                        <div className='shortTime'>
                            <p> {all.getTimeLine[rowIndex]} </p>
                        </div>
                        {/* <p> end time = {row[1]}</p> */}
                        <ReactPlayer
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
                            />
                    </div>
                ))}
                
                {/* <div className='short1'>
                    <div className='shortTime w-full'>
                        <p> 00:01 </p>
                        <p>서문</p>
                    </div>
                    <div className="short1Video">
                    <ReactPlayer
                    className='short1'
                    url={'/downloads/'+videoID+'.mp4#t=00:01,01:24'}
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
                        if(playerRef1.current){
                            playerRef1.current.seekTo(1, 'seconds', () => {
                                // seekTo 메서드 완료 후에 실행되는 콜백
                                console.log('Seek completed. Pausing now.');
                                playerRef1.current.start();
                            });
                        }
                        
                    }}
                    onProgress={(progress :any) => {
                        // progress 객체에서 seconds를 가져와 사용
                        // console.log('progress = ', progress);
                        const playedSeconds = progress.playedSeconds;
                        // console.log('progress.playedSeconds = ', progress.playedSeconds);
                        if (playedSeconds > 84) {
                            if(playerRef1.current){
                                playerRef1.current.seekTo(1, 'seconds', () => {
                                    // seekTo 메서드 완료 후에 실행되는 콜백
                                    console.log('Seek completed. Pausing now.');
                                    playerRef1.current.pause();
                                });
                            }
                        }
                    }}
                    />
                    </div>
                </div>

                <div className='short2'>
                    <div className='shortTime w-full'>
                        <p> 01:24 </p>
                        <p> 병원 외관 소개 </p>
                    </div>
                    <div className="short1Video">
                    <ReactPlayer
                    className='short2'
                    url={'/downloads/'+videoID+'.mp4#t=84,263'}
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
                        if(playerRef2.current){
                            playerRef2.current.seekTo(84, 'seconds', () => {
                                // seekTo 메서드 완료 후에 실행되는 콜백
                                console.log('Seek completed. Pausing now.');
                                playerRef2.current.start();
                            });
                        }
                        
                    }}
                    onProgress={(progress :any) => {
                        // progress 객체에서 seconds를 가져와 사용
                        // console.log('progress = ', progress);
                        const playedSeconds = progress.playedSeconds;
                        // console.log('progress.playedSeconds = ', progress.playedSeconds);
                        if (playedSeconds > 263) {
                            if(playerRef2.current){
                                playerRef2.current.seekTo(84, 'seconds', () => {
                                    // seekTo 메서드 완료 후에 실행되는 콜백
                                    console.log('Seek completed. Pausing now.');
                                    playerRef2.current.pause();
                                });
                            }
                        }
                    }}
                    />
                    </div>
                </div> */}
                

            </div>
            
        </div>
    
        );
    }
};


