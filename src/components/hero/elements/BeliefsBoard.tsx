/*
 * BeliefsBoard.tsx
 * "What I believe in": a typed heading above four square sticky notes in a loose
 * 2x2 cluster. Each note is the same pastel paper in both themes, with ink always
 * dark, a curled corner, a paper shadow and a strip of tape. It carries a number,
 * a typed value, a handwritten gloss and a marker tick, and lifts and straightens
 * on hover. With a `progress` source the ticks draw with the scroll (staggered
 * across the jumpto stage); without one they draw on view, for the static mobile
 * stack.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { DrawnPath, REDUCED_MOTION_STROKE } from "@/components/blog/Annotation";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { BELIEFS, BELIEFS_HEADING } from "@/data/heroContent";
import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import Tape from "./Tape";

// One short tick per item, each with its own seed so no two look stamped.
const TICK_PATHS = BELIEFS.map((_, index) => {
  const seed = 21 + index * 2;
  return `${sketchLine(2, 11, 8, 17, { seed, jitter: 0.5, bow: 0.5 })} ${sketchLine(8, 17, 18, 3, {
    seed: seed + 1,
    jitter: 0.5,
    bow: 1,
  })}`;
});

// Colour, tilt and stagger of each note (full class names so Tailwind can see them).
const NOTE_STYLES = [
  "bg-note-1 -rotate-3",
  "bg-note-2 rotate-2 sm:mt-6",
  "bg-note-3 rotate-1 sm:-mt-2",
  "bg-note-4 -rotate-2 sm:mt-3",
] as const;

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

interface BeliefsBoardProps {
  /** Hero scroll progress; omit for strokes that draw on view instead. */
  progress?: MotionValue<number>;
}

// Renders the heading and the cluster of notes.
export default function BeliefsBoard({ progress }: BeliefsBoardProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-hero-ink md:text-3xl">
        {BELIEFS_HEADING}
      </h3>
      <ul className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2">
        {BELIEFS.map(({ word, gloss }, index) => (
          <li
            key={word}
            className={cn(
              "relative aspect-square w-full max-w-[200px] p-4 pt-6 text-note-ink transition-transform duration-300",
              "hover:z-10 hover:-translate-y-1.5 hover:rotate-0 motion-reduce:transition-none",
              NOTE_STYLES[index],
            )}
            style={{ boxShadow: "var(--note-shadow)" }}
          >
            <Tape className="absolute -top-2 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2" />
            {/* Curled bottom-right corner. */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 h-6 w-6"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, transparent 50%, rgb(0 0 0 / 22%) 50%, rgb(0 0 0 / 6%) 100%)",
              }}
            />
            <span className="font-grotesk text-xs font-medium tracking-[0.12em] text-note-ink/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mt-1 flex items-start gap-2">
              <svg
                aria-hidden
                viewBox="0 0 22 22"
                className="mt-1 h-5 w-5 shrink-0 overflow-visible text-note-ink"
              >
                {progress ? (
                  <ScrollTick d={TICK_PATHS[index]} index={index} progress={progress} />
                ) : (
                  <DrawnPath d={TICK_PATHS[index]} delay={index * 0.25} duration={0.5} />
                )}
              </svg>
              <span className="font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.01em]">
                {word}
              </span>
            </div>
            <p className="mt-2 font-hand text-[1.35rem] font-semibold leading-[1.1]">{gloss}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Desktop wrapper: the board rises in as the jumpto stage settles.
export function ScrollBeliefsBoard({ progress }: { progress: MotionValue<number> }) {
  const jumptoStart = HERO_STAGES.jumpto.range[0];
  const entrySpan = entryEnd(HERO_STAGES.jumpto.range) - jumptoStart;
  const enterStart = jumptoStart + entrySpan * 0.15;
  const enterEnd = jumptoStart + entrySpan * 0.85;

  const opacity = useTransform(progress, [enterStart, enterEnd], [0, 1]);
  const y = useTransform(progress, [enterStart, enterEnd], ["28px", "0px"]);

  return (
    <motion.div
      style={{ opacity, y, width: "clamp(340px, 38vw, 460px)" }}
      className="pointer-events-auto"
    >
      <BeliefsBoard progress={progress} />
    </motion.div>
  );
}
