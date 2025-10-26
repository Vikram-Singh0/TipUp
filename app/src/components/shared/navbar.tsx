"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ThemeToggle } from "@/components/pushflow/theme-toggle";
import GlassSurface from "@/components/GlassSurface";

export function Navbar() {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  return (
    <motion.header
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-6xl px-2 sm:px-4"
      style={{ opacity: headerOpacity.get() }}
    >
      <div className="relative w-full">
        <GlassSurface
          height={80}
          borderRadius={20}
          borderWidth={0.12}
          displace={1.2}
          distortionScale={-150}
          redOffset={2}
          greenOffset={10}
          blueOffset={18}
          brightness={48}
          opacity={0.9}
          blur={20}
          backgroundOpacity={0}
          saturation={1.5}
          mixBlendMode="difference"
          className="shadow-2xl shadow-[var(--push-pink-500)]/20"
          style={{
            width: "100%",
            minWidth: "100%",
            border: "1.5px solid var(--push-pink-500)",
            backdropFilter: "blur(16px) saturate(1.5)",
            WebkitBackdropFilter: "blur(16px) saturate(1.5)",
            background: "rgba(255, 255, 255, 0.05)",
            boxShadow:
              "0 0 30px rgba(255, 102, 204, 0.35), 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.25)",
          }}
        >
          <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8">
            {/* Logo and Brand - Left Side */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-2 sm:gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src="/TipUp-large-logo.png"
                    alt="TipUp Logo"
                    width={48}
                    height={48}
                    className="rounded-lg w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-[var(--push-pink-500)]/20"
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span className="hidden sm:block font-bold text-base md:text-lg tracking-tight text-foreground whitespace-nowrap">
                  TipUp
                </span>
              </motion.div>
            </Link>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 transform -translate-x-1/2">
              <Link href="/dashboard">
                <motion.span
                  className="text-sm lg:text-base font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.span>
              </Link>

              <Link href="/tip/universal">
                <motion.span
                  className="text-sm lg:text-base font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tip
                </motion.span>
              </Link>

              <Link href="/#how-it-works" scroll={true}>
                <motion.span
                  className="text-sm lg:text-base font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Quick Guide
                </motion.span>
              </Link>
            </nav>

            {/* Mobile Navigation - Right Side */}
            <nav className="flex md:hidden items-center gap-2 sm:gap-3">
              <Link href="/dashboard">
                <motion.span
                  className="text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.span>
              </Link>

              <Link href="/tip/universal">
                <motion.span
                  className="text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Tip
                </motion.span>
              </Link>

              <Link href="/#how-it-works" scroll={true}>
                <motion.span
                  className="text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Guide
                </motion.span>
              </Link>
            </nav>

            {/* Theme Toggle Button - Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </motion.header>
  );
}
