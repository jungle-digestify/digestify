"use client";

import { useState, useRef, useId, useEffect } from "react";
import ChatInput from "@/components/chat-input";

import { CreateChat, refreshChat } from "./actions";
import { convertFileToBase64 } from "@/lib/utils";

import { MessagesType } from "./chat-content-wrapper";
import ChatContent from "@/app/playground-ai/[[...chatId]]/chat-content";

function scrollToBottom() {
  const element = document.getElementById("wraper");
  element!.scrollTop = element!.scrollHeight;
}

export default function ChatContents({
  createChat,
  chatId,
  messages,
}: {
  createChat: CreateChat;
  messages: MessagesType | undefined;
  chatId: string | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [assistantResponse, setAssistantResponse] = useState("");

  const handleSubmit = async (value: string, file?: File) => {
    if (!currentChatId) {
      // create a new chat in the database
      const chat = await createChat({});
      setCurrentChatId(chat.id);
      // and get the id and store it in state
    }
    let body = "";
    if (file) {
      const imageUrl = await convertFileToBase64(file);
      const content = [
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        },
        {
          type: "text",
          text: value,
        },
      ];

      body = JSON.stringify({ content, chatId: currentChatId });
    } else {
      body = JSON.stringify({ content: value, chatId: currentChatId });
    }

    // console.log("submit", value, file);
    try {
      abortControllerRef.current = new AbortController();
      const res = await fetch("/api/message", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        alert("Error sending message응답이상");
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
        alert("Error sending message 어보트");
      }
    }
    abortControllerRef.current = null;
    setIsLoading(false);
    await refreshChat(chatId!);
    setAssistantResponse("");
    scrollToBottom();
  };

  const handleStop = () => {
    if (!abortControllerRef.current) {
      return;
    }
    abortControllerRef.current.abort();
    abortControllerRef.current = null;
  };

  return (
    <>
      <div
        id="wraper"
        className="h-full max-w-4xl w-full mx-auto px-10 py-5 overflow-x-hidden overflow-y-auto dark:prose-invert"
      >
        {messages?.map((message) => (
          <ChatContent
            key={message.id}
            message={message}
            chatId={message.chatId}
          />
        ))}
        <p className="max-w-4xl w-full my-5">{assistantResponse}</p>
      </div>
      <ChatInput
        onSubmit={handleSubmit}
        isStreaming={isLoading}
        onStop={handleStop}
      />
    </>
  );
}
