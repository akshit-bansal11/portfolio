/*
 * CaseFile.tsx
 * "Case file" card for a real company example, in the tutorial style: a
 * tone-coloured card with the company, the problem, the fix and the
 * lesson (each with its own colour and icon), a handwritten note, and a
 * link to the public source the story comes from.
 */

import { CircleAlert, ExternalLink, Lightbulb, type LucideIcon, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

interface CaseFileProps {
  /** Case number shown on the badge. */
  number: number;
  company: string;
  /** e.g. "Big tech", "Startup", "Indian fintech". */
  kind: string;
  /** When it happened, e.g. "2017–2018". */
  period: string;
  problem: ReactNode;
  fix: ReactNode;
  lesson: ReactNode;
  /** Short handwritten aside next to the title. */
  note: string;
  sourceLabel: string;
  sourceHref: string;
  className?: string;
}

// Card colours cycle so a run of case files reads as separate stories.
const CARD_TONES: Tone[] = ["violet", "blue", "cyan", "pink", "amber", "green"];

const FIELDS: { key: "problem" | "fix" | "lesson"; label: string; tone: Tone; Icon: LucideIcon }[] =
  [
    { key: "problem", label: "The problem", tone: "red", Icon: CircleAlert },
    { key: "fix", label: "The fix", tone: "green", Icon: Wrench },
    { key: "lesson", label: "The lesson", tone: "amber", Icon: Lightbulb },
  ];

export default function CaseFile({
  number,
  company,
  kind,
  period,
  note,
  sourceLabel,
  sourceHref,
  className,
  ...fields
}: CaseFileProps) {
  return (
    <article
      aria-label={`Case file: ${company}`}
      data-tone={CARD_TONES[(number - 1) % CARD_TONES.length]}
      className={cn(
        "tut-glow my-10 rounded-xl border-2 border-(--tone) bg-(image:--tone-fill) p-4 sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <span className="inline-block rounded-full bg-(--tone) px-2.5 py-0.5 text-xs font-bold tracking-wide text-paper uppercase">
            Case file #{String(number).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">{company}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            <span className="font-semibold">{kind}</span> · {period}
          </p>
        </div>
        <p className="tut-marker max-w-xs -rotate-1 font-hand text-2xl leading-tight text-(--tone)">
          {note}
        </p>
      </header>

      <dl className="mt-4 grid gap-3 lg:grid-cols-3">
        {FIELDS.map(({ key, label, tone, Icon }) => (
          <div
            key={key}
            data-tone={tone}
            className="rounded-lg border border-(--tone)/50 border-t-4 border-t-(--tone) bg-paper/70 p-3"
          >
            <dt className="flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-(--tone) uppercase">
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </dt>
            <dd className="mt-1.5 leading-relaxed text-ink">{fields[key]}</dd>
          </div>
        ))}
      </dl>

      <a
        href={sourceHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-(--tone) decoration-2 underline-offset-4 hover:text-(--tone)"
      >
        Source: {sourceLabel}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </article>
  );
}
