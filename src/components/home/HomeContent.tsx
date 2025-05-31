import React from "react";
import Suggestion from "./Suggestion";
import { BiPlus, BiSend } from "react-icons/bi";

const HomeContent = () => {
  return (
    <div className="container max-w-3xl mx-auto w-full h-[100dvh] relative text-center lg:mt-16 mt-20">
      {/* Body */}
      <div className="w-full h-auto">
        <h2>
          Hello <span className="text-primary">Amir</span>, How can I Help You Today?
        </h2>
        <Suggestion className="mt-8" />
      </div>

      {/* User Prompt */}
      <div className="absolute bottom-0 w-full h-1/2 mt-10">
        <div className="relative w-full h-full">
          <form className="absolute bottom-16 w-full min-h-[100px] flex justify-between items-center gap-2 p-4 border border-border-700 rounded-3xl">
            <button
              type="button"
              className="w-auto scale-btn transition-[background-color, scale] duration-200 ease-in-out h-auto flex items-center justify-center p-2 rounded-full hover:bg-foreground-800 border border-transparent hover:border-border-700 active:border-border-700 text-primary bg-foreground-900"
            >
              <BiPlus className="shrink-0 w-7 h-7" />
            </button>

            <textarea
              defaultValue=""
              placeholder="Hello world!"
              className="flex-1 h-auto px-2 min-h-[40px] ring-none outline-none resize-none placeholder:text-body leading-normal"
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
