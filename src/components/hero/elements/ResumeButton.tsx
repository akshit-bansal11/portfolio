/*
 * ResumeButton.tsx
 * "Download Resume" as plain text inside a hand-drawn box, with a small drawn
 * arrow. The outline and arrow draw again on hover and keyboard focus; under
 * reduced motion they simply show fully drawn.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { RESUME_PATH } from "@/data/heroContent";
import { useElementSize } from "@/hooks/use-element-size";
import { sketchArrow, sketchRect } from "@/lib/blog/sketch";

const ARROW = sketchArrow(8, 2, 8, 17, { seed: 19, curve: 0.2, headSize: 5 });

// Renders the resume link.
export default function ResumeButton() {
  const [ref, { width, height }] = useElementSize<HTMLAnchorElement>();
  // Bumped on hover/focus so the strokes are remounted and draw again.
  const [drawKey, setDrawKey] = useState(0);
  const redraw = () => setDrawKey((key) => key + 1);

  return (
    <Link
      ref={ref}
      href={RESUME_PATH}
      onMouseEnter={redraw}
      onFocus={redraw}
      className="relative inline-flex min-h-11 items-center gap-2 px-5 py-2 font-display text-base font-semibold tracking-[-0.01em] text-hero-ink outline-none transition-colors hover:text-hero-pen focus-visible:text-hero-pen"
    >
      {width > 0 && (
        <svg
          aria-hidden
          width={width}
          height={height}
          className="pointer-events-none absolute left-0 top-0 overflow-visible text-hero-pen"
        >
          <DrawnPath
            key={drawKey}
            d={sketchRect(2, 2, width - 4, height - 4, { seed: 15, bow: 1.5 })}
            duration={0.7}
          />
        </svg>
      )}
      <span>Download Resume</span>
      <svg
        aria-hidden
        viewBox="0 0 16 20"
        className="h-5 w-4 overflow-visible text-hero-pen"
      >
        <DrawnPath key={`shaft-${drawKey}`} d={ARROW.shaft} delay={0.1} duration={0.4} />
        <DrawnPath key={`head-${drawKey}`} d={ARROW.head} delay={0.45} duration={0.2} />
      </svg>
    </Link>
  );
}
