/*
 * Flow.tsx
 * Coloured step boxes joined by hand-drawn arrows with marching-ants dashes. Boxes stack
 * vertically on phones and sit in a row from `md` up (or always stack with
 * direction="vertical"). Plain server-rendered HTML/SVG.
 */

import { Fragment, type ReactNode } from "react";
import { sketchArrow } from "@/lib/blog/sketch";
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

const ACROSS = sketchArrow(2, 12, 46, 12, { seed: 3, curve: 0.08, headSize: 7 });
const DOWN = sketchArrow(12, 2, 12, 46, { seed: 5, curve: 0.08, headSize: 7 });

// One arrow between two boxes; `across` points right, otherwise down.
function Arrow({ across, tone, className }: { across: boolean; tone: Tone; className?: string }) {
  const path = across ? ACROSS : DOWN;

  return (
    <svg
      aria-hidden
      data-tone={tone}
      viewBox={across ? "0 0 48 24" : "0 0 24 48"}
      className={cn(across ? "h-6 w-12" : "h-12 w-6", "shrink-0 text-(--tone)", className)}
    >
      <path
        d={path.shaft}
        className="tut-flow"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="5 5"
      />
      <path
        d={path.head}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Flow({ steps, direction = "horizontal" }: FlowProps) {
  const row = direction === "horizontal";

  return (
    <ol
      className={cn(
        "my-8 flex list-none flex-col items-center gap-1 p-0",
        row && "md:flex-row md:items-stretch",
      )}
    >
      {steps.map((step, index) => (
        <Fragment key={step.title}>
          <li
            data-tone={step.tone}
            className={cn(
              "tut-sketch-alt w-full min-w-0 border-[2.5px] border-(--tone) bg-(--tone-soft) px-3 py-2 text-center",
              row && "md:flex-1",
            )}
          >
            {step.icon && (
              <span
                aria-hidden
                className="mb-1 flex justify-center text-(--tone) [&_svg]:h-6 [&_svg]:w-6"
              >
                {step.icon}
              </span>
            )}
            <p className="font-hand text-2xl leading-6 font-bold text-ink">{step.title}</p>
            {step.note && (
              <p className="mt-0.5 font-hand text-lg leading-5 text-ink-muted">{step.note}</p>
            )}
          </li>
          {index < steps.length - 1 && (
            <li aria-hidden className="flex items-center justify-center">
              <Arrow across={false} tone={step.tone} className={row ? "md:hidden" : undefined} />
              {row && <Arrow across tone={step.tone} className="hidden md:block" />}
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
