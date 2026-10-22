/*
 * ReadingProgress.tsx
 * Wraps the article body and shows a thin progress bar at
 * the top of the viewport while it is being read. The bar is
 * portalled to <body> because the route template animates a
 * transform on an ancestor, which would break position: fixed.
 */

"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { type ReactNode, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  children: ReactNode;
  className?: string;
}

// True only after hydration (portals need document.body).
const noopSubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

export default function ReadingProgress({ children, className }: ReadingProgressProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion();

  // 0 when the article's top hits the viewport top, 1 when its bottom hits the viewport bottom.
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div ref={targetRef} className={cn("relative", className)}>
      {isClient &&
        createPortal(
          <motion.div
            aria-hidden
            className="fixed inset-x-0 top-0 z-60 h-[3px] origin-left bg-pen"
            style={{ scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress }}
          />,
          document.body,
        )}
      {children}
    </div>
  );
}
