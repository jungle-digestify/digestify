import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  console.log(session?.user);
  if (session?.user) {
    return new Response(JSON.stringify(session.user), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin":
          "chrome-extension://lnkfkjfpkmlgjgodcpeiijicinihaegg",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  return new Response(null, {
    status: 401,
    headers: {
      "Access-Control-Allow-Origin":
        "chrome-extension://lnkfkjfpkmlgjgodcpeiijicinihaegg",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
