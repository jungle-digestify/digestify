"use client";
import { MessageType } from "./chat-content-wrapper";
import { number } from "zod";
import Tiptap from "@/components/Tiptap";
import { PenBoxIcon } from "lucide-react";
import rehypeRaw from "rehype-raw";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

export default function ChatContent({
  chatId,
  message,
}: {
  message: MessageType;
  chatId: string | undefined;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(message.content);

  const updateSubmit = async (value: string) => {
    let body = "";
    body = JSON.stringify({ content: value, id: message.id });

    try {
      await fetch("/api/update", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        alert("Error sending message");
      }
    }
  };

  return (
    <div className="h-full max-w-4xl w-full mx-auto flex-1 px-10 py-5 overflow-x-hidden overflow-y-auto prose dark:prose-invert">
      {isEditing ? (
        <Tiptap
          description={
            document.getElementById("markdownHolder " + message.id)!.innerHTML
          }
          onChange={(newRichText) => setContent(newRichText)}
          id={message.id.toString()}
        />
      ) : (
        <div id={"markdownHolder " + message.id}>
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
            {content}
          </Markdown>
        </div>
      )}
      <button
        className={
          isLoading ? "hidden" : "px-4 py-2 ml-[95%] al font-medium rounded "
        }
        onClick={() => {
          if (isEditing)
            updateSubmit(
              document.getElementById("markdownHolder " + message.id)!.innerHTML
            );
          setIsEditing(!isEditing);
        }}
      >
        <PenBoxIcon></PenBoxIcon>
      </button>
    </div>
  );
}
