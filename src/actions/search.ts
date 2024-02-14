"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { db } from "@/db";
import { signIn } from "@/auth";
import { SearchSchema } from "@/zod-schemas";

export const searchAction = async (values: z.infer<typeof SearchSchema>) => {
  const validatedFields = SearchSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { query } = validatedFields.data;

  console.log(query);

  return { success: "아직 만드는 중" };
};
