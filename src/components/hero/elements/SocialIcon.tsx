/*
 * SocialIcon.tsx
 * One social link as a hand-made "sticker": a 52px tile with a sketchy outline,
 * a slight tilt of its own and a custom line icon in the same 2px round-cap
 * stroke as the rest of the board. On hover or keyboard focus the tile straightens,
 * lifts 3px and a handwritten label writes in underneath.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useState } from "react";
import type { HeroSocialLink } from "@/data/heroSocialLinks";
import { sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

// Line icons on a 24 x 24 grid, keyed by the link's name.
const ICONS: Record<string, ReactNode> = {
  // Envelope.
  Gmail: <path d="M3 6h18v12H3z M3.5 7l8.5 7 8.5-7" />,
  // Cat face with pointed ears and two dot eyes.
  GitHub: (
    <path d="M5 9V4l4 3q3-.6 6 0l4-3v5q2 2 1 5-1.5 6-8 6t-8-6q-1-3 1-5z M9 13h.01 M15 13h.01" />
  ),
  // Lower-case "in".
  LinkedIn: (
    <path d="M6 10v8 M6 6.5h.01 M10.5 18v-8 M10.5 13.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5V18" />
  ),
  // Medal on two ribbon tails.
  "Google Skills": (
    <path d="M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M9 12.5L7.5 21l4.5-2.5 4.5 2.5-1.5-8.5" />
  ),
  // Hexagon with an H.
  HackerRank: <path d="M12 3l7.5 4.5v9L12 21l-7.5-4.5v-9z M9.5 9v6 M14.5 9v6 M9.5 12h5" />,
};

// Resting tilt per position (full class names so Tailwind can see them).
const TILTS = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3", "-rotate-1"] as const;

interface SocialIconProps extends HeroSocialLink {
  index: number;
}

// Renders the sticker link.
export default function SocialIcon({ href, name, note, index }: SocialIconProps) {
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={cn(
        "relative flex h-[52px] w-[52px] items-center justify-center text-hero-ink/75 outline-none transition-transform duration-200 motion-reduce:transition-none",
        TILTS[index % TILTS.length],
        "hover:-translate-y-[3px] hover:rotate-0 hover:text-hero-ink focus-visible:-translate-y-[3px] focus-visible:rotate-0 focus-visible:text-hero-ink",
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 52 52"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-hero-pen"
      >
        <path
          d={sketchRect(4, 4, 44, 44, { seed: 100 + index, bow: 1.2 })}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="relative h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[name]}
      </svg>
      {active && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap font-hand text-xl font-semibold leading-none text-hero-pen"
          initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {note}
        </motion.span>
      )}
    </a>
  );
}
