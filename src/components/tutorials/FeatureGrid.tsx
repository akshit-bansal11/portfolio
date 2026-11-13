/*
 * FeatureGrid.tsx
 * A grid of tone-tinted cards (icon, title, text) for "these N things work together"
 * explanations. Cards rise in on scroll and lift on hover. Server-rendered, prints as-is.
 */

import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";

export interface Feature {
  title: string;
  text: ReactNode;
  tone: Tone;
  icon?: ReactNode;
  /** Small mono tag, e.g. the command or file it maps to. */
  tag?: string;
}

export default function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <ul className="my-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.title}
          data-tone={item.tone}
          className="dg-node dg-enter rounded-xl border border-(--tone-line) bg-(image:--tone-fill) p-4"
        >
          <p className="flex items-center gap-2.5 font-bold text-(--tone)">
            {item.icon && (
              <span className="dg-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--tone-soft) [&_svg]:h-[18px] [&_svg]:w-[18px]">
                {item.icon}
              </span>
            )}
            {item.title}
          </p>
          {item.tag && (
            <code className="mt-1 inline-block rounded bg-(--tone-soft) px-1.5 py-0.5 text-xs text-ink">
              {item.tag}
            </code>
          )}
          <p className="mt-2 text-sm leading-relaxed text-ink">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
