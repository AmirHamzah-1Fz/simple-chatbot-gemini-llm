"use client";

import React from "react";
import { BiPlus, BiSend } from "react-icons/bi";
import { RiSupabaseFill } from "react-icons/ri";
import Suggestion, { suggestionContent } from "./Suggestion";
import { useSidebar } from "../SidebarContext";

interface MessageType {
  role: string;
  content: string;
}

const dummyMessages: MessageType[] = [];

const HomeContent = () => {
  const { isOpen } = useSidebar();

  const [messages, setMessages] = React.useState(dummyMessages);
  const [input, setInput] = React.useState("");

  const hasMessages = messages && messages.length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
  };

  return (
    <div className="container max-w-3xl mx-auto w-full h-[100dvh] relative text-center">
      {/* Greeting & Suggestion */}
      {!hasMessages && (
        <div className="w-full h-auto flex flex-col items-center justify-center lg:mt-16 mt-20">
          <h2>
            Hello <span className="text-primary">Amir</span>, How can I Help You
            Today?
          </h2>
          <Suggestion className="mt-8" onSuggestionClick={setInput} />
        </div>
      )}

      {/* Chatbox UI */}
      {hasMessages && (
        <div className="w-full h-[65dvh] mt-6 flex flex-col gap-10 px-2 py-6 overflow-y-auto items-stretch">
          {messages.map((msg, idx) =>
            msg.role === "user" ? (
              <div key={idx} className="flex w-full justify-end">
                <div className="max-w-[70%] bg-gradient-to-r from-teal-600 to-background text-white rounded-2xl rounded-tr-md px-4 py-3 text-left shadow-md ml-auto">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="flex w-full justify-start items-start gap-3"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary text-xl shrink-0">
                  <RiSupabaseFill className="w-6 h-6" />
                </div>
                <div className="max-w-[70%] bg-foreground-900 text-head rounded-2xl rounded-bl-sm px-4 py-3 text-left shadow-md">
                  {msg.content}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* User Prompt */}
      <div
        className={`px-[5%] fixed bottom-6 max-lg:bottom-8 left-0 w-full z-20 bg-background/80 backdrop-blur-sm ${
          isOpen
            ? "lg:translate-x-1/9"
            : "lg:translate-x-0"
        }`}
      >
        <div className="container max-w-3xl mx-auto w-full">
          <form
            onSubmit={handleSubmit}
            className="w-full min-h-[100px] flex justify-between items-center gap-2 p-4 border border-border-700 rounded-3xl mt-4 mb-4"
          >
            <button
              type="button"
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
    </div>
  );
};

export default HomeContent;
