/*
 * SettingsTable.tsx
 * A table for MDX posts (the MDX pipeline has no GFM, so markdown pipe
 * tables don't render), styled like the tutorial Compare table:
 * tone-coloured headers, zebra rows. Scrolls sideways inside its own
 * box on narrow screens.
 * Usage in MDX: <SettingsTable columns={["A", "B"]} rows={[["a1", "b1"]]} />
 */

import type { ReactNode } from "react";
import type { Tone } from "@/components/tutorials/Flow";
import { cn } from "@/lib/utils";

interface SettingsTableProps {
  columns: string[];
  /** Each row starts with a unique plain-text label (also its React key). */
  rows: [string, ...ReactNode[]][];
  /** Header colour for the value columns. */
  tone?: Tone;
  className?: string;
}

export default function SettingsTable({
  columns,
  rows,
  tone = "violet",
  className,
}: SettingsTableProps) {
  return (
    <div className={cn("my-8 overflow-x-auto rounded-xl border border-rule", className)}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm sm:text-base">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                data-tone={tone}
                className={cn(
                  "p-3 font-bold",
                  index === 0
                    ? "bg-paper-raised text-ink-muted"
                    : "border-b-4 border-(--tone) bg-(--tone-soft) text-(--tone)",
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...rest]) => (
            <tr key={label} className="border-t border-rule align-top odd:bg-paper-raised/50">
              <th scope="row" className="p-3 font-semibold text-ink">
                {label}
              </th>
              {rest.map((cell, cellIndex) => (
                <td key={`${label}-${columns[cellIndex + 1]}`} className="p-3 text-ink">
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
