import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "./db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const config = {
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      console.log("request", request);
      const { pathname } = request.nextUrl;
      console.log(pathname);
      if (pathname === "/playground-auth/middleware-example") {
        return !!auth;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
