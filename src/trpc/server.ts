import "server-only"; // Make sure you can't import this on client

import { headers } from "next/headers";
import { appRouter } from "@/server/app-router";
import { db } from "@/db";

export const api = appRouter.createCaller({
  db: db,
  headers: headers(),
});
