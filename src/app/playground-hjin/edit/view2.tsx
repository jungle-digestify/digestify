"use client";

import { chats, SelectChat } from "@/db/schema";
import { time } from "console";
import { Tienne } from "next/font/google";
import { use, useEffect } from "react";
import React from "react";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { cookies } from "next/headers";

//scroll
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { FaYoutube } from "react-icons/fa";

type SelectChatDto = Pick<SelectChat, "id" | "name" | "videoId">;

export default function VideoView2({
  chats,
  workspaceId,
  spaceId,
}: {
  chats: SelectChatDto[];
  workspaceId: string;
  spaceId: string;
}) {
  console.log("all =", chats);
  const [showVideo, setShowVideo] = useState(false);
  const [getChats, setChats] = useState([]);

  useEffect(() => {
    if (document) {
      setShowVideo(true);
    }
  }, []);
  const path = "/";
  function deleteCookie(name: string) {
    // 만료일을 과거로 설정하여 쿠키 삭제
    
    document.cookie =
      name + `=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; path=${path}`;
  }
  const layoutResize = () => {
    // console.log('cookie=', cookies().get(`react-resizable-panels:layout`));
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // 해당 이름을 가진 쿠키를 찾으면 삭제
      const name = "react-resizable-panels:layout";
      if (cookie.indexOf(name + "=") === 0) {
        deleteCookie(name);
        break;
      }
    }
    document.cookie = `react-resizable-panels:layout=${JSON.stringify([
      5, 47.5, 47.5,
    ])}; path=${path}`;
  };
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
                      href={`${workspaceId}/${spaceId}/${item.id}`}
                      dangerouslySetInnerHTML={{ __html: item.name }}
                      onClick={(e) => layoutResize()}
                    ></Link>
                  </div>
                </div>
              ))
            ) : (
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube size={30} />
                요약하고 싶은 youtube 영상에서 digest 아이콘을 눌러주세요!
              </a>
            )}
          </div>
        </div>
      </ScrollArea>
    );
  }
}
