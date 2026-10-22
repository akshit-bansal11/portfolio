/*
 * Analogy.tsx
 * Callout for a real-life analogy. Tells the everyday story
 * first, then maps each piece back to the technical idea
 * ("the bouncer = the rate limiter").
 */

import type { ReactNode } from "react";
import { DrawnPath } from "@/components/blog/Annotation";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

interface AnalogyProps {
  title: string;
  children: ReactNode;
  /** Pairs of [everyday thing, technical thing]. */
  mapping?: [string, string][];
  className?: string;
}

// Short arrow used between the two sides of each mapping row.
const MAP_ARROW = sketchArrow(2, 9, 38, 9, { seed: 4, curve: 0.12, headSize: 6 });

export default function Analogy({ title, children, mapping, className }: AnalogyProps) {
  return (
    <aside
      aria-label={`Real-life analogy: ${title}`}
      className={cn(
        "my-10 rounded-2xl border-2 border-dashed border-pen/70 bg-paper-raised p-5 sm:p-6",
        className,
      )}
    >
      <p className="font-hand text-xl leading-none text-pen">real-life analogy</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-ink">{title}</p>
      <div className="mt-3 leading-relaxed text-ink [&_p]:my-3 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
        {children}
      </div>

      {mapping && mapping.length > 0 && (
        <div className="mt-5 border-t-2 border-dashed border-rule pt-4">
          <p className="mb-2 font-hand text-xl text-ink-muted">mapping it back…</p>
          <ul className="space-y-2">
            {mapping.map(([everyday, technical]) => (
              <li
                key={everyday}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm sm:text-base"
              >
                <span className="font-hand text-xl leading-tight text-pen">{everyday}</span>
                <svg aria-hidden viewBox="0 0 40 18" className="h-4 w-10 text-ink-muted">
                  <DrawnPath d={MAP_ARROW.shaft} strokeWidth={1.6} />
                  <DrawnPath d={MAP_ARROW.head} strokeWidth={1.6} delay={0.5} duration={0.2} />
                </svg>
                <span className="font-mono text-[0.85rem] text-ink">
                  <span className="sr-only">means </span>
                  {technical}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
