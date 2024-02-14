import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin");
  const session = await auth();
  console.log(session?.user);
  if (session?.user) {
    return new Response(JSON.stringify(session.user), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${origin}`,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }
  return new Response(null, {
    status: 401,
    headers: {
      "Access-Control-Allow-Origin": `${origin}`,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

// preflight - OPTIONS
export const OPTIONS = async (req: NextRequest, res: NextResponse) => {
  console.log("options..");
  const origin = req.headers.get("origin");
  console.log("origin:", origin);

  return new Response("OK", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": `${origin}`,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
};
