import NextAuth, { type DefaultSession } from "next-auth";
import type { UserRole } from "@/db/schema";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  id: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
