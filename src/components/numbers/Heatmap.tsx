/*
 * Heatmap.tsx
 * The contribution calendar as a grid of small rounded squares (one column per week) coloured
 * with the --heat-0..4 theme tokens, with Caveat month labels and a less/more legend.
 * Every square shows its count; the keyboard path is one tab stop (arrow keys, Home/End) with a
 * polite live announcement.
 */

"use client";

import { type KeyboardEvent, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LEVELS = [0, 1, 2, 3, 4] as const;
const CELL = "h-3 w-3 rounded-[3px]";
// Phones keep a 24px minimum cell (plus the 3px gap) and scroll inside the card.
const MIN_STEP = 27;

interface Day {
  date: string;
  row: number;
  col: number;
}

// Local calendar date as YYYY-MM-DD (matches the dates GitHub returns).
function isoDay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Every day from Jan 1 of the year up to today (or Dec 31), grouped into Sunday-first weeks.
function buildWeeks(year: number): Day[][] {
  const weeks: Day[][] = [];
  const today = new Date();
  const cursor = new Date(year, 0, 1);
  let week: Day[] = [];
  while (cursor.getFullYear() === year && cursor <= today) {
    week.push({ date: isoDay(cursor), row: cursor.getDay(), col: weeks.length });
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

// "4 contributions on Thu, 3 Oct 2026".
function describe(day: Day, count: number): string {
  const [y, m, d] = day.date.split("-").map(Number);
  const what = count === 0 ? "No contributions" : `${count} contribution${count === 1 ? "" : "s"}`;
  return `${what} on ${WEEKDAYS[day.row]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

interface HeatmapProps {
  /** ISO date -> contribution count. */
  data: Record<string, number>;
  year: number;
  total: number;
}

// Renders the grid.
export default function Heatmap({ data, year, total }: HeatmapProps) {
  const uid = useId();
  const weeks = useMemo(() => buildWeeks(year), [year]);
  const days = useMemo(() => weeks.flat(), [weeks]);
  const max = useMemo(() => Math.max(1, ...Object.values(data)), [data]);
  const months = useMemo(() => {
    const out: { label: string; col: number }[] = [];
    weeks.forEach((week, col) => {
      const label = MONTHS[Number(week[0].date.slice(5, 7)) - 1];
      if (out.length === 0 || label !== out[out.length - 1].label) out.push({ label, col });
    });
    return out;
  }, [weeks]);

  const [active, setActive] = useState(days.length - 1);
  const [focused, setFocused] = useState(false);
  const [announce, setAnnounce] = useState("");

  const countAt = (i: number) => data[days[i].date] ?? 0;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = days.length - 1;
    const moves: Record<string, number> = {
      ArrowLeft: active - 7,
      ArrowRight: active + 7,
      ArrowUp: active - 1,
      ArrowDown: active + 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const next = Math.min(Math.max(moves[e.key], 0), last);
    setActive(next);
    document
      .getElementById(`${uid}-${next}`)
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    setAnnounce(describe(days[next], countAt(next)));
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        role="listbox"
        tabIndex={0}
        aria-label={`Contribution calendar for ${year}, ${total.toLocaleString("en-US")} contributions. Arrow keys move between days.`}
        aria-activedescendant={`${uid}-${active}`}
        onKeyDown={onKeyDown}
        onFocus={() => {
          setFocused(true);
          setAnnounce(describe(days[active], countAt(active)));
        }}
        onBlur={() => setFocused(false)}
        className="grid w-full gap-[3px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-pen"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
          minWidth: `${weeks.length * MIN_STEP}px`,
        }}
      >
        {months.map((m) => (
          <span
            key={`${m.label}-${m.col}`}
            aria-hidden
            className="mb-1 whitespace-nowrap font-hand text-lg font-bold leading-none text-hero-muted"
            style={{ gridRow: 1, gridColumn: m.col + 1 }}
          >
            {m.label}
          </span>
        ))}
        {days.map((day, i) => (
          <div
            key={day.date}
            id={`${uid}-${i}`}
            role="option"
            aria-selected={i === active}
            aria-label={describe(day, countAt(i))}
            title={describe(day, countAt(i))}
            onClick={() => setActive(i)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-[3px] font-grotesk font-semibold leading-none tabular-nums [container-type:size]",
              focused && i === active && "outline-[1.5px] outline-hero-ink",
            )}
            style={{
              gridRow: day.row + 2,
              gridColumn: day.col + 1,
              backgroundColor: `var(--heat-${level(countAt(i), max)})`,
              color: `var(--heat-ink-${level(countAt(i), max)})`,
              fontSize: countAt(i) > 99 ? "30cqw" : "42cqw",
            }}
          >
            {countAt(i) > 0 ? countAt(i) : null}
          </div>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
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
