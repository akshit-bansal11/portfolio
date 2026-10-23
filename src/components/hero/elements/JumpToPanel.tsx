/*
 * JumpToPanel.tsx
 * Hero stage-4 "jump to" index, written on the board: a handwritten label over
 * a list of typed section names. The active entry (last hovered or focused) is
 * ink-coloured and gets a hand-drawn underline that draws in; the rest stay
 * muted. A handwritten gloss sits right under the active entry.
 * Clicking an entry smooth-scrolls the page to that section.
 */

"use client";

import { useState } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { JUMP_TO_CARDS } from "@/data/jumpToCards";
import { sketchLine } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

// Two loose strokes under the active entry, stretched to the entry's width.
const UNDERLINE = `${sketchLine(2, 3, 98, 4, { seed: 5 })} ${sketchLine(10, 6.5, 80, 6, {
  seed: 12,
  bow: 1,
})}`;

// Smooth-scrolls to a section by id.
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Renders the index.
export default function JumpToPanel() {
  const [active, setActive] = useState(0);

  return (
    <div
      className="pointer-events-auto flex flex-col gap-3"
      style={{ width: "clamp(200px, 22vw, 280px)" }}
    >
      <p className="-rotate-2 font-hand text-4xl font-bold leading-none text-hero-muted">jump to</p>
      <ul className="flex flex-col items-start gap-8">
        {JUMP_TO_CARDS.map(({ label, sectionId, description }, index) => {
          const isActive = index === active;
          return (
            <li key={sectionId} className="relative">
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => scrollToSection(sectionId)}
                className={cn(
                  "relative cursor-pointer py-1 text-left font-grotesk text-lg font-semibold outline-none transition-colors duration-200",
                  isActive ? "text-hero-ink" : "text-hero-muted",
                )}
              >
                {label}
                {isActive && (
                  <svg
                    aria-hidden
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-x-0 -bottom-1 h-2 w-full overflow-visible text-hero-pen"
                  >
                    <DrawnPath d={UNDERLINE} duration={0.45} />
                  </svg>
                )}
              </button>
              {isActive && (
                <span className="pointer-events-none absolute left-1 top-full mt-1.5 -rotate-1 whitespace-nowrap font-hand text-2xl font-semibold leading-none text-hero-pen">
                  {description}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
