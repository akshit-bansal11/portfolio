/*
 * WordNote.tsx
 * A handwritten whiteboard note attached to one tagline word, with a short drawn
 * arrow pointing at it. Positioned absolutely against the word's wrapper on the
 * side that has free board around it, so it never covers tagline glyphs. Only
 * rendered where there is room (xl and up); smaller screens list the facts instead.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

type Side = "left" | "right" | "top";

// Arrow toward the word, per side: the note sits on `side` of the word.
const ARROWS: Record<Side, ReturnType<typeof sketchArrow>> = {
  left: sketchArrow(2, 16, 50, 14, { seed: 71, curve: 0.3, headSize: 9 }),
  right: sketchArrow(54, 14, 6, 16, { seed: 73, curve: 0.3, headSize: 9 }),
  top: sketchArrow(14, 2, 15, 36, { seed: 79, curve: 0.25, headSize: 9 }),
};

const PLACEMENT: Record<Side, string> = {
  left: "right-full top-1/2 mr-3 -translate-y-1/2 flex-row text-right",
  right: "left-full top-1/2 ml-3 -translate-y-1/2 flex-row-reverse text-left",
  top: "bottom-full left-1/2 -translate-x-1/2 flex-col text-center",
};

interface WordNoteProps {
  text: string;
  side: Side;
  /** Seconds before the note starts to appear. */
  delay: number;
}

// Renders one note + arrow.
export default function WordNote({ text, side, delay }: WordNoteProps) {
  const reduceMotion = useReducedMotion();
  const arrow = ARROWS[side];

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute hidden items-center gap-1 text-hero-pen xl:flex",
        PLACEMENT[side],
      )}
    >
      <motion.span
        className="block w-max max-w-[10rem] whitespace-normal font-hand text-[1.6rem] font-semibold leading-[1.05] tracking-normal"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.4 }}
      >
        {text}
      </motion.span>
      <svg
        viewBox={side === "top" ? "0 0 30 40" : "0 0 56 30"}
        className={cn("shrink-0 overflow-visible", side === "top" ? "h-10 w-[30px]" : "h-[30px] w-14")}
      >
        <DrawnPath d={arrow.shaft} delay={delay + 0.2} duration={0.5} />
        <DrawnPath d={arrow.head} delay={delay + 0.7} duration={0.2} />
      </svg>
    </span>
  );
}
