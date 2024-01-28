import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import authConfig from "@/auth.config";
import { db } from "./db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, users } from "./db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const config = {
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: false,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },

  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, token.sub));

      if (!existingUser) return token;

      const existingAccount = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, existingUser.id));

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    //   authorized({ request, auth }) {
    //     console.log("request", request);
    //     const { pathname } = request.nextUrl;
    //     console.log(pathname);
    //     if (pathname === "/playground-auth/middleware-example") {
    //       return !!auth;
    //     }
    //     return true;
    //   },
  },
  ...authConfig,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
