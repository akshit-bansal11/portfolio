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

const BULLET = sketchEllipse(6, 6, 3.5, 3.5, { seed: 81, jitter: 0.1 });

// Tilt (within -2..2deg) and outline colour per stamp (full class names so Tailwind can see them).
const STAMP_STYLES = [
  "-rotate-2 text-doodle-1",
  "rotate-1 text-doodle-2",
  "-rotate-1 text-doodle-3",
  "rotate-2 text-doodle-1",
  "rotate-0 text-doodle-2",
] as const;

interface ProfileExtrasProps {
  className?: string;
}

// Renders the two handwritten blocks.
export default function ProfileExtras({ className }: ProfileExtrasProps) {
  return (
    <div className={cn("flex flex-col gap-5 text-left", className)}>
      <section>
        <h3 className="-rotate-2 font-hand text-3xl font-bold leading-none text-hero-pen">
          currently:
        </h3>
        <ul className="mt-2 flex flex-col gap-1">
          {CURRENTLY.map(({ text, link }) => (
            <li
              key={text + (link?.label ?? "")}
              className="flex items-start gap-2 font-hand text-2xl font-semibold leading-tight text-hero-ink"
            >
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="mt-2 h-3 w-3 shrink-0 overflow-visible text-hero-pen"
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
        <ul className="mt-3 flex flex-wrap gap-2">
          {WORKED_ACROSS.map((label, index) => (
            <li
              key={label}
              className={cn(
                "hand-border border-[1.5px] border-current px-2.5 py-0.5 font-grotesk text-[0.72rem] font-medium uppercase leading-snug tracking-[0.06em]",
                STAMP_STYLES[index % STAMP_STYLES.length],
              )}
            >
              <span className="text-hero-ink">{label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
