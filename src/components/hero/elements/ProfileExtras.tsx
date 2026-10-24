/*
 * ProfileExtras.tsx
 * Handwritten context beside (desktop) or under (mobile) the profile photo:
 * a "currently:" list with small drawn bullets (an item may carry a link), and
 * "worked across" with a row of CSS hand-drawn stamp labels, each tilted a little
 * differently and drawn in its own doodle colour.
 */

import { CURRENTLY, WORKED_ACROSS } from "@/data/heroContent";
import { sketchEllipse } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";
import Stamp from "./Stamp";

const BULLET = sketchEllipse(6, 6, 3.5, 3.5, { seed: 81, jitter: 0.1 });

interface ProfileExtrasProps {
  /** Smaller type and spacing for the stage-4 column. */
  compact?: boolean;
  className?: string;
}

// Renders the two handwritten blocks.
export default function ProfileExtras({ className, compact = false }: ProfileExtrasProps) {
  return (
    <div className={cn("flex flex-col text-left", compact ? "gap-3" : "gap-5", className)}>
      <section>
        <h3
          className={cn(
            "-rotate-2 font-hand font-bold leading-none text-hero-pen",
            compact ? "text-2xl" : "text-3xl",
          )}
        >
          currently:
        </h3>
        <ul className={cn("flex flex-col gap-1", compact ? "mt-1" : "mt-2")}>
          {CURRENTLY.map(({ text, link }) => (
            <li
              key={text + (link?.label ?? "")}
              className={cn(
                "flex items-start gap-2 font-hand font-semibold leading-tight text-hero-ink",
                compact ? "text-xl" : "text-2xl",
              )}
            >
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className={cn(
                  "h-3 w-3 shrink-0 overflow-visible text-hero-pen",
                  compact ? "mt-1.5" : "mt-2",
                )}
              >
                <path
                  d={BULLET}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
              <span>
                {text}
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-transparent decoration-2 underline-offset-4 outline-none transition-colors hover:decoration-hero-pen focus-visible:decoration-hero-pen"
                  >
                    {link.label}
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="font-hand text-2xl font-semibold leading-none text-hero-muted">
          worked across
        </h3>
        <ul className={cn("flex flex-wrap gap-2", compact ? "mt-2" : "mt-3")}>
          {WORKED_ACROSS.map((label, index) => (
            <Stamp key={label} label={label} index={index} />
          ))}
        </ul>
      </section>
    </div>
  );
}
