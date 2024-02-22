"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useCompletion } from "ai/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatContentFallback({ chatId }: { chatId: string }) {
  const path = usePathname();
  const [assisnantResponse, setAssistantResponse] = useState("");
  const { complete } = useCompletion({
    api: "/api/completion",
  });

  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleRetry = async () => {
    setIsLoading(true);
    let body = "";
    body = JSON.stringify({ content: "test", chatId });

    try {
      abortControllerRef.current = new AbortController();
      const res = await fetch("/api/retry", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json();
        toast.error(data.error.message);
        setIsLoading(false);
        return;
      }

      const reader = res.body.getReader();

      const decoder = new TextDecoder();
      // chunk가 올 때마다 응답을 세트한다. 다 왔으면 탈출함
      while (true) {
        const { value, done } = await reader.read();

        const text = decoder.decode(value);
        setAssistantResponse((currentValue) => currentValue + text);

        if (done) {
          break;
        }
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast.error(error.message);
        setIsLoading(false);
      }
    }
    abortControllerRef.current = null;
    setIsLoading(false);
  };

  return (
    <div className="h-full max-w-4xl w-full mx-auto flex-1 px-5 py-5 prose dark:prose-invert overflow-y-auto">
      <p>open ai와의 통신이 실패했습니다 (1분에 최대 3번 질의 가능)</p>
      <Button onClick={handleRetry} disabled={isLoading}>
        재시도하기
      </Button>
      <div className="max-w-4xl w-full mx-auto flex-1 px-10 py-5 overflow-x-hidden overflow-y-auto prose dark:prose-invert">
        <Markdown remarkPlugins={[remarkGfm]}>{assisnantResponse}</Markdown>
      </div>
    </div>
  );
}
