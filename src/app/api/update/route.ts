import { db } from "@/db"
import { messages } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { auth } from "@/auth"
 
export async function POST(req: Request) {
    const { content, chatId } = await req.json()
    const session = await auth()
    if (session?.user == undefined) throw "error"
    
    const sucess = await db.update(messages).set({content:content}).where(and(eq(messages.chatId,chatId),eq(messages.role, "assistant")))

    return new Response()
}