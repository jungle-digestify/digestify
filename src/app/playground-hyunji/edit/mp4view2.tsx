"use client"

import { useEffect } from 'react';
import React from 'react';
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';




// export default function VideoView({ openVideoUrl }: VideoViewProps) {
export default function VideoView(all: any) {
    const [getVideoId, setVideoId] = useState();
    const [test, setTest] = useState<Element | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    // console.log('VideoView all = ', all);
    let videoID = ''
    videoID = all.videoID+".mp4";
    let shortTime: any[][] = [];
    const playerRef1 = useRef(null);
    const playerRef2 = useRef(null);
    useEffect(()=>{
        
        if(document){
            setShowVideo(true);
        }
    }, [])


    if(showVideo){
        return (
            <div className="videoPlayer">
                <div className='oriVideo'>
                    <ReactPlayer
                        url='/downloads/8VZvs6O5tZY.mp4'
                        // url={'/downloads/'+getVideoId}
                        controls
                        width="400px"
                        height='auto'
                        onError={(e: any)=> console.log("onError", e)}
                    />
                </div>
            </div>
       
        );
    }else{
        return <></>
    }

    
};


