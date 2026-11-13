/*
 * MarginNote.tsx
 * Handwritten side note, like something scribbled in a notebook. Posts
 * are full width like the tutorials, so the note sits inline as a
 * tone-coloured aside instead of floating into a margin.
 */

import { PenLine } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarginNoteProps {
  children: ReactNode;
  /** Optional shout-out above the note, e.g. "aha!". */
  label?: string;
  tone?: "pen" | "blue";
  /** Kept for older posts; the inline note has no arrow. */
  arrow?: boolean;
  className?: string;
}

export default function MarginNote({ children, label, tone = "pen", className }: MarginNoteProps) {
  return (
    <aside
      role="note"
      data-tone={tone === "blue" ? "blue" : "amber"}
      className={cn(
        "my-6 flex gap-3 border-l-4 border-dashed border-(--tone) bg-(--tone-soft) py-2 pr-3 pl-4 font-hand text-[1.4rem] leading-snug text-(--tone)",
        // MDX wraps multi-line children in <p>; make those inherit the note's look.
        "[&_p]:m-0 [&_p]:text-[length:inherit] [&_p]:leading-[inherit] [&_p]:text-inherit",
        className,
      )}
    >
      <PenLine className="mt-1.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        {label && <span className="block text-2xl font-bold">{label}</span>}
        {children}
      </div>
    </aside>
  );
}
