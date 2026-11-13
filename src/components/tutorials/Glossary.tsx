/*
 * Glossary.tsx
 * "Words you need": each term on a clean, tone-tinted card with its plain meaning and an
 * everyday comparison. Cards rise in as they scroll into view and lift on hover. Put it
 * before the first section that uses the words.
 */

import type { Tone } from "@/components/tutorials/Flow";

export interface GlossaryItem {
  term: string;
  /** Plain meaning, one or two short sentences, no other jargon. */
  means: string;
  /** Everyday comparison. */
  like?: string;
  tone?: Tone;
}

const TONES: Tone[] = ["amber", "blue", "green", "pink", "violet", "cyan"];

export default function Glossary({ items }: { items: GlossaryItem[] }) {
  return (
    <ul className="my-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {items.map((item, i) => (
        <li
          key={item.term}
          data-tone={item.tone ?? TONES[i % TONES.length]}
          className="dg-node dg-enter relative overflow-hidden rounded-xl border border-(--tone-line) bg-(image:--tone-fill) p-4 pl-5"
        >
          <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-(--tone)" />
          <p className="text-lg leading-tight font-bold text-(--tone)">{item.term}</p>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">{item.means}</p>
          {item.like && (
            <p className="mt-2 border-t border-dashed border-(--tone-line) pt-2 text-sm leading-snug text-ink-muted">
              <span className="font-semibold text-(--tone)">Like </span>
              {item.like}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
