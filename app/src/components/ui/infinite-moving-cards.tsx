"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);
  
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  useEffect(() => {
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border-2 border-[var(--push-purple-500)]/30 bg-card/80 backdrop-blur-md px-8 py-6 md:w-[450px] shadow-lg hover:shadow-xl hover:border-[var(--push-pink-500)]/50 transition-all duration-300"
            key={item.name}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <div className="flex justify-start mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg text-yellow-400">⭐</span>
                ))}
              </div>
              <span className="relative z-20 text-base leading-[1.6] font-normal text-foreground">
                &ldquo;{item.quote}&rdquo;
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] flex items-center justify-center text-white font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="text-xs leading-[1.6] font-normal text-muted-foreground">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
