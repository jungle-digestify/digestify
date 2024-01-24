"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export const DeleteButton = (post: { id: number }) => {
  const router = useRouter();
  const { mutateAsync } = api.post.delete.useMutation({
    onSuccess: () => router.refresh(), // Refresh page content on success
  });

  return (
    <button
      className="border p-2 font-bold text-red-300"
      onClick={async () => await mutateAsync({ id: post.id })}
    >
      Delete
    </button>
  );
};
