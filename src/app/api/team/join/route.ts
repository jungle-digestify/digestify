import { db } from "@/db";
import { userInWorkspace } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { teamSpaceId, userId } = body;

  console.log("팀 스페이스 가입 버튼 POST 요청!" , body,teamSpaceId, userId)
  try {
    const result = await db
      .select()
      .from(userInWorkspace)
      .where(and(eq(userInWorkspace.workspaceId, teamSpaceId), eq(userInWorkspace.userId, userId)))
    
    if(!result){
      return new Response(JSON.stringify({ message: "워크스페이스 가입 실패" }), {
        status: 500,
      });
    }
  } catch{
    return new Response(JSON.stringify({ message: "워크스페이스 가입 실패" }), {
      status: 500,
    });
  }

  try {
    const result = await db
      .update(userInWorkspace)
      .set({ accept : true})
      .where(and(eq(userInWorkspace.workspaceId, teamSpaceId), eq(userInWorkspace.userId, userId)));
    
    console.log("join: result:", result)
  } catch {
    return new Response(JSON.stringify({ message: "워크스페이스 가입 실패" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "워크스페이스 가입 성공" }), {
    status: 200,
  });
}
