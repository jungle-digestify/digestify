import { auth } from "@/auth";
import { db } from "@/db";
import { userInWorkspace, users, workspace } from "../db/schema";
import { eq } from "drizzle-orm";
import { inArray } from "drizzle-orm";

export const currentUser = async () => {
  const session = await auth();
  return session?.user ?? null;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};

export const getCurrentUserPersonalSpace = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const [userInfo] = await db
    .select()
    .from(users)
    .where(eq(users.id, String(user.id)));

  return userInfo.defaultWorkspace;
};

export const getCurrentUserTeamSpace = async () => {
  const session = await auth();
  const currentUserPersonalSpace = await getCurrentUserPersonalSpace();
  console.log("personal:", currentUserPersonalSpace);

  const relations = await db // 모든 관계 가져옴
    .select()
    .from(userInWorkspace)
    .where(eq(userInWorkspace.userId, String(session?.user.id)));
  // console.log("relations:",relations)

  const teamSpaceIds = relations
    .filter((relation) => relation.workspaceId !== currentUserPersonalSpace)
    .map((relation) => relation.workspaceId);
  // console.log("teamspaceids:",teamSpaceIds)

  let teamSpaces: any;
  if (teamSpaceIds.length != 0) {
    teamSpaces = await db
      .select()
      .from(workspace)
      .where(inArray(workspace.id, teamSpaceIds));
  }
  // console.log("teamSpaces:",teamSpaces)
  return teamSpaces;
};

export const getSpace = async (spaceId: string) => {
  const validateSpace = await db
    .select()
    .from(workspace)
    .where(eq(workspace.id, spaceId));

  return validateSpace[0];
};
