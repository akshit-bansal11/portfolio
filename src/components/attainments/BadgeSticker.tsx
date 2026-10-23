/*
 * BadgeSticker.tsx
 * One Google Cloud skill badge as a round sticker: the Google Cloud mark in a paper circle
 * with a hand-drawn ring, the badge name under it, a slight tilt, and a wobble on hover.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { sketchEllipse } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { GoogleBadgeItem } from "@/types/attainments";

// Resting tilt per sticker, within -2..2deg.
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0"] as const;

// Ring colour per sticker.
const RING_COLOURS = ["text-doodle-1", "text-doodle-2", "text-doodle-3"] as const;

interface BadgeStickerProps {
  badge: GoogleBadgeItem;
  index: number;
}

// Renders the sticker as a link.
export default function BadgeSticker({ badge, index }: BadgeStickerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <a
      href={badge.gBadgeLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex min-h-11 w-36 flex-col items-center gap-3 text-center text-hero-ink transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 focus-visible:-translate-y-1 focus-visible:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-pen motion-reduce:transition-none",
        TILTS[index % TILTS.length],
      )}
    >
      <motion.span
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-paper-card"
        whileHover={reduceMotion ? undefined : { rotate: [0, -8, 6, -3, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="https://svgl.app/library/google-cloud.svg"
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 object-contain"
        />
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className={cn(
            "pointer-events-none absolute -inset-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] overflow-visible",
            RING_COLOURS[index % RING_COLOURS.length],
          )}
        >
          <path
            d={sketchEllipse(50, 50, 48, 48, { seed: 21 + index, jitter: 0.8 })}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
      </motion.span>
      <span className="font-grotesk text-sm font-medium leading-snug">
        {badge.gBadgeTitle}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}
