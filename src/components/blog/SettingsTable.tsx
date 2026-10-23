/*
 * SettingsTable.tsx
 * A small notebook-style table for MDX posts (the MDX pipeline has
 * no GFM, so markdown pipe tables don't render). Scrolls sideways
 * inside its own box on narrow screens.
 * Usage in MDX: <SettingsTable columns={["A", "B"]} rows={[["a1", "b1"]]} />
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsTableProps {
  columns: string[];
  /** Each row starts with a unique plain-text label (also its React key). */
  rows: [string, ...ReactNode[]][];
  className?: string;
}

export default function SettingsTable({ columns, rows, className }: SettingsTableProps) {
  return (
    <div className={cn("my-7 overflow-x-auto rounded-xl border-2 border-ink", className)}>
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem] leading-relaxed">
        <thead className="bg-paper-raised">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b-2 border-ink px-4 py-2.5 font-semibold text-ink"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, ...rest]) => (
            <tr key={label} className="border-b border-rule last:border-b-0 align-top">
              {[label, ...rest].map((cell, cellIndex) => (
                <td
                  key={`${label}-${columns[cellIndex]}`}
                  className={cn(
                    "px-4 py-2.5 text-ink",
                    cellIndex === 0 ? "font-medium" : "text-ink-muted",
                  )}
                >
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
