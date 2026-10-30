/*
 * Quiz.tsx
 * A one-question self-check. Picking an option marks it right or wrong and reveals why.
 * The printed copy shows the correct answer and the explanation.
 */

"use client";

import { CircleCheck, CircleHelp, CircleX } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface QuizProps {
  question: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  children: ReactNode;
}

export default function Quiz({ question, options, answer, children }: QuizProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;

  return (
    <section
      data-tone="violet"
      className="my-8 max-w-[88ch] rounded-xl border-2 border-dashed border-(--tone) p-4"
    >
      <p className="flex items-start gap-2 font-semibold text-ink">
        <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-(--tone)" aria-hidden />
        <span>
          <span className="text-(--tone)">Quick check: </span>
          {question}
        </span>
      </p>
      <ul className="mt-3 grid list-none gap-2 p-0 sm:grid-cols-2">
        {options.map((option, i) => {
          const right = i === answer;
          const state = !done ? "idle" : right ? "right" : i === picked ? "wrong" : "idle";
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => setPicked(i)}
                aria-pressed={picked === i}
                data-tone={state === "right" ? "green" : state === "wrong" ? "red" : "violet"}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm text-ink transition-colors",
                  state === "idle"
                    ? "border-rule hover:border-(--tone)"
                    : "border-(--tone) bg-(--tone-soft)",
                  right && "print:border-(--tone) print:bg-(--tone-soft)",
                )}
              >
                {state === "right" && (
                  <CircleCheck className="h-4 w-4 shrink-0 text-(--tone)" aria-hidden />
                )}
                {state === "wrong" && (
                  <CircleX className="h-4 w-4 shrink-0 text-(--tone)" aria-hidden />
                )}
                {option}
              </button>
            </li>
          );
        })}
      </ul>
      <div
        aria-live="polite"
        className={cn(
          "mt-3 text-sm leading-relaxed text-ink [&>p]:my-1",
          !done && "hidden print:block",
        )}
      >
        <p className="font-semibold">
          {done && picked !== answer ? "Not quite. " : ""}Answer: {options[answer]}
        </p>
        {children}
      </div>
    </section>
  );
}
