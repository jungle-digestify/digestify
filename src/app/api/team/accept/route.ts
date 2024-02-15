import { db } from "@/db";
import { userInWorkspace } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { workspaceId, userId } = body;
  try {
    const result = await db
      .insert(userInWorkspace)
      .values({ workspaceId: workspaceId, userId: userId, accept: true });
  } catch {
    return new Response(JSON.stringify({ message: "워크스페이스 가입 실패" }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ message: "워크스페이스 가입 성공" }), {
    status: 500,
  });
}
