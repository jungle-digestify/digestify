import { auth } from "@/auth";

export const GET = auth((req) => {
  if (req.auth) {
    return Response.json({ data: "Protected data" });
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 });
}) as any; // TODO: Fix `auth()` return type
// 이렇게 만들지 말고 tRPC를 사용할 것(server/routers
