"use client";

import type { Message } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BiPlus, BiSend } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import { NewChatModal } from "../NewChatModal";
import { useSidebar } from "../SidebarContext";
import Image from "next/image";

import Logo from "../../assets/logo/thunders-ai.svg";

const HomeContent = () => {
  const { isOpen } = useSidebar();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const hasMessages = messages && messages.length > 0;

  const handleNewChat = () => {
    setIsModalOpen(true);
  };

  const handleChatCreated = (newChat: { id: string }) => {
    router.push(`/chat/${newChat.id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: trimmed }],
        }),
      });
      if (!response.ok) throw new Error("No response body");

      setMessages((prev) => [...prev, { role: "bot", content: "" }]);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let botMsg = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        botMsg += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "bot", content: botMsg };
          return updated;
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, error has occurred." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container max-w-3xl mx-auto w-full h-[100dvh] relative text-center">
        {/* Welcome Screen */}
        {!hasMessages && (
          <div className="w-full h-[calc(100dvh-120px)] -translate-y-6 flex flex-col items-center justify-center lg:mt-0 mt-0 min-h-[400px]">
            <Image src={Logo} alt="Logo" className="w-5 h-5 text-primary" />
            <h2 className="text-4xl leading-12 mb-8 mt-4">Welcome to ThundersAI</h2>
            <button
              onClick={handleNewChat}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              <BiPlus className="w-6 h-6" />
              New Chat
            </button>
            <div className="w-full text-center text-xs text-body mt-6">
              Quick start by add new chat session with Gemini.
            </div>
          </div>
        )}

        {/* Chatbox UI */}
        {hasMessages && (
          <div className="w-full h-[65dvh] mt-6 flex flex-col gap-10 px-2 py-6 overflow-y-auto items-stretch">
            {messages.map((msg, idx) =>
              msg.role === "user" ? (
                <div key={idx} className="flex w-full justify-end">
                  <div className="max-w-[70%] max-md:max-w-[75%] bg-gradient-to-r from-teal-600 to-background text-white rounded-2xl rounded-tr-md px-4 py-2 text-left shadow-md ml-auto prose prose-invert prose-p:my-0 prose-pre:bg-foreground-800 prose-pre:text-xs prose-pre:rounded-xl prose-pre:p-3 prose-code:bg-transparent prose-code:p-0 prose-code:text-head prose-a:text-head prose-blockquote:border-primary/40 prose-blockquote:text-primary/80 prose-ol:pl-6 prose-ul:pl-6 prose-li:marker:text-primary/60 prose-headings:font-bold prose-headings:text-head break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div
                  key={idx}
                  className="flex w-full justify-start items-start gap-3"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground-900 text-primary text-xl shrink-0">
                    <Image src={Logo} alt="Avatar" className="w-6 h-6" />
                  </div>
                  <div className="lg:max-w-[70%] max-md:max-w-[100%] bg-foreground-900 text-head rounded-2xl px-4 py-2 text-left shadow-md prose prose-invert prose-p:my-2 prose-pre:bg-foreground-800 prose-pre:text-xs prose-pre:rounded-xl prose-pre:p-3 prose-code:bg-transparent prose-code:p-0 prose-code:text-primary prose-a:text-primary prose-blockquote:border-primary/40 prose-blockquote:text-primary/80 prose-ol:pl-6 prose-ul:pl-6 prose-li:marker:text-primary/60 prose-headings:font-bold prose-headings:text-primary/90 break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {isLoading && idx === messages.length - 1 && (
                      <span className="animate-pulse ml-1">|</span>
                    )}
                  </div>
                </div>
              )
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* User Prompt */}
        {hasMessages && (
          <div
            className={`px-[5%] fixed bottom-6 max-lg:bottom-8 left-0 w-full z-20 bg-background/80 backdrop-blur-sm ${
              isOpen ? "lg:translate-x-1/9" : "lg:translate-x-0"
            }`}
          >
            <div className="container max-w-3xl mx-auto w-full">
              <form
                onSubmit={handleSubmit}
                className="w-full min-h-[100px] flex justify-between items-center gap-2 p-4 border border-border-700 rounded-3xl mt-4 mb-4"
              >
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="w-auto scale-btn transition-[background-color, scale] duration-200 ease-in-out h-auto flex items-center justify-center p-2 rounded-full hover:bg-foreground-800 border border-transparent hover:border-border-700 active:border-border-700 text-primary bg-foreground-900"
                >
                  <BiPlus className="shrink-0 w-7 h-7" />
                </button>{" "}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      handleSubmit(e as any);
                    }
                  }}
                  placeholder="Type your message here"
                  className="flex-1 h-auto px-2 min-h-[40px] ring-none outline-none resize-none placeholder:text-body leading-normal bg-transparent"
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  className="w-auto scale-btn transition-[background-color, scale] duration-200 ease-in-out h-auto flex items-center justify-center p-2 rounded-full hover:bg-foreground-800 border border-transparent hover:border-border-700 active:border-border-700 text-primary bg-foreground-900"
                >
                  <BiSend className="shrink-0 w-7 h-7 -rotate-[45deg]" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChatCreated={handleChatCreated}
      />
    </>
  );
};

export default HomeContent;
