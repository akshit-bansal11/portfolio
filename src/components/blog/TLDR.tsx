/*
 * TLDR.tsx
 * End-of-post takeaways as numbered, tone-tinted cards (the same cards
 * as the tutorial glossary).
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
        "my-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 [counter-reset:takeaway]",
        // Cycle the tutorial tones across the notes.
        "[&>li:nth-child(6n+1)]:[--tone-base:var(--tut-amber)] [&>li:nth-child(6n+2)]:[--tone-base:var(--tut-blue)]",
        "[&>li:nth-child(6n+3)]:[--tone-base:var(--tut-green)] [&>li:nth-child(6n+4)]:[--tone-base:var(--tut-pink)]",
        "[&>li:nth-child(6n+5)]:[--tone-base:var(--tut-violet)] [&>li:nth-child(6n)]:[--tone-base:var(--tut-cyan)]",
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
      data-tone=""
      className={cn(
        "dg-node dg-enter relative rounded-xl border border-(--tone-line) bg-(image:--tone-fill) px-4 pt-9 pb-4 text-ink",
        "[counter-increment:takeaway]",
        "before:absolute before:top-3 before:left-4 before:font-mono before:text-xs before:font-bold before:text-(--tone) before:content-[counter(takeaway,decimal-leading-zero)]",
        className,
      )}
    >
      {children}
    </li>
  );
}
