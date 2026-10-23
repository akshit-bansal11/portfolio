/*
 * Heatmap.tsx
 * The contribution calendar as a grid of small rounded squares (one column per week) coloured
 * with the --heat-0..4 theme tokens, with Caveat month labels and a less/more legend.
 */

import { useMemo } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LEVELS = [0, 1, 2, 3, 4] as const;
const CELL = "h-3 w-3 rounded-[3px]";

interface Cell {
  date: string;
  row: number;
}

// Local calendar date as YYYY-MM-DD (matches the dates GitHub returns).
function isoDay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Every day from Jan 1 of the year up to today (or Dec 31), grouped into Sunday-first weeks.
function buildWeeks(year: number): Cell[][] {
  const weeks: Cell[][] = [];
  const today = new Date();
  const cursor = new Date(year, 0, 1);
  let week: Cell[] = [];
  while (cursor.getFullYear() === year && cursor <= today) {
    week.push({ date: isoDay(cursor), row: cursor.getDay() });
    if (cursor.getDay() === 6) {
      weeks.push(week);
      week = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}

// Heat level 0..4 for a count, relative to the busiest day.
function level(count: number, max: number): number {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

interface HeatmapProps {
  /** ISO date -> contribution count. */
  data: Record<string, number>;
  year: number;
  total: number;
}

// Renders the grid.
export default function Heatmap({ data, year, total }: HeatmapProps) {
  const weeks = useMemo(() => buildWeeks(year), [year]);
  const max = useMemo(() => Math.max(1, ...Object.values(data)), [data]);
  const months = useMemo(() => {
    const out: { label: string; col: number }[] = [];
    weeks.forEach((week, col) => {
      const label = MONTHS[Number(week[0].date.slice(5, 7)) - 1];
      if (out.length === 0 || label !== out[out.length - 1].label) out.push({ label, col });
    });
    return out;
  }, [weeks]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        role="img"
        aria-label={`Contribution calendar for ${year}: ${total.toLocaleString("en-US")} contributions`}
        className="grid w-full gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
          minWidth: `${weeks.length * 13}px`,
        }}
      >
        {months.map((m) => (
          <span
            key={`${m.label}-${m.col}`}
            className="mb-1 whitespace-nowrap font-hand text-lg font-bold leading-none text-hero-muted"
            style={{ gridRow: 1, gridColumn: m.col + 1 }}
          >
            {m.label}
          </span>
        ))}
        {weeks.map((week, col) =>
          week.map((day) => (
            <div
              key={day.date}
              title={`${data[day.date] ?? 0} on ${day.date}`}
              className="aspect-square rounded-[3px]"
              style={{
                gridRow: day.row + 2,
                gridColumn: col + 1,
                backgroundColor: `var(--heat-${level(data[day.date] ?? 0, max)})`,
              }}
            />
          )),
        )}
      </div>
      <div
        aria-hidden
        className="flex items-center gap-1 font-hand text-lg font-bold text-hero-muted"
      >
        less
        {LEVELS.map((l) => (
          <span key={l} className={CELL} style={{ backgroundColor: `var(--heat-${l})` }} />
        ))}
        more
      </div>
    </div>
  );
}
