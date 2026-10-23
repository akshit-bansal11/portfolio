/*
 * SectionTitle.tsx
 * Section header of the redesign: a typed h2 plus a handwritten aside with a small
 * drawn arrow pointing back at the heading.
 */

import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow } from "@/lib/blog/sketch";

// Small arrow from the handwritten aside toward the heading.
const ASIDE_ARROW = sketchArrow(46, 6, 4, 22, { seed: 63, curve: 0.3, headSize: 7 });

interface SectionTitleProps {
  title: string;
  aside: string;
}

// Renders the heading and its aside.
export default function SectionTitle({ title, aside }: SectionTitleProps) {
  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
      <h2 className="font-display text-5xl font-medium tracking-[-0.01em] text-hero-ink md:text-6xl lg:text-7xl">
        {title}
      </h2>
      <p className="flex items-center gap-1 pb-2 font-hand text-3xl font-semibold leading-none text-hero-pen">
        <svg aria-hidden viewBox="0 0 50 30" className="h-7 w-12 shrink-0 overflow-visible">
          <DrawnPath d={ASIDE_ARROW.shaft} duration={0.5} />
          <DrawnPath d={ASIDE_ARROW.head} delay={0.5} duration={0.2} />
        </svg>
        {aside}
      </p>
    </div>
  );
}
