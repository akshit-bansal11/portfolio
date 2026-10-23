/*
 * Stat.tsx
 * One big number on the board: Clash Display, tabular figures, never wrapping, counted up
 * once when it scrolls into view (reduced motion shows the final value at once), with its
 * label under it and a hand-drawn underline or circle in a doodle colour. An optional
 * handwritten note with a drawn arrow sits next to the number.
 */

"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow, sketchEllipse, sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

const COUNT_MS = 1400;

// Resting tilt per stat, within -2..2deg.
const TILTS = ["-rotate-1", "rotate-1", "rotate-[0.5deg]", "-rotate-[1.5deg]"] as const;
const DOODLE_COLOURS = ["text-doodle-1", "text-doodle-2", "text-doodle-3"] as const;

const UNDERLINE = sketchLine(2, 6, 98, 4, { seed: 7, jitter: 0.6, bow: 1.5 });
const CIRCLE = sketchEllipse(50, 20, 47, 17, { seed: 11, jitter: 0.04 });
const NOTE_ARROW = sketchArrow(30, 4, 4, 26, { seed: 5, curve: 0.3, headSize: 6 });

interface StatProps {
  /** Final value, or null while it is unavailable (shows a dash). */
  value: number | null;
  suffix: string;
  label: string;
  doodle: "underline" | "circle";
  index: number;
  /** Handwritten note drawn next to the number. */
  note?: string;
}

// Renders the stat.
export default function Stat({ value, suffix, label, doodle, index, note }: StatProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      setProgress(1 - (1 - t) ** 4);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion]);

  const decimals = value === null ? 0 : (String(value).split(".")[1] ?? "").length;
  const shown =
    value === null
      ? "–"
      : (reduceMotion ? value : value * progress).toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
  const colour = DOODLE_COLOURS[index % DOODLE_COLOURS.length];

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <div
        className={cn(
          "flex h-full flex-col justify-center gap-2 transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none",
          TILTS[index % TILTS.length],
        )}
      >
        <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
          <p className="relative inline-block whitespace-nowrap font-display text-4xl font-medium leading-none tabular-nums text-hero-ink sm:text-5xl">
            {shown}
            {value !== null && <span className="text-hero-muted">{suffix}</span>}
            <svg
              aria-hidden
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
              className={cn(
                "pointer-events-none absolute overflow-visible",
                colour,
                doodle === "circle"
                  ? "-inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
                  : "-bottom-3 left-0 h-3 w-full",
              )}
            >
              <DrawnPath
                d={doodle === "circle" ? CIRCLE : UNDERLINE}
                strokeWidth={doodle === "circle" ? 2 : 3}
                delay={0.3}
              />
            </svg>
          </p>
          {note && value !== null && (
            <p className="flex items-end gap-1 font-hand text-2xl font-bold leading-none text-hero-pen">
              <svg aria-hidden viewBox="0 0 34 30" className="h-6 w-8 shrink-0 overflow-visible">
                <DrawnPath d={NOTE_ARROW.shaft} delay={0.6} duration={0.4} />
                <DrawnPath d={NOTE_ARROW.head} delay={1} duration={0.2} />
              </svg>
              {note}
            </p>
          )}
        </div>
        <p className="font-grotesk text-sm font-medium text-hero-muted">{label}</p>
      </div>
    </motion.div>
  );
}
