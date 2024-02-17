"use client";

import Image from "next/image";

import { Poppins } from "next/font/google";
import { cn, generateRandomString } from "@/lib/utils";
import CustomLink from "./custom-link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { workspace, userInWorkspace } from "../../db/schema";
import React, { useState, useRef, useEffect } from "react";
import { toast as sonnerToast } from "sonner";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TeamInviteButton } from "@/app/playground-hjin/[...params]/components/teamInviteButton";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CopyIcon } from "@radix-ui/react-icons";
import { db } from "@/db";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
type TeamSpace = {
  name: string | null;
  description: string | null;
  id: string | null;
  isHost: boolean;
};

export function MainNav({
  currentUserPersonalSpace,
  currentUserTeamSpace,
  defaultLayout,
  chatToggle,
  userId,
}: {
  currentUserPersonalSpace: string | null;
  currentUserTeamSpace: TeamSpace[] | null;
  defaultLayout: number[] | undefined;
  chatToggle: boolean | undefined;
  userId: string | undefined;
}) {
  const [title, setTitle] = useState("새 워크 스페이스");
  const [description, setDescription] = useState("");
  const [teamWorkspaceId, setteamWorkspaceId] = useState("");

  const handleTeamSpaceChange = (e: any) => {
    setteamWorkspaceId(e.target.value);
  };
  const { toast } = useToast();

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };
  const [guestEmail, setEmail] = useState("");
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const onClickCreate = async () => {
    const body = JSON.stringify({ title: title, description: description });
    try {
      await fetch("/api/team/create", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "팀 생성에 실패하였습니다.",
        description: "다시 시도해보시겠어요?",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    sonnerToast("팀 생성이 완료되었습니다!", {
      description: "친구를 초대하여 협업해보세요",
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });

    setTimeout(() => {
      window.location.reload();
    }, 800);
    return;
  };

  const onClickLeave = async (teamSpaceId: string) => {
    try {
      const leaveSpace = {
        teamSpaceId: teamSpaceId,
        userId: userId,
      };

      const response = await fetch("/api/team/leave", {
        method: "DELETE",
        body: JSON.stringify(leaveSpace),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "탈퇴에 실패하였습니다.",
          description: "다시 시도해보시겠어요?",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }

      console.log("response:", response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "탈퇴에 실패하였습니다.",
        description: "다시 시도해보시겠어요?",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    sonnerToast("탈퇴가 완료되었습니다!", {
      description: "",
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return;
  };
  const onClickDelete = async (teamSpaceId: string) => {
    try {
      const deleteSpace = {
        teamSpaceId: teamSpaceId,
      };

      const response = await fetch("/api/team/delete", {
        method: "DELETE",
        body: JSON.stringify(deleteSpace),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "서버 요청에 실패함");
      }

      console.log("response:", response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "삭제에 실패하였습니다.",
        description: "다시 시도해보시겠어요?",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    sonnerToast("삭제가 완료되었습니다!", {
      description: "",
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return;
  };

  async function sendContactEmail(sender: any) {
    const response = await fetch("/api/team/sendMail", {
      method: "POST",
      body: JSON.stringify(sender),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }
  const onClickInvite = async (teamSpaceId: string) => {
    const sender = {
      to: guestEmail,
      from: process.env.USER_EMAIL,
      html: `<p>당신은 워크스페이스에 초대되셨습니다.</p>
      <p>팀스페이스 가입에 워크스페이스 아이디를 입력하고 가입해주세요!</p>
      <p>워크스페이스 id: ${teamSpaceId}</p>`, // 잘 바꾸면 이쁨
      subject: "Digest 워크스페이스에 초대합니다.",
    };

    try {
      const sendresponse = await sendContactEmail(sender); // api/sendMail 호출

      console.log("sendres:", sendresponse);
      if (!sendresponse.ok) {
        sonnerToast("초대에 실패하였습니다", {
          description:
            "상대방이 가입되어 있는지,\n메일주소가 맞는지 확인해 주세요",
          action: {
            label: "OK",
            onClick: () => console.log("OK"),
          },
        });
        return;
      }
    } catch {
      toast({
        variant: "destructive",
        title: "초대에 실패하였습니다.",
        description: "다시 시도해보시겠어요?",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    // api/invite 호출
    try {
      const invite = {
        teamSpaceId: teamSpaceId,
        userEmail: guestEmail,
      };

      const response = await fetch("/api/team/invite", {
        method: "POST",
        body: JSON.stringify(invite),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "초대에 실패하였습니다.",
          description: "다시 시도해보시겠어요?",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }

      console.log("response:", response);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "초대에 실패하였습니다.",
        description: "다시 시도해보시겠어요?",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    sonnerToast("초대가 완료되었습니다!", {
      description: "상대방이 초대를 수락하면 팀으로 합류합니다.",
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });
  };

  const onClickJoin = async () => {
    try {
      const join = {
        teamSpaceId: teamWorkspaceId,
        userId: userId,
      };
      console.log("join:", join);
      const response = await fetch("/api/team/join", {
        method: "POST",
        body: JSON.stringify(join),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("response:", response, data);

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "가입에 실패하였습니다.",
          description: "다시 시도해보시겠어요?",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "가입에 실패하였습니다.",
        description: "다시 시도해보시겠어요?",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    sonnerToast("가입이 완료되었습니다!", {
      description: "팀원들과 공유해보세요!",
      action: {
        label: "OK",
        onClick: () => console.log("OK"),
      },
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return;
  };
  // console.log('defaultLayout=',defaultLayout);
  // console.log('chatToggle=',chatToggle);

  const [isVisible, setIsVisible] = useState(chatToggle);
  const [getSize, setSize] = useState(defaultLayout);

  // console.log('cookie isVisible1 =', isVisible);

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };

  const resize = getSize;
  const toggleVisibility = () => {
    // console.log('header !isVisible=', !isVisible);
    setIsVisible(!isVisible);
    // console.log('isVisible2 =', isVisible);
    document.cookie = `react-chatlist-toggle:show=${JSON.stringify(
      !isVisible
    )}`;

    if (resize) {
      if (isVisible) {
        //true
        resize[0] = 0;
        resize[1] += 10;
        resize[2] += 10;
      } else {
        resize[0] = 20;
        resize[1] -= 10;
        resize[2] -= 10;
      }
      onLayout(resize);
      // document.location=''; //여기서 값 바뀐거 서버에 어떻게 알려줘 ㅜ
    }
  };

  // useEffect(()=>{
  //   // console.log('clicked! ');
  //   if(resize){
  //     if(isVisible){ //true
  //       resize[0]=0;
  //       resize[1]+=10;
  //       resize[2]+=10;
  //     }else{
  //       resize[0]=20;
  //       resize[1]-=10;
  //       resize[2]-=10;

  //     }
  //     onLayout(resize);
  //   }
  // },[isVisible])
  return (
    <div className="flex items-center space-x-2 lg:space-x-6">
      {/* <button className="ListBtn" onClick={toggleVisibility}>
        리스트
      </button> */}
      <CustomLink href="/playground-hjin">
        <span className={cn("font-semibold text-2xl", font.className)}>
          Digest
        </span>
      </CustomLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/playground-hjin/${currentUserPersonalSpace}`}
              className={navigationMenuTriggerStyle()}
            >
              개인 스페이스
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>팀 스페이스</NavigationMenuTrigger>
            <NavigationMenuContent
              className="overflow-y-scroll"
              style={{ maxHeight: "400px" }}
            >
              <ul className="grid gap-3 p-6 md:w-[500px] lg:w-[500px] lg:grid-cols-[1fr]">
                {currentUserTeamSpace ? (
                  currentUserTeamSpace.map((teamSpace) => (
                    <Menubar
                      className="md:w-[500px] lg:w-[450px] md:h-[100px] "
                      key={teamSpace.id}
                    >
                      <MenubarMenu>
                        <MenubarTrigger className="sm:w-[10px] lg:w-[10px]">
                          <Button className="sm:w-[20px] lg:h-[98px] md:h-[98px] bg-white text-primary-foreground text-black hover:bg-black hover:text-white">
                            ⠿
                          </Button>
                        </MenubarTrigger>
                        <ListItem
                          key={teamSpace.id} // 고유한 key prop으로 id 사용
                          href={`/playground-hjin/${teamSpace.id}`} // 팀 스페이스의 Id를 사용하여 href 설정
                          title={teamSpace.name!} // 팀 스페이스의 title 설정
                          className="md:w-[500px] lg:w-[417px] md:h-[100px]"
                        >
                          {teamSpace.description}
                        </ListItem>
                        <MenubarContent>
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="sm:w-[180px] bg-white text-primary-foreground text-black hover:bg-black hover:text-white">
                                  팀 스페이스 초대
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>팀 스페이스 초대</DialogTitle>
                                  <DialogDescription>
                                    이메일을 입력하여 초대하세요! 메일로
                                    초대장이 발송됩니다.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="email"
                                      className="text-right"
                                    >
                                      Email
                                    </Label>
                                    <Input
                                      id="email"
                                      placeholder="email"
                                      className="col-span-3"
                                      onChange={handleEmailChange}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => onClickInvite(teamSpace.id!)}
                                  >
                                    초대하기
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                          <MenubarSeparator />
                          {!teamSpace.isHost ? (
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button className="sm:w-[180px] bg-white text-primary-foreground text-black hover:bg-black hover:text-white">
                                  팀 스페이스 탈퇴하기
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    팀 스페이스 탈퇴
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    이 팀스페이스를 탈퇴하시겠습니까?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onClickLeave(teamSpace.id!)}
                                  >
                                    탈퇴하기
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <></>
                          )}
                          <MenubarSeparator />
                          {teamSpace.isHost ? (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="sm:w-[180px] bg-white text-primary-foreground text-black hover:bg-black hover:text-white">
                                    팀 스페이스 삭제하기
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>팀 스페이스 삭제</DialogTitle>
                                    <DialogDescription>
                                      이 팀스페이스를 삭제하시겠습니까?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      onClick={() =>
                                        onClickDelete(teamSpace.id!)
                                      }
                                    >
                                      삭제하기
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          ) : (
                            <></>
                          )}
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  ))
                ) : (
                  <>
                    <p>No team spaces available.</p>
                  </>
                )}
              </ul>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="m-auto w-full">
                    팀 스페이스 생성하기
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>팀 스페이스 만들기</DialogTitle>
                    <DialogDescription>
                      팀 스페이스를 만들고 친구를 초대하여 협업하세요!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        className="col-span-3"
                        defaultValue="새 워크 스페이스"
                        onChange={handleTitleChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="desc" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="username"
                        className="col-span-3"
                        onChange={handleDescriptionChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={onClickCreate}>
                      팀 스페이스 만들기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>팀 스페이스 가입</NavigationMenuTrigger>
            <NavigationMenuContent>
              <Dialog>
                <DialogTrigger className="w-[425px] h-[100px]">
                  {/* <Button variant="outline">Share</Button> */}
                  가입하기
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>팀 스페이스 가입</DialogTitle>
                    <DialogDescription>
                      메일로 받은 코드를 통해 팀 스페이스에 들어가세요!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        workspaceId
                      </Label>
                      <Input
                        id="link"
                        placeholder="워크스페이스 id를 입력해 주세요"
                        onChange={handleTeamSpaceChange}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="px-3"
                      onClick={onClickJoin}
                    >
                      가입하기
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
