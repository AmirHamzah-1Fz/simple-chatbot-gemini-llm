"use client";

import { NewChatModal } from "@/components/NewChatModal";
import type { Chat, Message } from "@/lib/supabase-client";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { BiCopy, BiPlus, BiSend } from "react-icons/bi";
import { RiSupabaseFill } from "react-icons/ri";
import { BsCheckLg } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Suggestion from "@/components/home/Suggestion";

import Layout from "@/components/Layout";
import { useSidebar } from "@/components/SidebarContext";

// This ensures the page is dynamically rendered
export const dynamic = "force-dynamic";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const { isOpen } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChat = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) {
        console.error("Error fetching chat:", error);
        return;
      }

      setChat(data);
    };

    fetchChat();
  }, [resolvedParams.id]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  const handleNewChat = () => {
    setIsModalOpen(true);
  };

  const handleChatCreated = (newChat: { id: string }) => {
    router.push(`/chat/${newChat.id}`);
  };

  const updateChatMessages = async (messages: Message[]) => {
    const { error } = await supabase
      .from("chats")
      .update({ messages })
      .eq("id", resolvedParams.id);

    if (error) {
      console.error("Error updating chat:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !chat) return;

    const newMessages = [
      ...(chat.messages || []),
      { role: "user", content: trimmed },
    ];
    setChat((prev) => (prev ? { ...prev, messages: newMessages } : null));
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });
      if (!response.ok) throw new Error("No response body");

      const updatedMessages = [...newMessages, { role: "bot", content: "" }];
      setChat((prev) => (prev ? { ...prev, messages: updatedMessages } : null));

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let botMsg = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        botMsg += chunk;

        const latestMessages = [
          ...newMessages,
          { role: "bot", content: botMsg },
        ];
        setChat((prev) =>
          prev ? { ...prev, messages: latestMessages } : null
        );
      }

      const finalMessages = [...newMessages, { role: "bot", content: botMsg }];
      await updateChatMessages(finalMessages);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      const errorMessages = [
        ...newMessages,
        { role: "bot", content: "Sorry, error has occurred." },
      ];
      setChat((prev) => (prev ? { ...prev, messages: errorMessages } : null));
      await updateChatMessages(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopyText = async (text: string, index: number) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // For modern browsers
        await navigator.clipboard.writeText(text);
      } else {
        // For OLder browser
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          textArea.remove();
        } catch (error) {
          console.error("Failed to copy text: ", error);
          textArea.remove();
          return;
        }
      }

      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto w-full h-[100dvh] relative">
        {/* Chat Messages */}
        <div className="w-full h-[65dvh] flex flex-col gap-10 px-2 max-w-screen overflow-y-auto items-stretch py-10">
          {!chat.messages || chat.messages.length === 0 ? (
            <div className="w-full h-[100dvh] translate-y-10 flex flex-col items-center justify-center text-center">
              <h2 className="text-4xl leading-12">
                Hello <span className="text-primary">Amir</span>, How can I Help
                You Today?
              </h2>
              <Suggestion className="mt-8" onSuggestionClick={setInput} />
              {/* Credit Gemini */}
              <div className="w-full text-center text-xs text-body mt-6">
                Responses are generated by Gemini. Use with discretion.{" "}
                <a
                  href="https://ai.google.dev/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Gemini Terms of Service
                </a>
                .
              </div>
            </div>
          ) : (
            chat.messages?.map((msg, idx) =>
              msg.role === "user" ? (
                <div key={idx} className="flex w-full justify-end">
                  <div className="max-w-[70%] max-md:max-w-[75%] bg-gradient-to-r from-teal-600 to-teal-700 selection:bg-foreground-800/20 selection:text-foreground-800 shadow-lg shadow-primary/30 text-white rounded-2xl rounded-tr-md px-4 py-2 text-left ml-auto prose prose-invert prose-p:my-0 prose-pre:bg-foreground-800 prose-pre:text-xs prose-pre:rounded-xl prose-pre:p-3 prose-code:bg-transparent prose-code:p-0 prose-code:text-primary prose-a:text-primary prose-em:text-primary prose-blockquote:border-primary/40 prose-blockquote:text-primary/80 prose-ol:pl-6 prose-ul:pl-6 prose-li:marker:text-primary/60 prose-headings:font-bold prose-headings:text-primary/90 prose-table:border-collapse prose-table:w-full prose-td:border prose-td:border-border-700 prose-td:px-3 prose-td:py-2 prose-th:border prose-th:border-border-700 prose-th:px-3 prose-th:py-2 prose-th:bg-foreground-800 break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div key={idx} className="flex flex-col w-full gap-2">
                  <div className="flex w-full justify-start items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground-900 text-primary text-xl shrink-0">
                      <RiSupabaseFill className="w-6 h-6" />
                    </div>
                    <div className="lg:max-w-[70%] max-md:max-w-[100%] w-full min-w-0 bg-foreground-900 text-head rounded-2xl px-4 py-2 text-left shadow-md prose prose-invert prose-p:my-0 prose-pre:bg-foreground-800 prose-pre:text-xs prose-pre:rounded-xl prose-pre:p-3 prose-code:bg-transparent prose-code:p-0 prose-code:text-primary prose-a:text-primary prose-em:text-primary prose-blockquote:border-primary/40 prose-blockquote:text-primary/80 prose-ol:pl-6 prose-ul:pl-6 prose-li:marker:text-primary/60 prose-headings:font-bold prose-headings:text-primary/90 prose-table:border-collapse prose-table:w-full prose-td:border prose-td:border-border-700 prose-td:px-3 prose-td:py-2 prose-th:border prose-th:border-border-700 prose-th:px-3 prose-th:py-2 prose-th:bg-foreground-800 break-words">
                      <div className="w-full overflow-x-auto max-w-full">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto w-full">
                                <table {...props} />
                              </div>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      {isLoading && idx === chat.messages.length - 1 && (
                        <span className="animate-pulse ml-1">|</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-12">
                    <button
                      onClick={() => handleCopyText(msg.content, idx)}
                      className="p-1.5 hover:bg-primary/10 active:bg-primary/10 rounded-lg text-primary transition-colors flex items-center gap-1.5 text-xs"
                      title="Copy text"
                    >
                      {copiedIndex === idx ? (
                        <BsCheckLg className="w-4 h-4" />
                      ) : (
                        <BiCopy className="w-4 h-4" />
                      )}
                      {copiedIndex === idx ? "Copied!" : "Copy message"}
                    </button>
                  </div>
                </div>
              )
            )
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
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
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hello world!"
                className="flex-1 h-auto px-2 min-h-[40px] ring-none outline-none resize-none placeholder:text-body leading-normal bg-transparent"
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

        <NewChatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onChatCreated={handleChatCreated}
        />
      </div>
    </Layout>
  );
}
