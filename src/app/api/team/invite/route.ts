import { db } from "@/db";
import { users, userInWorkspace } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
    const request = await req.json(); // body = ReadableStream
    const workspaceId = request.teamSpaceId;
    const userEmail = request.userEmail;
    try{
        const [userId] = await db
            .select({userId: users.id})
            .from(users)
            .where(eq(users.email,userEmail))
            
        try{
            await db // userInSpace 관계 넣기
                .insert(userInWorkspace)
                .values({
                    workspaceId: workspaceId,
                    userId: userId.userId,
                    isHost: false,
                    accept: false,
                });
    } catch{
        return new Response(JSON.stringify({ message: "초대에 실패함" }), {
            status: 500,
          });
    }
    }catch{
        return new Response(JSON.stringify({ message: "초대에 실패함" }), {
            status: 500,
          });
    }
    

    return new Response(JSON.stringify({ message: "초대에 성공함" }), {
        status: 200,
      })
}