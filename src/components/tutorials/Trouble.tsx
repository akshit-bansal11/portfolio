/*
 * Trouble.tsx
 * Troubleshooting entries as native <details>: the exact error text is the summary
 * (monospace), then a Cause block and a Fix block. `TroubleGroup` is a titled list of
 * them. Print opens every entry (see DownloadPdf).
 */

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface TroubleProps {
  /** The error text or symptom exactly as the reader sees it. */
  symptom: string;
  /** Why it happens. */
  cause: ReactNode;
  /** The fix: prose and commands. */
  children: ReactNode;
}

export function Trouble({ symptom, cause, children }: TroubleProps) {
  return (
    <details
      data-tone="red"
      className="tut-trouble group my-3 rounded-lg border border-(--tone) bg-(--tone-soft)"
    >
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pen">
        <ChevronRight
          className="h-4 w-4 shrink-0 text-(--tone) transition-transform group-open:rotate-90 motion-reduce:transition-none"
          aria-hidden
        />
        <span className="min-w-0 font-mono text-sm break-words text-ink">{symptom}</span>
      </summary>
      <div className="space-y-3 border-t border-(--tone) px-3 py-3">
        <div>
          <p className="font-semibold text-(--tone)">Cause</p>
          <div className="[&>p]:my-1">{cause}</div>
        </div>
        <div>
          <p className="font-semibold text-(--tone)">Fix</p>
          <div className="[&>p]:my-1">{children}</div>
        </div>
      </div>
    </details>
  );
}

interface TroubleGroupProps {
  title?: string;
  children: ReactNode;
}

export function TroubleGroup({ title = "If it goes wrong", children }: TroubleGroupProps) {
  return (
    <div role="group" aria-label={title} className="my-8">
      <p className="text-lg font-bold text-ink">{title}</p>
      {children}
    </div>
  );
}
