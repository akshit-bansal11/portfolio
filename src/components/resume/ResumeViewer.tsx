/*
 * ResumeViewer.tsx
 * Toolbar for the /resume page: a hand-drawn note and the Download PDF button
 * (prints the page; the print rules in resume.css produce one A4 sheet).
 */

"use client";

import type { ReactNode } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow } from "@/lib/blog/sketch";

// Hand-drawn arrow pointing at the print button.
const NOTE_ARROW = sketchArrow(4, 20, 56, 26, { seed: 7, curve: 0.25, headSize: 8 });

export default function ResumeViewer({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="resume-toolbar mx-auto mb-5 flex max-w-[210mm] flex-wrap items-center justify-end gap-x-4 gap-y-3 px-4 sm:px-0 print:hidden">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex -rotate-3 items-center gap-1 font-hand text-xl leading-none text-hero-pen"
          >
            print it
            <svg viewBox="0 0 64 40" className="h-7 w-12 overflow-visible">
              <DrawnPath d={NOTE_ARROW.shaft} delay={0.3} duration={0.6} />
              <DrawnPath d={NOTE_ARROW.head} delay={0.9} duration={0.25} />
            </svg>
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="cursor-pointer rounded-full border border-hero-ink/40 bg-hero-surface/60 px-5 py-2 text-sm font-medium text-hero-ink/90 transition-colors hover:border-hero-pen/50 hover:text-hero-pen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-pen"
          >
            Download PDF
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
