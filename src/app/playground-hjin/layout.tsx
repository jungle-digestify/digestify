import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Footer from "@/components/playground/footer";
import Header from "@/components/playground/header";
import { Toaster } from "@/components/ui/sonner";
import "../local2.css";
import { cn } from "@/lib/utils";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin-ext"] });

export const metadata: Metadata = {
  title: "digest",
  description: "youtube digestifier",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${notoSansKr.className} antialiased`}>
        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Header />
          <main className="z-0 flex-auto w-full overflow-y-hidden">
            {children}
          </main>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  );
}
