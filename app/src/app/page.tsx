"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/pushflow/theme-toggle";
import { HowItWorks } from "@/components/pushflow/how-it-works";
import { FloatingTags } from "@/components/pushflow/floating-tags";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "@/components/pushflow/footer";

const Coin3DLogo = dynamic(() => import("@/components/pushflow/coin-3d-logo"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradient + subtle orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_80%_-10%,var(--push-pink-500)/25,transparent),radial-gradient(900px_500px_at_10%_20%,var(--push-purple-500)/18,transparent),linear-gradient(180deg,var(--push-bg),var(--push-bg))]" />
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-background/50 border-b border-border">
        <div className="px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="size-8 rounded-md bg-[var(--push-pink-500)]"
              aria-hidden
            />
            <span className="font-semibold tracking-tight">TipUp</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="bg-[var(--push-card)] hover:bg-[var(--push-card-hover)]"
            >
              Connect Push Wallet
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="px-12 pt-16 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1
            className={cn(
              "text-balance text-4xl md:text-6xl font-semibold leading-tight"
            )}
          >
            Tip Creators, Instantly. On Any Chain.
          </h1>
          <p className="text-muted-foreground text-pretty">
            Powered by Push Chain and Push Wallet. A universal tipping
            experience with real-time Push notifications.
          </p>
          <div className="flex items-center gap-3">
            <Button className="px-6 py-6 text-base font-medium bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)] shadow-[0_0_32px_var(--push-pink-500-20)]">
              <Link href="/tip">Start Tipping</Link>
            </Button>
            <Button
              variant="outline"
              className="px-6 py-6 text-base bg-transparent"
            >
              <Link href="/dashboard">For Creators</Link>
            </Button>
          </div>

          {/* Floating ENS tags */}
          <FloatingTags
            tags={["@creator.eth", "@music.eth", "@nftartist.eth"]}
          />
        </div>

        {/* 3D coin */}
        <div className="relative aspect-square">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(60%_60%_at_50%_40%,var(--push-pink-500)/20,transparent)]" />
          <Suspense
            fallback={
              <div className="w-full h-full rounded-3xl bg-secondary animate-pulse" />
            }
          >
            <Coin3DLogo scale={0.8} startSpeed={0.6} fastFactor={2} />
          </Suspense>
        </div>
      </section>

      {/* Feature Links grid */}
      <section className="px-12 pb-12">
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/dashboard" className="group">
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 h-full transition-colors">
              <motion.h3
                className="text-base font-semibold mb-1"
                whileHover={{ y: -2 }}
              >
                Creator Dashboard
              </motion.h3>
              <p className="text-sm text-muted-foreground">
                Manage profile, tips, broadcasts
              </p>
              <div className="mt-4 text-xs text-[var(--push-pink-500)] group-hover:underline">
                Open Dashboard →
              </div>
            </div>
          </Link>

          <Link href="/tip" className="group">
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 h-full">
              <motion.h3
                className="text-base font-semibold mb-1"
                whileHover={{ y: -2 }}
              >
                Tip Interface
              </motion.h3>
              <p className="text-sm text-muted-foreground">
                Send tips in ETH, MATIC, USDC
              </p>
              <div className="mt-4 text-xs text-[var(--push-pink-500)] group-hover:underline">
                Start Tipping →
              </div>
            </div>
          </Link>

          <Link href="/broadcast" className="group">
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 h-full">
              <motion.h3
                className="text-base font-semibold mb-1"
                whileHover={{ y: -2 }}
              >
                Broadcast Channel
              </motion.h3>
              <p className="text-sm text-muted-foreground">
                Push notifications for your fans
              </p>
              <div className="mt-4 text-xs text-[var(--push-pink-500)] group-hover:underline">
                View Broadcasts →
              </div>
            </div>
          </Link>

          <Link href="/wallet" className="group">
            <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-5 h-full">
              <motion.h3
                className="text-base font-semibold mb-1"
                whileHover={{ y: -2 }}
              >
                Push Wallet
              </motion.h3>
              <p className="text-sm text-muted-foreground">
                Universal App – all chains enabled
              </p>
              <div className="mt-4 text-xs text-[var(--push-pink-500)] group-hover:underline">
                Connect Wallet →
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Why PushFlow section */}
      <section className="px-12 pb-12 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h4 className="font-semibold mb-1">Cross-Chain by Default</h4>
          <p className="text-sm text-muted-foreground">
            Tip creators across EVM and non-EVM networks seamlessly.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h4 className="font-semibold mb-1">Real-time Push Alerts</h4>
          <p className="text-sm text-muted-foreground">
            Instant notifications for tips, follows, and broadcasts.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h4 className="font-semibold mb-1">Creator-first UX</h4>
          <p className="text-sm text-muted-foreground">
            Glassy visuals, 3D motion, and a frictionless flow.
          </p>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* Footer */}
      <Footer />
    </main>
  );
}
