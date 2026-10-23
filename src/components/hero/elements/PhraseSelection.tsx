/*
 * PhraseSelection.tsx
 * Whiteboard "selection" around a phrase: a multiplayer-style cursor glides in,
 * drags a sketchy box around exactly the wrapped words, four square handles pop
 * in on the corners, then the cursor drifts aside and idles with a slow bob.
 * The box is measured with a ResizeObserver, so it keeps hugging the words when
 * the web font loads or the viewport changes. Under prefers-reduced-motion the
 * box and handles are shown at once and the cursor is parked.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { useElementSize } from "@/hooks/use-element-size";
import { sketchRect } from "@/lib/blog/sketch";

// Space the box keeps around the words, as a fraction of the phrase height (about 1em, since the
// tagline line-height is ~1): 0.35em left/right, 0.15em top/bottom.
const PAD_X_RATIO = 0.35;
const PAD_Y_RATIO = 0.15;
// Side of a corner handle (px).
const HANDLE = 9;
// Timeline (seconds): the cursor travels for CURSOR_TOTAL; the box is drawn while it drags.
const DRAW_START = 0.7;
const DRAW_DURATION = 0.9;
const CURSOR_TOTAL = 2.4;
const HANDLES_AT = DRAW_START + DRAW_DURATION;

// Name shown on the cursor's tag.
const CURSOR_NAME = "akshit";

interface PhraseSelectionProps {
  children: ReactNode;
  /** Starts the sequence (set once the surrounding text has been revealed). */
  active: boolean;
}

// Wraps the phrase and overlays the selection once it is active and measured.
export default function PhraseSelection({ children, active }: PhraseSelectionProps) {
  const [ref, { width, height }] = useElementSize<HTMLSpanElement>();
  const reduceMotion = useReducedMotion();
  const ready = active && width > 0;
  const padX = height * PAD_X_RATIO;
  const padY = height * PAD_Y_RATIO;

  const left = -padX;
  const top = -padY;
  const right = width + padX;
  const bottom = height + padY;
  const corners = [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
  ] as const;
  // Parked just outside the bottom-right handle, below the text line.
  const rest = { x: right + 8, y: bottom + 8 };

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      {ready && (
        <>
          <svg
            aria-hidden
            width={width}
            height={height}
            className="pointer-events-none absolute left-0 top-0 overflow-visible text-hero-pen"
          >
            <DrawnPath
              d={sketchRect(left, top, right - left, bottom - top, { seed: 13, bow: 1.5 })}
              delay={DRAW_START}
              duration={DRAW_DURATION}
            />
            {corners.map(([cx, cy], index) => (
              <motion.rect
                key={`${cx}-${cy}`}
                x={cx - HANDLE / 2}
                y={cy - HANDLE / 2}
                width={HANDLE}
                height={HANDLE}
                strokeWidth={1.5}
                className="fill-hero-bg stroke-hero-pen"
                initial={reduceMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: HANDLES_AT + index * 0.06, duration: 0.25, ease: "backOut" }}
              />
            ))}
          </svg>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 max-sm:hidden"
            initial={false}
            animate={
              reduceMotion
                ? { x: rest.x, y: rest.y, opacity: 1 }
                : {
                    x: [width + 140, left, right, rest.x],
                    y: [-90, top, bottom, rest.y],
                    opacity: [0, 1, 1, 1],
                  }
            }
            transition={{
              duration: reduceMotion ? 0 : CURSOR_TOTAL,
              times: [0, 0.3, 0.68, 1],
              ease: "easeInOut",
            }}
          >
            <motion.span
              className="relative block"
              animate={reduceMotion ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: CURSOR_TOTAL }}
            >
              <svg width="18" height="22" viewBox="0 0 18 22" className="block">
                <path
                  d="M1 1 L1 17 L5.5 13 L9 20.5 L12 19 L8.5 12 L14.5 12 Z"
                  className="fill-hero-pen stroke-hero-bg"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              </svg>
              <span className="absolute left-4 top-5 whitespace-nowrap rounded-[4px] bg-hero-pen px-1.5 py-[2px] font-grotesk text-xs font-semibold normal-case leading-none tracking-normal text-hero-bg">
                {CURSOR_NAME}
              </span>
            </motion.span>
          </motion.span>
        </>
      )}
    </span>
  );
}
