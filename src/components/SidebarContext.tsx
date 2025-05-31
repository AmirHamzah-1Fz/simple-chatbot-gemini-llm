"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext<{
  isOpen: boolean;
  toggleSidebar: () => void;
}>({
  isOpen: true,
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Default: open on desktop, closed on mobile
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Set initial state only on mount
    const isDesktop = window.innerWidth >= 1024;
    setIsOpen(isDesktop);
  }, []);

  const toggleSidebar = () => setIsOpen((v) => !v);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
