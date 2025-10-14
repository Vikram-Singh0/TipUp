"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/pushflow/theme-toggle";
import { HowItWorks } from "@/components/pushflow/how-it-works";
import { FloatingTags } from "@/components/pushflow/floating-tags";
import { MiniLoader } from "@/components/ui/mini-loader";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "@/components/pushflow/footer";
import Image from "next/image";
import { PushUniversalAccountButton } from "@pushchain/ui-kit";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

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

        {/* Push.org-style navbar */}
        <motion.header
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl"
          style={{ opacity: headerOpacity.get() }}
        >
          <div className="mx-6 backdrop-blur-md bg-background/80 border border-border/40 rounded-2xl px-6 py-4 shadow-2xl shadow-[var(--push-pink-500)]/5">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="relative">
                  <Image
                    src="/TipUp-large-logo.png"
                    alt="TipUp Logo"
                    width={56}
                    height={56}
                    className="rounded-lg"
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
                <span className="font-bold text-lg tracking-tight bg-white bg-clip-text text-transparent">
                  TipUp
                </span>
              </motion.div>
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PushUniversalAccountButton />
                </motion.div>
                <ThemeToggle />
              </div>
            </div>
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
            className="relative aspect-square"
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
            <motion.div
              className="absolute inset-4 rounded-2xl bg-gradient-to-br from-[var(--push-pink-500)]/5 to-[var(--push-purple-500)]/5 backdrop-blur-sm border border-border/20"
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Suspense fallback={<MiniLoader />}>
                <Coin3DLogo scale={0.9} startSpeed={0.8} fastFactor={2.5} />
              </Suspense>
            </motion.div>
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
                color: "pink",
              },
              {
                icon: "💰",
                title: "Fair Tips. Fast Payouts",
                description:
                  "Transparent distribution and instant payouts directly to creators. No delays, no hidden fees.",
                color: "purple",
              },
              {
                icon: "📊",
                title: "Stats & Analytics",
                description:
                  "Track supporter engagement, tip analytics, and creator performance in real-time with detailed insights.",
                color: "pink",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-full p-8 rounded-3xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-border/80 transition-all duration-300">
                  <motion.div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--push-pink-500)]/5 to-[var(--push-purple-500)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works flows */}
        <section className="px-6 md:px-12 pb-12">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold mb-4">How TipUp Works</h2>
            <p className="text-muted-foreground">
              Simple, fast, and secure tipping for everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Creator Flow */}
            <motion.div
              className="bg-card/40 backdrop-blur rounded-2xl p-6 border border-border/60 hover:border-border/80 hover:bg-card/60 transition-all duration-300"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                For Creators
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-pink-500)] text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Create Your Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Register with ENS name, add description and social links
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-pink-500)] text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">
                      Get Your Unique Link & QR Code
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Share your tipup.app/tip/yourname.eth link with supporters
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-pink-500)] text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Track Tips & Analytics</p>
                    <p className="text-sm text-muted-foreground">
                      View earnings, supporter count, and manage your profile
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/dashboard" className="inline-block mt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)] shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Creating →
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Supporter Flow */}
            <motion.div
              className="bg-card/40 backdrop-blur rounded-2xl p-6 border border-border/60 hover:border-border/80 hover:bg-card/60 transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">❤️</span>
                For Supporters
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-purple-500)] text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Find Your Favorite Creator</p>
                    <p className="text-sm text-muted-foreground">
                      Click their tip link or paste it in Universal Tipping
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-purple-500)] text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Connect Push Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      Use any wallet - supports all chains seamlessly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--push-purple-500)] text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Send Tips Instantly</p>
                    <p className="text-sm text-muted-foreground">
                      Choose amount, add message, and tip directly to creator
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/tip/universal" className="inline-block mt-4">
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
            </motion.div>
          </div>

          {/* Feature Links grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link href="/dashboard" className="group">
              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 h-full transition-colors">
                <motion.h3
                  className="text-base font-semibold mb-1"
                  whileHover={{ y: -2 }}
                >
                  Creator Dashboard
                </motion.h3>
                <p className="text-sm text-muted-foreground">
                  Manage your profile, view tips and analytics
                </p>
                <div className="mt-4 text-xs text-[var(--push-pink-500)] group-hover:underline">
                  Open Dashboard →
                </div>
              </div>
            </Link>

            <Link href="/tip/universal" className="group">
              <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 h-full">
                <motion.h3
                  className="text-base font-semibold mb-1"
                  whileHover={{ y: -2 }}
                >
                  Universal Tipping
                </motion.h3>
                <p className="text-sm text-muted-foreground">
                  Paste any creator link and tip instantly
                </p>
                <div className="mt-4 text-xs text-[var(--push-pink-500)] group-hover:underline">
                  Start Tipping →
                </div>
              </div>
            </Link>
          </motion.div>
        </section>

        {/* Why TipUp section */}
        <section className="px-6 md:px-12 pb-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose TipUp?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for the future of creator economy with cutting-edge
              blockchain technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Cross-Chain by Default",
                description:
                  "Tip creators across EVM and non-EVM networks seamlessly.",
                icon: "🔗",
              },
              {
                title: "Real-time Push Alerts",
                description:
                  "Instant notifications for tips, follows, and broadcasts.",
                icon: "🔔",
              },
              {
                title: "Creator-first UX",
                description:
                  "Glassy visuals, 3D motion, and a frictionless flow.",
                icon: "✨",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-8 hover:border-border/80 hover:bg-card/70 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="font-semibold mb-3 text-lg">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="px-6 md:px-12 py-20 bg-gradient-to-br from-[var(--push-pink-500)]/5 to-[var(--push-purple-500)]/5">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of creators who are already earning more with
              TipUp&apos;s seamless tipping experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { number: "10,000+", label: "Tips Processed", icon: "💰" },
              { number: "2,500+", label: "Active Creators", icon: "🎨" },
              { number: "95%", label: "Satisfaction Rate", icon: "⭐" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-8 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl text-yellow-400"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium mb-6 text-foreground leading-relaxed">
                &ldquo;TipUp has completely transformed how I connect with my
                supporters. The instant notifications and seamless cross-chain
                tipping make it incredibly easy for my community to show their
                appreciation.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <div className="font-semibold">Alex Chen</div>
                  <div className="text-muted-foreground">
                    Digital Artist & Creator
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <HowItWorks />

        {/* Footer */}
        <Footer />
      </motion.main>
    </>
  );
}
