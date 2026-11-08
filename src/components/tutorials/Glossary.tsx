/*
 * Glossary.tsx
 * "Words you need": each term on a slightly tilted sticky note with its plain meaning and
 * an everyday comparison. Put it before the first section that uses the words.
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
    <ul className="my-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {items.map((item, i) => (
        <li
          key={item.term}
          data-tone={item.tone ?? TONES[i % TONES.length]}
          className="tut-note relative border-t-[6px] border-(--tone) bg-(--tone-soft) p-4 shadow-sm"
        >
          <p className="font-hand text-3xl leading-none font-bold text-(--tone)">{item.term}</p>
          <p className="mt-2 text-ink">{item.means}</p>
          {item.like && (
            <p className="mt-2 font-hand text-xl leading-6 text-ink-muted">
              <span className="font-bold text-(--tone)">like: </span>
              {item.like}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
