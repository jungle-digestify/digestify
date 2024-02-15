import { db } from "@/db";
import { workspace, userInWorkspace } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  const body = await req.json();
  const { teamSpaceId } = body;
  console.log("delete 요청 api:", body)
  try {
    const result = await db
      .delete(workspace)
      .where(eq(workspace.id, teamSpaceId));
  } catch {
    return new Response(JSON.stringify({ message: "워크스페이스 삭제 실패" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "워크스페이스 삭제 성공" }), {
    status: 200,
  });
}
