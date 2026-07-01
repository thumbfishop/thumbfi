import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThumbFi — The AI Thumbnail Studio for Modern Creators",
  description:
    "Generate click-worthy YouTube thumbnails in seconds using AI. Create faster, test smarter, and unlock rewards with the $THUMB ecosystem.",
  keywords: ["AI thumbnail generator", "YouTube thumbnails", "thumbnail maker", "THUMB token", "crypto creator tools"],
  openGraph: {
    title: "ThumbFi — AI Thumbnail Studio",
    description: "Generate viral thumbnails in seconds with AI. Powered by $THUMB.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF7EF]">
        <ClerkProvider appearance={{ theme: shadcn }} afterSignOutUrl="/">
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}