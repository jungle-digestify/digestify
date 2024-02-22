"use client";
import CustomLink from "@/components/playground/custom-link";
import packageJSON from "@/../package.json";
import { Copy } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast as sonnerToast } from "sonner";

export default function Index() {
  const handleCopyClipBoard = () => {
    try {
      navigator.clipboard.writeText(
        "https://digest-jungle.site/playground-hjin"
      );
      sonnerToast("주소가 복사되었습니다!", {
        description: "링크를 공유해주세요!",
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
    } catch (error) {
      sonnerToast("복사에 실패하였습니다!", {
        description: "다시 시도해 주세요.",
        action: {
          label: "OK",
          onClick: () => {},
        },
      });
    }
  };

  return (
    <div className="space-y-2 flex flex-col p-10 gap-4 items-center">
      <h1 className="text-3xl font-bold">Welcome to Digest </h1>
      <p>Digest에 오신 것을 환영합니다!</p>
      <p>요약하고 싶은 영상을 youtube에서 digest 아이콘을 눌러 추가해주세요!</p>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant={"secondary"}
          className="flex flex-row items-center gap-2 p-0"
          onClick={() => window.open("https://www.youtube.com/")}
        >
          <FaYoutube className="size-9 fill-red-700" />
          YouTube창 열기
        </Button>{" "}
        <Button
          variant={"secondary"}
          className="flex flex-row items-center gap-2"
          onClick={handleCopyClipBoard}
        >
          <Copy className="size-7" />
          주소 복사하기
        </Button>
      </div>
    </div>
  );
}
