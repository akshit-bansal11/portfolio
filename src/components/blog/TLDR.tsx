/*
 * TLDR.tsx
 * End-of-post takeaways rendered as handwritten sticky notes.
 * Usage in MDX: <TLDR><Takeaway>…</Takeaway>…</TLDR>
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TLDRProps {
  children: ReactNode;
  className?: string;
}

export function TLDR({ children, className }: TLDRProps) {
  return (
    <ol
      className={cn(
        "my-10 grid list-none gap-6 p-0 sm:grid-cols-2 [counter-reset:takeaway]",
        className,
      )}
    >
      {children}
    </ol>
  );
}

interface TakeawayProps {
  children: ReactNode;
  className?: string;
}

export function Takeaway({ children, className }: TakeawayProps) {
  return (
    <li
      className={cn(
        "relative bg-sticky px-5 pt-7 pb-5 font-hand text-[1.45rem] leading-snug text-sticky-ink shadow-md",
        "[counter-increment:takeaway] odd:-rotate-1 even:rotate-1",
        "before:absolute before:top-1.5 before:left-4 before:text-lg before:font-bold before:opacity-60 before:content-['#'_counter(takeaway)]",
        "motion-safe:transition-transform motion-safe:hover:rotate-0",
        className,
      )}
    >
      {children}
    </li>
  );
}
