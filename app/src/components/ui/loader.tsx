"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function CustomLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient similar to main page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_50%,var(--push-pink-500)/15,transparent),radial-gradient(600px_300px_at_30%_70%,var(--push-purple-500)/12,transparent)]" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-[var(--push-pink-500)]/10 to-[var(--push-purple-500)]/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Logo with pulse animation */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl bg-[var(--push-pink-500)]/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/20">
            <Image
              src="/TipUp-logo-final.png"
              alt="TipUp Logo"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="text-2xl font-bold bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          TipUp
        </motion.h1>

        {/* Arrow animation container */}
        <div className="relative w-24 h-32 flex flex-col items-center justify-center">
          {/* Multiple arrows with staggered animation */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute"
              animate={{
                y: [-40, -80, -120],
                opacity: [0, 1, 0],
                scale: [0.8, 1, 1.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: index * 0.3,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[var(--push-pink-500)]"
              >
                <motion.path
                  d="M12 4L12 20M12 4L6 10M12 4L18 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                />
              </svg>
            </motion.div>
          ))}

          {/* Base arrow that stays visible */}
          <motion.div
            className="absolute bottom-0"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[var(--push-purple-500)]"
            >
              <path
                d="M12 4L12 20M12 4L6 10M12 4L18 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>

        {/* Loading text with typing animation */}
        <motion.p
          className="text-muted-foreground text-sm tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.span
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading your tipping experience...
          </motion.span>
        </motion.p>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-border/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
