/*
 * CaseFile.tsx
 * "Case file" card for a real company example: a manila
 * folder with the company, the problem, the fix and the
 * lesson, a sticky note scribbled on top, and a link to the
 * public source the story comes from.
 */

import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { cn } from "@/lib/utils";

interface CaseFileProps {
  /** Case number shown on the folder tab. */
  number: number;
  company: string;
  /** e.g. "Big tech", "Startup", "Indian fintech". */
  kind: string;
  /** When it happened, e.g. "2017–2018". */
  period: string;
  problem: ReactNode;
  fix: ReactNode;
  lesson: ReactNode;
  /** Handwritten sticky note on top of the folder. */
  note: string;
  sourceLabel: string;
  sourceHref: string;
  className?: string;
}

// One labelled row inside the folder.
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-dashed border-ink/25 py-3 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
      <dt className="text-xs font-bold tracking-[0.14em] text-ink-muted uppercase sm:pt-1">
        {label}
      </dt>
      <dd className="leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

export default function CaseFile({
  number,
  company,
  kind,
  period,
  problem,
  fix,
  lesson,
  note,
  sourceLabel,
  sourceHref,
  className,
}: CaseFileProps) {
  return (
    <ScrollReveal className={cn("my-14", className)}>
      <article aria-label={`Case file: ${company}`} className="relative pt-7">
        {/* Folder tab */}
        <div className="absolute top-0 left-4 rounded-t-lg border-2 border-b-0 border-ink bg-folder px-3 py-1 text-xs font-bold tracking-[0.18em] text-ink uppercase">
          Case file #{String(number).padStart(2, "0")}
        </div>

        <div className="relative rounded-xl rounded-tl-none border-2 border-ink bg-folder p-4 shadow-[4px_4px_0_0_var(--blog-ink)] sm:p-6">
          {/* Sticky note: in flow on phones, pinned top-right on larger screens */}
          <p
            className={cn(
              "relative mb-4 ml-auto w-fit max-w-[85%] rotate-2 bg-sticky px-3 pt-3 pb-2 font-hand text-xl leading-tight text-sticky-ink shadow-md",
              "sm:absolute sm:-top-6 sm:right-5 sm:mb-0 sm:max-w-[15rem]",
            )}
          >
            <span
              aria-hidden
              className="absolute -top-2.5 left-1/2 h-4 w-14 -translate-x-1/2 -rotate-3 bg-ink/15"
            />
            {note}
          </p>

          <header className="mb-2 sm:pr-64">
            <h3 className="text-2xl font-bold tracking-tight text-ink">{company}</h3>
            <p className="mt-1 text-sm text-ink-muted">
              <span className="font-semibold">{kind}</span> · {period}
            </p>
          </header>

          <dl>
            <Field label="The problem">{problem}</Field>
            <Field label="The fix">{fix}</Field>
            <Field label="The lesson">{lesson}</Field>
          </dl>

          <a
            href={sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-pen decoration-2 underline-offset-4 hover:text-pen"
          >
            Source: {sourceLabel}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </article>
    </ScrollReveal>
  );
}
