import NextAuth, { type DefaultSession } from "next-auth";
import type { UserRole, UserSelect } from "@/db/schema";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
  defaultWorkspace: string | null;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
