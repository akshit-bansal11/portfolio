/*
 * Tape.tsx
 * A strip of translucent, hand-drawn "tape" that pins a photo or note to the
 * board. Static; the colour comes from --doodle-3 so both themes match.
 */

import { sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

interface TapeProps {
  /** Different seeds give each strip its own wobble. */
  seed?: number;
  className?: string;
}

// Renders one tape strip; position and tilt come from className.
export default function Tape({ seed = 2, className }: TapeProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 24"
      className={cn("pointer-events-none h-6 w-20 overflow-visible text-doodle-3", className)}
    >
      <rect x="2" y="2" width="76" height="20" fill="currentColor" fillOpacity="0.5" />
      <path
        d={sketchRect(2, 2, 76, 20, { seed, bow: 1 })}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
