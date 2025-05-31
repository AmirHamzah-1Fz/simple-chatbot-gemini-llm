import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="container mx-auto flex-1 overflow-auto flex flex-col px-[4%] items-center justify-start max-w-5xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
