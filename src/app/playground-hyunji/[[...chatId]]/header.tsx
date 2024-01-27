import { db } from "@/db"
import { eq } from "drizzle-orm"
import { chats as chatsTable } from "@/db/schema"
import { unstable_cache as cache } from "next/cache"
// import Link from "next/link"
import { auth } from "@/auth"
import { SignIn, SignOut } from "@/components/playground/auth-components";

const getChats = cache(
  async (userId: string) =>
    await db
      .select({ id: chatsTable.id, name: chatsTable.name })
      .from(chatsTable)
      .where(eq(chatsTable.userId, userId))
      .all(),
  ["get-chats-for-chat-list"],
  {
    tags: ["get-chats-for-chat-list"],
  }
)
export default async function ChatHeader() {
  const session = await auth()
  if (session?.user == undefined) throw "error"
  if (session?.user) {
    // filter out sensitive data before passing to client.
    // @ts-expect-error TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }
  const chats = session.user ? await getChats(session.user.id) : []

  return (
    <div className="ChatHeader">
      {session.user ? (
        <div className="flex flex-col">
          <p>{session.user.name}</p>
          <SignOut>LogOut</SignOut>
        </div>
      ) : (
        <div className="flex flex-col">
          <SignIn>Sign in</SignIn>
        </div>
      )}
    </div>
  )
}

