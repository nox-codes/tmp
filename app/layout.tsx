import type { Metadata } from "next";
import "./globals.css";
import DynamicNav from "./componenets/dynamicNav";
import ConditionalSideBar from "./componenets/conditionalSideBar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "UniLock — Lock into your university's resources with ease.",
  description: "Access curated course materials, practice past questions with CBT simulation, track your academic performance, and study smarter — all in one platform designed for UNILAG students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <DynamicNav />
          <div className="flex flex-1 pt-12">
            <ConditionalSideBar />
            <main className="flex-1 w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}