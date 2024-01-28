"use client"

import { useEffect } from 'react';
import React from 'react';
import ReactPlayer from 'react-player';
// import ffmpeg from 'fluent-ffmpeg';

interface VideoViewProps {
  openVideoUrl: string;
}


// export default function VideoView({ openVideoUrl }: VideoViewProps) {
export default function VideoView(all: any) {
    console.log('all = ', all);
    let videoID = ''
    videoID = all.videoID+".mp4";
    // console.log('videoID = ',videoID);
    let getTimeLine = all.getTimeLine;
    let test =[];
    for(let i=0; i<getTimeLine.length; i++){
        if (getTimeLine.length === 1){
            return test.push(['00:00', getTimeLine[0]]);
        }
        if(i!=getTimeLine.length-1){
            test.push([getTimeLine[i], getTimeLine[i+1]]);
        }
        
    }
    console.log('test = ',test );
    
//     useEffect(()=>{
//         // 동영상 편집 코드
//     const inputVideoPath = '/downloads/'+videoID;
//     const outputVideoPath = '/downloads/'+videoID+'_1';

//     ffmpeg()
//       .input(inputVideoPath)
//       .setStartTime('00:00:05') // 시작 시간
//       .setDuration('00:00:10') // 지속 시간
//       .output(outputVideoPath)
//       .on('end', () => {
//         console.log('동영상 편집 완료');
//       }).on('error', (err) => {
//         console.error('Error:', err);
//       })
//       .run();
//   }, []);

    return (
    <div className="videoPlayer">
        <div className='oriVideo'>
            <ReactPlayer
            //   url={openVideoUrl}
                // url='/downloads/8VZvs6O5tZY.mp4'
                url={'/downloads/'+videoID}
                controls
                width="400px"
                height='auto'
            />
        </div>
        {/* <div className='shortVideo'>
                <ReactPlayer
                    url={'/downloads/'+videoID}
                    controls
                    width="300px"
                    height='auto'
                    // start={time[0]}
                    // end={time[1]}
                    start={0o3}
                    end={156}
                /> */}

            {/* {test.length!==0?
                test.map((time: any, index:any) => (
                    // console.log('time = ', time, 'index = ', index)
                    
                    <ReactPlayer
                        key={index}
                        url={'/downloads/'+videoID}
                        controls
                        width="300px"
                        height='auto'
                        // start={time[0]}
                        // end={time[1]}
                        start={01}
                        end={156}
                    />
                ))
                
                :
                <div>제공된 타임 스크립트가 없습니다.</div>
            } */}
        {/* </div> */}
    </div>
    );
};


