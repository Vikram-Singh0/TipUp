"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { CustomLoader } from "@/components/ui/loader";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowContent(true);
      }, 100);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Also handle route changes
  useEffect(() => {
    // Listen for navigation events if using Next.js router
    if (typeof window !== "undefined") {
      const handleBeforeUnload = () => setIsLoading(true);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [setIsLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <AnimatePresence mode="wait">
        {isLoading && <CustomLoader key="loader" />}
      </AnimatePresence>
      {showContent && <div className="page-transition">{children}</div>}
    </LoadingContext.Provider>
  );
}
