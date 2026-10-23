/*
 * ResumeButton.tsx
 * "Download Resume" as the primary call to action: a hand-drawn marker swash
 * filled with the pen colour behind a dark label, plus a small drawn arrow.
 * The swash is sized from the measured link, and swells slightly on hover and
 * keyboard focus (it just shows, without movement, under reduced motion).
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { RESUME_PATH } from "@/data/heroContent";
import { useElementSize } from "@/hooks/use-element-size";
import { sketchArrow, sketchEllipse } from "@/lib/blog/sketch";

const ARROW = sketchArrow(8, 2, 8, 17, { seed: 19, curve: 0.2, headSize: 5 });

// Renders the resume link.
export default function ResumeButton() {
  const [ref, { width, height }] = useElementSize<HTMLAnchorElement>();
  const reduceMotion = useReducedMotion();
  // Hover or focus swells the swash and redraws the arrow.
  const [hot, setHot] = useState(false);

  return (
    <Link
      ref={ref}
      href={RESUME_PATH}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      className="relative inline-flex min-h-11 items-center gap-2 px-8 py-3 font-grotesk text-base font-semibold text-hero-bg outline-none"
    >
      {width > 0 && (
        <svg
          aria-hidden
          width={width}
          height={height}
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
        >
          <motion.path
            d={sketchEllipse(width / 2, height / 2, width / 2 + 3, height / 2 + 2, {
              seed: 15,
              jitter: 0.07,
            })}
            className="fill-hero-pen stroke-hero-pen"
            strokeWidth={4}
            strokeLinejoin="round"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: hot && !reduceMotion ? 1.07 : 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </svg>
      )}
      <span className="relative">Download Resume</span>
      <svg
        aria-hidden
        viewBox="0 0 16 20"
        className="relative h-5 w-4 overflow-visible text-hero-bg"
      >
        <DrawnPath key={`shaft-${hot}`} d={ARROW.shaft} delay={0.1} duration={0.4} />
        <DrawnPath key={`head-${hot}`} d={ARROW.head} delay={0.45} duration={0.2} />
      </svg>
    </Link>
  );
}
