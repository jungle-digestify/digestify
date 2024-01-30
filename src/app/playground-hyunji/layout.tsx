import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import '../local-globals.css'
// //page 이동
// import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeGPT",
  description: "AI Generated Code Prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) 

{
  return (
    <html lang="en">
      <head>
        {/* <link href="path/to/node_modules/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet" /> */}
      </head>
      <body className={cn(inter.className, "w-screen h-screen bg-white dark:bg-black text-black dark:text-white")}>
        {children}
      </body>
    </html>
  );
}
