import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/playground/footer";
import Header from "@/components/playground/header";
import { Toaster } from "@/components/ui/sonner";
import "../local2.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "digest",
  description: "youtube digestifier",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Header />
          <main className="flex-auto w-full">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
