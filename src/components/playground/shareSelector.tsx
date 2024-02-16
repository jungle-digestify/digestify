"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {TeamSpace} from "@/app/playground-hjin/[...params]/page"
import { CopyIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { Toaster, toast as sonnerToast } from "sonner";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function ShareSelector( {teamSpaces,chatId} :{ teamSpaces : TeamSpace[], chatId: string}) {
  if(!teamSpaces){
    return <></>
  }
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(''); // 선택된 workspace의 ID를 저장할 상태

    const { toast } = useToast();
    // 선택된 workspace ID를 처리하는 함수
    const handleSelectChange = (value: any) => {
      setSelectedWorkspaceId(value);
    };

    const handleClick = async () => {
      const body = JSON.stringify({ spaceId : selectedWorkspaceId, chatId : chatId})
      // api 호출
      try {
        await fetch("/api/team/share", {
          method: "POST",
          body: body,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "공유에 실패하였습니다.",
          description: "다시 시도해보시겠어요?",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }
      sonnerToast("공유가 완료되었습니다!", {
        description: "팀 스페이스에서 확인해보세요!",
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });

    }

    return (
      <>
    <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2"><Share></Share>공유하기</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-[350px]">
                      <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                      {Array.isArray(teamSpaces) && teamSpaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id!}>
                          {workspace.name}
                        </SelectItem>
                      ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" size="sm" className="px-3" onClick={handleClick}>
                  <span className="sr-only">Copy</span>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          
      <Toaster />
          </>
    )
}