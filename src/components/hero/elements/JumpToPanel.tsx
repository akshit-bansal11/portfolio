/*
 * JumpToPanel.tsx
 * Hero stage-4 "jump to" index, written on the board and right-aligned: a handwritten label
 * over a compact list of typed section names. Every entry has a short hand-drawn underline;
 * only the current one (last hovered or focused) turns ink-coloured, stretches its
 * underline past the word and writes its description in to the left. The description
 * is positioned out of flow, so no other entry ever moves.
 * Clicking an entry smooth-scrolls the page to that section.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { JUMP_TO_CARDS } from "@/data/jumpToCards";
import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

// Two loose strokes, stretched to the underline's width.
const UNDERLINE = `${sketchLine(2, 3, 98, 4, { seed: 5 })} ${sketchLine(10, 6.5, 80, 6, {
  seed: 12,
  bow: 1,
})}`;

// Smooth-scrolls to a section by id.
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Renders the index.
export default function JumpToPanel() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-auto flex flex-col items-end gap-3 text-right"
      style={{ width: "clamp(220px, 24vw, 320px)" }}
    >
      <p className="-rotate-2 font-hand text-5xl font-bold leading-none text-hero-muted">jump to</p>
      <ul className="flex flex-col items-end gap-4">
        {JUMP_TO_CARDS.map(({ label, sectionId, description }, index) => {
          const isActive = index === active;
          return (
            <li key={sectionId} className="relative">
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => scrollToSection(sectionId)}
                className={cn(
                  "relative cursor-pointer py-1 text-right font-grotesk text-2xl font-semibold outline-none transition-colors duration-200",
                  isActive ? "text-hero-ink" : "text-hero-muted",
                )}
              >
                {label}
                <svg
                  aria-hidden
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  className={cn(
                    "pointer-events-none absolute -bottom-0.5 right-0 h-2 overflow-visible transition-[width] duration-300 motion-reduce:transition-none",
                    isActive ? "w-[calc(100%+1.5rem)] text-hero-pen" : "w-7 text-hero-muted",
                  )}
                >
                  <path
                    d={UNDERLINE}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </button>
              {isActive && (
                <motion.span
                  className="pointer-events-none absolute right-full top-1/2 mr-6 -translate-y-1/2 whitespace-nowrap font-hand text-2xl font-semibold leading-none text-hero-pen"
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {description}
                </motion.span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
