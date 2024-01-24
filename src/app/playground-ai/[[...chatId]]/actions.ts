"use server"

import { auth } from "@/auth"
import { db } from "@/db"
import { chats, users as userTable } from "@/db/schema"
import { generateRandomString } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { revalidateTag } from "next/cache"


export async function createChat() {

  const session = await auth()

  if (session?.user == undefined) throw "error"
  console.log("createChat", session)
  
  const users = await db.select().from(userTable).where(eq(userTable.name, session.user.name!))
  
  const id = generateRandomString(16)
  const result = await db.insert(chats).values({
    id: id,
    name: id,
    userId: users[0].id,
  }).returning()
  console.log("result:",result)

  revalidateTag("get-chats-for-chat-list")

  return {
    id
  }
}

export type CreateChat = typeof createChat