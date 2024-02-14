"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export default function ChatContentFallback({ chatId }: { chatId: string }) {
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleRetry = async () => {
    setIsLoading(true);
    let body = "";
    body = JSON.stringify({ content: "test", chatId });

    try {
      abortControllerRef.current = new AbortController();
      await fetch("/api/retry", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast(`error:${error.message}`);
      }
    }

    setIsLoading(false);
  };

  const handleClick = (e: MouseEvent) => {
    console.log(e);
  };

  return (
    <div className="h-full max-w-4xl w-full mx-auto flex-1 px-5 py-5 prose dark:prose-invert overflow-y-auto">
      <p>open ai와의 통신이 실패했습니다 (1분에 최대 3번 질의 가능)</p>
      <Button onClick={handleRetry} disabled={isLoading}>
        재시도하기
      </Button>
    </div>
  );
}
