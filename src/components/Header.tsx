import { BiKey, BiMenuAltLeft } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import { RiSupabaseFill } from "react-icons/ri";

const Header = () => {
  return (
    <header className="h-18 bg-background border-b border-border-800 flex items-center justify-between px-[4%]">
      {/* Sidebar Menu */}
      <div className="lg:hidden">
        <div className="text-primary flex items-center gap-2 p-2 bg-foreground-900 border border-transparent hover:border-border-700 scale-btn transition-[background-color, scale] duration-100 ease-out active:border-border-700 active:bg-foreground-800 hover:bg-foreground-800 rounded-xl cursor-pointer">
          <BiMenuAltLeft className="w-[24px] h-[24px] shrink-0" />
        </div>
      </div>

      {/* Logo */}
      <div className="w-auto h-auto flex items-center gap-4 max-md:gap-3">
        <RiSupabaseFill className="w-6 h-6 text-primary" />
        <h1 className="text-xl">ThunderAI</h1>
      </div>

      {/* Navigation */}
      <nav className="w-auto h-auto text-primary">
        <div className="max-md:hidden flex items-center gap-3">
          <a href="https://www.github.com/amirhamzah-1fz/simple-chatbot-ui">
            <FaGithub className="w-[24px] h-[24px] shrink-0" />
          </a>

          {/* Use API Key */}
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-foreground-900 border border-transparent hover:border-border-800 rounded-xl cursor-pointer">
            <BiKey className="rotate-[-45deg] w-[24px] h-[24px]" />
            <span className="font-semibold text-base text-head">Use API Key</span>
          </button>
        </div>

        {/* Use API Key */}
        <button className="sm:hidden primary flex items-center gap-2 p-2 bg-foreground-900 border border-transparent hover:border-border-700 scale-btn transition-[background-color, scale] duration-100 ease-out active:border-border-700 active:bg-foreground-800 hover:bg-foreground-800 rounded-xl cursor-pointer">
          <BiKey className="rotate-[-45deg] w-[24px] h-[24px]" />
        </button>
      </nav>
    </header>
  );
};

export default Header;
