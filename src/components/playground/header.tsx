import { MainNav } from "./main-nav";
import UserButton from "./user-button";
import {
  currentUser,
  getCurrentUserPersonalSpace,
  getCurrentUserTeamSpace,
} from "../../lib/auth";
import { cookies } from "next/headers";

export default async function Header() {
  const currentUserTeamSpace = (await getCurrentUserTeamSpace()) || null;
  const session = (await currentUser()) || null;
  const currentUserPersonalSpace = session?.defaultWorkspace || null;

  const layout = cookies().get("react-resizable-panels:layout");
  const toggleList = cookies().get("react-chatlist-toggle:show");

  let defaultLayout, chatToggle;
  if (layout) {
    defaultLayout = JSON.parse(layout.value);
  }
  if (toggleList) {
    chatToggle = JSON.parse(toggleList.value);
  } else {
    chatToggle = "false";
  }

  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
        <MainNav
          currentUserPersonalSpace={currentUserPersonalSpace}
          currentUserTeamSpace={currentUserTeamSpace}
          defaultLayout={defaultLayout}
          chatToggle={chatToggle}
          userId={session?.id}
        />
        <UserButton />
      </div>
    </header>
  );
}
