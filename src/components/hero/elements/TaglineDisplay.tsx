/*
 * TaglineDisplay.tsx
 * The animated word-by-word tagline text atom, set in three fixed lines.
 * Extracted from TaglineStage so it can be used standalone
 * in the mobile layout without scroll-driven props.
 * Once the reveal finishes, a whiteboard selection box is drawn around the
 * marked phrase, then three handwritten notes point at tagline words (xl and up;
 * smaller screens get the same facts as a short list) and an aside appears below.
 */

"use client";

import { useState } from "react";
import { Annotation } from "@/components/blog/Annotation";
import {
  TAGLINE_ACCENT_CLASS,
  TAGLINE_ASIDE,
  TAGLINE_CLASSNAME,
  TAGLINE_FACTS,
  TAGLINE_LINES,
  TAGLINE_MARKED,
} from "@/data/heroContent";
import AnimatedText from "./AnimatedText";
import PhraseSelection from "./PhraseSelection";
import WordNote from "./WordNote";

// Delay between words (ms), shared by the offsets of the later lines.
const STAGGER = 150;
// Seconds from the end of the reveal until the notes start (the box and handles finish first).
const NOTES_START = 2.6;
const NOTES_STEP = 0.55;

// Running word offset of each line, so the reveal flows across line breaks.
const LINE_OFFSETS = TAGLINE_LINES.map((_, index) =>
  TAGLINE_LINES.slice(0, index).reduce((count, line) => count + line.split(" ").length, 0),
);

// Public props.
interface TaglineDisplayProps {
  /** Gates the word-reveal animation; defaults to true for mobile use. */
  active?: boolean;
}

// Renders the tagline with its light gradient word-by-word reveal.
export default function TaglineDisplay({ active = true }: TaglineDisplayProps) {
  // The selection waits for the last word, so it draws around visible text.
  const [revealed, setRevealed] = useState(false);

  // Every word keeps its gradient on an inner span: background-clip text does not
  // reach into the positioned wrappers the selection and notes need.
  const renderWord = (segment: string) => {
    if (segment.startsWith(TAGLINE_MARKED)) {
      return (
        <>
          <PhraseSelection active={revealed}>
            <span className={TAGLINE_ACCENT_CLASS}>{TAGLINE_MARKED}</span>
          </PhraseSelection>
          <span className={TAGLINE_ACCENT_CLASS}>{segment.slice(TAGLINE_MARKED.length)}</span>
        </>
      );
    }
    const factIndex = TAGLINE_FACTS.findIndex(({ word }) => word === segment.replace(/,$/, ""));
    const word = <span className={TAGLINE_ACCENT_CLASS}>{segment}</span>;
    if (factIndex < 0) return word;
    const { text, side } = TAGLINE_FACTS[factIndex];
    return (
      <span className="relative inline-block">
        {word}
        {revealed && (
          <WordNote text={text} side={side} delay={NOTES_START + factIndex * NOTES_STEP} />
        )}
      </span>
    );
  };

  return (
    <div className="flex w-full max-w-5xl flex-col items-center">
      {TAGLINE_LINES.map((line, index) => (
        <AnimatedText
          key={line}
          text={line}
          stagger={STAGGER}
          animateBy="words"
          direction="top"
          active={active}
          delayOffset={LINE_OFFSETS[index] * STAGGER}
          onComplete={
            active && index === TAGLINE_LINES.length - 1 ? () => setRevealed(true) : undefined
          }
          renderWord={renderWord}
          className={TAGLINE_CLASSNAME}
        />
      ))}
      {revealed && (
        <>
          <ul className="mt-6 flex flex-col items-center gap-1 font-hand text-xl font-semibold leading-tight text-hero-pen xl:hidden">
            {TAGLINE_FACTS.map(({ text }) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          <Annotation
            kind="arrow"
            direction="up"
            label={TAGLINE_ASIDE}
            seed={11}
            className="mt-16 -rotate-2 max-w-full self-end text-left text-xl font-semibold sm:mr-8 sm:text-3xl"
          />
        </>
      )}
    </div>
  );
}
