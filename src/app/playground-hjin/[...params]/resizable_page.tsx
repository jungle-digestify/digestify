"use client";

import { ReactNode, useEffect, useState } from "react";
import { FaL, FaRegCircleXmark } from "react-icons/fa6";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { number } from "zod";
import { FaList } from "react-icons/fa";
import SettingsPage from "@/app/playground-auth2/settings/page";
import { useAmp } from "next/amp";
import React from "react";

export const setDefaultLayout = () => {
  const layoutCookie = document.cookie.match(
    "(^|;) ?" + "react-resizable-panels:layout" + "=([^;]*)(;|$)"
  );
  if (layoutCookie === null) {
    return [5, 47.5, 47.5];
  }
  const layout = layoutCookie[2].slice(1, -1)?.split(",").map(Number);
  return layout;
};

export function ClientComponent({
  chatId,
  children,
  chatToggle,
}: {
  chatId: string | undefined;
  children: ReactNode[];
  chatToggle: boolean | undefined;
}) {
  // console.log('defaultLayout=',defaultLayout);
  // console.log('children.length=',children);

  function deleteCookie(name: string) {
    // 만료일을 과거로 설정하여 쿠키 삭제
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  let [getSize, setSize] = useState<number[]>([]);
  const [getToggle, setToggle] = useState(false);
  const [checkLoad, setLoad] = useState(false);
  const path = "/";
  let defaultLayout = setDefaultLayout();
  const onLayout = (sizes: number[]) => {
    // deleteCookie('react-resizable-panels:layout');
    // deleteCookie('react-chatlist-toggle:show');

    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
      sizes
    )}; path=${path}`;
    if (sizes[0] <= 5) {
      document.cookie = `react-chatlist-toggle:show=${JSON.stringify(
        false
      )}; path=${path}`;
      setToggle(false);
    } else {
      document.cookie = `react-chatlist-toggle:show=${JSON.stringify(
        true
      )}; path=${path}`;
      setToggle(true);
    }
    setSize(sizes);
  };

  useEffect(() => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
      getSize
    )}; path=${path}`;
    setLoad(true);
  });

  const changeLayout = () => {
    const size = getSize;
    setSize([20, size[1] - 15, size[2] ? size[2] : 0]);
    defaultLayout = getSize;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="main w-full h-full flex flex-row"
        suppressContentEditableWarning={true}
      >
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            minSize={5}
            maxSize={35}
          >
            {checkLoad &&
              (getSize[0] <= 5 ? (
                <div className="listItem flex justify-center my-4">
                  <FaList size={20} onClick={changeLayout} />
                </div>
              ) : (
                <div className="listItem h-full">{children && children[0]}</div>
              ))}
          </ResizablePanel>
          <ResizableHandle withHandle />

          {children[2] ? (
            <>
              {" "}
              {/* 요소가 두개인경우 : 채팅 리스트 + 왼쪽 요약 + 오른쪽 영상  */}
              <ResizablePanel
                defaultSize={defaultLayout[1]}
                minSize={30}
                maxSize={70}
              >
                {children && children[1]}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={defaultLayout[2]}
                minSize={30}
                maxSize={70}
              >
                {children && children[2]}
              </ResizablePanel>
            </>
          ) : (
            <>
              {" "}
              {/* 요소가 한개인경우 : show thumbnail  */}
              <ResizablePanel defaultSize={100 - defaultLayout[0]} minSize={10}>
                {children && children[1]}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
