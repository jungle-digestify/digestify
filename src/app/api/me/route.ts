import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  const nextHeaders = headers();

  console.log("nextUrl: ", req.nextUrl.origin);
  console.log("url: ", req.url);
  console.log("header host: ", nextHeaders.get("host"));
  const session = await auth();
  console.log(session?.user);
  if (session?.user) {
    return new Response(JSON.stringify(session.user), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${req.nextUrl.origin}`,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  return new Response(null, {
    status: 401,
    headers: {
      "Access-Control-Allow-Origin": `${req.nextUrl.origin}`,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// preflight - OPTIONS
export const OPTIONS = async (req: NextRequest, res: NextResponse) => {
  const nextHeaders = headers();

  console.log("options..");
  console.log("nextUrl: ", req.nextUrl);
  console.log("url: ", req.url);
  console.log("header host: ", nextHeaders.get("host"));

  return new Response("OK", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": `${req.nextUrl.origin}`,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
