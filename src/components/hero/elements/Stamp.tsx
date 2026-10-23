/*
 * Stamp.tsx
 * One CSS hand-drawn stamp label (a list item): a tilted, irregular outline in a doodle
 * colour around uppercase ink text. Used for the hero's "worked across" row and for each
 * project's tech stack.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Tilt (within -2..2deg) and outline colour per stamp (full class names so Tailwind can see them).
const STAMP_STYLES = [
  "-rotate-2 text-doodle-1",
  "rotate-1 text-doodle-2",
  "-rotate-1 text-doodle-3",
  "rotate-2 text-doodle-1",
  "rotate-0 text-doodle-2",
] as const;

interface StampProps {
  label: string;
  index: number;
  /** Optional icon drawn before the label, in the stamp colour. */
  icon?: ReactNode;
}

// Renders one stamp; its position in the row picks the tilt and colour.
export default function Stamp({ label, index, icon }: StampProps) {
  return (
    <li
      className={cn(
        "hand-border inline-flex items-center gap-1.5 whitespace-nowrap border-[1.5px] border-current px-2.5 py-0.5 font-grotesk text-[0.72rem] font-medium uppercase leading-snug tracking-[0.06em]",
        STAMP_STYLES[index % STAMP_STYLES.length],
      )}
    >
      {icon}
      <span className="text-hero-ink">{label}</span>
    </li>
  );
}
