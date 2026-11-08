/*
 * Compare.tsx
 * A comparison table with tone-coloured column headers (optionally with a logo). The
 * first column is the row label. Scrolls sideways on narrow screens instead of squashing.
 */

import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { Logo, type Tech } from "@/components/tutorials/Logo";

export interface CompareColumn {
  title: string;
  tone?: Tone;
  tech?: Tech;
}

interface CompareProps {
  /** Header of the label column. */
  label?: string;
  columns: (CompareColumn | string)[];
  rows: [string, ...ReactNode[]][];
}

export default function Compare({ label = "", columns, rows }: CompareProps) {
  const cols = columns.map((c) => (typeof c === "string" ? { title: c } : c));

  return (
    <div className="my-8 overflow-x-auto rounded-xl border border-rule">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm sm:text-base">
        <thead>
          <tr>
            <th className="bg-paper-raised p-3 font-semibold text-ink-muted">{label}</th>
            {cols.map((col) => (
              <th
                key={col.title}
                data-tone={col.tone ?? "violet"}
                className="border-b-4 border-(--tone) bg-(--tone-soft) p-3 font-bold text-(--tone)"
              >
                <span className="flex items-center gap-2">
                  {col.tech && <Logo tech={col.tech} />}
                  {col.title}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([rowLabel, ...cells]) => (
            <tr key={rowLabel} className="border-t border-rule odd:bg-paper-raised/50">
              <th scope="row" className="p-3 align-top font-semibold text-ink">
                {rowLabel}
              </th>
              {cells.map((cell, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional.
                <td key={i} className="p-3 align-top text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
