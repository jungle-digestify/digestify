"use client";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { chats as chatsTable } from "@/db/schema";
import { unstable_cache as cache } from "next/cache";
import Link from "next/link";
import { auth } from "@/auth";
import { SignIn, SignOut } from "@/components/playground/auth-components";

import { useState } from "react";
import { FaList } from "react-icons/fa6";

// //page 이동
// import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

export default function TeamMenu() {
  const [isDropdownActive, setDropdownActive] = useState(false);

  const toggleDropdown = () => {
    // console.log('clicked ');
    setDropdownActive(!isDropdownActive);
  };

  // /ai/page.tsx 로 이동
  //   const navigate = useNavigate();

  //   const movePage = (path : any) => {
  //     navigate(path);
  //   };

  return (
    <div className="TeamSelectDiv">
      <div className="dropdown">
        <button
          className="TeamSelectBtn outline-none focus:outline-none bg-black"
          onClick={toggleDropdown}
        >
          <FaList size={30} color="white" />
        </button>
        <div
          className={isDropdownActive ? "TeamDropDown active" : "TeamDropDown"}
        >
          <ul>
            <li>현재 워크스페이스</li>
            <li>팀 1 워크스페이스</li>
            <li>팀 2 워크스페이스</li>
          </ul>
        </div>
      </div>
      <a href="../playground-hyunji/ai" className="aiBtn">
        ai
      </a>
    </div>
  );
}
