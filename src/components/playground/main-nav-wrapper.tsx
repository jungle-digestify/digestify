"use client"
import { RecoilRoot } from "recoil"
import { MainNav } from "./main-nav"

type TeamSpace = {
    name: string | null;
    description: string | null;
    id: string | null;
    isHost: boolean;
  };

export default function MainNavWrap({
    currentUserPersonalSpace,
    currentUserTeamSpace,
    defaultLayout,
    chatToggle,
    userId,
    }: {
    currentUserPersonalSpace: string | null;
    currentUserTeamSpace: TeamSpace[] | null;
    defaultLayout: number[] | undefined;
    chatToggle: boolean;
    userId: string | undefined;
    }) {


    return(
        <RecoilRoot>
            <MainNav
                currentUserPersonalSpace={currentUserPersonalSpace}
                currentUserTeamSpace={currentUserTeamSpace}
                defaultLayout={defaultLayout}
                chatToggle={chatToggle}
                userId={userId}
            />
        </RecoilRoot>
        
    );
}
