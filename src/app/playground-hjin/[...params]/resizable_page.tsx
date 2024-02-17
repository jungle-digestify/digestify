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

export function ClientComponent({
  defaultLayout = [5, 47.5, 47.5],
  chatId,
  children,
  chatToggle,
}: {
  defaultLayout: number[] | undefined;
  chatId: string | undefined;
  children: ReactNode[];
  chatToggle: boolean | undefined;
}) {
  const [isVisible, setIsVisible] = useState(chatToggle);
  // console.log('defaultLayout=',defaultLayout);
  // console.log('children.length=',children);

  function deleteCookie(name: string) {
    // 만료일을 과거로 설정하여 쿠키 삭제
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  
  let [getSize,setSize] = useState<number[]>([]);
  const [getToggle, setToggle] = useState(false);
  const [checkLoad, setLoad]= useState(false);
  const onLayout = (sizes: number[]) => {
    deleteCookie('react-resizable-panels:layout');
    deleteCookie('react-chatlist-toggle:show');
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
    if(sizes[0]<=5){
      document.cookie = `react-chatlist-toggle:show=${JSON.stringify(false)}`;
      setToggle(false);
    }
    else{
      document.cookie = `react-chatlist-toggle:show=${JSON.stringify(true)}`;
      setToggle(true);
    }
    setSize(sizes);

  };

  useEffect(()=>{
    setLoad(true);
  }, [getSize])
  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="main w-full h-full flex flex-row"
        suppressContentEditableWarning={true}
      >
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel defaultSize={defaultLayout[0]} minSize={5} maxSize={30}>
           {checkLoad &&(
            getSize[0]<=5 ? (<div className="listItem flex justify-center my-4"><FaList size={20}/></div>):(<div className="listItem h-full">{children && children[0]}</div>)
           )}
          </ResizablePanel><ResizableHandle withHandle />

          {children[2] ? ( 
            <> {/* 요소가 두개인경우 : 채팅 리스트 + 왼쪽 요약 + 오른쪽 영상  */}
              <ResizablePanel
                defaultSize={defaultLayout[1]}
                minSize={10}
                maxSize={95}
              >
                {children && children[1]}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={defaultLayout[2]}
                minSize={10}
                maxSize={95}
              >
                {children && children[2]}
              </ResizablePanel>
            </>
          ) : (
            <> {/* 요소가 한개인경우 : show thumbnail  */}
              <ResizablePanel defaultSize={isVisible ? 80 : 95} minSize={10}>
                {children && children[1]}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
