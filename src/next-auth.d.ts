import NextAuth, { type DefaultSession } from "next-auth";
import type { UserRole, UserSelect } from "@/db/schema";

export type ExtendedUser = DefaultSession["user"] &
  UserSelect & {
    isOAuth: boolean;
  };

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
