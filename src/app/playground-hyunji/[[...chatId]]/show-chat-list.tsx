"use client"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { chats as chatsTable } from "@/db/schema"
import { unstable_cache as cache } from "next/cache"
import Link from "next/link"
import { auth } from "@/auth"
import { SignIn, SignOut } from "@/components/playground/auth-components";

import { useState, Suspense } from 'react';
import ChatList, { ChatListSkeleton } from "./chat-list"
import ChatContentWrapper from "./chat-content-wrapper"

import { FaList } from "react-icons/fa6";

// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
//   } from "@/components/ui/accordion"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function ShowChatList(all : any) {
  const defaultLayout = all.defaultSize;

  return (
    <div>
    <ResizablePanel defaultSize={defaultLayout} className="chat-list">
      <div>
        <Suspense fallback={<ChatListSkeleton />}>
          <ChatList chatId ={chatId}/>
        </Suspense>
      </div>
        
    </ResizablePanel>
    </div>
  )
  }