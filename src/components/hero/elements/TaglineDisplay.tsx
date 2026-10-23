/*
 * TaglineDisplay.tsx
 * The animated word-by-word tagline text atom.
 * Extracted from TaglineStage so it can be used standalone
 * in the mobile two-stage layout without scroll-driven props.
 * Once the reveal finishes, a hand-drawn circle closes around
 * the marked phrase and a handwritten aside appears underneath.
 */

"use client";

import { useState } from "react";
import { Annotation, Mark } from "@/components/blog/Annotation";
import {
  TAGLINE,
  TAGLINE_ACCENT_CLASS,
  TAGLINE_ASIDE,
  TAGLINE_CLASSNAME,
  TAGLINE_MARKED,
} from "@/data/heroContent";
import AnimatedText from "./AnimatedText";

// Public props.
interface TaglineDisplayProps {
  /** Gates the word-reveal animation; defaults to true for mobile use. */
  active?: boolean;
}

// Renders the tagline with its light gradient word-by-word reveal.
export default function TaglineDisplay({ active = true }: TaglineDisplayProps) {
  // Pen strokes wait for the last word, so they draw on visible text.
  const [revealed, setRevealed] = useState(false);

  // The marked phrase gets its gradient on an inner span: background-clip text does not
  // reach into the Mark wrapper's own stacking context.
  const renderWord = (segment: string) =>
    segment === TAGLINE_MARKED && revealed ? (
      <Mark kind="circle" className="leading-[inherit]">
        <span className={TAGLINE_ACCENT_CLASS}>{segment}</span>
      </Mark>
    ) : undefined;

  return (
    <div className="flex w-full max-w-5xl flex-col items-center">
      <AnimatedText
        text={TAGLINE}
        stagger={150}
        animateBy="words"
        direction="top"
        active={active}
        onComplete={active ? () => setRevealed(true) : undefined}
        wordClassName={(segment) =>
          segment === TAGLINE_MARKED && revealed ? "" : TAGLINE_ACCENT_CLASS
        }
        renderWord={renderWord}
        className={TAGLINE_CLASSNAME}
      />
      {revealed && (
        <Annotation
          kind="arrow"
          direction="up"
          label={TAGLINE_ASIDE}
          seed={11}
          className="-rotate-2 max-w-full self-end text-left sm:mr-8"
        />
      )}
    </div>
  );
}
