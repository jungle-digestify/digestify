"use client";

import { Button } from "@/app/playground-hjin/ui/button";
import { Home } from "lucide-react";
import { signIn } from "next-auth/react";

export default function AccessDenied() {
  const returnToMain = () => {
    window.location.href = `/playground-hjin/`;

    return;
  };
  return (
    <div className="w-full h-full flex flex-col gap-8 justify-center align-middle items-center">
      <h1>허가되지 않은 페이지입니다</h1>
      <p> 버튼을 눌러 홈으로 돌아가 주세요</p>
      <Button onClick={returnToMain} className="gap-2">
        <Home></Home> 홈으로 돌아가기
      </Button>
    </div>
  );
}
