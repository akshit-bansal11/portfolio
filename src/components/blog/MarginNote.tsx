/*
 * MarginNote.tsx
 * Short side note. Posts are full width like the tutorials, so the
 * note sits inline as a quiet tone-coloured aside.
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
        "my-6 flex gap-3 rounded-r-xl border-l-4 border-(--tone) bg-(--tone-soft) py-2.5 pr-3 pl-4 leading-relaxed text-ink",
        // MDX wraps multi-line children in <p>; make those inherit the note's look.
        "[&_p]:m-0 [&_p]:text-[length:inherit] [&_p]:leading-[inherit] [&_p]:text-inherit",
        className,
      )}
    >
      <PenLine className="mt-1 h-4 w-4 shrink-0 text-(--tone)" aria-hidden />
      <div>
        {label && (
          <span className="block text-xs font-bold tracking-[0.08em] text-(--tone) uppercase">
            {label}
          </span>
        )}
        {children}
      </div>
    </aside>
  );
}
