import { db } from "@/db";
import { workspace, userInWorkspace } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { workspaceId } = body;
  try {
    const result = await db
      .delete(workspace)
      .where(eq(workspace.id, workspaceId));
  } catch {
    return new Response(JSON.stringify({ message: "워크스페이스 삭제 실패" }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ message: "워크스페이스 삭제 성공" }), {
    status: 500,
  });
}
