"use client"

import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BiAtom, BiCode, BiEditAlt, BiMath, BiMessage, BiMoney } from "react-icons/bi";
import { BsCpu } from "react-icons/bs";
import { MdOutlineNotes } from "react-icons/md";

interface suggestionType {
  icons: IconType;
  title: string;
}

interface suggestionProps {
    className?: string;
}

const suggestionContent: suggestionType[] = [
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
    title: "Creative poem",
  },
  {
    icons: MdOutlineNotes,
    title: "Summarize text",
  },
  {
    icons: BsCpu,
    title: "Tech news",
  },
  {
    icons: BiMoney,
    title: "Finance News",
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

export default function Suggestion({className}: suggestionProps) {
  const [visibleItems, setVisibleItems] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      // lg breakpoint in Tailwind is 1024px
      const isLargeScreen = window.innerWidth >= 1024;
      setVisibleItems(isLargeScreen ? 8 : 6);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`${className} container mx-auto w-full max-w-xl h-auto flex justify-center flex-wrap gap-3`}>
      {suggestionContent.slice(0, visibleItems).map((item, index) => (
        <button type="button"
          key={index}
          className="cursor-pointer scale-btn transition-[scale] duration-100 ease-out w-auto h-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-primary lg:bg-foreground-900 bg-foreground-900/60 hover:bg-foreground-800/60 hover:text-primary active:bg-foreground-800/60 border border-transparent hover:border-primary/40 max-lg:active:border-primary/40 active:border-transparent"
        >
          <item.icons className="w-5 h-5 shrink-0" />
          <span className="font-normal lg:text-sm text-base">{item.title}</span>
        </button>
      ))}
    </div>
  );
}
