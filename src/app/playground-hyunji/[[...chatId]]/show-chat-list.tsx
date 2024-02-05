"use client"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { chats as chatsTable } from "@/db/schema"
import { unstable_cache as cache } from "next/cache"
import Link from "next/link"
import { auth } from "@/auth"
import { SignIn, SignOut } from "@/components/playground/auth-components";

import { useState } from 'react';
import { FaList } from "react-icons/fa6";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

export default function ShowChatList() {
  

  return (
    <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
    </AccordionItem>
    </Accordion>
  )
  }