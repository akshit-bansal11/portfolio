/*
 * Analogy.tsx
 * Callout for a real-life analogy, in the tutorial callout style. Tells
 * the everyday story first, then maps each piece back to the technical
 * idea ("the bouncer = the rate limiter").
 */

import { Globe } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnalogyProps {
  title: string;
  children: ReactNode;
  /** Pairs of [everyday thing, technical thing]. */
  mapping?: [string, string][];
  className?: string;
}

export default function Analogy({ title, children, mapping, className }: AnalogyProps) {
  return (
    <aside
      aria-label={`Real-life analogy: ${title}`}
      data-tone="violet"
      className={cn(
        "tut-glow my-8 rounded-xl border border-l-[6px] border-(--tone) bg-(image:--tone-fill) p-4 sm:p-5",
        className,
      )}
    >
      <p className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-(--tone) px-2.5 py-0.5 text-xs font-bold tracking-wide text-paper uppercase">
          <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Real-life analogy
        </span>
        <span className="font-hand text-2xl leading-none font-bold text-(--tone)">{title}</span>
      </p>
      <div className="mt-3 leading-relaxed text-ink [&_p]:my-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
        {children}
      </div>

      {mapping && mapping.length > 0 && (
        <ul className="mt-4 grid list-none gap-2 border-t border-dashed border-(--tone)/40 p-0 pt-4 sm:grid-cols-2">
          {mapping.map(([everyday, technical]) => (
            <li
              key={everyday}
              className="flex flex-wrap items-baseline gap-x-2 rounded-lg bg-paper/60 px-3 py-1.5"
            >
              <span className="font-hand text-xl leading-tight text-(--tone)">{everyday}</span>
              <span aria-hidden className="text-ink-muted">
                →
              </span>
              <span className="font-mono text-[0.85rem] text-ink">
                <span className="sr-only">means </span>
                {technical}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
