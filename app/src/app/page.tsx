"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/pushflow/theme-toggle";
import { FloatingTags } from "@/components/pushflow/floating-tags";
import { MiniLoader } from "@/components/ui/mini-loader";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "@/components/pushflow/footer";
import Image from "next/image";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import GlassSurface from "@/components/GlassSurface";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const Coin3DLogo = dynamic(() => import("@/components/pushflow/coin-3d-logo"), {
  ssr: false,
  loading: () => <MiniLoader />,
});

export default function Page() {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  return (
    <>
      {/* Background Ripple Effect - Full Page Coverage */}
      <div className="fixed top-0 left-0 w-screen h-screen min-h-screen -z-50 overflow-hidden">
        <BackgroundRippleEffect rows={20} cols={35} cellSize={48} />
      </div>

      <motion.main
        className="min-h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Enhanced Background gradient with animated orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,var(--push-pink-500)/25,transparent),radial-gradient(900px_500px_at_10%_20%,var(--push-purple-500)/18,transparent),linear-gradient(180deg,var(--push-bg),var(--push-bg))]" />
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-[var(--push-pink-500)]/10 to-[var(--push-purple-500)]/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-[var(--push-purple-500)]/10 to-[var(--push-pink-500)]/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        {/* Push.org-style navbar with Glass Effect */}
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

                  <Link href="#how-it-works" scroll={true}>
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

                  <Link href="#how-it-works" scroll={true}>
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

        {/* Hero Section with enhanced animations */}
        <section className="px-6 md:px-12 pt-32 pb-20 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1
                  className={cn(
                    "text-balance text-5xl md:text-7xl font-bold leading-tight"
                  )}
                >
                  <motion.span className="bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent">
                    Tip Creators,
                  </motion.span>
                  <br />
                  <span className="text-foreground">Instantly.</span>
                  <br />
                  <span className="text-muted-foreground text-3xl md:text-5xl">
                    On Any Chain.
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className="text-muted-foreground text-lg md:text-xl text-pretty leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Powered by Push Chain and Push Wallet. A universal tipping
                experience that makes supporting creators effortless and
                instant.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button className="px-8 py-6 text-lg font-semibold bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)] shadow-[0_0_40px_var(--push-pink-500-20)] hover:shadow-[0_0_60px_var(--push-pink-500-20)] transition-all duration-300">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    🎨 Start Creating
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

            {/* Enhanced Floating ENS tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <FloatingTags
                tags={["@creator.eth", "@music.eth", "@nftartist.eth"]}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced 3D coin with better animations */}
          <motion.div
            className="relative aspect-square ml-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 rounded-3xl bg-[radial-gradient(60%_60%_at_50%_40%,var(--push-pink-500)/20,transparent)]"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="absolute inset-4">
              <Suspense fallback={<MiniLoader />}>
                <Coin3DLogo scale={0.9} startSpeed={0.8} fastFactor={2.5} />
              </Suspense>
            </div>
          </motion.div>
        </section>

        {/* Key Features Section */}
        <section className="px-6 md:px-12 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent">
              Tipping Made Simple
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cashless, compliant & instant. Experience the future of creator
              support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "⚡",
                title: "Tip in a Flash",
                description:
                  "Effortless and instant—supporters can leave a tip with just a quick scan or click, making it simple to express their appreciation.",
              },
              {
                icon: "💰",
                title: "Fair Tips. Fast Payouts",
                description:
                  "Transparent distribution and instant payouts directly to creators. No delays, no hidden fees.",
              },
              {
                icon: "📊",
                title: "Stats & Analytics",
                description:
                  "Track supporter engagement, tip analytics, and creator performance in real-time with detailed insights.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <CardSpotlight className="h-full">
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardSpotlight>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works flows */}
        <section id="how-it-works" className="px-6 md:px-12 pb-12 scroll-mt-24">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent">
              How TipUp Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and secure tipping for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Creator Flow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <CardSpotlight className="h-full">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <span className="text-2xl">🎨</span>
                  For Creators
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-pink-500)] text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Create Your Profile
                      </p>
                      <p className="text-sm text-neutral-300">
                        Register with ENS name, add description and social links
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-pink-500)] text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Get Your Unique Link & QR Code
                      </p>
                      <p className="text-sm text-neutral-300">
                        Share your tipup.app/tip/yourname.eth link with
                        supporters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-pink-500)] text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Track Tips & Analytics
                      </p>
                      <p className="text-sm text-neutral-300">
                        View earnings, supporter count, and manage your profile
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard" className="inline-block mt-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)] shadow-lg hover:shadow-xl transition-all duration-300">
                      Start Creating →
                    </Button>
                  </motion.div>
                </Link>
              </CardSpotlight>
            </motion.div>

            {/* Supporter Flow */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CardSpotlight className="h-full">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <span className="text-2xl">❤️</span>
                  For Supporters
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-purple-500)] text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Find Your Favorite Creator
                      </p>
                      <p className="text-sm text-neutral-300">
                        Click their tip link or paste it in Universal Tipping
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-purple-500)] text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Connect Push Wallet
                      </p>
                      <p className="text-sm text-neutral-300">
                        Use any wallet - supports all chains seamlessly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-purple-500)] text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        Send Tips Instantly
                      </p>
                      <p className="text-sm text-neutral-300">
                        Choose amount, add message, and tip directly to creator
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="/tip/universal" className="inline-block mt-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="border-[var(--push-purple-500)] text-[var(--push-purple-500)] hover:bg-[var(--push-purple-500)] hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start Tipping →
                    </Button>
                  </motion.div>
                </Link>
              </CardSpotlight>
            </motion.div>
          </div>
        </section>

        {/* Creator Categories Section */}
        <section className="px-6 md:px-12 py-28 bg-gradient-to-br from-[var(--push-pink-500)]/5 to-[var(--push-purple-500)]/5">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent">
              Creators of all kinds, all kind!
            </h2>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto">
              From podcasts to cosplay, pixel art to crochet.
            </p>
          </motion.div>

          {/* Creator Category Pills */}
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center items-center gap-4 md:gap-5 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                { icon: "🎧", label: "Streamers", highlight: true },
                { icon: "🎨", label: "Artists" },
                { icon: "✍️", label: "Writers" },
                { icon: "🧵", label: "Crafters" },
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  className={`flex items-center gap-3 px-7 md:px-8 py-4 md:py-4.5 rounded-full font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer ${
                    category.highlight
                      ? "bg-card/80 backdrop-blur-sm border-2 border-[var(--push-purple-500)]/40 shadow-lg hover:shadow-2xl hover:border-[var(--push-purple-500)]/80"
                      : "bg-card/40 backdrop-blur-sm border border-border/30 hover:bg-card/70 hover:border-[var(--push-pink-500)]/50 hover:shadow-lg"
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -6,
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="text-2xl"
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.4 }
                    }}
                  >
                    {category.icon}
                  </motion.span>
                  <span>{category.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center items-center gap-4 md:gap-5 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { icon: "🎙️", label: "Podcasters" },
                { icon: "📹", label: "Video Creators" },
                { icon: "🎭", label: "Cosplayers" },
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  className="flex items-center gap-3 px-7 md:px-8 py-4 md:py-4.5 rounded-full bg-card/40 backdrop-blur-sm border border-border/30 hover:bg-card/70 hover:border-[var(--push-purple-500)]/50 hover:shadow-lg font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -6,
                    rotate: [0, 2, -2, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="text-2xl"
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.4 }
                    }}
                  >
                    {category.icon}
                  </motion.span>
                  <span>{category.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center items-center gap-4 md:gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {[
                { icon: "🎵", label: "Musicians" },
                { icon: "💻", label: "Developers" },
                { icon: "🤝", label: "Communities" },
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  className="flex items-center gap-3 px-7 md:px-8 py-4 md:py-4.5 rounded-full bg-card/40 backdrop-blur-sm border border-border/30 hover:bg-card/70 hover:border-[var(--push-pink-500)]/50 hover:shadow-lg font-semibold text-base md:text-lg transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -6,
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="text-2xl"
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: [0, 15, -15, 0],
                      transition: { duration: 0.4 }
                    }}
                  >
                    {category.icon}
                  </motion.span>
                  <span>{category.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Testimonials & Reviews Section */}
          <motion.div
            className="mt-20 w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent">
                What Creators Say
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of creators who trust TipUp for instant support
              </p>
            </div>
            
            <div className="w-full flex justify-center">
              <InfiniteMovingCards
              items={[
                {
                  quote: "TipUp has completely transformed how I connect with my supporters. The instant notifications and seamless cross-chain tipping make it incredibly easy for my community to show their appreciation.",
                  name: "Sarah Mitchell",
                  title: "Digital Artist & NFT Creator",
                },
                {
                  quote: "As a content creator, getting paid quickly is crucial. TipUp delivers on that promise with zero hassle. My fans love how easy it is to support me!",
                  name: "Marcus Rodriguez",
                  title: "Twitch Streamer",
                },
                {
                  quote: "The analytics dashboard helps me understand my supporters better. Plus, the QR code feature makes it super easy to share at live events!",
                  name: "Emma Chen",
                  title: "Musician & Performer",
                },
                {
                  quote: "No platform fees means I keep more of what my supporters send. TipUp is a game-changer for independent creators like me.",
                  name: "David Park",
                  title: "Podcast Host",
                },
                {
                  quote: "I was amazed at how simple it was to set up. Within minutes, I was receiving tips from my community. The Push Chain integration is seamless!",
                  name: "Lisa Thompson",
                  title: "YouTuber & Educator",
                },
                {
                  quote: "Finally, a tipping platform that actually works across different blockchains. My global audience can support me without any friction!",
                  name: "Alex Kumar",
                  title: "Web3 Developer",
                },
              ]}
              direction="left"
              speed="slow"
              pauseOnHover={true}
              className="py-4"
            />
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer />
      </motion.main>
    </>
  );
}
