/*
 * PhraseSelection.tsx
 * Whiteboard "selection" around a phrase, like a marquee drag on a canvas: a multiplayer-style
 * cursor appears at the box's top-left corner and drags to the bottom-right while the rectangle
 * grows with it (top-left anchored, right/bottom edges on the cursor tip, constant 2px stroke).
 * Four square handles then pop in and the cursor parks beside the last one and idles with a slow
 * bob. The motion is CSS keyframes (.sel-* in globals.css); the box is measured with a
 * ResizeObserver, so it keeps hugging the words when the web font loads or the viewport changes.
 * Under prefers-reduced-motion the box and handles are shown at once and the cursor is parked.
 */

"use client";

import type { ReactNode } from "react";
import { useElementSize } from "@/hooks/use-element-size";

// Space the box keeps around the words, as a fraction of the phrase height (about 1em, since the
// tagline line-height is ~1): 0.35em left/right, 0.15em top/bottom.
const PAD_X_RATIO = 0.35;
const PAD_Y_RATIO = 0.15;
// Seconds into the sequence when the first handle pops (after the 0.3s lead-in + 0.9s drag), and
// the stagger between handles. Keep in step with the .sel-* timings in globals.css.
const HANDLES_AT = 1.2;
const HANDLE_STAGGER = 0.06;

// Corner handle positions on the box.
const HANDLE_POSITIONS = [
  "left-0 top-0",
  "left-full top-0",
  "left-full top-full",
  "left-0 top-full",
] as const;

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
  const ready = active && width > 0;
  const padX = height * PAD_X_RATIO;
  const padY = height * PAD_Y_RATIO;

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      {ready && (
        <span
          aria-hidden
          className="pointer-events-none absolute text-hero-pen"
          style={{ left: -padX, top: -padY, width: width + padX * 2, height: height + padY * 2 }}
        >
          <span className="sel-box absolute left-0 top-0 block h-full w-full rounded-[2px] border-2 border-hero-pen" />
          {HANDLE_POSITIONS.map((position, index) => (
            <span
              key={position}
              className={`sel-handle absolute block h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-hero-pen bg-hero-bg ${position}`}
              style={{ animationDelay: `${HANDLES_AT + index * HANDLE_STAGGER}s` }}
            />
          ))}
          <span className="sel-cursor absolute left-full top-full z-20 max-sm:hidden">
            <span className="sel-park block">
              <span className="sel-bob relative block">
                <svg width="18" height="22" viewBox="0 0 18 22" className="-ml-px -mt-px block">
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
              </span>
            </span>
          </span>
        </span>
      )}
    </span>
  );
}
