"use client";

import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import {
  BiAtom,
  BiCode,
  BiEditAlt,
  BiMath,
  BiMessage
} from "react-icons/bi";
import { BsCpu } from "react-icons/bs";
import { MdOutlineNotes } from "react-icons/md";

interface suggestionType {
  icons: IconType;
  title: string;
}

interface suggestionProps {
  className?: string;
  onSuggestionClick?: (text: string) => void;
}

export const suggestionContent: suggestionType[] = [
  {
    icons: BiMessage,
    title: "Get advice",
  },
  {
    icons: BiCode,
    title: "Write a code",
  },
  {
    icons: BiEditAlt,
    title: "Poem",
  },
  {
    icons: MdOutlineNotes,
    title: "Summarize",
  },
  {
    icons: BsCpu,
    title: "Tech news",
  },
  {
    icons: BiMath,
    title: "Math",
  },
  {
    icons: BiAtom,
    title: "Physics",
  },
];

export default function Suggestion({
  className,
  onSuggestionClick,
}: suggestionProps) {
  const [visibleItems, setVisibleItems] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 370) {
        setVisibleItems(4);
      } else if (width < 1024) {
        setVisibleItems(6);
      } else {
        setVisibleItems(8);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`${className} container mx-auto w-full max-w-xl h-auto flex flex-col items-center gap-3`}
    >
      {/* Baris 1: 2 kolom */}
      <div className="flex w-full justify-center gap-3">
        {suggestionContent.slice(0, 2).map((item, index) => (
          <button
            type="button"
            key={index}
            onClick={() => onSuggestionClick && onSuggestionClick(item.title)}
            className="min-w-0 cursor-pointer scale-btn transition-[scale] duration-100 ease-out w-auto h-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-primary lg:bg-foreground-900 bg-foreground-900/70 hover:bg-foreground-800/60 hover:text-primary active:bg-foreground-800/60 border border-transparent hover:border-primary/40 max-lg:active:border-primary/40 active:border-transparent"
          >
            <item.icons className="w-5 h-5 shrink-0" />
            <span className="font-normal text-sm lg:text-base">{item.title}</span>
          </button>
        ))}
      </div>
      {/* Baris 2: 3 kolom */}
      <div className="flex w-full justify-center gap-3">
        {suggestionContent.slice(2, 5).map((item, index) => (
          <button
            type="button"
            key={index + 2}
            onClick={() => onSuggestionClick && onSuggestionClick(item.title)}
            className="min-w-0 cursor-pointer scale-btn transition-[scale] duration-100 ease-out w-auto h-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-primary lg:bg-foreground-900 bg-foreground-900/70 hover:bg-foreground-800/60 hover:text-primary active:bg-foreground-800/60 border border-transparent hover:border-primary/40 max-lg:active:border-primary/40 active:border-transparent"
          >
            <item.icons className="w-5 h-5 shrink-0" />
            <span className="font-normal text-sm lg:text-base">{item.title}</span>
          </button>
        ))}
      </div>
      {/* Baris 3: 2 kolom */}
      <div className="flex w-full justify-center gap-3">
        {suggestionContent.slice(5, 7).map((item, index) => (
          <button
            type="button"
            key={index + 5}
            onClick={() => onSuggestionClick && onSuggestionClick(item.title)}
            className="min-w-0 cursor-pointer scale-btn transition-[scale] duration-100 ease-out w-auto h-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-primary lg:bg-foreground-900 bg-foreground-900/70 hover:bg-foreground-800/60 hover:text-primary active:bg-foreground-800/60 border border-transparent hover:border-primary/40 max-lg:active:border-primary/40 active:border-transparent"
          >
            <item.icons className="w-5 h-5 shrink-0" />
            <span className="font-normal text-sm lg:text-base">{item.title}</span>
          </button>
        ))}
      </div>
      {/* Responsif: tampilkan sisa item jika ada dan layar kecil */}
      {visibleItems > 7 && (
        <div className="flex w-full justify-center gap-3 flex-wrap">
          {suggestionContent.slice(7, visibleItems).map((item, index) => (
            <button
              type="button"
              key={index + 7}
              onClick={() => onSuggestionClick && onSuggestionClick(item.title)}
              className="min-w-0 cursor-pointer scale-btn transition-[scale] duration-100 ease-out w-auto h-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-primary lg:bg-foreground-900 bg-foreground-900/70 hover:bg-foreground-800/60 hover:text-primary active:bg-foreground-800/60 border border-transparent hover:border-primary/40 max-lg:active:border-primary/40 active:border-transparent"
            >
              <item.icons className="w-5 h-5 shrink-0" />
              <span className="font-normal text-sm lg:text-base">{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
