/*
 * TaglineDisplay.tsx
 * The animated word-by-word tagline text atom.
 * Extracted from TaglineStage so it can be used standalone
 * in the mobile two-stage layout without scroll-driven props.
 * Once the reveal finishes, a whiteboard selection box is drawn
 * around the marked phrase and a handwritten aside appears underneath.
 */

"use client";

import { useState } from "react";
import { Annotation } from "@/components/blog/Annotation";
import {
  TAGLINE,
  TAGLINE_ACCENT_CLASS,
  TAGLINE_ASIDE,
  TAGLINE_CLASSNAME,
  TAGLINE_MARKED,
} from "@/data/heroContent";
import AnimatedText from "./AnimatedText";
import PhraseSelection from "./PhraseSelection";

// Public props.
interface TaglineDisplayProps {
  /** Gates the word-reveal animation; defaults to true for mobile use. */
  active?: boolean;
}

// Renders the tagline with its light gradient word-by-word reveal.
export default function TaglineDisplay({ active = true }: TaglineDisplayProps) {
  // The selection waits for the last word, so it draws around visible text.
  const [revealed, setRevealed] = useState(false);

  // The marked phrase keeps its gradient on an inner span: background-clip text does not
  // reach into the selection wrapper's own positioned box.
  const renderWord = (segment: string) =>
    segment === TAGLINE_MARKED ? (
      <PhraseSelection active={revealed}>
        <span className={TAGLINE_ACCENT_CLASS}>{segment}</span>
      </PhraseSelection>
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
        wordClassName={(segment) => (segment === TAGLINE_MARKED ? "" : TAGLINE_ACCENT_CLASS)}
        renderWord={renderWord}
        className={TAGLINE_CLASSNAME}
      />
      {revealed && (
        <Annotation
          kind="arrow"
          direction="up"
          label={TAGLINE_ASIDE}
          seed={11}
          className="mt-2 -rotate-2 max-w-full self-end text-left text-xl font-semibold sm:mr-8 sm:text-3xl"
        />
      )}
    </div>
  );
}
