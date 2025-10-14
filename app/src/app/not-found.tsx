"use client";

import { Button } from "@/components/ui/button";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function NotFound() {
  return (
    <>
      {/* Background Ripple Effect */}
      <div className="fixed top-0 left-0 w-screen h-screen min-h-screen -z-50 overflow-hidden">
        <BackgroundRippleEffect rows={15} cols={25} cellSize={56} />
      </div>

      <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_50%,var(--push-pink-500)/20,transparent),linear-gradient(180deg,var(--push-bg),var(--push-bg))]" />
          <motion.div
            className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-[var(--push-pink-500)]/10 to-[var(--push-purple-500)]/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[var(--push-purple-500)]/10 to-[var(--push-pink-500)]/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Logo */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <Image
                  src="/TipUp-large-logo.png"
                  alt="TipUp Logo"
                  width={80}
                  height={80}
                  className="rounded-xl"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-[var(--push-pink-500)]/20"
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
            </motion.div>

            {/* 404 Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent mb-4">
                404
              </h1>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved. Let&apos;s get you back to creating and tipping!
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  className="px-8 py-6 text-lg font-semibold bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)] shadow-[0_0_40px_var(--push-pink-500)/20] hover:shadow-[0_0_60px_var(--push-pink-500)/20] transition-all duration-300"
                  asChild
                >
                  <Link href="/" className="flex items-center gap-2">
                    🏠 Go Home
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold bg-transparent hover:bg-[var(--push-purple-500)]/10 border-[var(--push-purple-500)]/30 hover:border-[var(--push-purple-500)] transition-all duration-300"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    🎨 Dashboard
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold bg-transparent hover:bg-[var(--push-purple-500)]/10 border-[var(--push-purple-500)]/30 hover:border-[var(--push-purple-500)] transition-all duration-300"
                  asChild
                >
                  <Link
                    href="/tip/universal"
                    className="flex items-center gap-2"
                  >
                    ❤️ Start Tipping
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Fun Animation */}
            <motion.div
              className="flex justify-center pt-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                className="text-6xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                💸
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
