import { db } from "@/db";
import { workspace, userInWorkspace } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { teamSpaceId, userId } = body;

  try {
    const result = await db
      .delete(userInWorkspace)
      .where(
        and(
          eq(userInWorkspace.workspaceId, teamSpaceId),
          eq(userInWorkspace.userId, userId),
        ),
      );
  } catch {
    return new Response(JSON.stringify({ message: "워크스페이스 탈퇴 실패" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "워크스페이스 탈퇴 성공" }), {
    status: 200,
  });
}
