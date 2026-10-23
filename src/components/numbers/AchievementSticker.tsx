/*
 * AchievementSticker.tsx
 * One GitHub achievement as a round sticker: the badge art in a paper circle with a
 * hand-drawn ring, a small tier tag, a slight tilt, and a wobble on hover.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { sketchEllipse } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import type { GitHubAchievement } from "@/types/attainments";

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0"] as const;
const RING_COLOURS = ["text-doodle-1", "text-doodle-2", "text-doodle-3"] as const;

interface AchievementStickerProps {
  achievement: GitHubAchievement;
  index: number;
}

// Renders the sticker.
export default function AchievementSticker({ achievement, index }: AchievementStickerProps) {
  const reduceMotion = useReducedMotion();
  const { name, imgUrl, tier } = achievement;

  return (
    <div
      className={cn(
        "transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none",
        TILTS[index % TILTS.length],
      )}
    >
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-paper-card"
        whileHover={reduceMotion ? undefined : { rotate: [0, -8, 6, -3, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={imgUrl}
          alt={tier ? `${name} achievement, ${tier}` : `${name} achievement`}
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className={cn(
            "pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] overflow-visible",
            RING_COLOURS[index % RING_COLOURS.length],
          )}
        >
          <path
            d={sketchEllipse(50, 50, 48, 48, { seed: 41 + index, jitter: 0.03 })}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
          />
        </svg>
        {tier && (
          <span
            aria-hidden
            className="absolute -bottom-1 -right-1 rounded-full bg-hero-pen px-1.5 font-grotesk text-xs font-semibold leading-5 text-hero-bg"
          >
            {tier}
          </span>
        )}
      </motion.div>
    </div>
  );
}
