/*
 * BeliefsBoard.tsx
 * "What I believe in": a typed heading above four square sticky notes in a loose
 * 2x2 cluster. Each note is the same pastel paper in both themes, with ink always
 * dark, a curled corner, a paper shadow and a strip of tape. It carries a number,
 * a typed value, a handwritten gloss and a marker tick. A note is a button: click or tap
 * flips it to three points (a cross-fade under reduced motion); hover lifts and
 * straightens it. With a `progress` source the ticks draw with the scroll and finish
 * inside the jumpto stage; without one they draw on view, for the static mobile stack.
 */

"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { useId, useState } from "react";
import { DrawnPath, REDUCED_MOTION_STROKE } from "@/components/blog/Annotation";
import { entryEnd, HERO_STAGES } from "@/config/heroStages";
import { BELIEFS, BELIEFS_HEADING } from "@/data/heroContent";
import { sketchEllipse, sketchLine } from "@/lib/blog/sketch";
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

// Tilt and stagger of each note, and its paper colour (full class names so Tailwind can see them).
const NOTE_TILTS = [
  "-rotate-3",
  "rotate-2 sm:mt-6",
  "rotate-1 sm:-mt-2",
  "-rotate-2 sm:mt-3",
] as const;
// Each note is a different paper: ruled, squared, dotted and a legal pad.
const NOTE_COLOURS = [
  "bg-note-1 paper-ruled",
  "bg-note-2 paper-grid",
  "bg-note-3 paper-dots",
  "bg-note-4 paper-legal",
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
  const from = start + (end - start) * (0.3 + index * 0.15);
  const to = from + (end - start) * 0.15;
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

// Small hand-drawn bullet for the points on a note's back.
const POINT_BULLET = sketchEllipse(6, 6, 3, 3, { seed: 83, jitter: 0.12 });

// Curled bottom-right corner, shared by both faces.
function Curl() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-0 right-0 h-6 w-6"
      style={{
        backgroundImage:
          "linear-gradient(135deg, transparent 50%, rgb(0 0 0 / 22%) 50%, rgb(0 0 0 / 6%) 100%)",
      }}
    />
  );
}

interface FlipNoteProps {
  belief: (typeof BELIEFS)[number];
  index: number;
  progress?: MotionValue<number>;
}

// One note: a real button that flips between the typed gloss and three points.
function FlipNote({ belief, index, progress }: FlipNoteProps) {
  const { word, gloss, points } = belief;
  const [flipped, setFlipped] = useState(false);
  const pointsId = useId();
  // Both faces share the paper colour, shadow and backface culling. Reduced motion shows
  // both faces unrotated and cross-fades them instead.
  const face =
    "absolute inset-0 overflow-hidden [backface-visibility:hidden] motion-reduce:[backface-visibility:visible] motion-reduce:transition-opacity";

  return (
    <li
      className={cn(
        "relative aspect-square w-full max-w-[200px] lg:w-[min(260px,29vh)] lg:max-w-none text-note-ink transition-transform duration-300 [perspective:900px]",
        "hover:z-10 hover:-translate-y-1.5 hover:rotate-0 motion-reduce:transition-none",
        NOTE_TILTS[index],
      )}
    >
      <button
        type="button"
        aria-pressed={flipped}
        aria-label={`${word}: show what I mean`}
        aria-describedby={pointsId}
        onClick={() => setFlipped((value) => !value)}
        className="relative block h-full w-full cursor-pointer text-left outline-none transition-transform duration-500 [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-pen motion-reduce:transition-none motion-reduce:[transform:none]!"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front: number, tick, typed word and handwritten gloss. */}
        <span
          className={cn(
            face,
            NOTE_COLOURS[index],
            "p-4 pt-6",
            flipped && "motion-reduce:opacity-0",
          )}
          style={{ boxShadow: "var(--note-shadow)" }}
        >
          <Curl />
          <span className="font-grotesk text-xs font-medium tracking-[0.12em] text-note-ink/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="absolute right-3 top-2 font-grotesk text-[10px] tracking-[0.08em] text-note-ink/55">
            tap to flip
          </span>
          <span className="mt-1 flex items-start gap-2">
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
            <span className="font-display text-[1.35rem] font-medium leading-tight tracking-[-0.01em] lg:text-[1.6rem]">
              {word}
            </span>
          </span>
          <span className="mt-2 block font-hand text-[1.35rem] font-semibold leading-[1.1] lg:text-[1.55rem]">
            {gloss}
          </span>
        </span>

        {/* Back: three points with drawn bullets. */}
        <span
          id={pointsId}
          className={cn(
            face,
            NOTE_COLOURS[index],
            "flex flex-col justify-center gap-2 px-4 py-5 [transform:rotateY(180deg)] motion-reduce:[transform:none]",
            !flipped && "motion-reduce:opacity-0",
          )}
          style={{ boxShadow: "var(--note-shadow)" }}
        >
          <Curl />
          {points.map((point) => (
            <span
              key={point}
              className="flex items-start gap-2 font-hand text-[1.1rem] font-semibold leading-[1.05] lg:text-[1.3rem]"
            >
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="mt-1 h-3 w-3 shrink-0 overflow-visible text-note-ink"
              >
                <path
                  d={POINT_BULLET}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
              {point}
            </span>
          ))}
        </span>
      </button>
      <Tape className="pointer-events-none absolute -top-2 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2" />
    </li>
  );
}

// Renders the heading and the cluster of notes.
export default function BeliefsBoard({ progress }: BeliefsBoardProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-hero-ink md:text-3xl lg:text-center">
        {BELIEFS_HEADING}
      </h3>
      <ul className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:gap-x-14 lg:gap-y-12">
        {BELIEFS.map((belief, index) => (
          <FlipNote key={belief.word} belief={belief} index={index} progress={progress} />
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
