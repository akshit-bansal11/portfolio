/*
 * MarginNote.tsx
 * Handwritten side note, like something scribbled in a
 * notebook margin. On wide screens it floats into the right
 * margin next to the paragraph that follows it (place it
 * *before* that paragraph in MDX); on smaller screens it sits
 * inline as an indented aside.
 */

import type { ReactNode } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

interface MarginNoteProps {
  children: ReactNode;
  /** Optional shout-out above the note, e.g. "aha!". */
  label?: string;
  tone?: "pen" | "blue";
  /** Draw an arrow pointing back at the text (wide screens only). */
  arrow?: boolean;
  className?: string;
}

// Arrow from the note back toward the prose column.
const BACK_ARROW = sketchArrow(46, 8, 4, 22, { seed: 11, curve: 0.3, headSize: 7 });

export default function MarginNote({
  children,
  label,
  tone = "pen",
  arrow = true,
  className,
}: MarginNoteProps) {
  return (
    <aside
      role="note"
      className={cn(
        "relative my-6 border-l-2 border-dashed pl-4 font-hand text-[1.35rem] leading-snug",
        // MDX wraps multi-line children in <p>; make those inherit the note's look.
        "[&_p]:m-0 [&_p]:text-[length:inherit] [&_p]:leading-[inherit] [&_p]:text-inherit",
        tone === "blue" ? "border-pen-blue/60 text-pen-blue" : "border-pen/60 text-pen",
        "xl:float-right xl:clear-right xl:-mr-[296px] xl:mt-1 xl:mb-4 xl:w-[248px] xl:-rotate-1 xl:border-0 xl:pl-0",
        className,
      )}
    >
      {arrow && (
        <svg
          aria-hidden
          viewBox="0 0 50 30"
          className="absolute top-1 -left-14 hidden h-8 w-12 overflow-visible xl:block"
        >
          <DrawnPath d={BACK_ARROW.shaft} strokeWidth={1.8} />
          <DrawnPath d={BACK_ARROW.head} strokeWidth={1.8} delay={0.7} duration={0.2} />
        </svg>
      )}
      {label && <span className="mb-0.5 block text-2xl font-bold">{label}</span>}
      {children}
    </aside>
  );
}
