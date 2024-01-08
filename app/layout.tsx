import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/session-provider";
import { getSession } from "@/lib/next-auth";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hot Desk",
  description: "Hot desk booking web application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
        <body className={inter.className}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="hot-desk"
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
