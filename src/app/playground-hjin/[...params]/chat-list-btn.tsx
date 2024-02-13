"use client";
import { useState } from "react";
import { FaList } from "react-icons/fa6";

// //page 이동
// import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

export default function ChatListBtn() {
  const [isDropdownActive, setDropdownActive] = useState(false);
  const toggleDropdown = () => {
    // console.log('clicked ');
    setDropdownActive(!isDropdownActive);
    console.log("isDropdownActive =", isDropdownActive);
  };

  return (
    <div>
      <button className="ChatListBtn" onClick={toggleDropdown}>
        리스트
      </button>
    </div>
  );
}
