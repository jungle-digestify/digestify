"use client";

import { ReactNode, useState } from "react";
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
  const [getSize, setSize] = useState<number[]>([]);

  // console.log("cookie isVisible1 =", isVisible);

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
    // console.log("sizes =", sizes);
    setSize(sizes);
  };

  const toggleVisibility = () => {
    // console.log('chatToggle =', chatToggle);
    setIsVisible(!isVisible);
    // console.log("isVisible2 =", isVisible);
    document.cookie = `react-chatlist-toggle:show=${JSON.stringify(
      !isVisible
    )}`;

    const resize: number[] = getSize;
    if (isVisible) {
      //true
      resize[0] = 0;
      resize[1] += 10;
      resize[2] += 10;
    } else {
      resize[0] = 20;
      resize[1] -= 10;
      resize[2] -= 10;
    }
    onLayout(resize);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="header w-full h-[10%] flex items-center border">
        <button className="ListBtn" onClick={toggleVisibility}>
          리스트
        </button>
        {/* <ChatListBtn></ChatListBtn> */}
        <p> 헤드 (로고, 팀워크스페이스버튼, 사용자 로그인 현황)</p>
      </div>

      <div
        className="main w-full h-[85%] flex flex-row"
        suppressContentEditableWarning={true}
      >
        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
          <ResizablePanel defaultSize={defaultLayout[0]}>
            <div className="h-full">{children && children[0]}</div>
          </ResizablePanel>
          <ResizableHandle withHandle disabled />

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
        </ResizablePanelGroup>
      </div>

      <div className="footer w-full h-[5%] min-h-[5%] border">
        <div className="footText">&copy; Digestify</div>
      </div>
    </div>
  );
}
