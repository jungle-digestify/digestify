import { db } from "@/db";
import { workspace, userInWorkspace } from "@/db/schema";
import { generateRandomString } from "@/lib/utils";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const body = await req.json(); // body = ReadableStream
  const { title, description } = body;
  const spaceId = generateRandomString(16);
  const session = await auth();

  console.log("팀생성 Post 요청");
  console.log(session);
  try {
    const newSpace = await db
      .insert(workspace)
      .values({
        name: title,
        description: description,
        type: "team",
      })
      .returning();

    try {
      const relation = await db
        .insert(userInWorkspace)
        .values({
          workspaceId: newSpace[0].id,
          userId: session?.user.id ?? "",
          isHost: true,
          accept: true,
        })
        .returning();
    } catch (e) {
      return new Response(JSON.stringify({ message: "팀 생성 실패1" }), {
        status: 200,
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ message: "팀 생성 실패2" }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ message: "팀 생성 성공" }), {
    status: 500,
  });
}
