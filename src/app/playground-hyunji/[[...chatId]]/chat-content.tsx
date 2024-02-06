"use client";

import { useState, useRef, useId } from "react";
import ChatInput from "@/components/chat-input";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CreateChat } from "./actions";
import { convertFileToBase64 } from "@/lib/utils";
import { number } from "zod";
import Tiptap from "@/components/Tiptap";
import { PenBoxIcon } from "lucide-react";
import rehypeRaw from "rehype-raw";

import { Toggle } from "@/components/ui/toggle"
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons"

export default function ChatContent({
  createChat,
  script,
  initialAssistantResponse = "",
  messageResponseId,
}: {
  createChat: CreateChat;
  script: string;
  initialAssistantResponse?: string;
  messageResponseId?: string;
}) {
  // console.log("initialAssistantResponse:",initialAssistantResponse)
  const [assisnantResponse, setAssistantResponse] = useState(
    initialAssistantResponse
  );
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [chatId, setChatId] = useState("");
  const [isEditing, setIsEditing] = useState(false)
  const [messageId, setMessageId] = useState("");

  const updateSubmit = async (value: string)=> {
    setIsLoading(true)
    setMessageId(messageResponseId!.toString())

    let body = ""
    body = JSON.stringify({ content: value, id: messageResponseId })

    try {
      abortControllerRef.current = new AbortController()
      await fetch("/api/update", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      })
    } catch (error: any) {
      if (error.name !== "AbortError") {
        alert("Error sending message")
      }
    }

    setIsLoading(false)
  }

  const handleSubmit = async (value: string, file?: File) => {
    let currentChatId = chatId;
    if (!currentChatId) {
      // create a new chat in the database
      const chat = await createChat();
      if(chat.id !==undefined) {

      currentChatId = chat.id;
      // and get the id and store it in state
      setChatId(chat.id);
    }
    }

    setMessageId(messageResponseId!.toString())
    setIsLoading(true);
    setAssistantResponse("");

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

    // console.log("", value, file);
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
        alert("Error sending message");
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
        alert("Error sending message");
      }
    }
    abortControllerRef.current = null;
    setIsLoading(false);
  };
  // console.log('response = ', assisnantResponse);
  if (script !== "") {
    handleSubmit(script);
  }

  const handleStop = () => {
    if (!abortControllerRef.current) {
      return;
    }
    abortControllerRef.current.abort();
    abortControllerRef.current = null;
  };

  return (
    <>
      <div className="h-full max-w-4xl w-full mx-auto flex-1 px-5 py-5 prose dark:prose-invert overflow-y-auto">
        {isEditing ? (
          <Tiptap
            description={document.getElementById('markdownHolder ' + messageId)!.innerHTML}
            onChange={(newRichText) => setAssistantResponse(newRichText)} id={messageId}          />
        ):(
          <div id={"markdownHolder "+messageId}>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <SyntaxHighlighter
                      PreTag="div"
                      // eslint-disable-next-line react/no-children-prop
                      children={String(children).replace(/\n$/, "")}
                      language={match[1]}
                      style={dark}
                      wrapLines={true}
                      wrapLongLines={true}
                    />
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                },
              }}
              rehypePlugins={[rehypeRaw]}
            >
              {assisnantResponse}
            </Markdown>
          </div>
        )}
        {/* <button className={messageResponseId ? (isLoading ? ("hidden"):("px-4 py-2 ml-[95%] al font-medium rounded")):("hidden")} onClick={() => { if(isEditing) updateSubmit(document.getElementById('markdownHolder '+messageId)!.innerHTML);setIsEditing(!isEditing)}}><PenBoxIcon className="h-4 w-4" style={{fill: 'black'}}></PenBoxIcon></button> */}
        <div className="w-full flex justify-end">
          <Toggle variant="outline" aria-label="Toggle italic"
          onClick={() => { if(isEditing) updateSubmit(document.getElementById('markdownHolder '+messageId)!.innerHTML);setIsEditing(!isEditing)}}>
            <PenBoxIcon className="h-4 w-4" />
          </Toggle>
        </div>
        
      </div>
      <ChatInput
        onSubmit={handleSubmit}
        isStreaming={isLoading}
        onStop={handleStop}
      />
    </>
  );
}
