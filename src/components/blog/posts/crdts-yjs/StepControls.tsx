/*
 * StepControls.tsx
 * Back / Play-Pause / Next for the post's step-through diagrams, plus the current step's
 * note. The note is announced to screen readers only while the reader is driving
 * (not during the automatic loop). Play is hidden when reduced motion is on.
 */

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepControlsProps {
  step: number;
  last: number;
  playing: boolean;
  motion: boolean;
  go: (step: number) => void;
  toggle: () => void;
  note: ReactNode;
  tone?: string;
}

const BUTTON =
  "inline-flex min-h-10 items-center gap-1 rounded-lg border border-rule bg-paper px-3 text-sm font-medium text-ink transition-[background-color,border-color,translate] hover:border-(--tone-line) hover:bg-(--tone-soft) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tone) active:translate-y-px disabled:pointer-events-none disabled:opacity-35";

export default function StepControls({
  step,
  last,
  playing,
  motion,
  go,
  toggle,
  note,
  tone = "violet",
}: StepControlsProps) {
  return (
    <div data-tone={tone} className="mt-4 print:hidden">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 rounded-md bg-(--tone-soft) px-2 py-0.5 font-mono text-xs font-semibold text-(--tone)">
          {step + 1}/{last + 1}
        </span>
        <p aria-live={playing ? "off" : "polite"} className="min-h-12 text-[0.95rem] leading-snug text-ink">
          {note}
        </p>
      </div>
      {/* Buttons, then one progress dot per step. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className={BUTTON}>
          <ChevronLeft className="h-4 w-4" aria-hidden /> Back
        </button>
        {motion && (
          <button type="button" onClick={toggle} className={cn(BUTTON, "min-w-24 justify-center")}>
            {playing ? (
              <Pause className="h-4 w-4" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
            {playing ? "Pause" : "Play"}
          </button>
        )}
        <button type="button" onClick={() => go(step + 1)} disabled={step === last} className={BUTTON}>
          Next <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
        <span className="ml-auto flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: last + 1 }, (_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional.
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-5 bg-(--tone)" : "w-1.5 bg-(--tone-line)",
              )}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
