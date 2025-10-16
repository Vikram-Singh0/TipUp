"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      data-state={isDark ? "dark" : "light"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-4 py-2 text-sm font-medium border-[var(--push-pink-500)] text-[var(--push-pink-500)] hover:bg-[var(--push-pink-500)] hover:text-white transition-all duration-300"
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
