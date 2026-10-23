/*
 * BeliefsList.tsx
 * The four "what I believe in" items: a typed word, a handwritten
 * gloss and a small hand-drawn tick. With a `progress` source the
 * ticks draw with the scroll (staggered across the jumpto stage);
 * without one they draw on view, for the static mobile stack.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { DrawnPath, REDUCED_MOTION_STROKE } from "@/components/blog/Annotation";
import { HERO_STAGES } from "@/config/heroStages";
import { BELIEFS } from "@/data/heroContent";
import { sketchLine } from "@/lib/blog/sketch";

// One short tick per item, each with its own seed so no two look stamped.
const TICK_PATHS = BELIEFS.map((_, index) => {
  const seed = 21 + index * 2;
  return `${sketchLine(2, 11, 8, 17, { seed, jitter: 0.5, bow: 0.5 })} ${sketchLine(8, 17, 18, 3, {
    seed: seed + 1,
    jitter: 0.5,
    bow: 1,
  })}`;
});

// Stroke whose pathLength follows the scroll across this item's slice of the stage.
function ScrollTick({
  d,
  index,
  progress,
}: {
  d: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const [start, end] = HERO_STAGES.jumpto.range;
  const from = start + (end - start) * (0.45 + index * 0.1);
  const to = from + (end - start) * 0.12;
  const pathLength = useTransform(progress, [from, to], [0, 1]);
  // Hidden until it starts so a zero-length round cap never shows as a dot.
  const opacity = useTransform(progress, [from, from + 0.004], [0, 1]);

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={REDUCED_MOTION_STROKE}
      style={{ pathLength, opacity }}
    />
  );
}

interface BeliefsListProps {
  /** Hero scroll progress; omit for strokes that draw on view instead. */
  progress?: MotionValue<number>;
}

// Renders the list of beliefs.
export default function BeliefsList({ progress }: BeliefsListProps) {
  return (
    <ul className="flex flex-col gap-3 text-left">
      {BELIEFS.map(({ word, gloss }, index) => (
        <li key={word} className="flex items-start gap-2.5">
          <svg
            aria-hidden
            viewBox="0 0 22 22"
            className="mt-1 h-5 w-5 shrink-0 overflow-visible text-hero-pen"
          >
            {progress ? (
              <ScrollTick d={TICK_PATHS[index]} index={index} progress={progress} />
            ) : (
              <DrawnPath d={TICK_PATHS[index]} delay={index * 0.25} duration={0.5} />
            )}
          </svg>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-snug text-hero-ink md:text-lg">
              {word}
            </span>
            <span className="-rotate-1 font-hand text-lg leading-tight text-hero-pen md:text-xl">
              {gloss}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
