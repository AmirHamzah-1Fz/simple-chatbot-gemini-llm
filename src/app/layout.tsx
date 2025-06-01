import { SidebarProvider } from "@/components/SidebarContext";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thunders AI - Quick Start",
  description: "Chat with ThundersAI powered by Google Gemini AI.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Thunders AI - Quick Start",
    description: "Chat with ThundersAI powered by Google Gemini AI.",
    url: "https://thunders-ai.vercel.app/",
    siteName: "Thunders AI",
    images: [
      {
        url: "/thunders-ai-favicon.svg",
        width: 400,
        height: 400,
        alt: "Thunders AI Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/thunders-ai-favicon.svg" type="image/svg+xml" />
      <body className={figtree.className}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
