/*
 * PenLine.tsx
 * One long, hand-drawn line that wanders across the pinned hero
 * canvas and draws itself as the reader scrolls. Purely decorative.
 * Under prefers-reduced-motion it is shown fully drawn.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { REDUCED_MOTION_STROKE } from "@/components/blog/Annotation";
import { HERO_HORIZONTAL_END } from "@/config/heroStages";

// Fixed wander in a 1000 x 600 box: low left, up through the middle, off the right edge.
const PEN_PATH =
  "M-20 520 C90 430 160 590 270 500 S430 330 520 420 S690 560 770 400 S900 250 1020 330";

interface PenLineProps {
  progress: MotionValue<number>;
}

// Renders the scroll-driven pen line.
export default function PenLine({ progress }: PenLineProps) {
  const pathLength = useTransform(progress, [0, HERO_HORIZONTAL_END], [0, 1]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full text-hero-pen opacity-50"
    >
      <motion.path
        d={PEN_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={REDUCED_MOTION_STROKE}
        style={{ pathLength }}
      />
    </svg>
  );
}
