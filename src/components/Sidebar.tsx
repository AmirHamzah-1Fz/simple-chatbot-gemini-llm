"use client";

import { BiEdit, BiKey, BiSearch } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { useEffect, useRef } from "react";
import { useSidebar } from "./SidebarContext";

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

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
            <h2 className="text-head text-lg truncate">
              New Chat
            </h2>

            {/* Add New Chat*/}
            <button className="w-auto h-auto flex items-center justify-center p-2 rounded-2xl bg-foreground-900 text-head hover:bg-foreground-800 transition-colors">
              <BiEdit className="w-6 h-6 shrink-0" />
            </button>
          </div>
          <div className="w-full flex items-center gap-3 h-auto px-3 py-2 rounded-2xl bg-foreground-900 text-body">
            <BiSearch className="w-5 h-5 shrink-0" />
            <input
              type="text"
              id="search"
              className="ring-none outline-none placeholder:text-body text-head"
              placeholder="Find whats..."
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="w-full overflow-auto h-auto flex-1 flex p-4 flex-col gap-6 pb-12 border-b border-border-800">
          <h3 className="text-body text-lg">History</h3>

          <div className="w-full h-full flex flex-col gap-4">
            <div className="text-head font-medium text-sm w-full h-fit truncate cursor-pointer">Apa yang baru di Next.js v15</div>
            <div className="text-head font-medium text-sm w-full h-fit truncate cursor-pointer">Tentang Backend Development</div>
            <div className="text-head font-medium text-sm w-full h-fit truncate cursor-pointer">Analisis Struktur Teks</div>
            <div className="text-head font-medium text-sm w-full h-fit truncate cursor-pointer">Machine Learning: Probabilitas, Statistika, Kalkulus</div>
            <div className="text-head font-medium text-sm w-full h-fit truncate cursor-pointer">Nasihat Keuangan</div>
            <div className="text-head font-medium text-sm w-full h-fit truncate cursor-pointer">Masalah pada Aplikasi Flutter</div>
            <div className="text-head font-medium text-sm w-full h-fit truncate cursor-pointer">Jetpack Compose Kotlin</div>
          </div>
        </div>

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
    </>
  );
};

export default Sidebar;
