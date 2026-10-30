/*
 * Term.tsx
 * An important term, inline: coloured, dotted-underlined, and (when `def` is given) a
 * short definition on hover or keyboard focus. The tooltip never prints.
 */

import type { ReactNode } from "react";

interface TermProps {
  /** One-line definition shown on hover/focus. */
  def?: string;
  children: ReactNode;
}

export default function Term({ def, children }: TermProps) {
  if (!def) {
    return (
      <strong data-tone="term" className="font-semibold text-(--tone)">
        {children}
      </strong>
    );
  }

  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: focus shows the definition to keyboard readers.
    <span data-tone="term" tabIndex={0} className="tut-term relative inline-block outline-none">
      <strong className="cursor-help font-semibold text-(--tone) underline decoration-(--tone) decoration-dotted underline-offset-4">
        {children}
      </strong>
      <span
        role="tooltip"
        className="tut-term-tip absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg border border-(--tone) bg-paper-raised p-2.5 text-sm leading-snug font-normal text-ink shadow-lg transition-opacity"
      >
        {def}
      </span>
    </span>
  );
}
