"use client";

import { motion } from "framer-motion";

export function MiniLoader() {
  return (
    <div className="w-full h-full rounded-2xl bg-secondary/50 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning logo placeholder */}
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--push-pink-500)]/20 to-[var(--push-purple-500)]/20 border-2 border-[var(--push-pink-500)]/30"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Loading arrows */}
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-6 bg-[var(--push-pink-500)]/40 rounded-full"
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
