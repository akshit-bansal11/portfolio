/*
 * Annotation.tsx
 * The handwritten "pen" layer of the blog.
 *  - DrawnPath: an SVG stroke that draws itself when scrolled into view.
 *  - Mark: circles, underlines, boxes or highlights a word inline.
 *  - Annotation: a standalone scribbled arrow / circle / underline with a label.
 * All strokes show fully drawn under prefers-reduced-motion.
 */

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useElementSize } from "@/hooks/use-element-size";
import { sketchArrow, sketchEllipse, sketchLine, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* DrawnPath                                                           */
/* ------------------------------------------------------------------ */

interface DrawnPathProps {
  d: string;
  className?: string;
  strokeWidth?: number;
  /** Seconds before the stroke starts drawing once visible. */
  delay?: number;
  /** Seconds the stroke takes to draw. */
  duration?: number;
  /** Draw every time it enters view instead of once. */
  repeat?: boolean;
}

// Forces a drawn stroke to show fully under prefers-reduced-motion. Done in CSS (not with
// useReducedMotion) so server-rendered strokes don't stay stuck at opacity 0 after hydration.
export const REDUCED_MOTION_STROKE =
  "motion-reduce:opacity-100! motion-reduce:[stroke-dasharray:none]!";

// An SVG <path> that animates pathLength 0 -> 1 on first view.
export function DrawnPath({
  d,
  className,
  strokeWidth = 2,
  delay = 0,
  duration = 0.9,
  repeat = false,
}: DrawnPathProps) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(REDUCED_MOTION_STROKE, className)}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: !repeat, amount: 0.6 }}
      transition={{
        pathLength: { delay, duration, ease: "easeInOut" },
        opacity: { delay, duration: 0.01 },
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Mark                                                                */
/* ------------------------------------------------------------------ */

type MarkKind = "circle" | "underline" | "box" | "highlight";

interface MarkProps {
  children: ReactNode;
  kind?: MarkKind;
  /** Pen colour; "blue" reads as a second annotator. */
  tone?: "pen" | "blue";
  seed?: number;
  delay?: number;
  className?: string;
}

// Space (px) the stroke is allowed to spill outside the word.
const MARK_PAD = 8;

// Builds the stroke for a word of the measured size.
function markPath(kind: MarkKind, width: number, height: number, seed: number): string {
  const w = width + MARK_PAD * 2;
  const h = height + MARK_PAD * 2;
  switch (kind) {
    case "circle":
      return sketchEllipse(w / 2, h / 2, w / 2 - 2, h / 2 - 3, { seed });
    case "box":
      return sketchRect(MARK_PAD - 4, MARK_PAD - 2, width + 8, height + 4, { seed, bow: 1.5 });
    case "highlight":
      return sketchLine(MARK_PAD - 2, h / 2 + 2, w - MARK_PAD + 2, h / 2 + 1, { seed, bow: 1.2 });
    default: {
      const y = MARK_PAD + height + 1;
      return `${sketchLine(MARK_PAD - 2, y, w - MARK_PAD + 2, y - 1, { seed })} ${sketchLine(
        MARK_PAD + 6,
        y + 4,
        w - MARK_PAD - 4,
        y + 3,
        { seed: seed + 7, bow: 1 },
      )}`;
    }
  }
}

// Inline word with a hand-drawn mark around, under or behind it.
export function Mark({
  children,
  kind = "underline",
  tone = "pen",
  seed = 3,
  delay = 0.15,
  className,
}: MarkProps) {
  const [ref, size] = useElementSize<HTMLSpanElement>();
  const isHighlight = kind === "highlight";

  return (
    <span ref={ref} className={cn("relative isolate inline-block leading-[1.15]", className)}>
      {size.width > 0 && (
        <svg
          aria-hidden
          width={size.width + MARK_PAD * 2}
          height={size.height + MARK_PAD * 2}
          className={cn(
            "pointer-events-none absolute -top-2 -left-2 overflow-visible",
            isHighlight ? "-z-10 text-marker" : tone === "blue" ? "text-pen-blue" : "text-pen",
          )}
        >
          <DrawnPath
            d={markPath(kind, size.width, size.height, seed)}
            strokeWidth={isHighlight ? size.height * 0.85 : 2}
            delay={delay}
            duration={isHighlight ? 0.6 : 0.8}
          />
        </svg>
      )}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Annotation                                                          */
/* ------------------------------------------------------------------ */

type AnnotationKind = "arrow" | "circle" | "underline";
type ArrowDirection = "down" | "up" | "left" | "right" | "down-left" | "down-right";

interface AnnotationProps {
  kind?: AnnotationKind;
  /** Arrow direction (arrow only). */
  direction?: ArrowDirection;
  /** Handwritten text next to the scribble. */
  label?: ReactNode;
  tone?: "pen" | "blue";
  seed?: number;
  className?: string;
}

// Start/end points (in a 100 x 60 box) for each arrow direction.
const ARROW_POINTS: Record<ArrowDirection, [number, number, number, number]> = {
  down: [40, 6, 52, 54],
  up: [52, 54, 40, 6],
  left: [94, 22, 8, 36],
  right: [6, 22, 92, 36],
  "down-left": [86, 6, 14, 52],
  "down-right": [14, 6, 86, 52],
};

// A standalone scribble with an optional handwritten label (e.g. "try it!").
export function Annotation({
  kind = "arrow",
  direction = "down",
  label,
  tone = "pen",
  seed = 5,
  className,
}: AnnotationProps) {
  const color = tone === "blue" ? "text-pen-blue" : "text-pen";
  const labelFirst = kind === "arrow" && (direction === "down" || direction.startsWith("down-"));

  let paths: string[];
  if (kind === "arrow") {
    const [x1, y1, x2, y2] = ARROW_POINTS[direction];
    const arrow = sketchArrow(x1, y1, x2, y2, { seed, curve: 0.22, headSize: 10 });
    paths = [arrow.shaft, arrow.head];
  } else if (kind === "circle") {
    paths = [sketchEllipse(50, 30, 46, 24, { seed })];
  } else {
    paths = [sketchLine(4, 40, 96, 38, { seed }), sketchLine(12, 47, 90, 46, { seed: seed + 3 })];
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-hand text-xl leading-tight",
        labelFirst ? "flex-col" : "flex-row",
        color,
        className,
      )}
    >
      {labelFirst && label && <span>{label}</span>}
      <svg aria-hidden viewBox="0 0 100 60" className="h-12 w-20 shrink-0 overflow-visible">
        {paths.map((d, index) => (
          <DrawnPath key={d} d={d} delay={index * 0.6} duration={index === 0 ? 0.6 : 0.25} />
        ))}
      </svg>
      {!labelFirst && label && <span>{label}</span>}
    </span>
  );
}
