/*
 * ProfileExtras.tsx
 * Handwritten context beside (desktop) or under (mobile) the profile photo:
 * a "currently:" list with small drawn bullets, and "worked across" with a row
 * of hand-drawn stamp labels, each tilted a little differently.
 */

"use client";

import { CURRENTLY, WORKED_ACROSS } from "@/data/heroContent";
import { useElementSize } from "@/hooks/use-element-size";
import { sketchEllipse, sketchRect } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

const BULLET = sketchEllipse(6, 6, 3.5, 3.5, { seed: 81, jitter: 0.1 });

// Tilt and outline colour per stamp (full class names so Tailwind can see them).
const STAMP_STYLES = [
  "-rotate-2 text-doodle-1",
  "rotate-1 text-doodle-2",
  "-rotate-1 text-doodle-3",
  "rotate-2 text-doodle-1",
  "-rotate-3 text-doodle-2",
] as const;

// One stamp label: uppercase text inside a sketchy outline sized to the text.
function Stamp({ label, index }: { label: string; index: number }) {
  const [ref, { width, height }] = useElementSize<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={cn(
        "relative px-3 py-1.5 font-grotesk text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-hero-ink",
        STAMP_STYLES[index % STAMP_STYLES.length],
      )}
    >
      {width > 0 && (
        <svg
          aria-hidden
          width={width}
          height={height}
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
        >
          <path
            d={sketchRect(1, 1, width - 2, height - 2, { seed: 90 + index, bow: 1 })}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </svg>
      )}
      <span className="text-hero-ink">{label}</span>
    </li>
  );
}

interface ProfileExtrasProps {
  className?: string;
}

// Renders the two handwritten blocks.
export default function ProfileExtras({ className }: ProfileExtrasProps) {
  return (
    <div className={cn("flex flex-col gap-6 text-left", className)}>
      <section>
        <h3 className="-rotate-2 font-hand text-3xl font-bold leading-none text-hero-pen">
          currently:
        </h3>
        <ul className="mt-2 flex flex-col gap-1">
          {CURRENTLY.map((item) => (
            <li
              key={item}
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
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="font-hand text-2xl font-semibold leading-none text-hero-muted">
          worked across
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-3">
          {WORKED_ACROSS.map((label, index) => (
            <Stamp key={label} label={label} index={index} />
          ))}
        </ul>
      </section>
    </div>
  );
}
