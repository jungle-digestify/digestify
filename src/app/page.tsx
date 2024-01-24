import CustomLink from "@/components/playground/custom-link";

export default function Index() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">
        플레이그라운드를 포함한 엔트리포인트
      </h1>
      <p>
        <CustomLink href="/playground-auth" className="underline">
          playground-auth
        </CustomLink>
      </p>
      <p>
        <CustomLink href="/playground-trpc" className="underline">
          playground-trpc
        </CustomLink>
      </p>
      <p>
        Current{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink>{" "}
      </p>
    </div>
  );
}
