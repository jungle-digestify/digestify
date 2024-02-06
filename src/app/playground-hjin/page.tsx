import CustomLink from "@/components/playground/custom-link";
import packageJSON from "@/../package.json";

export default function Index() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink>{" "}
        for authentication. Check out the{" "}
        <CustomLink
          href="/playground-auth/server-example"
          className="underline"
        >
          Server
        </CustomLink>{" "}
        and the{" "}
        <CustomLink
          href="/playground-auth/client-example"
          className="underline"
        >
          Client
        </CustomLink>{" "}
        examples to see how to secure pages and get session data.
      </p>
      <p>
        Current{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink>{" "}
        version: <em>next-auth@{packageJSON.dependencies["next-auth"]}</em>
      </p>
    </div>
  );
}