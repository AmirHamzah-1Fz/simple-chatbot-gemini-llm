import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ThundersAI - Chat",
  description: "Chat with ThundersAI powered by Google Gemini",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
