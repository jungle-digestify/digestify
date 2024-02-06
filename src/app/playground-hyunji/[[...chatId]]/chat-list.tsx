import { db } from "@/db";
import { asc, desc, eq } from "drizzle-orm";
import { chats as chatsTable } from "@/db/schema";
import { unstable_cache as cache } from "next/cache";
import Link from "next/link";
import { auth } from "@/auth";
import { SignIn, SignOut } from "@/components/playground/auth-components";
import { currentUser } from "@/lib/auth";

const getChats = cache(
  async (userId: string) =>
    await db
      .select({ id: chatsTable.id, name: chatsTable.name })
      .from(chatsTable)
      .where(eq(chatsTable.userId, userId))
      .orderBy(desc(chatsTable.createdAt)),
  ["get-chats-for-chat-list"],
  {
    tags: ["get-chats-for-chat-list"],
  }
);
export default async function ChatList(all: any) {
  const user = await currentUser();

  const chats = user ? await getChats(user.id) : [];

  // console.log('chats =', all);
  const getChatId = all.chatId;
  return (
    <div className="chatlistUp flex h-full">
      <div className="chatlist w-full h-full">
        <div className="flex flex-col gap-y-1 mx-1">
          {/* <a key="new" href={"/playground-hyunji"} className="truncate inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start">
            New Chat
          </a> */}
          <a key="" className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start" href="/playground-hyunji/edit">
            Show Thumbnail
          </a>
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/playground-hyunji/${chat.id}`}
              className={`chatlistitem truncate inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start`}
              style={{backgroundColor: getChatId === chat.id ? 'black' : '', color: getChatId === chat.id ? 'white':''}}
              dangerouslySetInnerHTML={{ __html: chat.name }}
            >
              {/* {chat.name} */}
            </Link>
          ))}
        </div>

        {user ? (
          <div className="flex flex-col">
            <p>{user.name}</p>
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
