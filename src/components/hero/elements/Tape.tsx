/*
 * Tape.tsx
 * A strip of translucent masking tape with torn zig-zag ends and a faint
 * lengthwise texture, no outline. It pins a photo or note to the board; the
 * colour comes from --tape so both themes show the same strip.
 */

import { cn } from "@/lib/utils";

// Strip outline: straight long edges, jagged short ends.
const STRIP_POINTS =
  "3,0 77,0 80,3 77,6 80,9 77,12 80,15 77,18 80,21 77,24 3,24 0,21 3,18 0,15 3,12 0,9 3,6 0,3";

interface TapeProps {
  className?: string;
}

// Renders one tape strip; position and tilt come from className.
export default function Tape({ className }: TapeProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 24"
      className={cn("pointer-events-none h-6 w-20 overflow-visible", className)}
    >
      <polygon points={STRIP_POINTS} style={{ fill: "var(--tape)" }} />
      <g stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.07" className="text-hero-ink">
        <line x1="6" y1="8" x2="74" y2="8" />
        <line x1="5" y1="12.5" x2="75" y2="12.5" />
        <line x1="6" y1="17" x2="74" y2="17" />
      </g>
    </svg>
  );
}
