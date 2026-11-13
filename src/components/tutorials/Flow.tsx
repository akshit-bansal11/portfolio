/*
 * Flow.tsx
 * Numbered step cards joined by connectors with packets flowing along them. A spotlight
 * walks from step to step on a loop (paused while you hover the flow), and each card
 * lifts on hover. Cards stack on phones and sit in a row from `md` up (or always stack
 * with direction="vertical"). Server-rendered; motion is CSS only.
 */

import { type CSSProperties, Fragment, type ReactNode } from "react";
import { Wire } from "@/components/tutorials/Diagram";
import { cn } from "@/lib/utils";

export type Tone =
  | "blue"
  | "violet"
  | "green"
  | "amber"
  | "pink"
  | "cyan"
  | "red"
  | "docker"
  | "k8s"
  | "vm"
  | "term";

export interface FlowStep {
  title: string;
  note?: string;
  tone: Tone;
  /** An icon element, e.g. `<Server />` from lucide-react. */
  icon?: ReactNode;
}

interface FlowProps {
  steps: FlowStep[];
  /** "horizontal" (default) rows up from `md`; "vertical" always stacks. */
  direction?: "horizontal" | "vertical";
}

// Connector between two cards: down on phones (or always), right in a row.
function Connector({ tone, row }: { tone: Tone; row: boolean }) {
  return (
    <li aria-hidden data-tone={tone} className="dg-link flex items-center justify-center">
      <span className={cn("flex flex-col items-center py-0.5", row && "md:hidden")}>
        <Wire axis="y" className="h-7" />
        <svg viewBox="0 0 12 8" className="h-2 w-3 fill-(--tone)">
          <path d="M0 0 L12 0 L6 8 Z" />
        </svg>
      </span>
      {row && (
        <span className="hidden items-center md:flex">
          <Wire axis="x" className="w-7" />
          <svg viewBox="0 0 8 12" className="h-3 w-2 fill-(--tone)">
            <path d="M0 0 L8 6 L0 12 Z" />
          </svg>
        </span>
      )}
    </li>
  );
}

export default function Flow({ steps, direction = "horizontal" }: FlowProps) {
  const row = direction === "horizontal";

  return (
    <ol
      className={cn(
        "dg-flow my-8 flex list-none flex-col items-stretch gap-0 p-0",
        row && "md:flex-row md:items-stretch",
      )}
      style={{ "--n": steps.length } as CSSProperties}
    >
      {steps.map((step, index) => (
        <Fragment key={step.title}>
          <li
            data-tone={step.tone}
            style={{ "--i": index } as CSSProperties}
            className={cn(
              "dg-node dg-spot dg-enter relative w-full min-w-0 rounded-xl border border-(--tone-line) bg-(--tone-soft) px-3 pt-3 pb-2.5 text-center",
              row && "md:flex-1",
            )}
          >
            <span className="absolute top-2 left-2.5 font-mono text-[0.7rem] font-bold text-(--tone) opacity-80">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step.icon && (
              <span
                aria-hidden
                className="dg-icon mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-paper text-(--tone) [&_svg]:h-5 [&_svg]:w-5"
              >
                {step.icon}
              </span>
            )}
            <p className="font-semibold leading-snug text-ink">{step.title}</p>
            {step.note && <p className="mt-0.5 text-sm leading-snug text-ink-muted">{step.note}</p>}
          </li>
          {index < steps.length - 1 && <Connector tone={step.tone} row={row} />}
        </Fragment>
      ))}
    </ol>
  );
}
