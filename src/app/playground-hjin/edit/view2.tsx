"use client";

import { chats, SelectChat } from "@/db/schema";
import { time } from "console";
import { Tienne } from "next/font/google";
import { use, useEffect } from "react";
import React from "react";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";

//scroll
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

type SelectChatDto = Pick<SelectChat, "id" | "name" | "videoId">;

export default function VideoView2({
  chats,
  workspaceId,
}: {
  chats: SelectChatDto[];
  workspaceId: string;
}) {
  // console.log("all =", chats);
  const [showVideo, setShowVideo] = useState(false);
  const [getChats, setChats] = useState([]);

  useEffect(() => {
    if (document) {
      setShowVideo(true);
    }
  }, []);

  if (!showVideo) {
    return <></>;
  } else {
    return (
      <ScrollArea className="h-full w-full ">
        <div className="videoPlayer2 m-3">
          <div className="oriVideo2 gap-5">
            {chats.length !== 0 ? (
              chats.map((item: any, index: number) => (
                <div className="ori_video gap-2" key={index}>
                  <ReactPlayer
                    url={"https://www.youtube.com/watch?v=" + item.videoId}
                    controls
                    width="400px"
                    height="220px"
                    onError={(e: any) => console.log("onError", e)}
                    onStart={() => {}}
                    onReady={() => {}}
                  />
                  <div className="video_title">
                    <Link
                      href={`${workspaceId}/${item.id}`}
                      dangerouslySetInnerHTML={{ __html: item.name }}
                    ></Link>
                  </div>
                </div>
              ))
            ) : (
              <div>동영상 없음</div>
            )}
          </div>
        </div>
      </ScrollArea>
    );
  }
}
