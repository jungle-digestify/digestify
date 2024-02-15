import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";
import {
  users,
  twoFactorConfirmation as twoFactorConfirmationTable,
  UserRole,
  workspace,
  userInWorkspace,
} from "./db/schema";
import { eq } from "drizzle-orm";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async createUser({ user }) {
      console.log("user", user);
      if (user.id === undefined) return;
      const existingUser = await getUserById(user.id);
      console.log("existingUser", existingUser);
      if (!existingUser) return;
      if (!existingUser.defaultWorkspace) {
        const space = await db
          .insert(workspace) //개인 스페이스 생성
          .values({
            name: "personalSpace",
            description: "personalSpace",
            type: "personal",
          })
          .returning();

        await db // 유저 테이블에 개인 스페이스 넣기
          .update(users)
          .set({ defaultWorkspace: space[0].id })
          .where(eq(users.id, String(existingUser.id)));

        await db // userInSpace 관계 넣기
          .insert(userInWorkspace)
          .values({
            workspaceId: space[0].id,
            userId: existingUser.id,
            isHost: true,
            accept: true,
          });
      }
    },

    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }
      if (user.id === undefined) return false;
      const existingUser = await getUserById(user.id);
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

        if (!existingUser.defaultWorkspace) {
          const space = await db
            .insert(workspace) //개인 스페이스 생성
            .values({
              name: "personalSpace",
              description: "personalSpace",
              type: "personal",
            })
            .returning();
  
          await db // 유저 테이블에 개인 스페이스 넣기
            .update(users)
            .set({ defaultWorkspace: space[0].id })
            .where(eq(users.id, String(existingUser.id)));
  
          await db // userInSpace 관계 넣기
            .insert(userInWorkspace)
            .values({
              workspaceId: space[0].id,
              userId: existingUser.id,
              isHost: true,
              accept: true,
            });
        }
      
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db
          .delete(twoFactorConfirmationTable)
          .where(eq(twoFactorConfirmationTable.id, twoFactorConfirmation.id));
      }
      

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.defaultWorkspace = token.defaultWorkspace as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.defaultWorkspace = existingUser.defaultWorkspace;

      return token;
    },
  },
  session: { strategy: "jwt" },

  ...authConfig,
});
