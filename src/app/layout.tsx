import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "NextAuth.js Example",
  description:
    "This is an example site to demonstrate how to use NextAuth.js for authentication",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
    </>
  );
}
