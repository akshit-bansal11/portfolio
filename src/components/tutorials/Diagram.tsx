/*
 * Diagram.tsx
 * Clean, animated architecture diagrams written straight in MDX, as responsive HTML: a
 * dot-grid canvas (`Diagram`) holding tone-tinted regions (`Group`), boxes (`Node`),
 * horizontal runs (`Row`) and connectors with packets flowing along them (`Link`).
 * Parts rise in as they scroll into view; hovering a node lifts it and dims the rest.
 * Rows stack on phones and their connectors turn to point down. Server-rendered, motion
 * is CSS only (see the diagram kit in tutorials.css), so the PDF prints the final state.
 */

import type { CSSProperties, ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { Logo, type Tech } from "@/components/tutorials/Logo";
import { cn } from "@/lib/utils";

export function Diagram({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="my-10">
      <div className="dg-canvas flex flex-col items-stretch rounded-2xl border border-rule p-4 sm:p-7">
        {children}
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-muted">
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

// A tinted region with a labelled tab on top.
export function Group({ title, tone, icon, cols = 1, dashed, children }: GroupProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "dg-enter my-2 min-w-0 flex-1 rounded-2xl border-[1.5px] border-(--tone-line) bg-(--tone-soft) p-3 pt-2.5 sm:p-4 sm:pt-3",
        dashed && "border-dashed",
      )}
    >
      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-(--tone) uppercase [&_svg]:h-4 [&_svg]:w-4">
        {icon}
        {title}
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
  /** A soft pulsing ring: "this is the one we're talking about". */
  pulse?: boolean;
}

// One box: icon chip, title, smaller note. Lifts on hover.
export function Node({ title, note, tone = "blue", icon, tech, pulse }: NodeProps) {
  return (
    <div
      data-tone={tone}
      className={cn(
        "dg-node dg-enter flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-(--tone-line) bg-paper px-3 py-2.5",
        pulse && "dg-pulse",
      )}
    >
      {(icon || tech) && (
        <span className="dg-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--tone-soft) text-(--tone) [&_svg]:h-5 [&_svg]:w-5">
          {tech ? <Logo tech={tech} className="text-[1.05rem]" /> : icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-semibold leading-snug text-ink">{title}</span>
        {note && <span className="block text-sm leading-snug text-ink-muted">{note}</span>}
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

// Arrowhead pointing down or right, drawn at a fixed size so it never stretches.
function Head({ dir, className }: { dir: "down" | "up" | "right" | "left"; className?: string }) {
  const rotate = { down: "rotate-0", up: "rotate-180", right: "-rotate-90", left: "rotate-90" }[
    dir
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      className={cn("h-2 w-3 shrink-0 fill-(--tone)", rotate, className)}
    >
      <path d="M0 0 L12 0 L6 8 Z" />
    </svg>
  );
}

// A wire with packets travelling along it. `back` sends a second stream the other way.
export function Wire({
  axis,
  back,
  className,
}: {
  axis: "x" | "y";
  back?: boolean;
  className?: string;
}) {
  const dot =
    "dg-dot absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--tone) shadow-[0_0_0_3px_var(--tone-soft)]";
  const along = axis === "x" ? "top-1/2" : "left-1/2";
  return (
    <span
      aria-hidden
      className={cn(
        "relative block rounded-full",
        axis === "x" ? "dg-wire-x h-[2px]" : "dg-wire-y w-[2px]",
        className,
      )}
    >
      <span className={cn(dot, along)} />
      <span className={cn(dot, along)} style={{ "--delay": "-0.95s" } as CSSProperties} />
      {back && (
        <span
          className={cn(dot, along, "dg-dot-back")}
          style={{ "--delay": "-0.45s" } as CSSProperties}
        />
      )}
    </span>
  );
}

interface LinkProps {
  label?: string;
  /** "down" between stacked items, "right" between items in a Row, "both" for two-way. */
  dir?: "down" | "right" | "both";
  tone?: Tone;
  /** Kept for older MDX; connectors are no longer hand-drawn. */
  seed?: number;
}

// A connector with a label. "right" connectors point down on phones.
export function Link({ label, dir = "down", tone = "cyan" }: LinkProps) {
  const across = dir === "right";
  const both = dir === "both";

  return (
    <div
      data-tone={tone}
      className={cn(
        "dg-link dg-enter flex flex-none items-center justify-center gap-2 py-1 text-(--tone)",
        across && "md:flex-col md:gap-1 md:px-1 md:py-0",
      )}
    >
      <span className={cn("flex flex-col items-center", across && "md:hidden")}>
        {both && <Head dir="up" />}
        <Wire axis="y" back={both} className="h-10" />
        <Head dir="down" />
      </span>
      {across && (
        <span className="hidden items-center md:flex">
          <Wire axis="x" className="w-16" />
          <Head dir="right" />
        </span>
      )}
      {label && (
        <span
          className={cn(
            "max-w-[15rem] text-center text-sm leading-snug font-medium",
            across && "md:max-w-[8.5rem]",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
