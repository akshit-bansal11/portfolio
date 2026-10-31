/*
 * Diagram.tsx
 * Architecture diagrams written straight in MDX, as plain responsive HTML: a dotted
 * canvas (`Diagram`) holding titled, tone-coloured regions (`Group`), boxes with an icon
 * (`Node`), horizontal runs (`Row`) and labelled arrows (`Link`). Rows stack on phones and
 * their arrows turn to point down. Server-rendered, so the PDF prints it as seen.
 */

import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { Logo, type Tech } from "@/components/tutorials/Logo";
import { cn } from "@/lib/utils";

export function Diagram({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="my-10">
      <div className="tut-canvas flex flex-col items-stretch rounded-2xl border border-rule p-4 sm:p-8">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-ink-muted">{caption}</figcaption>
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
  /** Dashed border: a boundary rather than a thing (a network, a VM edge). */
  dashed?: boolean;
  children: ReactNode;
}

// A titled region. The title sits on the border as a coloured tab.
export function Group({ title, tone, icon, cols = 1, dashed, children }: GroupProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "relative mt-4 min-w-0 flex-1 rounded-xl border-2 border-(--tone) bg-(--tone-soft) p-3 pt-6 sm:p-4 sm:pt-7",
        dashed ? "border-dashed" : "tut-glow",
      )}
    >
      <p className="absolute -top-3.5 left-3 inline-flex items-center gap-1.5 rounded-full bg-(--tone) px-3 py-0.5 text-xs font-bold tracking-wide text-paper uppercase [&_svg]:h-3.5 [&_svg]:w-3.5">
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
}

// One box: icon tile, bold title, muted note.
export function Node({ title, note, tone = "blue", icon, tech }: NodeProps) {
  return (
    <div
      data-tone={tone}
      className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-(--tone) bg-paper p-2.5 sm:p-3"
    >
      {(icon || tech) && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-(--tone-soft) text-(--tone) [&_svg]:h-5 [&_svg]:w-5">
          {tech ? <Logo tech={tech} className="text-[0.9rem]" /> : icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block leading-tight font-semibold text-ink">{title}</span>
        {note && <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{note}</span>}
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
}

// A labelled arrow. "right" arrows point down on phones, where rows stack.
export function Link({ label, dir = "down", tone = "cyan" }: LinkProps) {
  const across = dir === "right";

  return (
    <div
      data-tone={tone}
      className={cn(
        "flex flex-none items-center justify-center gap-2 py-1 text-(--tone)",
        across && "tut-across md:flex-col md:gap-1 md:px-2 md:py-0",
      )}
    >
      <span aria-hidden className={cn("flex flex-col items-center", across && "md:flex-row")}>
        {dir === "both" && <span className="tut-head tut-head-up" />}
        <span className={cn("tut-line block h-8 w-[2px]", across && "md:h-[2px] md:w-14")} />
        <span className="tut-head" />
      </span>
      {label && (
        <span
          className={cn(
            "max-w-[14rem] rounded-full bg-(--tone-soft) px-2 py-0.5 text-center font-mono text-xs text-ink",
            across && "md:max-w-[9rem]",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
