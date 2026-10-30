/*
 * Steps.tsx
 * Numbered walkthrough: `Steps` is the list, each `Step` has a numbered badge, a connecting
 * line to the next step, a title, and an optional green "You should see" checkpoint.
 * Numbers come from a CSS counter (tutorials.css), so Step needs no index.
 */

import { CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="tut-steps my-8 list-none p-0">{children}</ol>;
}

interface StepProps {
  title: string;
  tone?: Tone;
  /** What the reader should see when the step worked. */
  checkpoint?: ReactNode;
  children?: ReactNode;
}

export function Step({ title, tone = "blue", checkpoint, children }: StepProps) {
  return (
    <li
      data-tone={tone}
      className="tut-step relative pb-8 pl-14 before:absolute before:top-9 before:bottom-0 before:left-4 before:w-0.5 before:bg-(--tone-soft) last:pb-0 last:before:hidden"
    >
      <span
        aria-hidden
        className="tut-step-num absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-(--tone) bg-(--tone-soft) text-sm font-bold text-ink"
      />
      <p className="text-lg leading-8 font-semibold text-ink">{title}</p>
      <div className="[&>p]:my-3 [&>p:first-child]:mt-2">{children}</div>
      {checkpoint && (
        <div
          data-tone="green"
          className="mt-3 rounded-lg border-l-4 border-(--tone) bg-(--tone-soft) p-3"
        >
          <p className="flex items-center gap-2 font-semibold text-(--tone)">
            <CircleCheck className="h-5 w-5 shrink-0" aria-hidden />
            You should see
          </p>
          <div className="mt-1 text-ink [&>p]:my-1">{checkpoint}</div>
        </div>
      )}
    </li>
  );
}
