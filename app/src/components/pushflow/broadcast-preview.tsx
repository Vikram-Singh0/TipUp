"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const messages = ["You just got tipped 5 MATIC!", "New supporter: @music.eth", "Tip received: 0.05 ETH"]

export function BroadcastPreview() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-28 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="rounded-md border border-border/60 bg-background/60 px-3 py-2 text-sm"
        >
          {messages[index]}
        </motion.div>
      </AnimatePresence>
      <div className="absolute -inset-1 rounded-md pointer-events-none shadow-[0_0_48px] shadow-[var(--push-pink-500-20)]" />
    </div>
  )
}
