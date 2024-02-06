import { db } from "@/db";
import { asc, desc, eq } from "drizzle-orm";
import { chats as chatsTable } from "@/db/schema";
import { unstable_cache as cache } from "next/cache";
import Link from "next/link";
import { auth } from "@/auth";
import { SignIn, SignOut } from "@/components/playground/auth-components";
import { currentUser, getCurrentUserPersonalSpace } from "@/lib/auth";

const getChats = cache(
  async (personalSpace: string | null ) =>
    await db
      .select({ id: chatsTable.id, name: chatsTable.name })
      .from(chatsTable)
      .where(eq(chatsTable.workspaceId, personalSpace ?? ""))
      .orderBy(desc(chatsTable.createdAt))
      ,
  ["get-chats-for-chat-list"],
  {
    tags: ["get-chats-for-chat-list"],
  }
);
export default async function ChatList() {
  const session = await currentUser();
  const currentUserPersonalSpace = await getCurrentUserPersonalSpace();

  const chats =  session ? await getChats(currentUserPersonalSpace) : [];

  // console.log(messagesTable)
  return (
    <div className="chatlistUp flex h-full">
      <div className="chatlist w-full h-full flex flex-col justify-between">
      <div className="flex flex-col gap-y-4">
        <a key="new" href={"/playground-hyunji"} className="truncate">
          New Chat
        </a>
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/playground-hjin/${chat.id}`}
            className="truncate"
          >
            {chat.name}
          </Link>
        ))}
      </div>

      {session ? (
        <div className="flex flex-col">
          <p>{session.name}</p>
          <SignOut>LogOut</SignOut>
        </div>
      ) : (
        <div className="flex flex-col">
          <SignIn>Sign in</SignIn>
        </div>
      )}
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="flex flex-col p-10 gap-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-300 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                <div className="h-2 bg-gray-300 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
