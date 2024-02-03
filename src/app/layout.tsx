import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "NextAuth.js Example",
  description:
    "This is an example site to demonstrate how to use NextAuth.js for authentication",
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </SessionProvider>
    </>
  );
}
