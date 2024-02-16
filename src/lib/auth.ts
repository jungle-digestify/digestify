import { auth } from "@/auth";
import { db } from "@/db";
import { userInWorkspace, users, workspace } from "../db/schema";
import { eq, and } from "drizzle-orm";
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
    .select({
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      isHost: userInWorkspace.isHost,
    })
    .from(userInWorkspace)
    .leftJoin(workspace, eq(userInWorkspace.workspaceId, workspace.id))
    .where(
      and(
        eq(userInWorkspace.userId, String(session?.user.id)),
        eq(workspace.type, "team"),
        eq(userInWorkspace.accept, true),
      ),
    );
  // console.log("relations:",relations)

  console.log("team:", relations);
  return relations;
};

export const getSpace = async (spaceId: string) => {
  const validateSpace = await db
    .select()
    .from(workspace)
    .where(eq(workspace.id, spaceId));

  return validateSpace[0];
};
