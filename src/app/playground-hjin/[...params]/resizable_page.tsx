"use client";

import { ReactNode, useEffect, useState } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { number } from "zod";

export function ClientComponent({
  defaultLayout = [20, 40, 40],
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

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
    // console.log('sizes =', sizes);
  };

  // const toggleVisibility = () => {

  //   setIsVisible(!isVisible);
  //   console.log('isVisible2 =', isVisible);
  //   document.cookie = `react-chatlist-toggle:show=${JSON.stringify(!isVisible)}`

  //   const resize:number[] = getSize;
  //   console.log('getSize =', getSize);
  //   if(isVisible){ //true
  //     resize[0]=0;
  //     resize[1]+=10;
  //     resize[2]+=10;
  //   }else{
  //     resize[0]=20;
  //     resize[1]-=10;
  //     resize[2]-=10;

  //   }
  //   onLayout(resize);

  // };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        className="main w-full h-full flex flex-row"
        suppressContentEditableWarning={true}
      >
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel defaultSize={defaultLayout[0]}>
            <div className="h-full">{children && children[0]}</div>
          </ResizablePanel>
          <ResizableHandle withHandle disabled />

          {children[2] ? (
            <>
              <ResizablePanel
                defaultSize={defaultLayout[1]}
                minSize={10}
                maxSize={isVisible ? 70 : 90}
              >
                {children && children[1]}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={defaultLayout[2]}
                minSize={10}
                maxSize={isVisible ? 70 : 90}
              >
                {children && children[2]}
              </ResizablePanel>
            </>
          ) : (
            <>
              <ResizablePanel defaultSize={80} minSize={10}>
                {children && children[1]}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
