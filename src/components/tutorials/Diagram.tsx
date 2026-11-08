/*
 * Diagram.tsx
 * Hand-drawn notebook diagrams written straight in MDX, as responsive HTML: a ruled-paper
 * canvas (`Diagram`) holding wobbly, tone-coloured regions (`Group`), boxes (`Node`),
 * horizontal runs (`Row`) and sketched arrows with handwritten labels (`Link`). Rows stack
 * on phones and their arrows turn to point down. Server-rendered, so the PDF prints it.
 */

import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { Logo, type Tech } from "@/components/tutorials/Logo";
import { sketchArrow } from "@/lib/blog/sketch";
import { cn } from "@/lib/utils";

export function Diagram({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="my-10">
      <div className="tut-paper flex flex-col items-stretch rounded-md border border-rule p-4 pl-6 sm:p-8 sm:pl-14">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-hand text-xl text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Static class names so Tailwind sees them.
const COLS: Record<number, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
};

interface GroupProps {
  title: string;
  tone: Tone;
  icon?: ReactNode;
  /** Columns for the children grid (1-5). */
  cols?: number;
  /** Dashed outline: a boundary rather than a thing (a network, a VM edge). */
  dashed?: boolean;
  children: ReactNode;
}

// A circled region with a handwritten, highlighted title above its contents.
export function Group({ title, tone, icon, cols = 1, dashed, children }: GroupProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "tut-sketch my-2 min-w-0 flex-1 border-[2.5px] border-(--tone) bg-(--tone-soft) p-3 sm:p-4",
        dashed && "border-dashed",
      )}
    >
      <p className="mb-2 flex items-center gap-1.5 font-hand text-2xl leading-none font-bold text-(--tone) [&_svg]:h-5 [&_svg]:w-5">
        {icon}
        <span className="tut-marker">{title}</span>
      </p>
      <div className={cn("grid gap-3", COLS[cols])}>{children}</div>
    </section>
  );
}

interface NodeProps {
  title: string;
  note?: string;
  tone?: Tone;
  icon?: ReactNode;
  /** Use a technology logo as the icon. */
  tech?: Tech;
}

// One hand-outlined box: icon, handwritten title, smaller note.
export function Node({ title, note, tone = "blue", icon, tech }: NodeProps) {
  return (
    <div
      data-tone={tone}
      className="tut-sketch-alt flex min-w-0 flex-1 items-center gap-3 border-2 border-(--tone) bg-paper px-3 py-2"
    >
      {(icon || tech) && (
        <span className="shrink-0 text-(--tone) [&_svg]:h-6 [&_svg]:w-6">
          {tech ? <Logo tech={tech} className="text-[1.05rem]" /> : icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-hand text-[1.45rem] leading-6 font-bold text-ink">{title}</span>
        {note && <span className="block font-hand text-lg leading-5 text-ink-muted">{note}</span>}
      </span>
    </div>
  );
}

// Children side by side from `md` up, stacked below it.
export function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-stretch gap-x-3 md:flex-row md:items-center">
      {children}
    </div>
  );
}

interface LinkProps {
  label?: string;
  /** "down" between stacked items, "right" between items in a Row, "both" for two-way. */
  dir?: "down" | "right" | "both";
  tone?: Tone;
  seed?: number;
}

const DOWN = (seed: number) => sketchArrow(15, 3, 15, 50, { seed, curve: 0.12, headSize: 8 });
const ACROSS = (seed: number) => sketchArrow(3, 15, 66, 15, { seed, curve: 0.12, headSize: 8 });
const UP = (seed: number) =>
  sketchArrow(15, 50, 15, 3, { seed: seed + 7, curve: 0.12, headSize: 8 });

function Arrow({
  d,
  view,
  className,
}: {
  d: { shaft: string; head: string }[];
  view: string;
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox={view} className={cn("shrink-0", className)}>
      {d.map((p) => (
        <g
          key={p.shaft}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={p.shaft} className="tut-flow" strokeDasharray="6 5" />
          <path d={p.head} />
        </g>
      ))}
    </svg>
  );
}

// A sketched arrow with a handwritten label. "right" arrows point down on phones.
export function Link({ label, dir = "down", tone = "cyan", seed = 3 }: LinkProps) {
  const across = dir === "right";
  const vertical = dir === "both" ? [DOWN(seed), UP(seed)] : [DOWN(seed)];

  return (
    <div
      data-tone={tone}
      className={cn(
        "flex flex-none items-center justify-center gap-1 py-1 text-(--tone)",
        across && "md:flex-col md:px-1 md:py-0",
      )}
    >
      <Arrow d={vertical} view="0 0 30 54" className={cn("h-14 w-8", across && "md:hidden")} />
      {across && (
        <Arrow d={[ACROSS(seed)]} view="0 0 70 30" className="hidden h-8 w-[4.5rem] md:block" />
      )}
      {label && (
        <span
          className={cn(
            "max-w-[15rem] text-center font-hand text-xl leading-5",
            across && "md:max-w-[8.5rem]",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
