import { db } from "@/db";
import { userInWorkspace } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { teamSpaceId, userId } = body;

  try {
    const result: { accept: boolean }[] = await db
      .update(userInWorkspace)
      .set({ accept: true })
      .where(
        and(
          eq(userInWorkspace.workspaceId, teamSpaceId),
          eq(userInWorkspace.userId, userId)
        )
      )
      .returning({ accept: userInWorkspace.accept });
    // console.log("join: result:", result, "!");
    if (result.length === 0) {
      return new Response(
        JSON.stringify({ message: "워크스페이스 가입 실패!" }),
        {
          status: 500,
        }
      );
    }
  } catch {
    return new Response(JSON.stringify({ message: "워크스페이스 가입 실패" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "워크스페이스 가입 성공" }), {
    status: 200,
  });
}
