"use client";

import { ReactNode, useEffect, useState } from "react"
import { FaRegCircleXmark } from "react-icons/fa6"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { number } from "zod";
import VideoView2 from "../edit/view2";

export function ClientComponent({
  defaultLayout = [20, 40, 40],
  chatId,
  children,
  chatToggle,
  chats,
  spaceId
}: {
  defaultLayout: number[] | undefined;
  chatId : string | undefined;
  children : ReactNode[];
  chatToggle : boolean | undefined;
  chats: { id: string; name: string; videoId: string | null; }[];
  spaceId: string ;
}) {
  const [isVisible, setIsVisible] = useState(chatToggle);
  // console.log('defaultLayout=',defaultLayout);
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
      <div className="main w-full h-full flex flex-row" suppressContentEditableWarning={true}>
        {chatId === null ? 
        // show thumbnail
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel defaultSize={20} >
          <div className="h-full">
            {children && children[0]}
            </div>

          </ResizablePanel>
          <ResizableHandle withHandle disabled/>
          <ResizablePanel defaultSize={80}>
            <VideoView2 chats={chats} workspaceId={spaceId}></VideoView2>
          </ResizablePanel>
          </ResizablePanelGroup>
        :
        //select list
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel defaultSize={defaultLayout[0]} >
            <div className="h-full">
            {children && children[0]}
            </div>

          </ResizablePanel>
          <ResizableHandle withHandle disabled/>
        
        
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={10} maxSize={isVisible?70:90}>

          {children && children[1]}

          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[2]} minSize={10} maxSize={isVisible?70:90}>
          {children && children[2]}

          </ResizablePanel>
        
          
        </ResizablePanelGroup>
        }
        
      </div>

    </div>
    
  );
}