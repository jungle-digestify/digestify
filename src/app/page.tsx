import CustomLink from "@/components/playground/custom-link";

export default function Index() {
  return (
    <html lang="en">
      <body>
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
            <CustomLink href="/playground-ai" className="underline">
              playground-ai
            </CustomLink>
          </p>
          <p>
            <CustomLink href="/playground-hyunji" className="underline">
              playground-hyunji
            </CustomLink>
          </p>
          <p>
            <CustomLink href="/playground-hyunji/ai" className="underline">
              playground-hyunji/ai
            </CustomLink>
          </p>

          <p>
            <CustomLink href="/playground-hyunji/edit" className="underline">
              playground-hyunji/edit
            </CustomLink>
          </p>
          <p>
            Current{" "}
            <CustomLink href="https://nextjs.authjs.dev">
              NextAuth.js
            </CustomLink>{" "}
          </p>
        </div>
      </body>
    </html>
  );
}
