"use client";

import { motion } from "framer-motion";

export function FloatingTags({ tags }: { tags: string[] }) {
  return (
    <div className="relative h-16">
      <div className="absolute inset-0 flex gap-3 items-center">
        {tags.map((t, i) => (
          <motion.span
            key={t}
            className="px-3 py-1.5 rounded-full text-sm bg-secondary/50 border border-border/60 backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + i * 0.15,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{ scale: 1.05 }}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
