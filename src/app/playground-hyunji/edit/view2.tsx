"use client"

import { chats } from '@/db/schema';
import { time } from 'console';
import { Tienne } from 'next/font/google';
import { use, useEffect } from 'react';
import React from 'react';
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

export default function VideoView2(all: any) {
    // console.log('all =', all);
    const [showVideo, setShowVideo] = useState(false);
    const [getChats, setChats] = useState([]);
    

    useEffect(()=>{
        if(document){
            setChats(all.chats.reverse());
            setShowVideo(true);
        }
    })

    if(!showVideo){
        return <></>
    }
    else{
        return (
        <div className="videoPlayer2 m-3">
            <div className='oriVideo2 gap-5'>
                {getChats.length!==0 ?
                    getChats.map((item : any, index: number)=>(
                    <div className='ori_video gap-2' key={index}>
                        <ReactPlayer
                            
                            url={'https://www.youtube.com/watch?v='+item.video_id}
                            controls
                            width="340px"
                            height='180px'
                            onError={(e: any)=> console.log("onError", e)}
                            onStart={() => {}}
                            onReady={()=>{ }}
                        />
                        <div className="video_title">
                            <a href={item.id} dangerouslySetInnerHTML={{ __html: item.name }}></a>    
                        </div> 
                      
                    </div>
                    
                    ))

                    :(
                    <div>동영상 없음</div>
                    )
                }
                
            </div>
        </div>
    
        );
    }
};


