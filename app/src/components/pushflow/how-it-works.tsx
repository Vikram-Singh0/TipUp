"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  { title: "Connect Push Wallet", desc: "One universal App across chains." },
  { title: "Verify Creator ENS", desc: "Link your identity. Build trust." },
  { title: "Send a Tip", desc: "ETH, MATIC, USDC and more." },
  { title: "Instant Alerts", desc: "Real-time Push notifications." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-28">
      {/* Larger heading for landing */}
      <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-balance">
        How It Works
      </h2>

      {/* Bigger card, add group perspective and subtle tilt on hover */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-90px" }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="group relative overflow-hidden rounded-3xl"
        whileHover={{ rotateX: 2, rotateY: -2 }}
        style={{ perspective: 1000 }}
      >
        {/* Pink shell + inner surface */}
        <div className="rounded-3xl p-1 bg-[var(--push-pink-500)] shadow-[0_0_72px_var(--push-pink-500-20)]">
          <div className="rounded-[calc(theme(--radius-lg)*2)] bg-[var(--push-bg)]/10 p-10 md:p-12 lg:p-14">
            {/* Steps grid larger spacing */}
            <div className="grid md:grid-cols-4 gap-5 md:gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="rounded-2xl p-6 md:p-7 bg-[color-mix(in_oklab,var(--push-white)_8%,transparent)] border border-[color-mix(in_oklab,var(--push-white)_18%,transparent)] text-[var(--push-white)] hover:ring-1 hover:ring-[var(--push-white)]/20 shadow-[0_0_0_transparent]"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{
                    delay: 0.06 + i * 0.07,
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                  }}
                  whileHover={{
                    y: -8,
                    rotateX: 5,
                    rotateY: -5,
                    boxShadow: "0 0 72px var(--push-pink-500-20)",
                  }}
                >
                  <div className="text-xs uppercase opacity-90 tracking-wide mb-2">
                    Step {i + 1}
                  </div>
                  <div className="text-base md:text-lg font-semibold mb-1">
                    {s.title}
                  </div>
                  <div className="text-sm opacity-90">{s.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA row expanded */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/tip"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium bg-[var(--push-white)] text-[var(--push-bg)] hover:opacity-90 transition-opacity"
              >
                Start Tipping
              </Link>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium border border-[var(--push-white)]/30 text-[var(--push-white)] hover:bg-[var(--push-white)]/10 transition-colors"
              >
                For Creators
              </a>
              <a
                href="/wallet"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium border border-[var(--push-white)]/30 text-[var(--push-white)]/90 hover:text-[var(--push-white)] hover:bg-[var(--push-white)]/10 transition-colors"
              >
                Connect Push Wallet
              </a>
            </div>
          </div>
        </div>

        {/* Ambient light */}
        <div className="pointer-events-none absolute -inset-16 blur-3xl opacity-30 bg-[radial-gradient(40%_40%_at_80%_10%,white,transparent)]" />
      </motion.div>
    </section>
  );
}
