/*
 * ScrollIndicator.tsx
 * Whiteboard-style scroll cue: a handwritten "scroll" over a short sketchy
 * down arrow that draws itself once, then bobs slowly. No box, no background.
 * `ScrollIndicator` (desktop) fades out for good once the hero progress passes
 * CUE_GONE_AT; `ScrollCue` is the plain cue the mobile stack drops into its
 * first screen, where it simply scrolls away with the content.
 */

"use client";

import { type MotionValue, motion, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { useAnimation } from "@/context/AnimationContext";
import { sketchArrow } from "@/lib/blog/sketch";

// Hero progress past which the cue disappears and never returns.
const CUE_GONE_AT = 0.04;

const ARROW = sketchArrow(14, 3, 15, 38, { seed: 4, curve: 0.12, headSize: 9 });

// The cue itself; `gone` fades it out.
export function ScrollCue({ gone = false }: { gone?: boolean }) {
  const { isWelcomeComplete } = useAnimation();
  const reduceMotion = useReducedMotion();
  if (!isWelcomeComplete) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none flex flex-col items-center"
      initial={false}
      animate={{ opacity: gone ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <span className="font-hand text-2xl font-semibold leading-none text-hero-muted">scroll</span>
      <motion.svg
        viewBox="0 0 30 44"
        className="mt-1 h-11 w-[30px] overflow-visible text-hero-pen"
        animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      >
        <DrawnPath d={ARROW.shaft} delay={0.3} duration={0.6} />
        <DrawnPath d={ARROW.head} delay={0.85} duration={0.25} />
      </motion.svg>
    </motion.div>
  );
}

// Desktop cue: tied to the hero scroll progress.
export default function ScrollIndicator({ progress }: { progress: MotionValue<number> }) {
  const [gone, setGone] = useState(false);

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest > CUE_GONE_AT) setGone(true);
  });

  return <ScrollCue gone={gone} />;
}
