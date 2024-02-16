import { db } from "@/db";
import { eq } from "drizzle-orm";
import { chats as chatsTable } from "@/db/schema";
import { unstable_cache as cache } from "next/cache";
// import Link from "next/link"
import { auth } from "@/auth";
import { SignIn, SignOut } from "@/components/playground/auth-components";
import { currentUser } from "@/lib/auth";

const getChats = cache(
  async (personalSpace: string) =>
    await db
      .select({ id: chatsTable.id, name: chatsTable.name })
      .from(chatsTable)
      .where(eq(chatsTable.workspaceId, personalSpace)),
  ["get-chats-for-chat-list"],
  {
    tags: ["get-chats-for-chat-list"],
  },
);
export default async function ChatHeader() {
  const session = await auth();
  const user = session?.user ?? null;

  const chats = user ? await getChats(user.defaultWorkspace!) : [];

  return (
    <div className="ChatHeader">
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
  );
}
