import { MainNav } from "./main-nav";
import UserButton from "./user-button";
import {getCurrentUserPersonalSpace, getCurrentUserTeamSpace} from "../../lib/auth"

export default async function Header() {

  
  const currentUserPersonalSpace = await getCurrentUserPersonalSpace() || null
  const currentUserTeamSpace = await getCurrentUserTeamSpace() || null
  
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
        <MainNav currentUserPersonalSpace={currentUserPersonalSpace} currentUserTeamSpace={currentUserTeamSpace}/>
        <UserButton />
      </div>
    </header>
  );
}