"use client";

import { BiEdit, BiKey, BiSearch, BiPlus } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSidebar } from "./SidebarContext";
import { supabase } from "@/lib/supabase-client";
import type { Chat } from "@/lib/supabase-client";
import { NewChatModal } from "./NewChatModal";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import * as Portal from "@radix-ui/react-portal";

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Get current chat title
  const currentChatId = pathname?.split("/").pop();
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  // Fetch chat history
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoadingChats(true);
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching chats:", error);
        setIsLoadingChats(false);
        return;
      }

      setChats(data);
      setIsLoadingChats(false);
    };

    fetchChats();

    // Subscribe to chat changes
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Close sidebar on click outside (mobile only)
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      // Only trigger on mobile (window.innerWidth < 1024)
      if (window.innerWidth >= 1024) return;
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, toggleSidebar]);

  const handleChatCreated = useCallback(
    (newChat: Chat) => {
      setChats((prev) => [newChat, ...prev]);
      router.push(`/chat/${newChat.id}`);
    },
    [router]
  );

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Overlay for mobile, only when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/30 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      <aside
        ref={sidebarRef}
        className={`
    z-[9999] fixed w-[260px] h-[100dvh] bg-background border-r border-border-800 flex flex-col transition-transform duration-300 ease-in-out
    ${
      isOpen
        ? "translate-x-0 lg:w-[300px] w-[320px] lg:relative"
        : "-translate-x-full"
    }
    max-lg:shadow-lg
  `}
      >
        <div className="w-full h-auto flex p-4 flex-col gap-6 pb-12 border-b border-border-800">
          <div className="w-full flex items-center gap-1 justify-between">
            <h2 className="text-head text-lg truncate min-h-[1.5em]">
              {isLoadingChats ? (
                <span className="inline-block w-32 h-5 bg-foreground-800 rounded animate-pulse" />
              ) : currentChat ? (
                currentChat.title
              ) : (
                "New Chat"
              )}
            </h2>

            {/* Add New Chat*/}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-auto h-auto flex items-center justify-center p-2 rounded-2xl bg-foreground-900 text-head hover:bg-foreground-800 transition-colors"
            >
              <BiEdit className="w-6 h-6 shrink-0" />
            </button>
          </div>
          <div className="w-full flex items-center gap-3 h-auto px-3 py-2 rounded-2xl bg-foreground-900 text-body">
            <BiSearch className="w-5 h-5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ring-none outline-none w-full bg-transparent placeholder:text-body text-head"
              placeholder="Search chats..."
            />
          </div>
        </div>{" "}
        {/* Chat History */}
        <div className="w-full overflow-auto h-auto flex-1 flex p-4 flex-col gap-4 pb-12 border-b border-border-800">
          <h3 className="text-lg font-semibold text-body pl-2">History</h3>
          <div className="w-full h-full flex flex-col gap-1">
            {isLoadingChats ? (
              // Skeleton untuk histori chat
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-4 bg-foreground-800 rounded-xl animate-pulse mb-1"
                />
              ))
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-2">
                <p className="text-body text-sm">No conversations yet</p>
                <p className="text-xs text-body/60">
                  Start a new chat by clicking the edit button above
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-1.5 px-2.5 mt-1 bg-primary text-white text-sm rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <BiPlus className="w-6 h-6" />
                  New Chat
                </button>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={`text-head font-medium text-sm w-full h-fit truncate cursor-pointer p-2 rounded-xl hover:bg-foreground-900 active:bg-foreground-900 ${
                    pathname === `/chat/${chat.id}` ? "bg-foreground-900 text-primary" : ""
                  }`}
                >
                  {chat.title}
                </Link>
              ))
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="w-full flex flex-col border-t border-t-border-800 py-4 px-4">
          <a href="/api-key">
            <button
              type="button"
              className="w-full h-auto p-2 rounded-2xl text-primary hover:bg-foreground-900 active:bg-foreground-900 cursor-pointer flex items-center gap-3"
            >
              <BiKey className="shrink-0 w-6 h-6" />
              <h3 className="text-lg font-medium text-primary">API Key</h3>
            </button>
          </a>
          <button
            type="button"
            className="w-full h-auto p-2 rounded-2xl text-head hover:bg-foreground-900 active:bg-foreground-900 cursor-pointer flex items-center gap-3"
          >
            <CiSettings className="shrink-0 w-6 h-6" />
            <h3 className="text-lg font-medium">Settings</h3>
          </button>
        </div>
      </aside>

      {/* Modals */}
      <Portal.Root>
        <NewChatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onChatCreated={handleChatCreated}
        />
      </Portal.Root>
    </>
  );
};

export default Sidebar;
