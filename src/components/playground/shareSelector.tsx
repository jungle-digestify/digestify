"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeamSpace } from "@/app/playground-hjin/[...params]/page";
import { CopyIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Toaster, toast as sonnerToast } from "sonner";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function ShareSelector({
  teamSpaces,
  chatId,
}: {
  teamSpaces: TeamSpace[];
  chatId: string;
}) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(""); // 선택된 workspace의 ID를 저장할 상태

  const { toast } = useToast();

  if (!teamSpaces) {
    return <></>;
  }
  // 선택된 workspace ID를 처리하는 함수
  const handleSelectChange = (value: any) => {
    setSelectedWorkspaceId(value);
  };

  const handleClick = async () => {
    if (selectedWorkspaceId === "") {
      sonnerToast("공유에 실패하였습니다", {
        description: "공유할 워크스페이스를 선택해 주세요",
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
      return;
    }
    const body = JSON.stringify({
      spaceId: selectedWorkspaceId,
      chatId: chatId,
    });
    // api 호출
    try {
      const result = await fetch("/api/team/share", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("share result", result);
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
    });
    return;
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[117px]">
            <Share></Share>공유하기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>요약 공유하기</DialogTitle>
            <DialogDescription>
              워크스페이스를 선택하여 요약을 공유하세요!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[340px]">
                  <SelectValue placeholder="워크스페이스 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.isArray(teamSpaces) &&
                      teamSpaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id!}>
                          {workspace.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={handleClick}
            >
              <span className="sr-only">Copy</span>
              <Share></Share>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
